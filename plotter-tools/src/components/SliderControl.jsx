import React from 'react'

const SliderControl = ({
  label,
  value,
  setValue,
  min,
  max,
  step = 1,
  className = '',
  displayValue = (value) => value,
  inputWidth = 'w-16',
  sliderWidth = 'w-64',
  formatValue = (value) => value,
}) => {
  return (
    <label
      className={`block text-gray-700 text-sm font-medium mb-2 ${className}`}
    >
      {label}: {displayValue(value)}
      <div className="mt-2 flex items-center gap-4">
        <div className={sliderWidth}>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => setValue(parseFloat(e.target.value))}
            className="w-full h-2 bg-rose-100 rounded-lg appearance-none cursor-pointer accent-green-700"
          />
        </div>
        <div>
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={formatValue(value)}
            onChange={(e) => {
              const val = parseFloat(e.target.value)
              if (!isNaN(val)) setValue(val)
            }}
            className={`${inputWidth} text-center px-2 py-1 border border-green-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700`}
          />
        </div>
      </div>
    </label>
  )
}

export default SliderControl
