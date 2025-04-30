import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default function useThreeJsScene(mountRef, width = 500, height = 500) {
  const sceneRef = useRef()
  const cameraRef = useRef()
  const rendererRef = useRef()
  const controlsRef = useRef()
  const initializedRef = useRef(false)

  useEffect(() => {
    if (initializedRef.current) return

    while (mountRef.current && mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild)
    }

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#d5bacc')
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000)
    camera.position.z = 3

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    mountRef.current.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    sceneRef.current = scene
    cameraRef.current = camera
    rendererRef.current = renderer
    controlsRef.current = controls

    initializedRef.current = true

    const animationFrameId = { current: null }

    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
      controls.dispose()
      initializedRef.current = false
    }
  }, [mountRef, width, height])

  const clearScene = () => {
    if (sceneRef.current) {
      sceneRef.current.clear()
    }
  }

  const addToScene = (object) => {
    if (sceneRef.current) {
      sceneRef.current.add(object)
    }
  }

  return {
    get scene() {
      return sceneRef.current
    },
    get camera() {
      return cameraRef.current
    },
    get renderer() {
      return rendererRef.current
    },
    get controls() {
      return controlsRef.current
    },
    clearScene,
    addToScene,
  }
}
