/* eslint-disable @typescript-eslint/explicit-function-return-type */
const Wavelength = ({ ampValues, pixel_count, color, activeFb, activeRightFb, volume }:{
  ampValues: number[]
  pixel_count: number
  color: { r: number, g: number, b: number }
  activeFb: number
  activeRightFb: number
  volume: number
}): number[] =>
  [...Array(pixel_count).keys()].map((v) => [
    ((ampValues.slice(activeFb, activeRightFb + 1)[v] - volume * 2.55) / 255) * color.r,
    ((ampValues.slice(activeFb, activeRightFb + 1)[v] - volume * 2.55) / 255) * color.g,
    ((ampValues.slice(activeFb, activeRightFb + 1)[v] - volume * 2.55) / 255) * color.b
  ]).flat()

export default Wavelength
