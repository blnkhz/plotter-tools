import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

export const parseObjFile = (content) => {
  const loader = new OBJLoader()
  const object = loader.parse(content)
  return extractGeometry(object)
}

export const extractGeometry = (object) => {
  const geometries = []

  object.traverse((child) => {
    if (child.isMesh) {
      const geom = child.geometry.clone()
      geom.applyMatrix4(child.matrixWorld)
      geometries.push(geom)
    }
  })

  if (geometries.length === 0) return null

  const merged = mergeGeometries(geometries)

  merged.computeBoundingBox()
  const bbox = merged.boundingBox
  const size = new THREE.Vector3()
  bbox.getSize(size)

  const maxDim = Math.max(size.x, size.y, size.z)
  const scale = 2 / maxDim
  const offset = bbox.getCenter(new THREE.Vector3()).negate()

  merged.translate(offset.x, offset.y, offset.z)
  merged.scale(scale, scale, scale)

  return merged
}

export const connectSegments = (segments) => {
  const chains = []

  while (segments.length > 0) {
    let [[start, end]] = segments.splice(0, 1)
    const chain = [start, end]

    let growing = true
    while (growing) {
      growing = false

      for (let i = 0; i < segments.length; i++) {
        const [a, b] = segments[i]

        if (chain[chain.length - 1].distanceTo(a) < 1e-5) {
          chain.push(b)
          segments.splice(i, 1)
          growing = true
          break
        } else if (chain[chain.length - 1].distanceTo(b) < 1e-5) {
          chain.push(a)
          segments.splice(i, 1)
          growing = true
          break
        } else if (chain[0].distanceTo(a) < 1e-5) {
          chain.unshift(b)
          segments.splice(i, 1)
          growing = true
          break
        } else if (chain[0].distanceTo(b) < 1e-5) {
          chain.unshift(a)
          segments.splice(i, 1)
          growing = true
          break
        }
      }
    }

    chains.push(chain)
  }

  return chains
}

export const createWireframeMesh = (geometry) => {
  const material = new THREE.MeshBasicMaterial({
    color: 0x000000,
    wireframe: true,
  })
  return new THREE.Mesh(geometry, material)
}
