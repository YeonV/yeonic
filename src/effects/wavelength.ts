/* eslint-disable @typescript-eslint/explicit-function-return-type */
const Wavelength = ({
  ampValues,
  pixel_count,
  color,
  bandStart,
  bandStop,
  minVolume
}: {
  ampValues: number[]
  pixel_count: number
  color: { r: number; g: number; b: number }
  bandStart: number
  bandStop: number
  minVolume: number
}): number[] =>
  [...Array(pixel_count).keys()]
    .map((v) => [
      ((ampValues.slice(bandStart, bandStop + 1)[v] - minVolume * 2.55) / 255) * color.r,
      ((ampValues.slice(bandStart, bandStop + 1)[v] - minVolume * 2.55) / 255) * color.g,
      ((ampValues.slice(bandStart, bandStop + 1)[v] - minVolume * 2.55) / 255) * color.b
    ])
    .flat()

export default Wavelength
