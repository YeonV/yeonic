import React, { useRef, useEffect } from 'react'

interface VisualizerProps {
  audioContext: AudioContext | null
  frequencyBandArray: number[]
  getFrequencyData: (styleAdjuster: (_arg0: Uint8Array) => void) => void
}

const Visualizer: React.FC<VisualizerProps> = ({ audioContext, frequencyBandArray, getFrequencyData }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !audioContext) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const renderFrame = () => {
      requestAnimationFrame(renderFrame)

      getFrequencyData((amplitudeArray) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height) // Clear the canvas

        // Draw the frequency bands
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

    renderFrame()
  }, [audioContext, frequencyBandArray, getFrequencyData])

  return <canvas ref={canvasRef} />
}

export default Visualizer
