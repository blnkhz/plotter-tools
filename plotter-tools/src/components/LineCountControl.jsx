import React from 'react'

const LineCountControl = ({ linesCount, setLinesCount }) => {
  return (
    <div>
      <label>
        Number of Lines:
        <div>
          <input
            type="range"
            min="10"
            max="200"
            value={linesCount}
            onChange={(e) => setLinesCount(parseInt(e.target.value))}
          />
          <input
            type="number"
            min="10"
            max="200"
            value={linesCount}
            onChange={(e) => {
              const val = parseInt(e.target.value)
              if (!isNaN(val)) setLinesCount(val)
            }}
            style={{ width: '4rem' }}
          />
        </div>
      </label>
    </div>
  )
}

export default LineCountControl
