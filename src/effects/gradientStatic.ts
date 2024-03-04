/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { getMultipleGradientSteps } from './utils'

const GradientStatic = ({ pixel_count, gcolor }: {
  pixel_count: number
  gcolor: string

}) => {
  getMultipleGradientSteps(
    gcolor.match(/rgb\([^()]*\)|#\w+/g)?.map((c) => c.match(/\d+/g)),
    pixel_count
  )
}

export default GradientStatic
