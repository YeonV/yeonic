export const circle = (
  amplitudeArray: Uint8Array,
  config: {
    canvas: HTMLCanvasElement
    bands: number
  }
) => {
  const ctx = config.canvas.getContext('2d')
  if (!ctx) return
  const radius = 100
  const centerX = config.canvas.width / 2
  const centerY = config.canvas.height / 2

  for (let i = 0; i < config.bands; i++) {
    const value = amplitudeArray[i]
    const percent = value / 255
    const height = radius * percent
    const angle = ((Math.PI * 2) / config.bands) * i
    const hue = (i / config.bands) * 360

    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(centerX + height * Math.cos(angle), centerY + height * Math.sin(angle))
    ctx.lineWidth = 2
    ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`
    ctx.stroke()
  }
}
