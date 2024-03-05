export const bars = (
  amplitudeArray: Uint8Array,
  config: {
    bgColor: { r: number; g: number; b: number }
    color: { r: number; g: number; b: number }
    bands: number
    minVolume: number
    selectedBands: number[]
    canvas: HTMLCanvasElement
  }
) => {
  const ctx = config.canvas.getContext('2d')
  if (!ctx) return
  const barWidth = config.canvas.width / config.bands
  // Add a background color to all bars
  ctx.fillStyle = `rgb(${config.bgColor.r}, ${config.bgColor.g}, ${config.bgColor.b})`
  ctx.fillRect(0, 0, config.canvas.width, config.canvas.height)

  for (let i = 0; i < config.bands; i++) {
    const value = amplitudeArray[i]
    const percent = value / 255
    const height = config.canvas.height * percent
    const offset = config.canvas.height - height - 1
    const barWidth = config.canvas.width / config.bands

    // Use the color variable for the bars
    ctx.fillStyle = `rgb(${config.color.r}, ${config.color.g}, ${config.color.b})`
    ctx.fillRect(i * barWidth, offset, barWidth, height)
  }

  // Draw the overlay for minVolume
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)' // Change the last value to adjust transparency
  ctx.fillRect(0, config.canvas.height * (1 - config.minVolume / 100), config.canvas.width, config.canvas.height)

  // Draw the overlays for selectedBands
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)' // Change the last value to adjust transparency
  ctx.fillRect(0, 0, config.selectedBands[0] * barWidth, config.canvas.height)
  ctx.fillRect(config.selectedBands[1] * barWidth, 0, config.canvas.width - config.selectedBands[1] * barWidth, config.canvas.height)
}
