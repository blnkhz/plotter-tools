import React, { useRef, useEffect } from 'react'
import useThreeJsScene from '../hooks/useThreeJsScene'
import { createWireframeMesh } from '../utils/geometryUtils'

const ThreeJsViewer = ({
  geometry,
  width = 500,
  height = 500,
  onSceneReady,
}) => {
  const mountRef = useRef()
  const { clearScene, addToScene, scene, camera, renderer, controls } =
    useThreeJsScene(mountRef, width, height)

  useEffect(() => {
    if (camera && onSceneReady) {
      onSceneReady({ scene, camera, renderer, controls })
    }
  }, [scene, camera, renderer, controls, onSceneReady])

  useEffect(() => {
    if (!geometry) return

    clearScene()
    const mesh = createWireframeMesh(geometry)
    addToScene(mesh)
  }, [geometry, clearScene, addToScene])

  return (
    <div
      ref={mountRef}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    />
  )
}

export default ThreeJsViewer
