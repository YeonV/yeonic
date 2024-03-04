import { produce } from 'immer'
import type { IStore } from './useStore'

const storeAudio = (set: any) => ({
  effect: 'Power (Left FB)',
  setEffect: (newEffect: string): void =>
  set(
    produce((state: IStore) => {
      state.effect = newEffect
    }),
    false,
    'audio/setEffect'
  ),
  audioDevice: 'default',
  setAudioDevice: (newDevice: string): void =>
  set(
    produce((state: IStore) => {
      state.audioDevice = newDevice
    }),
    false,
    'audio/setAudioDevice'
  ),
  audioDevices: [] as MediaDeviceInfo[],
  setAudioDevices: (newDevices: MediaDeviceInfo[]): void =>
    set(
      produce((state: IStore) => {
        state.audioDevices = newDevices
      }),
      false,
      'audio/setAudioDevices'
    ),
  audioSettings: {
    fft: 1024,
    bands: 32,
    sampleRate: 48000
  },
  setAudioSettings: (config: Record<string, any>): void =>
  set(
    produce((state: IStore) => {
      state.audioSettings = { ...state.audioSettings, ...config }
    }),
    false,
    'audio/setAudioSettings'
  ),
  minVolume: 0,
  setMinVolume: (volume: number): void =>
  set(
    produce((state: IStore) => {
      state.minVolume = volume
    }),
    false,
    'audio/setMinVolume'
  ),
  selectedBands: [0, 31],
  setSelectedBands: (bands: number[]): void =>
  set(
    produce((state: IStore) => {
      state.selectedBands = bands
    }),
    false,
    'audio/setSelectedBands'
  ),
    
})

export default storeAudio
