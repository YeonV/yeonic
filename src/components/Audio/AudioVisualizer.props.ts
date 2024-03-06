import { IUDP } from '../../plugins/UDP'

export interface AudioVisualizerProps {
  audioContext: AudioContext | null
  frequencyBandArray: number[]
  getFrequencyData: (styleAdjuster: (_arg0: Uint8Array) => void) => void
  isPlaying: boolean
  udpRef: React.MutableRefObject<IUDP | null>
}
