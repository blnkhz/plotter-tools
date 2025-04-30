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
      if (chain.length > 1) {
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

export const downloadSVG = (svgPaths, filename = 'lines_remesh.svg') => {
  if (!svgPaths || svgPaths.length === 0) return

  const svgContent = `<svg xmlns='http://www.w3.org/2000/svg' width='500' height='500'>
    <path d='${svgPaths.join(
      ' '
    )}' fill='none' stroke='black' stroke-width='0.5'/>
  </svg>`

  const blob = new Blob([svgContent], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
