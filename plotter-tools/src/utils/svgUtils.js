import * as THREE from 'three'
import { connectSegments } from './geometryUtils'

export const orderChains = (chains) => {
  const ordered = []
  let remaining = chains.slice()

  let currentChain = remaining.shift()
  ordered.push(currentChain)

  while (remaining.length > 0) {
    const lastPoint = currentChain[currentChain.length - 1]

    let closestIndex = -1
    let closestDist = Infinity
    let reverse = false

    remaining.forEach((chain, i) => {
      const distStart = lastPoint.distanceTo(chain[0])
      const distEnd = lastPoint.distanceTo(chain[chain.length - 1])

      if (distStart < closestDist) {
        closestIndex = i
        closestDist = distStart
        reverse = false
      }
      if (distEnd < closestDist) {
        closestIndex = i
        closestDist = distEnd
        reverse = true
      }
    })

    let nextChain = remaining.splice(closestIndex, 1)[0]
    if (reverse) nextChain.reverse()

    ordered.push(nextChain)
    currentChain = nextChain
  }

  return ordered
}

export const generateSVGPaths = (geometry, linesCount, camera) => {
  if (!geometry) return []

  const position = geometry.attributes.position
  const vertices = []
  for (let i = 0; i < position.count; i++) {
    vertices.push(new THREE.Vector3().fromBufferAttribute(position, i))
  }

  const bbox = new THREE.Box3().setFromPoints(vertices)
  const minY = bbox.min.y
  const maxY = bbox.max.y
  const deltaY = (maxY - minY) / linesCount

  const paths = []

  for (let i = 0; i <= linesCount; i++) {
    const y = minY + i * deltaY
    const segments = []

    for (let j = 0; j < vertices.length; j += 3) {
      const v1 = vertices[j]
      const v2 = vertices[j + 1]
      const v3 = vertices[j + 2]

      const intersections = []

      ;[
        [v1, v2],
        [v2, v3],
        [v3, v1],
      ].forEach(([a, b]) => {
        if ((a.y <= y && b.y >= y) || (a.y >= y && b.y <= y)) {
          const t = (y - a.y) / (b.y - a.y)
          const point = new THREE.Vector3(
            a.x + t * (b.x - a.x),
            y,
            a.z + t * (b.z - a.z)
          )
          intersections.push(point)
        }
      })

      if (intersections.length === 2) {
        segments.push(intersections)
      }
    }

    const screenSegments = segments.map(([p1, p2]) => {
      const projectedP1 = p1.clone().project(camera)
      const projectedP2 = p2.clone().project(camera)

      return [
        new THREE.Vector2(
          (projectedP1.x * 0.5 + 0.5) * 500,
          (1 - (projectedP1.y * 0.5 + 0.5)) * 500
        ),
        new THREE.Vector2(
          (projectedP2.x * 0.5 + 0.5) * 500,
          (1 - (projectedP2.y * 0.5 + 0.5)) * 500
        ),
      ]
    })

    const chains = connectSegments(screenSegments)
    const orderedChains = orderChains(chains)

    orderedChains.forEach((chain) => {
      if (chain?.length > 1) {
        const d = [`M${chain[0].x},${chain[0].y}`]
        for (let i = 1; i < chain.length; i++) {
          d.push(`L${chain[i].x},${chain[i].y}`)
        }
        paths.push(d.join(' '))
      }
    })
  }

  return paths
}

export const createSVG = (svgPaths) => {
  const svgContent = `<svg xmlns='http://www.w3.org/2000/svg' width='500' height='500'>
  <path d='${svgPaths.join(
    ' '
  )}' fill='none' stroke='black' stroke-width='0.5'/>
</svg>`
  return svgContent
}

export const downloadSVG = (svgPaths, filename = 'lines_remesh.svg') => {
  if (!svgPaths || svgPaths.length === 0) return

  const svgContent = createSVG(svgPaths)
  const blob = new Blob([svgContent], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export const processImageToDitheredSvg = (img, canvas, options) => {
  const { cellSize, brightness, contrast, markShape, strokeWidth } = options
  const ctx = canvas.getContext('2d')
  const bayerMatrix = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
  ]

  canvas.width = 500
  canvas.height = 500

  const scale = Math.min(500 / img.width, 500 / img.height)
  const outputWidth = Math.round(img.width * scale)
  const outputHeight = Math.round(img.height * scale)

  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.drawImage(img, 0, 0, outputWidth, outputHeight)

  const imgData = ctx.getImageData(0, 0, outputWidth, outputHeight)
  const { data, width, height } = imgData

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 255) {
      const alpha = data[i + 3] / 255
      data[i] = data[i] * alpha + 255 * (1 - alpha)
      data[i + 1] = data[i + 1] * alpha + 255 * (1 - alpha)
      data[i + 2] = data[i + 2] * alpha + 255 * (1 - alpha)
      data[i + 3] = 255
    }
  }

  for (let i = 0; i < data.length; i += 4) {
    let gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    gray += brightness
    gray = (gray - 128) * contrast + 128
    gray = Math.max(0, Math.min(255, gray))
    data[i] = data[i + 1] = data[i + 2] = gray
  }
  ctx.putImageData(imgData, 0, 0)

  const cellsX = Math.floor(width / cellSize)
  const cellsY = Math.floor(height / cellSize)

  let pathData = ''
  const circleApprox = 'polygon'

  for (let cellY = 0; cellY < cellsY; cellY++) {
    for (let cellX = 0; cellX < cellsX; cellX++) {
      const x = Math.floor(cellX * cellSize)
      const y = Math.floor(cellY * cellSize)

      const i = (y * width + x) * 4
      const gray = data[i]
      const threshold = (bayerMatrix[cellY % 4][cellX % 4] / 16) * 255

      if (gray < threshold) {
        const cx = x + cellSize / 2
        const cy = y + cellSize / 2
        const r = cellSize / 2

        switch (markShape) {
          case 'circle':
            if (circleApprox === 'diamond') {
              pathData += `M${cx} ${cy - r} L${cx + r} ${cy} L${cx} ${
                cy + r
              } L${cx - r} ${cy} Z `
            } else {
              const points = []
              for (let angle = 0; angle < 360; angle += 45) {
                const rad = (angle * Math.PI) / 180
                const px = cx + r * Math.cos(rad)
                const py = cy + r * Math.sin(rad)
                points.push([px, py])
              }
              pathData += `M${points
                .map((p) => `${p[0]} ${p[1]}`)
                .join(' L')} Z `
            }
            break

          case 'x':
            pathData += `M${x} ${y} l${cellSize} ${cellSize} M${
              x + cellSize
            } ${y} l-${cellSize} ${cellSize} `
            break

          case 'cross':
            pathData += `M${cx} ${y} v${cellSize} M${x} ${cy} h${cellSize} `
            break

          default:
            pathData += `M${x} ${y}h${cellSize}v${cellSize}h-${cellSize}Z `
            break
        }
      }
    }
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
      <path d="${pathData.trim()}" fill="none" stroke="black" stroke-width="${strokeWidth}" stroke-linecap="round" />
    </svg>
  `

  return svg.trim()
}

export const extractSvgPaths = (svgContent) => {
  const pathMatch = svgContent.match(/<path[^>]*d="([^"]*)"[^>]*\/>/)
  const pathData = pathMatch ? pathMatch[1] : ''
  return [pathData.trim()]
}
