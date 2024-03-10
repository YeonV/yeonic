import { produce } from 'immer'
import type { IStore } from './useStore'

const storeAudio = (set: any) => ({
  audio: {
    audioPlaying: false,
    audioDevice: 'default',
    audioDevices: [] as MediaDeviceInfo[],
    audioSettings: {
      fft: 2048,
      bands: 512,
      sampleRate: 48000
    },
    minVolume: 0,
    selectedBands: [0, 31]
  },
  setAudioPlaying: (playing: boolean): void =>
    set(
      produce((state: IStore) => {
        state.audio.audioPlaying = playing
      }),
      false,
      'audio/setAudioPlaying'
    ),

  setAudioDevice: (newDevice: string): void =>
    set(
      produce((state: IStore) => {
        state.audio.audioDevice = newDevice
      }),
      false,
      'audio/setAudioDevice'
    ),
  setAudioDevices: (newDevices: MediaDeviceInfo[]): void =>
    set(
      produce((state: IStore) => {
        state.audio.audioDevices = newDevices
      }),
      false,
      'audio/setAudioDevices'
    ),
  setAudioSettings: (config: Record<string, any>): void =>
    set(
      produce((state: IStore) => {
        state.audio.audioSettings = { ...state.audio.audioSettings, ...config }
      }),
      false,
      'audio/setAudioSettings'
    ),
  setMinVolume: (volume: number): void =>
    set(
      produce((state: IStore) => {
        state.audio.minVolume = volume
      }),
      false,
      'audio/setMinVolume'
    ),
  setSelectedBands: (bands: number[]): void =>
    set(
      produce((state: IStore) => {
        state.audio.selectedBands = bands
      }),
      false,
      'audio/setSelectedBands'
    )
})

export default storeAudio
