import React, { useState, useRef } from 'react'
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
    <div className="font-sans p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Horizontal Line Remesher
      </h1>

      <div className="space-y-6">
        <div className="bg-white p-4 rounded-lg shadow-md max-w-md mx-auto w-4/5">
          <label className="block text-gray-700 font-medium mb-2">
            Upload 3D Model
          </label>
          <input
            type="file"
            accept=".obj"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-md file:border-0
      file:text-sm file:font-medium
      file:bg-rose-50 file:text-rose-700
      file:content-['Choose_File']
      hover:file:bg-rose-100"
          />
          <p className="text-xs text-gray-500 mt-1 mb-4">
            Currently only .obj files are supported
          </p>

          <div className="mt-6">
            <LineCountControl
              linesCount={linesCount}
              setLinesCount={setLinesCount}
            />
          </div>
        </div>

        <div className="flex justify-center">
          <ThreeJsViewer
            geometry={geometry}
            width={500}
            height={500}
            onSceneReady={(sceneData) => {
              sceneRef.current = sceneData
            }}
          />
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={handleExportSVG}
            disabled={!geometry}
            className={`px-4 py-2 rounded-md font-medium ${
              geometry
                ? 'bg-rose-500 text-white hover:bg-rose-600 active:bg-rose-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            } transition-colors`}
          >
            Export as SVG
          </button>
        </div>
      </div>
    </div>
  )
}
