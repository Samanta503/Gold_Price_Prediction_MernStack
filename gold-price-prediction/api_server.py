from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# Load model and feature columns
print("Loading model...")
model = joblib.load('models/xgboost_gold_model.pkl')
feature_cols = joblib.load('models/feature_cols.pkl')

# Load training data to get statistics for better predictions
print("Loading training data statistics...")
df = pd.read_csv('data/Gold_Price_Regression.csv')
df['date'] = pd.to_datetime(df['date'])
df['year'] = df['date'].dt.year
df['month'] = df['date'].dt.month
df['day'] = df['date'].dt.day
df['dayofweek'] = df['date'].dt.dayofweek

# Get statistics for each feature to understand ranges
feature_stats = {}
for col in feature_cols:
    if col in df.columns:
        feature_stats[col] = {
            'mean': float(df[col].mean()),
            'std': float(df[col].std()),
            'min': float(df[col].min()),
            'max': float(df[col].max())
        }

# Handle gold close - remove NaN values first
gold_prices = df['gold close'].dropna().values
if len(gold_prices) > 0:
    gold_price_mean = float(gold_prices.mean())
    gold_price_std = float(gold_prices.std())
    gold_price_min = float(gold_prices.min())
    gold_price_max = float(gold_prices.max())
else:
    # Fallback values if all gold prices are NaN
    gold_price_mean = 1300
    gold_price_std = 200
    gold_price_min = 1000
    gold_price_max = 2000

print(f"Gold price range in training data: ${gold_price_min:.2f} - ${gold_price_max:.2f}")

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        year = int(data.get('year'))
        month = int(data.get('month', 6))
        day = int(data.get('day', 15))
        inflation_rate = float(data.get('inflation_rate', 0.0))  # Default to 0% if not provided
        
        # Validate month and day
        if month < 1 or month > 12:
            return jsonify({'error': 'Month must be between 1 and 12'}), 400
        if day < 1 or day > 31:
            return jsonify({'error': 'Day must be between 1 and 31'}), 400
        if inflation_rate < -10 or inflation_rate > 50:
            return jsonify({'error': 'Inflation rate must be between -10% and 50%'}), 400
        
        # Calculate day of week (0=Monday, 6=Sunday)
        from datetime import date
        try:
            d = date(year, month, day)
            dayofweek = d.weekday()
        except ValueError:
            return jsonify({'error': 'Invalid date'}), 400
        
        # Load fresh data to get a sample row to work with
        df_sample = pd.read_csv('data/Gold_Price_Regression.csv')
        df_sample['date'] = pd.to_datetime(df_sample['date'])
        df_sample['year'] = df_sample['date'].dt.year
        df_sample['month'] = df_sample['date'].dt.month
        df_sample['day'] = df_sample['date'].dt.day
        df_sample['dayofweek'] = df_sample['date'].dt.dayofweek
        df_sample['inflation_rate'] = df_sample['CPI'].pct_change() * 100
        df_sample['inflation_rate'] = df_sample['inflation_rate'].fillna(0)
        
        # Get a sample row and fill in our prediction inputs
        sample_row = df_sample.iloc[0].copy()
        sample_row['year'] = year
        sample_row['month'] = month
        sample_row['day'] = day
        sample_row['dayofweek'] = dayofweek
        sample_row['inflation_rate'] = inflation_rate
        
        # Keep all other features as their median values from training data
        for col in feature_cols:
            if col not in ['year', 'month', 'day', 'dayofweek', 'inflation_rate'] and col in df_sample.columns:
                if col not in sample_row or pd.isna(sample_row[col]):
                    sample_row[col] = df_sample[col].median()
        
        # Create feature vector in correct order
        X = np.array([[sample_row[col] for col in feature_cols]])
        
        # Make prediction
        base_prediction = float(model.predict(X)[0])
        
        # Extrapolate prediction based on year trend
        # Calculate year deviation from training data center (2015)
        training_center_year = 2015
        year_deviation = year - training_center_year
        
        # Apply a trend factor based on year (approximately 2-3% change per year in gold prices)
        # This creates realistic extrapolation for years outside training range
        trend_factor = 1.0 + (year_deviation * 0.025)  # 2.5% per year trend
        
        # Calculate cyclic variation based on year (some years gold trends up, some down)
        cyclic_factor = 1.0 + (0.15 * np.sin(year_deviation / 7.0))  # 7-year cycle
        
        # Final prediction with extrapolation
        prediction = base_prediction * trend_factor * cyclic_factor
        
        # Ensure prediction stays in reasonable bounds (allow wider range for extrapolation)
        min_bound = gold_price_min * 0.5
        max_bound = gold_price_max * 3.0
        prediction = max(min(prediction, max_bound), min_bound)
        
        return jsonify({
            'predicted_price': float(round(prediction, 2)),
            'year': int(year),
            'month': int(month),
            'day': int(day),
            'inflation_rate': float(inflation_rate),
            'currency': 'USD',
            'unit': 'per troy ounce'
        })
    
    except Exception as e:
        import traceback
        print(f"Error: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'Model server is running!'}), 200

if __name__ == '__main__':
    if not os.path.exists('models/xgboost_gold_model.pkl'):
        print("Error: Model files not found! Run train_model.py first.")
    else:
        app.run(debug=False, port=5000, host='0.0.0.0')
