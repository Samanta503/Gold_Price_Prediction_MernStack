# Gold Price Predictor - MERN Stack

A full-stack web application that predicts gold prices for any given year using XGBoost machine learning model. Features a stunning black and gold themed UI built with React, Tailwind CSS, and powered by a Flask backend.

## Features

✨ **Advanced ML Model**: XGBoost trained on historical gold price data from Kaggle
🎨 **Luxurious UI**: Black and gold color scheme with smooth animations and glassmorphism effects
⚡ **Real-time Predictions**: Get instant gold price predictions
📊 **Interactive Dashboard**: Beautiful input forms and result cards
🔄 **Full Stack**: Python backend + React frontend with Vite

## Project Structure

```
gold-price-prediction/
├── src/
│   ├── App.jsx              # Main React component with prediction UI
│   ├── App.css              # Tailwind CSS styling
│   └── main.jsx             # React entry point
├── data/
│   └── Gold_Price_Regression.csv  # Kaggle gold price dataset
├── models/                  # (Generated after training) ML models
│   ├── xgboost_gold_model.pkl
│   ├── scaler.pkl
│   └── feature_cols.pkl
├── train_model.py           # XGBoost model training script
├── api_server.py            # Flask backend API
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── package.json             # Node.js dependencies
├── requirements.txt         # Python dependencies
└── vite.config.js          # Vite configuration
```

## Setup Instructions

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2. Train the XGBoost Model

```bash
python train_model.py
```

This will:
- Load the gold price dataset
- Preprocess and clean the data
- Train an XGBoost model
- Save the model, scaler, and feature columns to the `models/` directory
- Display evaluation metrics (MAE, RMSE, R²)

**Output:**
```
Loading dataset...
Dataset shape: (2291, 47)
Preparing data...
Rows before cleaning: 2291
Rows after cleaning: 2285
Training XGBoost model...
Evaluating model...
MAE: $XX.XX
RMSE: $XX.XX
R² Score: 0.XXXX
✓ Model training complete! Files saved in 'models/' directory
```

### 3. Install Node.js Dependencies

```bash
npm install
```

### 4. Start the Flask Backend Server

```bash
python api_server.py
```

Server will run on: `http://localhost:5000`

### 5. Start the React Development Server

In a new terminal:

```bash
npm run dev
```

React app will run on: `http://localhost:5173`

## Usage

1. Open `http://localhost:5173` in your browser
2. Select a **Year** (2010-2030)
3. Select a **Month** (January-December)
4. Select a **Day** (1-31)
5. Click **✨ Predict Price**
6. View the predicted gold price with date details

## API Endpoints

### POST `/api/predict`

Predict gold price for a specific date.

**Request:**
```json
{
  "year": 2025,
  "month": 6,
  "day": 15
}
```

**Response:**
```json
{
  "predicted_price": 2450.75,
  "year": 2025,
  "month": 6,
  "day": 15,
  "currency": "USD",
  "unit": "per troy ounce"
}
```

### GET `/api/health`

Check if the model server is running.

**Response:**
```json
{
  "status": "Model server is running!"
}
```

## Technologies Used

### Frontend
- **React 19**: UI library
- **Vite**: Fast build tool
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API requests

### Backend
- **Flask**: Python web framework
- **Flask-CORS**: Cross-origin support

### Machine Learning
- **XGBoost**: Gradient boosting framework
- **scikit-learn**: Data preprocessing and metrics
- **Pandas/NumPy**: Data manipulation
- **joblib**: Model persistence

## UI/UX Features

### Design Elements
- **Color Scheme**: Black background (#1a1a1a) with gold accents (#fbbf24)
- **Typography**: Bold headlines with golden gradients
- **Animations**: 
  - Pulsing background glows
  - Smooth fade-in transitions
  - Hover effects with scale transforms
  - Shimmer effects on cards
  - Loading spinner animations

### Components
- **Input Section**: Year, month, and day selectors with glassmorphism
- **Prediction Button**: Gradient background with hover effects
- **Result Card**: Displays predicted price with glowing border
- **Feature Cards**: Showcase AI, data, and real-time features
- **Error Handling**: Red alert messages for validation

## Model Information

### Features Used
- S&P 500 Close
- NASDAQ Close
- US Interest Rates
- CPI (Consumer Price Index)
- Currency Exchange Rates (USD/CHF, EUR/USD)
- Precious Metal Prices (Silver, Oil, Platinum, Palladium)
- Date Components (Year, Month, Day)

### Model Performance
- Algorithm: XGBoost Regressor
- Training Set: 80% of data
- Test Set: 20% of data
- Features Scaled: StandardScaler normalization
- Cross-validation: Eval set monitoring during training

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

## Troubleshooting

### Backend Not Connecting
- Ensure Flask server is running on port 5000
- Check that models are trained (run `python train_model.py`)
- Verify CORS is properly configured in `api_server.py`

### Incorrect Predictions
- Verify the dataset file exists at `data/Gold_Price_Regression.csv`
- Retrain the model: `python train_model.py`
- Check that feature scaling is consistent

### Development Issues
- Clear Node cache: `npm cache clean --force`
- Reinstall dependencies: `rm -r node_modules && npm install`
- Check Node version: `node --version` (requires 14+)

## Future Enhancements

- [ ] Historical price chart visualization
- [ ] Confidence intervals for predictions
- [ ] Multiple model comparison
- [ ] Data refresh from live APIs
- [ ] User accounts and prediction history
- [ ] Mobile app version
- [ ] Deployment to cloud (Vercel + Heroku/Railway)

## License

MIT License - Feel free to use this project for educational purposes.

## Dataset Source

Gold Price Regression Dataset from [Kaggle](https://www.kaggle.com/datasets/altruistdelhite04/gold-price-prediction)

---

**Created with ✨ Gold and ❤️ Code**
