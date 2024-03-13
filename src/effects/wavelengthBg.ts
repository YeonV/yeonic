/* eslint-disable @typescript-eslint/explicit-function-return-type */
const WavelengthBg = ({
  ampValues,
  pixel_count,
  color,
  bgColor,
  bandStart,
  bandStop,
  minVolume
}: {
  ampValues: number[]
  pixel_count: number
  color: { r: number; g: number; b: number }
  bgColor: { r: number; g: number; b: number }
  bandStart: number
  bandStop: number
  minVolume: number
}): number[] =>
  [...Array(pixel_count).keys()]
    .map((v) => [
      (((ampValues.slice(bandStart, bandStop + 1)[v] - minVolume * 2.55) / 255) * color.r + bgColor.r) / 2,
      (((ampValues.slice(bandStart, bandStop + 1)[v] - minVolume * 2.55) / 255) * color.g + bgColor.g) / 2,
      (((ampValues.slice(bandStart, bandStop + 1)[v] - minVolume * 2.55) / 255) * color.b + bgColor.b) / 2
    ])
    .flat()

export default WavelengthBg
