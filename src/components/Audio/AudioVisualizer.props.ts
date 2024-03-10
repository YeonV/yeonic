import { IUDP } from '../../plugins/udp'

export interface AudioVisualizerProps {
  audioContext: AudioContext | null
  frequencyBandArray: number[]
  getFrequencyData: (styleAdjuster: (_arg0: Uint8Array) => void) => void
  audioPlaying: boolean
  udpRef: React.MutableRefObject<IUDP | null>
}
