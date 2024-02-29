import React, { useRef, useEffect } from 'react'

interface VisualizerProps {
  audioContext: AudioContext | null
  frequencyBandArray: number[]
  getFrequencyData: (styleAdjuster: (_arg0: Uint8Array) => void) => void
  isPlaying: boolean
}

const Visualizer: React.FC<VisualizerProps> = ({ audioContext, frequencyBandArray, getFrequencyData, isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationFrameId = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !audioContext) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const renderFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (isPlaying) {
        getFrequencyData((amplitudeArray) => {
          for (let i = 0; i < frequencyBandArray.length; i++) {
            const value = amplitudeArray[i]
            const percent = value / 255
            const height = canvas.height * percent
            const offset = canvas.height - height - 1
            const barWidth = canvas.width / frequencyBandArray.length
            const hue = i / frequencyBandArray.length * 360

            ctx.fillStyle = `hsl(${hue}, 100%, 50%)`
            ctx.fillRect(i * barWidth, offset, barWidth, height)
          }
        })
      }
      animationFrameId.current = requestAnimationFrame(renderFrame)
    }

    if (isPlaying) {
      renderFrame()
    } else if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current)
    }
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [audioContext, frequencyBandArray, getFrequencyData, isPlaying])

  return <canvas ref={canvasRef} style={{ width: "100%" }} />
}

export default Visualizer
