import React from 'react'

const LineCountControl = ({ linesCount, setLinesCount }) => {
  return (
    <label className="block text-gray-700 text-sm font-medium mb-2">
      Number of Lines:
      <div className="mt-2 flex items-center gap-4">
        <div className="w-64">
          <input
            type="range"
            min="10"
            max="200"
            value={linesCount}
            onChange={(e) => setLinesCount(parseInt(e.target.value))}
            className="w-full h-2 bg-rose-100 rounded-lg appearance-none cursor-pointer accent-green-700"
          />
        </div>
        <div>
          <input
            type="number"
            min="10"
            max="200"
            value={linesCount}
            onChange={(e) => {
              const val = parseInt(e.target.value)
              if (!isNaN(val)) setLinesCount(val)
            }}
            className="w-16 text-center px-2 py-1 border border-green-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700"
          />
        </div>
      </div>
    </label>
  )
}

export default LineCountControl
