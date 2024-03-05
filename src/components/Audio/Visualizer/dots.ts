export const dots = (
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

  for (let i = 0; i < amplitudeArray.length; i++) {
    const v = amplitudeArray[i] / 128.0
    const y = config.canvas.height - (v * config.canvas.height) / 2
    const radius = v * 10 // The size of the dot is proportional to the amplitude

    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
    ctx.fill()

    x += sliceWidth
  }
}
