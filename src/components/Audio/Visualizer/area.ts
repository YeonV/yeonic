export const area = (
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
  const sliceWidth = (config.canvas.width * 1.0) / amplitudeArray.length
  let x = 0

  ctx.beginPath()
  ctx.moveTo(x, config.canvas.height / 2)
  for (let i = 0; i < amplitudeArray.length; i++) {
    const v = amplitudeArray[i] / 128.0
    const y = config.canvas.height - (v * config.canvas.height) / 2

    ctx.lineTo(x, y)

    x += sliceWidth
  }
  ctx.lineTo(config.canvas.width, config.canvas.height / 2)
  ctx.fill()
}
