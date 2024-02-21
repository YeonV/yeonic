import { produce } from 'immer'
import type { IStore } from './useStore'
import { ZeroConfService } from 'capacitor-zeroconf'
import { DeviceInfo } from '@capacitor/device'

const storePlugins = (set: any) => ({
  services: [] as ZeroConfService[],
  setServices: (newServices: ZeroConfService[]): void =>
    set(
      produce((state: IStore) => {
        state.services = newServices
      }),
      false,
      'services/setServices'
    ),
  addS: (newService: ZeroConfService): void =>
    set(
      produce((state: IStore) => {
        state.services.push(newService)
      }),
      false,
      'services/addService'
    ),
  removeService: (service: ZeroConfService): void =>
    set(
      produce((state: IStore) => {
        state.services = state.services.filter((s) => s.name !== service.name)
      }),
      false,
      'services/removeService'
    ),
  clearServices: (): void =>
    set(
      produce((state: IStore) => {
        state.services = []
      }),
      false,
      'services/clearServices'
    ),
  addService: (service: ZeroConfService): void =>
    set(
      produce((state: IStore) => {
        const index = state.services.findIndex((s) => s.name === service.name)
        if (index === -1) state.services.push(service)
        else state.services[index] = service
      }),
      false,
      'services/addService'
    ),
  info: {
    model: 'unknown',
    platform: 'web',
    operatingSystem: 'unknown',
    osVersion: 'unknown',
    manufacturer: 'unknown',
    isVirtual: false,
    webViewVersion: '121.0.0.0'
  } as DeviceInfo,
  setInfo: (newInfo: DeviceInfo): void =>
    set(
      produce((state: IStore) => {
        state.info = newInfo
      }),
      false,
      'info/setInfo'
    )
})

export default storePlugins
