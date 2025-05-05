import React, { useState, useRef, useEffect } from 'react'
import ThreeJsViewer from './ThreeJsViewer'
import LineCountControl from './LineCountControl'
import { parseObjFile } from '../utils/geometryUtils'
import { generateSVGPaths, downloadSVG } from '../utils/svgUtils'
import WhatIsThis from './WhatIsThis'

export default function HorizontalLineRemesher() {
  const [linesCount, setLinesCount] = useState(50)
  const [geometry, setGeometry] = useState(null)
  const viewerRef = useRef()
  const sceneRef = useRef({
    camera: null,
  })

  const canvasSize = window.innerWidth < 500 ? window.innerWidth : 500

  useEffect(() => {
    fetch('https://blnkhz.github.io/plotter-tools/sample.obj')
      .then((res) => res.text())
      .then((objText) => {
        const parsedGeometry = parseObjFile(objText)
        if (parsedGeometry) {
          setGeometry(parsedGeometry)
        }
      })
      .catch((err) => {
        console.error('Failed to load sample.obj:', err)
      })
  }, [])

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
      <WhatIsThis />
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
      file:bg-rose-50 file:text-green-700
      file:content-['Choose_File']
      hover:file:bg-rose-100"
          />
          <p className="text-xs text-gray-500 mt-1 mb-4">
            *Currently only .obj files are supported
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
            width={canvasSize}
            height={canvasSize}
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
                ? 'bg-green-700 text-white hover:bg-green-600 active:bg-green-700'
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
