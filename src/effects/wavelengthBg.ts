/* eslint-disable @typescript-eslint/explicit-function-return-type */
const WavelengthBg = ({
  ampValues,
  pixel_count,
  color,
  bgColor,
  activeFb,
  activeRightFb,
  volume
}:{ 
  ampValues: number[]
  pixel_count: number
  color: { r: number, g: number, b: number }
  bgColor: { r: number, g: number, b: number }
  activeFb: number
  activeRightFb: number
  volume: number
}): number[] =>
  [...Array(pixel_count).keys()].map((v) => [
    (((ampValues.slice(activeFb, activeRightFb + 1)[v] - volume * 2.55) / 255) * color.r +
      bgColor.r) /
      2,
    (((ampValues.slice(activeFb, activeRightFb + 1)[v] - volume * 2.55) / 255) * color.g +
      bgColor.g) /
      2,
    (((ampValues.slice(activeFb, activeRightFb + 1)[v] - volume * 2.55) / 255) * color.b +
      bgColor.b) /
      2
  ]).flat()

export default WavelengthBg
