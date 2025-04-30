import './App.css'
import { useState } from 'react'
import HorizontalLineRemesher from './components/HorizontalLineRemesher'

const COMPONENTS = {
  remesher: {
    label: 'Horizontal Line Remesher',
    element: <HorizontalLineRemesher />,
  },
}

function App() {
  const [selected, setSelected] = useState('remesher')

  return (
    <div className="max-w-full">
      <div className="flex gap-4 mb-4 items-center">
        {Object.entries(COMPONENTS).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => setSelected(key)}
            className={`px-4 py-2 cursor-pointer border border-rose-300 rounded-md ${
              selected === key
                ? 'bg-rose-100 font-bold'
                : 'bg-white font-normal'
            }`}
          >
            {label}
          </button>
        ))}
        <p className="text-xs text-gray-500">- adding more soon!</p>
      </div>
      <div>{COMPONENTS[selected].element}</div>
    </div>
  )
}

export default App
