import React, { useState, useRef, useEffect } from 'react'
import ThreeJsViewer from './ThreeJsViewer'
import SliderControl from './SliderControl'
import { parseObjFile } from '../utils/geometryUtils'
import { generateSVGPaths, downloadSVG } from '../utils/svgUtils'
import ExpandableCard from './ExpandableCard'

const InfoCard = () => {
  const mainContent = (
    <>
      Parallel Remesher (AKA Slice-o-Matic 3000, LineLasagna Maker, Flat Earth
      Engine, OBJ-to-Wow-J Converter) is a browser-based tool for digital
      artists, designers, and plotter nerds who dream in X and Y. This app takes
      your fancy 3D OBJ models and slices them into sleek, hypnotic parallel
      lines, generating SVG files that your pen plotter will love. Great for
      making your art look like it fell into a fax machine and came out
      fabulous.
      <br />
      <br />
      This is version 0.0.0-alpha, so please don't panic (or bite) if something
      breaks — the bugs are probably just trying to become features 🦋
    </>
  )

  const features = [
    {
      name: 'Adjustable Line Density',
      description: 'Control the detail and density of your plots with a slider',
    },
    {
      name: 'Interactive Preview',
      description:
        'Rotate and pan the 3D model to create the perfect composition',
    },
    {
      name: 'One-Click Export',
      description:
        'Generate ready-to-plot SVG files with a single button press',
    },
  ]

  const images = [
    {
      caption: 'Before (screenshot of the model used, created in Blender):',
      src: './before.png',
      alt: '3D model in Blender',
    },
    {
      caption: 'Exported SVGs with different line density:',
      src: './after2.svg',
      alt: 'SVG output with low density',
    },
    {
      caption: '',
      src: './after3.svg',
      alt: 'SVG output with medium density',
    },
    {
      caption: '',
      src: './after.svg',
      alt: 'SVG output with high density',
    },
  ]
  return (
    <ExpandableCard
      title="What is this?"
      mainContent={mainContent}
      features={features}
      images={images}
      footerText="Free to use & open-source (づ｡◕‿‿◕｡)づ"
    />
  )
}

export default function HorizontalLineRemesher() {
  const [linesCount, setLinesCount] = useState(50)
  const [geometry, setGeometry] = useState(null)
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
      <InfoCard />
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
            <SliderControl
              label="Number of Lines"
              value={linesCount}
              setValue={setLinesCount}
              min={10}
              max={200}
              step={1}
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
