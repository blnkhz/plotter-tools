import React, { useState, useEffect } from 'react'
import ExpandableCard from './ExpandableCard'
import SliderControl from './SliderControl'

const SoundToSvg = () => {
  const [audioBuffer, setAudioBuffer] = useState(null)
  const [svgContent, setSvgContent] = useState('')
  const [pattern, setPattern] = useState('linear')
  const [amplitude, setAmplitude] = useState(1)

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validTypes = [
      'audio/wav',
      'audio/x-wav',
      'audio/mpeg',
      'audio/mp3',
      'audio/mp4',
      'audio/x-m4a',
    ]
    if (!validTypes.includes(file.type)) {
      alert('Please upload a .wav, .mp3, or .m4a file')
      return
    }

    const arrayBuffer = await file.arrayBuffer()
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    try {
      const decoded = await audioCtx.decodeAudioData(arrayBuffer)
      setAudioBuffer(decoded)
      processAudioToSVG(decoded, pattern)
    } catch (err) {
      alert('Failed to decode audio. Try another file format.')
      console.error(err)
    }
  }

  const processAudioToSVG = (buffer, mode) => {
    const samples = buffer.getChannelData(0)
    const step = Math.floor(samples.length / 1024)
    const points = []

    if (mode === 'linear') {
      for (let i = 0; i < samples.length; i += step) {
        const x = (i / samples.length) * 1000
        const y = 500 - samples[i] * 400 * amplitude
        points.push(`${x},${y}`)
      }
    } else {
      const centerX = 500
      const centerY = 500
      for (let i = 0; i < samples.length; i += step) {
        const t = i / samples.length
        const angle = 2 * Math.PI * (mode === 'circular' ? t : t * 10)
        const radius = mode === 'circular' ? 200 : 50 + 200 * t
        const r = radius + samples[i] * 80 * amplitude
        const x = centerX + r * Math.cos(angle)
        const y = centerY + r * Math.sin(angle)
        points.push(`${x},${y}`)
      }
    }

    const svg = `
      <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
        <polyline fill="none" stroke="black" stroke-width="1" points="${points.join(
          ' '
        )}" />
      </svg>
    `
    setSvgContent(svg)
  }

  const downloadSVG = () => {
    const blob = new Blob([svgContent], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sound-visualization.svg'
    a.click()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    if (audioBuffer) processAudioToSVG(audioBuffer, pattern)
  }, [pattern, audioBuffer, amplitude])

  const mainContent = (
    <>
      An audio to SVG tool! How does audio become SVG? The uploaded audio is
      decoded into waveform data, sampled, and converted into a sequence of 2D
      points. These points are used to draw an SVG polyline in a linear,
      circular, or spiral layout, visualizing the sound.
    </>
  )

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen space-y-6">
      <ExpandableCard title="What is this?" mainContent={mainContent} />

      <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
        <label className="block text-gray-700 font-medium mb-2">
          Upload Sound File
        </label>
        <input
          type="file"
          accept=".wav,.mp3,.m4a,audio/wav,audio/mp3,audio/mpeg,audio/mp4"
          onChange={handleUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-medium
            file:bg-rose-50 file:text-green-700
            hover:file:bg-blue-100"
        />
        <div className="mt-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Pattern:
          </label>
          <select
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="mt-2 w-full p-2 border border-green-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700"
          >
            <option value="linear">Linear</option>
            <option value="circular">Circular</option>
            <option value="spiral">Spiral</option>
          </select>
          <div className="pt-2"></div>
          <SliderControl
            label="Amplitude"
            value={amplitude}
            setValue={setAmplitude}
            min={0.1}
            max={5}
            step={0.1}
            displayValue={(val) => val.toFixed(1)}
          />
        </div>
      </div>

      {svgContent && (
        <>
          <div className="flex justify-center">
            <div
              className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden"
              style={{ width: '500px', height: '500px' }}
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={downloadSVG}
              className="px-4 py-2 rounded-md font-medium bg-green-700 text-white hover:bg-green-600 active:bg-green-700 transition-colors"
            >
              Export as SVG
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default SoundToSvg
