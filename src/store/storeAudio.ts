import { produce } from 'immer'
import type { IStore } from './useStore'

const storeAudio = (set: any) => ({
  audioDevice: 'default',
  setAudioDevice: (newDevice: string): void =>
  set(
    produce((state: IStore) => {
      state.audioDevice = newDevice
    }),
    false,
    'audio/setAudioDevice'
  ),
  audioDevices: [] as string[],
  setAudioDevices: (newDevices: string[]): void =>
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
    
})

export default storeAudio
