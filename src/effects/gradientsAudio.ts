/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { IEffectConfig } from './Effect'
import { getMultipleGradientSteps } from './utils'

let shift = 0

export const shifting = (pixel_count: number) => {
  if (shift >= pixel_count) {
    shift = 0
  } else {
    shift++
  }
}

const GradientAudio = ({ ampValues, pixel_count, bandStart, minVolume, timeStarted, gcolor }: IEffectConfig): number[] => {
  const tmp = getMultipleGradientSteps(
    gcolor.match(/rgb\([^()]*\)|#\w+/g)?.map((c: string) => c.match(/\d+/g)),
    pixel_count
  )
  const audio = ampValues[bandStart] - minVolume * 2.55 > 0
  const speed = audio ? 0 : 5

  if (timeStarted.current && performance.now() - timeStarted.current >= 16 + speed * 9.84) {
    shifting(pixel_count)
    timeStarted.current = performance.now()
  }

  const sliceA = tmp.slice(0, shift)
  const sliceB = tmp.slice(shift)

  return [...sliceB, ...sliceA].flat()
}

export default GradientAudio
