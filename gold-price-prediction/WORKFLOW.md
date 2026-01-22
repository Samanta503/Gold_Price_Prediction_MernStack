# Gold Price Predictor - Complete Workflow Guide

## 📋 Overview

This document provides a step-by-step guide to understand and run the entire Gold Price Predictor application.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      REACT FRONTEND                         │
│          (React 19 + Tailwind + Vite)                       │
│  http://localhost:5173                                      │
│                                                             │
│  ┌───────────────────────────────────────────────────┐    │
│  │ Input Form: Year, Month, Day                      │    │
│  │ Beautiful Black/Gold UI with Animations          │    │
│  │ Real-time Error Handling                         │    │
│  │ Result Card with Predicted Price                 │    │
│  └───────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                          ↓ axios
           ┌──────────────────────────────┐
           │   FLASK API SERVER           │
           │   http://localhost:5000      │
           │   /api/predict               │
           │   /api/health                │
           └──────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│              XGBOOST ML MODEL                               │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Trained on Kaggle Gold Price Data                  │  │
│  │ Features: S&P500, NASDAQ, Currencies,              │  │
│  │           Precious Metals, CPI, Rates              │  │
│  │ Output: Predicted Gold Price (USD/troy ounce)      │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Complete Setup Process

### Step 1: Prepare Python Environment

```bash
# Navigate to project directory
cd gold-price-prediction

# Create virtual environment (optional but recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### Step 2: Install Python Dependencies

```bash
pip install -r requirements.txt
```

**What gets installed:**
- `pandas`: Data manipulation
- `numpy`: Numerical operations
- `xgboost`: ML model
- `scikit-learn`: Data preprocessing
- `joblib`: Model saving/loading
- `flask`: Web framework
- `flask-cors`: Handle cross-origin requests

### Step 3: Train the XGBoost Model

```bash
python train_model.py
```

**What this does:**
1. Loads `data/Gold_Price_Regression.csv`
2. Extracts year, month, day from dates
3. Selects 13 features for prediction
4. Cleans missing values
5. Splits data: 80% train, 20% test
6. Normalizes features with StandardScaler
7. Trains XGBoost with 200 estimators
8. Evaluates on test set
9. Saves:
   - `models/xgboost_gold_model.pkl` - The trained model
   - `models/scaler.pkl` - Feature scaler
   - `models/feature_cols.pkl` - Feature column names

**Expected Output:**
```
Loading dataset...
Dataset shape: (2291, 47)
Preparing data...
Rows after cleaning: 2285
Training XGBoost model...
Evaluating model...
MAE: $XX.XX
RMSE: $XX.XX
R² Score: 0.XXXX
✓ Model training complete!
```

### Step 4: Start Flask Backend Server

```bash
python api_server.py
```

**Output:**
```
Loading model...
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

### Step 5: Install Node.js Dependencies (In New Terminal)

```bash
npm install
```

### Step 6: Start React Development Server (In Another Terminal)

```bash
npm run dev
```

**Output:**
```
VITE v7.2.4  ready in 123 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

### Step 7: Open in Browser

Navigate to: `http://localhost:5173`

## 💻 How to Use the Application

1. **Input Section** (Black card with gold border):
   - Select **Year**: 2010-2030
   - Select **Month**: January-December
   - Select **Day**: 1-31

2. **Predict Button**: Click "✨ Predict Price"

3. **Result Section** (Golden result card):
   - Displays predicted gold price in USD
   - Shows the date you predicted for
   - Displays currency and unit information

## 🎨 UI Features

### Design Elements
- **Background**: Dark gradient (black to dark gray)
- **Accent Color**: Gold (#fbbf24)
- **Cards**: Glassmorphism with backdrop blur
- **Borders**: Gold with reduced opacity
- **Text**: White with gold gradients for headers

### Animations
- **Pulsing Glows**: Background elements glow softly
- **Fade-in**: Results fade in smoothly
- **Hover Effects**: Buttons scale up on hover
- **Loading State**: Animated dots while predicting
- **Border Transitions**: Smooth color transitions on hover

### Responsive Design
- Mobile: Stack vertical, touch-friendly inputs
- Tablet: 2-column layout
- Desktop: 3-column layout with full width

## 🔧 API Reference

### Endpoint: POST /api/predict

**Request:**
```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "year": 2025,
    "month": 6,
    "day": 15
  }'
```

**Response (Success):**
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

**Response (Error):**
```json
{
  "error": "Year must be between 2010 and 2030"
}
```

### Endpoint: GET /api/health

**Request:**
```bash
curl http://localhost:5000/api/health
```

**Response:**
```json
{
  "status": "Model server is running!"
}
```

## 📊 Model Details

### Features Used for Prediction (13 total):
1. S&P 500 Close Price
2. NASDAQ Close Price
3. US Interest Rates (%)
4. CPI (Consumer Price Index)
5. USD/CHF Exchange Rate
6. EUR/USD Exchange Rate
7. Silver Close Price
8. Oil Close Price
9. Platinum Close Price
10. Palladium Close Price
11. Year
12. Month
13. Day

### Feature Scaling
- Method: StandardScaler (mean=0, std=1)
- Applied to: All features including date components
- Why: XGBoost performs better with normalized features

### Model Configuration
- Algorithm: XGBoost Regressor
- Trees (n_estimators): 200
- Learning Rate: 0.05
- Max Depth: 7
- Subsample: 0.8
- Colsample BytTree: 0.8
- Random State: 42 (reproducibility)

### Performance Metrics
- **MAE**: Mean Absolute Error (average difference from actual)
- **RMSE**: Root Mean Squared Error (penalty for large errors)
- **R² Score**: Coefficient of determination (0-1, higher is better)

## 🐛 Troubleshooting

### Issue: "Failed to get prediction"
**Solution:**
- Check if Flask server is running on port 5000
- Verify models are trained: Check if `models/` folder exists
- Check browser console for detailed error

### Issue: "Year must be between 2010 and 2030"
**Solution:**
- This is intentional - the model was trained on 2010-2030 data
- Select a year within this range

### Issue: Model file not found
**Solution:**
```bash
# Run training again
python train_model.py

# Verify files were created
ls models/
# Should show:
# - xgboost_gold_model.pkl
# - scaler.pkl
# - feature_cols.pkl
```

### Issue: CORS error
**Solution:**
- Flask-CORS is already configured in `api_server.py`
- Ensure Flask server is running before React app
- Restart both servers if issue persists

### Issue: Vite not finding modules
**Solution:**
```bash
# Clear cache and reinstall
rm -r node_modules
npm cache clean --force
npm install
```

## 📦 Building for Production

### Build React App
```bash
npm run build
```

Creates optimized build in `dist/` folder:
- Minified JavaScript
- Optimized CSS
- Cached resources

### Deploy Backend

For production deployment, use a production WSGI server:

```bash
# Install production server
pip install gunicorn

# Run with gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 api_server.py
```

## 📚 File Descriptions

| File | Purpose |
|------|---------|
| `train_model.py` | XGBoost model training and evaluation |
| `api_server.py` | Flask API server with prediction endpoint |
| `src/App.jsx` | Main React component |
| `src/App.css` | Tailwind CSS imports and custom styles |
| `src/index.css` | Global styles and theme setup |
| `tailwind.config.js` | Tailwind CSS configuration |
| `postcss.config.js` | PostCSS with Tailwind plugins |
| `vite.config.js` | Vite build configuration |
| `package.json` | Node.js dependencies and scripts |
| `requirements.txt` | Python dependencies |

## 🔄 Typical Workflow

```
1. First Time Setup:
   ├─ pip install -r requirements.txt
   ├─ python train_model.py
   ├─ npm install
   └─ (setup complete)

2. Development Session:
   ├─ Terminal 1: python api_server.py
   ├─ Terminal 2: npm run dev
   └─ Open http://localhost:5173

3. Testing Predictions:
   ├─ Input year, month, day
   ├─ Click "✨ Predict Price"
   └─ View result with animation

4. Production Deployment:
   ├─ npm run build (creates dist/)
   ├─ gunicorn api_server.py (production backend)
   └─ Deploy dist/ to static hosting
```

## 🎯 Key Concepts

### Why XGBoost?
- Excellent for tabular data
- Handles non-linear relationships
- Fast training and prediction
- Robust to outliers
- Works well with mixed feature types

### Why StandardScaler?
- Normalizes features to same scale
- Prevents features with larger values from dominating
- Required for distance-based algorithms
- Improves model convergence

### Why Tailwind CSS?
- Rapid UI development
- Consistent design system
- Small bundle size with PurgeCSS
- Mobile-first responsive design
- Easy to customize

### Why Flask?
- Lightweight and flexible
- Easy to integrate with ML models
- Simple REST API creation
- Great for prototyping

## 📖 Additional Resources

- [XGBoost Documentation](https://xgboost.readthedocs.io/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Kaggle Gold Price Dataset](https://www.kaggle.com/datasets/altruistdelhite04/gold-price-prediction)

---

**Last Updated**: January 2026
**Version**: 1.0
**Status**: Production Ready ✓
