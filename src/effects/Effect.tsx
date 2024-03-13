// import GradientRolling from "./gradientRolling";
import { MutableRefObject } from 'react'
import GradientAudio from './gradientsAudio'
import GradientsAudioInv from './gradientsAudioInv'
import GradientStatic from './gradientStatic'
import Power from './power'
import Wavelength from './wavelength'
import WavelengthBg from './wavelengthBg'

export interface IEffectConfig {
  ampValues: number[]
  pixel_count: number
  color: { r: number; g: number; b: number }
  bgColor: { r: number; g: number; b: number }
  gcolor: string
  bandStart: number
  bandStop: number
  minVolume: number
  timeStarted: MutableRefObject<number | null>
  smooth: boolean
}

export const effectNames = [
  'Power (Left FB)',
  'Wavelength (Range)',
  'WavelengthBg (Range)',
  'GradientStatic',
  // "GradientRolling",
  'GradientAudio',
  'GradientsAudioInv'
]

const Effect = ({ type, config }: { type: string; config: IEffectConfig }) => {
  switch (type) {
    case 'Power (Left FB)':
      return Power(config)

    case 'Wavelength (Range)':
      return Wavelength(config)

    case 'WavelengthBg (Range)':
      return WavelengthBg(config)

    case 'GradientStatic':
      return GradientStatic(config)

    // case "GradientRolling":
    //   return GradientRolling(config);

    case 'GradientAudio':
      return GradientAudio(config)

    case 'GradientsAudioInv':
      return GradientsAudioInv(config)

    default:
      return Power(config)
  }
}

export default Effect
