import './App.css'
import { useState } from 'react'
import HorizontalLineRemesher from './components/HorizontalLineRemesher'
import Header from './components/Header'

const COMPONENTS = {
  remesher: {
    label: 'Horizontal Line Remesher',
    element: <HorizontalLineRemesher />,
  },
}

function App() {
  const [selected, setSelected] = useState('remesher')

  return (
    <div className="max-w-full bg-rose-50">
      <Header />
      <div className="flex gap-4 mb-4 items-center py-2 px-2">
        {Object.entries(COMPONENTS).map(([key, { label }]) => (
          <div
            key={key}
            onClick={() => setSelected(key)}
            className={`px-2 py-1 cursor-pointer text-md relative ${
              selected === key
                ? 'font-bold text-green-700'
                : 'font-normal text-gray-600 hover:text-rose-400'
            }`}
          >
            {label}
          </div>
        ))}
        <p className="text-gray-400 text-sm italic">adding more soon!</p>
      </div>
      <div>{COMPONENTS[selected].element}</div>
    </div>
  )
}

export default App
