import { IUDP } from '../../plugins/udplib'

export interface AudioVisualizerProps {
  audioContext: AudioContext | null
  frequencyBandArray: number[]
  getFrequencyData: (styleAdjuster: (_arg0: Uint8Array) => void) => void
  isPlaying: boolean
  udpRef: React.MutableRefObject<IUDP | null>
}
