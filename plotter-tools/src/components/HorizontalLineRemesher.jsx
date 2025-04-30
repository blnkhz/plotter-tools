import React, { useState, useRef, useEffect } from 'react'
import ThreeJsViewer from './ThreeJsViewer'
import LineCountControl from './LineCountControl'
import { parseObjFile } from '../utils/geometryUtils'
import { generateSVGPaths, downloadSVG } from '../utils/svgUtils'

export default function HorizontalLineRemesher() {
  const [linesCount, setLinesCount] = useState(50)
  const [geometry, setGeometry] = useState(null)
  const viewerRef = useRef()
  const sceneRef = useRef({
    camera: null,
  })

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target.result
      const parsedGeometry = parseObjFile(content)

      if (parsedGeometry) {
        setGeometry(parsedGeometry)
      }
    }
    reader.readAsText(file)
  }

  const handleExportSVG = () => {
    if (!geometry || !sceneRef.current.camera) return

    const svgPaths = generateSVGPaths(
      geometry,
      linesCount,
      sceneRef.current.camera
    )
    downloadSVG(svgPaths)
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <h1>Horizontal Line Remesher</h1>

      <input type="file" accept=".obj" onChange={handleFileUpload} />
      <br />
      <br />

      <LineCountControl linesCount={linesCount} setLinesCount={setLinesCount} />
      <br />

      <ThreeJsViewer
        geometry={geometry}
        width={500}
        height={500}
        onSceneReady={(sceneData) => {
          sceneRef.current = sceneData
        }}
      />

      <button onClick={handleExportSVG} disabled={!geometry}>
        Export as SVG
      </button>
    </div>
  )
}
