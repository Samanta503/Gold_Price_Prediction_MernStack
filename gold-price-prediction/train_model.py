import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from xgboost import XGBRegressor
import joblib
import os

# 1) Load data
print("Loading data...")
data = pd.read_csv("data/Gold_Price_Regression.csv")

# 2) Convert date to datetime
data["date"] = pd.to_datetime(data["date"], errors="coerce")

# Option A (simple & effective): convert date into numeric features
data["year"] = data["date"].dt.year
data["month"] = data["date"].dt.month
data["day"] = data["date"].dt.day
data["dayofweek"] = data["date"].dt.dayofweek

# Drop original date (object/datetime not allowed directly by XGBoost)
data = data.drop(columns=["date"])

# 3) Choose target (predict gold close)
target_col = "gold close"

# Drop rows where target is missing
data = data.dropna(subset=[target_col])

# Fill remaining missing feature values (simple imputation)
X = data.drop(columns=[target_col])
y = data[target_col]

print(f"Initial features shape: {X.shape}")
print(f"Features: {X.columns.tolist()}")

X = X.fillna(X.median(numeric_only=True))

print(f"Final data shape - X: {X.shape}, y: {y.shape}")

# 4) Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42
)

# 5) Model
print("\nTraining XGBoost model...")
model = XGBRegressor(
    n_estimators=500,
    max_depth=5,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    objective="reg:squarederror",
    random_state=42
)

# 6) Train
model.fit(X_train, y_train, verbose=False)

# 7) Predict + Evaluate
print("\nEvaluating model...")
y_pred = model.predict(X_test)

rmse = np.sqrt(mean_squared_error(y_test, y_pred))
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"RMSE: ${rmse:.2f}")
print(f"MAE: ${mae:.2f}")
print(f"R²: {r2:.4f}")

# Compare actual vs predicted
predictions = pd.DataFrame({
    "Actual Gold Price": y_test.values,
    "Predicted Gold Price": y_pred
})

print("\nSample Predictions:")
print(predictions.head(10))

# Save model and feature columns
print("\nSaving model...")
os.makedirs('models', exist_ok=True)
joblib.dump(model, 'models/xgboost_gold_model.pkl')
joblib.dump(X.columns.tolist(), 'models/feature_cols.pkl')

print("✓ Model training complete! Files saved in 'models/' directory")
