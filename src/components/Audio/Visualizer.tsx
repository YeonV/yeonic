import { MenuItem, Stack, TextField } from '@mui/material'
import React, { useRef, useEffect, useState } from 'react'

interface VisualizerProps {
  audioContext: AudioContext | null
  frequencyBandArray: number[]
  getFrequencyData: (styleAdjuster: (_arg0: Uint8Array) => void) => void
  isPlaying: boolean
}

const Visualizer: React.FC<VisualizerProps> = ({ audioContext, frequencyBandArray, getFrequencyData, isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationFrameId = useRef<number | null>(null)
  const [visualizationType, setVisualizationType] = useState('bars')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !audioContext) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const renderBars = (amplitudeArray: Uint8Array) => {
      for (let i = 0; i < frequencyBandArray.length; i++) {
        const value = amplitudeArray[i]
        const percent = value / 255
        const height = canvas.height * percent
        const offset = canvas.height - height - 1
        const barWidth = canvas.width / frequencyBandArray.length
        const hue = (i / frequencyBandArray.length) * 360

        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`
        ctx.fillRect(i * barWidth, offset, barWidth, height)
      }
    }

    const renderCircle = (amplitudeArray: Uint8Array) => {
      const radius = 100
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      for (let i = 0; i < frequencyBandArray.length; i++) {
        const value = amplitudeArray[i]
        const percent = value / 255
        const height = radius * percent
        const angle = ((Math.PI * 2) / frequencyBandArray.length) * i
        const hue = (i / frequencyBandArray.length) * 360

        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(centerX + height * Math.cos(angle), centerY + height * Math.sin(angle))
        ctx.lineWidth = 2
        ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`
        ctx.stroke()
      }
    }

    const renderWave = (amplitudeArray: Uint8Array) => {
      const sliceWidth = (canvas.width * 1.0) / amplitudeArray.length
      ctx.beginPath()
      let x = 0
      for (let i = 0; i < amplitudeArray.length; i++) {
        const v = amplitudeArray[i] / 128.0
        const y = canvas.height - (v * canvas.height) / 2
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
        x += sliceWidth
      }
      ctx.lineTo(canvas.width, canvas.height / 2)
      ctx.stroke()
    }

    const renderRadial = (amplitudeArray: Uint8Array) => {
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = 30
      const sliceWidth = (2 * Math.PI) / amplitudeArray.length
      let angle = 0

      ctx.beginPath()
      for (let i = 0; i < amplitudeArray.length; i++) {
        const v = amplitudeArray[i] / 128.0
        const r = radius + (canvas.height / 2) * v
        const x = centerX + r * Math.cos(angle)
        const y = centerY + r * Math.sin(angle)

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
        angle += sliceWidth
      }
      ctx.lineTo(centerX + radius, centerY)
      ctx.stroke()
    }

    const renderSpiral = (amplitudeArray: Uint8Array) => {
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const maxRadius = Math.min(canvas.width, canvas.height) / 2
      const sliceWidth = (2 * Math.PI) / amplitudeArray.length
      let angle = 0

      ctx.beginPath()
      for (let i = 0; i < amplitudeArray.length; i++) {
        const v = amplitudeArray[i] / 128.0
        const r = maxRadius * v
        const x = centerX + r * Math.cos(angle)
        const y = centerY + r * Math.sin(angle)

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
        angle += sliceWidth
      }
      ctx.stroke()
    }

    const renderDots = (amplitudeArray: Uint8Array) => {
      const sliceWidth = (canvas.width * 1.0) / amplitudeArray.length
      let x = 0

      for (let i = 0; i < amplitudeArray.length; i++) {
        const v = amplitudeArray[i] / 128.0
        const y = canvas.height - (v * canvas.height) / 2
        const radius = v * 10 // The size of the dot is proportional to the amplitude

        ctx.beginPath()
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
        ctx.fill()

        x += sliceWidth
      }
    }

    const renderLines = (amplitudeArray: Uint8Array) => {
      const sliceWidth = (canvas.width * 1.0) / amplitudeArray.length
      let x = 0

      for (let i = 0; i < amplitudeArray.length; i++) {
        const v = amplitudeArray[i] / 128.0
        const y = canvas.height - (v * canvas.height) / 2

        ctx.beginPath()
        ctx.moveTo(x, canvas.height / 2)
        ctx.lineTo(x, y)
        ctx.stroke()

        x += sliceWidth
      }
    }

    const renderArea = (amplitudeArray: Uint8Array) => {
      const sliceWidth = (canvas.width * 1.0) / amplitudeArray.length
      let x = 0

      ctx.beginPath()
      ctx.moveTo(x, canvas.height / 2)
      for (let i = 0; i < amplitudeArray.length; i++) {
        const v = amplitudeArray[i] / 128.0
        const y = canvas.height - (v * canvas.height) / 2

        ctx.lineTo(x, y)

        x += sliceWidth
      }
      ctx.lineTo(canvas.width, canvas.height / 2)
      ctx.fill()
    }

    const renderScatter = (amplitudeArray: Uint8Array) => {
      const sliceWidth = (canvas.width * 1.0) / amplitudeArray.length
      let x = 0

      for (let i = 0; i < amplitudeArray.length; i++) {
        const v = amplitudeArray[i] / 128.0
        const y = canvas.height - (v * canvas.height) / 2
        const radius = 2 // Fixed size for the dots

        ctx.beginPath()
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
        ctx.fill()

        x += sliceWidth
      }
    }

    const renderVUMeter = (amplitudeArray: Uint8Array) => {
      const sliceWidth = (canvas.width * 1.0) / amplitudeArray.length
      let x = 0

      // Array to store the current height of each bar
      const currentHeights = new Array(amplitudeArray.length).fill(0)

      for (let i = 0; i < amplitudeArray.length; i++) {
        const amplitude = amplitudeArray[i]
        const dB = 20 * Math.log10((amplitude + 0.01) / 128) // Add a small constant to prevent log10(0)

        // Calculate target height based on dB value
        const targetHeight = (dB + 48) * (canvas.height / 48)

        // Update current height towards target height
        if (currentHeights[i] < targetHeight) {
          currentHeights[i] += 0.5 // Increase speed for rising
        } else if (currentHeights[i] > targetHeight) {
          currentHeights[i] -= 0.2 // Decrease speed for falling

          // Ensure current height doesn't go below 0
          currentHeights[i] = Math.max(currentHeights[i], 0)
        }

        const barWidth = sliceWidth * 0.8 // Leave some space between the bars
        const y = canvas.height - currentHeights[i]

        ctx.fillRect(x, canvas.height - y, barWidth, y)

        x += sliceWidth
      }
    }

    const renderPolar = (amplitudeArray: Uint8Array) => {
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const maxRadius = Math.min(canvas.width, canvas.height) / 2
      const sliceWidth = (2 * Math.PI) / amplitudeArray.length
      let angle = 0

      ctx.beginPath()
      for (let i = 0; i < amplitudeArray.length; i++) {
        const amplitude = amplitudeArray[i]
        const r = (amplitude / 255) * maxRadius
        const x = centerX + r * Math.cos(angle)
        const y = centerY + r * Math.sin(angle)

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
        angle += sliceWidth
      }
      ctx.closePath()
      ctx.stroke()
    }

    const renderFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (isPlaying) {
        getFrequencyData((amplitudeArray) => {
          if (visualizationType === 'bars') {
            renderBars(amplitudeArray)
          } else if (visualizationType === 'circle') {
            renderCircle(amplitudeArray)
          } else if (visualizationType === 'wave') {
            renderWave(amplitudeArray)
          } else if (visualizationType === 'radial') {
            renderRadial(amplitudeArray)
          } else if (visualizationType === 'spiral') {
            renderSpiral(amplitudeArray)
          } else if (visualizationType === 'dots') {
            renderDots(amplitudeArray)
          } else if (visualizationType === 'lines') {
            renderLines(amplitudeArray)
          } else if (visualizationType === 'area') {
            renderArea(amplitudeArray)
          } else if (visualizationType === 'scatter') {
            renderScatter(amplitudeArray)
          } else if (visualizationType === 'vumeter') {
            renderVUMeter(amplitudeArray)
          } else if (visualizationType === 'polar') {
            renderPolar(amplitudeArray)
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

  return (
    <>
      <Stack direction='row' spacing={2}>
        <TextField
          select
          variant='outlined'
          label='Visualization Type'
          value={visualizationType}
          onChange={(e) => setVisualizationType(e.target.value)}
          style={{ maxWidth: '100%', minWidth: '150px', textAlign: 'left' }}
          disabled={isPlaying}
        >
          <MenuItem value='bars'>Bars</MenuItem>
          <MenuItem value='circle'>Circle</MenuItem>
          <MenuItem value='wave'>Wave</MenuItem>
          <MenuItem value='radial'>Radial</MenuItem>
          <MenuItem value='spiral'>Spiral</MenuItem>
          <MenuItem value='dots'>Dots</MenuItem>
          <MenuItem value='lines'>Lines</MenuItem>
          <MenuItem value='area'>Area</MenuItem>
          <MenuItem value='scatter'>Scatter</MenuItem>
          <MenuItem value='vumeter'>VU Meter</MenuItem>
          <MenuItem value='polar'>Polar</MenuItem>
        </TextField>
      </Stack>
      <canvas ref={canvasRef} style={{ width: '100%' }} />
    </>
  )
}

export default Visualizer
