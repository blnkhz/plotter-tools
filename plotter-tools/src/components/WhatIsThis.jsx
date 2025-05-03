import React, { useState } from 'react'

const WhatIsThis = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-white border border-rose-100 rounded-lg p-6 mb-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-green-700">What is this?</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-green-700 hover:text-green-800 text-sm font-medium"
        >
          {isExpanded ? (
            'Show Less'
          ) : (
            <p className="animate-bounce">Read More</p>
          )}
        </button>
      </div>
      <p className="text-gray-600 mb-4">
        Parallel Remesher (AKA Slice-o-Matic 3000, LineLasagna Maker, Flat Earth
        Engine, OBJ-to-Wow-J Converter) is a browser-based tool for digital
        artists, designers, and plotter nerds who dream in X and Y. This app
        takes your fancy 3D OBJ models and slices them into sleek, hypnotic
        parallel lines, generating SVG files that your pen plotter will love.
        Great for making your art look like it fell into a fax machine and came
        out fabulous.
        <br />
        <br />
        This is version 0.0.0-alpha, so please don't panic (or bite) if
        something breaks — the bugs are probably just trying to become features
        🦋
      </p>
      {isExpanded && (
        <div className="animate-fadeIn">
          <h3 className="text-lg font-semibold text-green-700 mt-6 mb-3">
            Key Features
          </h3>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
            <li>
              <strong>Adjustable Line Density</strong>: Control the detail and
              density of your plots with a slider
            </li>
            <li>
              <strong>Interactive Preview</strong>: Rotate and pan the 3D model
              to create the perfect composition
            </li>
            <li>
              <strong>One-Click Export</strong>: Generate ready-to-plot SVG
              files with a single button press
            </li>
          </ul>
          <div className="text-gray-600">
            Before (screenshot of the model used, created in Blender):
            <img src="./before.png" alt="before" width={400} />
            Exported SVGs with different line density:
            <img src="./after2.svg" alt="before" width={400} />
            <img src="./after3.svg" alt="before" width={400} />
            <img src="./after.svg" alt="before" width={400} />
          </div>
          <p className="text-gray-600 mt-4 italic">
            Free to use & open-source (づ｡◕‿‿◕｡)づ
          </p>
        </div>
      )}
    </div>
  )
}

export default WhatIsThis
