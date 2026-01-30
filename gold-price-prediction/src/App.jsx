import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [year, setYear] = useState(2024)
  const [month, setMonth] = useState(6)
  const [day, setDay] = useState(15)
  const [inflationRate, setInflationRate] = useState(2.5)
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const validateInputs = () => {
    if (year < 1900) {
      setError('Year must be after 1900')
      return false
    }
    if (month < 1 || month > 12) {
      setError('Month must be between 1 and 12')
      return false
    }
    if (day < 1 || day > 31) {
      setError('Day must be between 1 and 31')
      return false
    }
    return true
  }

  const handlePredict = async () => {
    if (!validateInputs()) return

    try {
      setLoading(true)
      setError(null)
      setSuccess(false)
      
      const response = await axios.post('http://localhost:5000/api/predict', {
        year,
        month,
        day,
        inflation_rate: inflationRate
      })
      
      setPrediction(response.data)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to get prediction. Make sure the backend server is running.')
      setPrediction(null)
    } finally {
      setLoading(false)
    }
  }

  const setPresetDate = (presetYear) => {
    const today = new Date()
    setYear(presetYear)
    setMonth(today.getMonth() + 1)
    setDay(today.getDate())
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col items-center justify-center px-4 py-8">
      {/* Background animated elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-gold-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-gold-600 rounded-full mix-blend-screen filter blur-3xl opacity-5 animate-float" style={{animationDelay: '1.5s'}}></div>
      </div>

      {/* Main container */}
      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in group cursor-default">
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600 mb-4 drop-shadow-lg transition-all duration-700 group-hover:from-gold-300 group-hover:to-gold-500 group-hover:drop-shadow-2xl">
            Gold Price
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 transition-all duration-700 group-hover:text-gold-100 group-hover:drop-shadow-lg">Predictor</h2>
          <p className="text-gold-300 text-lg font-light transition-all duration-700 group-hover:text-gold-100 group-hover:text-xl">Predict gold prices for any year with advanced AI</p>
          <div className="w-24 h-1 bg-gradient-to-r from-gold-400 to-gold-600 mx-auto mt-4 rounded-full animate-glow-pulse group-hover:w-32 transition-all duration-700"></div>
        </div>

        {/* Input Card */}
        <div className="bg-gray-900 border border-gold-500/30 rounded-2xl p-8 mb-8 shadow-2xl hover:border-gold-400 transition-all duration-700 backdrop-blur-sm bg-opacity-80 animate-scale-up hover:shadow-gold-500/60 hover:bg-opacity-95 hover:bg-gray-800/80">
          {/* Quick Preset Buttons */}
          <div className="mb-6 flex gap-2 flex-wrap">
            <button
              onClick={() => setPresetDate(2025)}
              className="text-xs px-3 py-2 bg-gold-500/20 text-gold-300 rounded-lg hover:bg-gold-500/40 transition-all duration-300 border border-gold-400/30 hover:border-gold-400 font-semibold"
            >
              2025
            </button>
            <button
              onClick={() => setPresetDate(2024)}
              className="text-xs px-3 py-2 bg-gold-500/20 text-gold-300 rounded-lg hover:bg-gold-500/40 transition-all duration-300 border border-gold-400/30 hover:border-gold-400 font-semibold"
            >
              2024
            </button>
            <button
              onClick={() => setPresetDate(2023)}
              className="text-xs px-3 py-2 bg-gold-500/20 text-gold-300 rounded-lg hover:bg-gold-500/40 transition-all duration-300 border border-gold-400/30 hover:border-gold-400 font-semibold"
            >
              2023
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Year Input */}
            <div className="space-y-3 group">
              <label className="block text-gold-300 font-semibold text-sm uppercase tracking-wider transition-all duration-700 group-hover:text-gold-200">Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-gray-800 border border-gold-500/30 text-white rounded-lg focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/60 transition-all duration-500 text-center font-bold text-lg hover:border-gold-400 hover:bg-gray-700 hover:shadow-lg hover:shadow-gold-400/40 focus:shadow-lg focus:shadow-gold-400/50"
              />
              <p className="text-gray-400 text-xs transition-all duration-700 group-hover:text-gold-300">Any year (limitless)</p>
            </div>

            {/* Month Input */}
            <div className="space-y-3 group">
              <label className="block text-gold-300 font-semibold text-sm uppercase tracking-wider transition-all duration-700 group-hover:text-gold-200">Month</label>
              <select
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-gray-800 border border-gold-500/30 text-white rounded-lg focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/60 transition-all duration-500 font-semibold hover:border-gold-400 hover:bg-gray-700 hover:shadow-lg hover:shadow-gold-400/40 focus:shadow-lg focus:shadow-gold-400/50"
              >
                {Array.from({length: 12}, (_, i) => (
                  <option key={i+1} value={i+1} className="bg-gray-800 text-white">
                    {new Date(2024, i).toLocaleString('default', {month: 'long'})}
                  </option>
                ))}
              </select>
            </div>

            {/* Day Input */}
            <div className="space-y-3 group">
              <label className="block text-gold-300 font-semibold text-sm uppercase tracking-wider transition-all duration-700 group-hover:text-gold-200">Day</label>
              <input
                type="number"
                min="1"
                max="31"
                value={day}
                onChange={(e) => setDay(parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-gray-800 border border-gold-500/30 text-white rounded-lg focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/60 transition-all duration-500 text-center font-bold text-lg hover:border-gold-400 hover:bg-gray-700 hover:shadow-lg hover:shadow-gold-400/40 focus:shadow-lg focus:shadow-gold-400/50"
              />
              <p className="text-gray-400 text-xs transition-all duration-700 group-hover:text-gold-300">1 - 31</p>
            </div>

            {/* Inflation Rate Input */}
            <div className="space-y-3 group">
              <label className="block text-gold-300 font-semibold text-sm uppercase tracking-wider transition-all duration-700 group-hover:text-gold-200">Inflation %</label>
              <input
                type="number"
                min="-10"
                max="50"
                step="0.1"
                value={inflationRate}
                onChange={(e) => setInflationRate(parseFloat(e.target.value))}
                className="w-full px-4 py-3 bg-gray-800 border border-gold-500/30 text-white rounded-lg focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/60 transition-all duration-500 text-center font-bold text-lg hover:border-gold-400 hover:bg-gray-700 hover:shadow-lg hover:shadow-gold-400/40 focus:shadow-lg focus:shadow-gold-400/50"
              />
              <p className="text-gray-400 text-xs transition-all duration-700 group-hover:text-gold-300">-10% to 50%</p>
            </div>
          </div>

          {/* Predict Button */}
          <button
            onClick={handlePredict}
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-lg uppercase tracking-wider transition-all duration-500 transform ${
              loading
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-gold-400 to-gold-600 text-black hover:from-gold-300 hover:to-gold-500 hover:shadow-2xl hover:shadow-gold-400/80 hover:scale-105 active:scale-95 hover:text-gray-900 font-extrabold'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="w-5 h-5 border-2 border-gray-400 border-t-gold-400 rounded-full animate-spin"></div>
                <span>Predicting...</span>
              </div>
            ) : (
              '✨ Predict Price'
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-300 px-6 py-4 rounded-xl mb-8 animate-slide-in-left backdrop-blur-sm transition-all duration-700 hover:border-red-400 hover:bg-red-900/60 hover:shadow-lg hover:shadow-red-500/50">
            <p className="font-semibold text-sm hover:text-red-100 transition-all duration-700">⚠️ {error}</p>
          </div>
        )}

        {/* Success Notification */}
        {success && (
          <div className="bg-green-900/30 border border-green-500/50 text-green-300 px-6 py-4 rounded-xl mb-8 animate-slide-in-left backdrop-blur-sm transition-all duration-700">
            <p className="font-semibold text-sm">✅ Prediction successful!</p>
          </div>
        )}

        {/* Result Card */}
        {prediction && (
          <div className="bg-gradient-to-br from-gold-900/50 to-gray-900 border border-gold-400/50 rounded-2xl p-8 shadow-2xl backdrop-blur-sm animate-bounce-in hover:shadow-gold-500/80 transition-all duration-700 hover:border-gold-300 hover:from-gold-900/70">
            <div className="text-center space-y-6">
              <div className="animate-float group">
                <p className="text-gold-300 font-semibold text-sm uppercase tracking-wider mb-2 transition-all duration-700 group-hover:text-gold-100">Predicted Gold Price</p>
                <p className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-500 drop-shadow-lg transition-all duration-700 group-hover:scale-110 inline-block group-hover:from-gold-200 group-hover:to-gold-400 group-hover:drop-shadow-xl">
                  ${prediction.predicted_price.toFixed(2)}
                </p>
              </div>

              <div className="border-t border-gold-500/30 pt-6 transition-all duration-700 hover:border-gold-400/50">
                <p className="text-gray-400 text-sm mb-4 transition-all duration-700 hover:text-gold-300">For the date:</p>
                <p className="text-2xl text-gold-200 font-semibold transition-all duration-700 hover:text-gold-100">
                  {new Date(prediction.year, prediction.month - 1, prediction.day).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-gold-400 text-sm mt-2 transition-all duration-700 hover:text-gold-300">{prediction.unit}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gold-500/20 transition-all duration-700 hover:border-gold-400 hover:bg-gray-700 hover:shadow-lg hover:shadow-gold-400/50 group cursor-pointer">
                  <p className="text-gray-400 transition-all duration-700 group-hover:text-gold-200">Currency</p>
                  <p className="text-gold-300 font-bold transition-all duration-700 group-hover:text-gold-100 group-hover:text-base">{prediction.currency}</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-blue-500/20 transition-all duration-700 hover:border-blue-400 hover:bg-gray-700 hover:shadow-lg hover:shadow-blue-400/50 group cursor-pointer">
                  <p className="text-gray-400 transition-all duration-700 group-hover:text-blue-200">Inflation Rate</p>
                  <p className="text-blue-400 font-bold transition-all duration-700 group-hover:text-blue-300 group-hover:text-base">{prediction.inflation_rate.toFixed(2)}%</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-green-500/20 transition-all duration-700 hover:border-green-400 hover:bg-gray-700 hover:shadow-lg hover:shadow-green-400/50 group cursor-pointer">
                  <p className="text-gray-400 transition-all duration-700 group-hover:text-green-200">Status</p>
                  <p className="text-green-400 font-bold transition-all duration-700 group-hover:text-green-300 group-hover:text-base">✓ Predicted</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          <div className="bg-gray-800/50 backdrop-blur rounded-xl p-4 border border-gold-500/20 hover:border-gold-400 transition-all duration-700 group hover:bg-gray-700/80 hover:shadow-xl hover:shadow-gold-500/60 transform hover:-translate-y-2 cursor-pointer">
            <p className="text-gold-300 font-bold mb-1 group-hover:text-gold-100 transition-all duration-700 text-lg">🤖 AI Powered</p>
            <p className="text-gray-400 text-sm group-hover:text-gold-200 transition-all duration-700">XGBoost ML model</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur rounded-xl p-4 border border-gold-500/20 hover:border-gold-400 transition-all duration-700 group hover:bg-gray-700/80 hover:shadow-xl hover:shadow-gold-500/60 transform hover:-translate-y-2 cursor-pointer">
            <p className="text-gold-300 font-bold mb-1 group-hover:text-gold-100 transition-all duration-700 text-lg">📊 Historical Data</p>
            <p className="text-gray-400 text-sm group-hover:text-gold-200 transition-all duration-700">From Kaggle dataset</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur rounded-xl p-4 border border-gold-500/20 hover:border-gold-400 transition-all duration-700 group hover:bg-gray-700/80 hover:shadow-xl hover:shadow-gold-500/60 transform hover:-translate-y-2 cursor-pointer">
            <p className="text-gold-300 font-bold mb-1 group-hover:text-gold-100 transition-all duration-700 text-lg">⚡ Real-time</p>
            <p className="text-gray-400 text-sm group-hover:text-gold-200 transition-all duration-700">Instant predictions</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
