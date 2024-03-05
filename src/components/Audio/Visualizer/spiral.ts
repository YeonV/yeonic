export const spiral = (
  amplitudeArray: Uint8Array,
  config: {
    //   bgColor: { r: number; g: number; b: number }
    //   color: { r: number; g: number; b: number }
    //   bands: number
    //   minVolume: number
    //   selectedBands: number[]
    canvas: HTMLCanvasElement
  }
) => {
  const ctx = config.canvas.getContext('2d')
  if (!ctx) return
  const centerX = config.canvas.width / 2
  const centerY = config.canvas.height / 2
  const maxRadius = Math.min(config.canvas.width, config.canvas.height) / 2
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
