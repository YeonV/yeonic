/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const Power = ({ ampValues, pixel_count, color, bgColor, activeFb, volume }: {
    ampValues: number[]
    pixel_count: number
    color: { r: number, g: number, b: number }
    bgColor: { r: number, g: number, b: number }
    activeFb: number
    volume: number
    
}) =>
  activeFb > -1
    ? Array(pixel_count)
      .fill([color.r, color.g, color.b])
      .fill(
        [bgColor.r, bgColor.g, bgColor.b],
        ampValues[activeFb] - volume * 2.55 > 0
          ? pixel_count * ((ampValues[activeFb] - volume * 2.55) / 255)
          : 0
      )
    : undefined

export default Power