const movingAverage = (arr: number[], windowSize: number) => {
  const result: number[] = Array(arr.length)
  for (let i = 0; i < arr.length; i++) {
    const start = Math.max(0, i - windowSize)
    const end = Math.min(arr.length, i + windowSize)
    let sum = 0
    for (let j = start; j < end; j++) {
      sum += arr[j]
    }
    result[i] = sum / (end - start)
  }
  return result
}

const Power = ({
  ampValues,
  pixel_count,
  color,
  bgColor,
  activeFb,
  volume,
  smooth
}: {
  ampValues: number[]
  pixel_count: number
  color: { r: number; g: number; b: number }
  bgColor: { r: number; g: number; b: number }
  activeFb: number
  volume: number
  smooth: boolean
}): number[] => {
  const val = smooth ? movingAverage(ampValues, 5) : ampValues
  return activeFb > -1
    ? Array(pixel_count)
        .fill([color.r, color.g, color.b])
        .fill([bgColor.r, bgColor.g, bgColor.b], val[activeFb] - volume * 2.55 > 0 ? pixel_count * ((val[activeFb] - volume * 2.55) / 255) : 0)
        .flat()
    : []
}

export default Power
