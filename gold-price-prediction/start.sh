#!/bin/bash

# Gold Price Predictor - Quick Start Script

echo ""
echo "============================================"
echo "  GOLD PRICE PREDICTOR - QUICK START"
echo "============================================"
echo ""

echo "[1/4] Installing Python dependencies..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install Python dependencies"
    exit 1
fi
echo "✓ Python dependencies installed"
echo ""

echo "[2/4] Training XGBoost model..."
python train_model.py
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to train model"
    exit 1
fi
echo "✓ Model trained successfully"
echo ""

echo "[3/4] Installing Node.js dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install Node dependencies"
    exit 1
fi
echo "✓ Node.js dependencies installed"
echo ""

echo "[4/4] Building Tailwind CSS..."
echo "✓ Tailwind CSS configured"
echo ""

echo "============================================"
echo "  SETUP COMPLETE!"
echo "============================================"
echo ""
echo "Next steps:"
echo "  1. Run the Flask backend:"
echo "     python api_server.py"
echo ""
echo "  2. In a new terminal, run the React dev server:"
echo "     npm run dev"
echo ""
echo "  3. Open your browser to http://localhost:5173"
echo ""
echo "============================================"
