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
  bandStart,
  minVolume,
  smooth
}: {
  ampValues: number[]
  pixel_count: number
  color: { r: number; g: number; b: number }
  bgColor: { r: number; g: number; b: number }
  bandStart: number
  minVolume: number
  smooth: boolean
}): number[] => {
  const val = smooth ? movingAverage(ampValues, 5) : ampValues
  return bandStart > -1
    ? Array(pixel_count)
        .fill([color.r, color.g, color.b])
        .fill([bgColor.r, bgColor.g, bgColor.b], val[bandStart] - minVolume * 2.55 > 0 ? pixel_count * ((val[bandStart] - minVolume * 2.55) / 255) : 0)
        .flat()
    : []
}

export default Power
