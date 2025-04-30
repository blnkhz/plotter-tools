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
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        {Object.entries(COMPONENTS).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => setSelected(key)}
            style={{
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              border: '1px solid #ccc',
              backgroundColor: selected === key ? '#ddd' : '#fff',
              fontWeight: selected === key ? 'bold' : 'normal',
              borderRadius: '4px',
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div>{COMPONENTS[selected].element}</div>
    </div>
  )
}

export default App
