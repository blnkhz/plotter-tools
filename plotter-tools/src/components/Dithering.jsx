import React, { useRef, useState, useEffect } from 'react'
import SliderControl from './SliderControl'
import ExpandableCard from './ExpandableCard'
import {
  downloadSVG,
  extractSvgPaths,
  processImageToDitheredSvg,
} from '../utils/svgUtils'

const InfoCard = () => {
  const mainContent = (
    <>
      <a
        href="https://en.wikipedia.org/wiki/Ordered_dithering"
        target="_blank"
        className="text-rose-500 hover:text-rose-700"
      >
        Ordered Dithering
      </a>{' '}
      is a delightfully nerdy image processing technique that transforms
      grayscale images into mesmerizing patterns of crisp black-and-white dots —
      perfect for plotters and vintage display aesthetics. At its core, ordered
      dithering uses a tiny repeating grid of threshold values - like the Bayer
      matrix - to scan methodically across your image. For each pixel, it asks a
      simple question: Is this pixel darker than the corresponding matrix value?
      If yes: draw a dot (black). If no: leave it blank (white). This creates a
      tidy, structured illusion of shading, where darker regions get more dots
      clustered tightly together while lighter regions breathe with more white
      space. Think of it as pixel pointillism, but with robot discipline.
      Instead of smooth gradients, you get a rhythmic constellation of dots
      arranged in satisfying geometric patterns. It's not chaotic like{' '}
      <a
        href="https://en.wikipedia.org/wiki/Error_diffusion"
        target="_blank"
        className="text-rose-500 hover:text-rose-700"
      >
        error diffusion
      </a>
      ; it's organized cool — and ideal for pen plotters because every dot is
      discrete and precisely placed.
    </>
  )

  const images = [
    {
      caption:
        'thank you for making it this far, enjoy this dithered half-portrait of my cat:',
      src: './dith.svg',
      alt: 'a picture of my cat after ordered dithering',
    },
  ]

  const features = [
    {
      name: 'Image to SVG Conversion',
      description:
        'Transform any image into a clean SVG format with customizable dithering patterns',
    },
    {
      name: 'Adjustable Parameters',
      description:
        'Fine-tune cell size, brightness, contrast, and stroke width to get exactly the look you want',
    },
    {
      name: 'Multiple Mark Shapes',
      description:
        'Choose between squares, circles, X marks, or crosses for different visual effects',
    },
    {
      name: 'One-Click Export',
      description:
        'Generate ready-to-plot SVG files with a single button press',
    },
  ]

  return (
    <ExpandableCard
      title="What is this?"
      mainContent={mainContent}
      features={features}
      images={images}
    />
  )
}

export default function DitherToSvg() {
  const canvasRef = useRef(null)
  const [imageSrc, setImageSrc] = useState(null)
  const [svgContent, setSvgContent] = useState('')
  const [cellSize, setCellSize] = useState(1)
  const [brightness, setBrightness] = useState(0)
  const [contrast, setContrast] = useState(1)
  const [markShape, setMarkShape] = useState('square')
  const [strokeWidth, setStrokeWidth] = useState(0.5)
  const canvasSize = window.innerWidth < 500 ? window.innerWidth : 500

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => setImageSrc(event.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleDownloadSvg = () => {
    if (!svgContent) return
    const svgPaths = extractSvgPaths(svgContent)
    downloadSVG(svgPaths, 'dithered.svg')
  }

  useEffect(() => {
    if (!imageSrc) return

    const img = new Image()
    img.onload = () => {
      const svg = processImageToDitheredSvg(img, canvasRef.current, {
        cellSize,
        brightness,
        contrast,
        markShape,
        strokeWidth,
      })

      setSvgContent(svg)
    }

    img.src = imageSrc
  }, [imageSrc, cellSize, brightness, contrast, markShape, strokeWidth])

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen">
      <InfoCard />
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-lg shadow-md max-w-md mx-auto w-4/5">
          <label className="block text-gray-700 font-medium mb-2">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-medium
              file:bg-rose-50 file:text-green-700
              hover:file:bg-rose-100"
          />
          <p className="text-xs text-gray-500 mt-1 mb-4">
            *Common image formats supported
          </p>
          <div className="mt-6 space-y-4">
            <SliderControl
              label="Cell Size"
              value={cellSize}
              setValue={setCellSize}
              min={1}
              max={7}
              step={1}
            />
            <SliderControl
              label="Brightness"
              value={brightness}
              setValue={setBrightness}
              min={-128}
              max={128}
              step={1}
            />
            <SliderControl
              label="Contrast"
              value={contrast}
              setValue={setContrast}
              min={0.2}
              max={3}
              step={0.1}
              displayValue={(val) => val.toFixed(2)}
            />
            <div className="relative">
              <SliderControl
                label="Stroke Width"
                value={strokeWidth}
                setValue={setStrokeWidth}
                min={0.1}
                max={2}
                step={0.1}
                displayValue={(val) => val.toFixed(2)}
              />
              <div className="absolute top-0 right-0">
                <div className="group relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500 cursor-help"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="hidden group-hover:block absolute z-10 right-0 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg">
                    Note: Stroke width only affects the preview. When plotting,
                    the actual line thickness will be determined by your choice
                    of pen/pencil.
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Shape:
                <select
                  value={markShape}
                  onChange={(e) => setMarkShape(e.target.value)}
                  className="mt-2 w-full p-2 border border-green-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700"
                >
                  <option value="square">Square</option>
                  <option value="circle">Circle</option>
                  <option value="x">x</option>
                  <option value="cross">+</option>
                </select>
              </label>
            </div>
          </div>
        </div>
        <canvas
          ref={canvasRef}
          width={canvasSize}
          height={canvasSize}
          style={{ display: 'none' }}
        />
        {svgContent && (
          <>
            <div className="flex justify-center">
              <div
                className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden"
                style={{
                  width: canvasSize,
                  height: canvasSize,
                }}
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={handleDownloadSvg}
                className="px-4 py-2 rounded-md font-medium bg-green-700 text-white hover:bg-green-600 active:bg-green-700 transition-colors"
              >
                Export as SVG
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
