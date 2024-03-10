import { produce } from 'immer'
import type { IStore } from './useStore'
import { ZeroConfService } from 'capacitor-zeroconf'
import { DeviceInfo } from '@capacitor/device'

const storePlugins = (set: any) => ({
  plugins: {
    services: [] as ZeroConfService[],
    activeService: '',
    info: {
      model: 'unknown',
      platform: 'web',
      operatingSystem: 'unknown',
      osVersion: 'unknown',
      manufacturer: 'unknown',
      isVirtual: false,
      webViewVersion: '121.0.0.0'
    } as DeviceInfo
  },
  setActiveService: (service: string): void =>
    set(
      produce((state: IStore) => {
        state.plugins.activeService = service
      }),
      false,
      'services/setActiveService'
    ),
  setServices: (newServices: ZeroConfService[]): void =>
    set(
      produce((state: IStore) => {
        state.plugins.services = newServices
      }),
      false,
      'services/setServices'
    ),
  addS: (newService: ZeroConfService): void =>
    set(
      produce((state: IStore) => {
        state.plugins.services.push(newService)
      }),
      false,
      'services/addService'
    ),
  removeService: (service: ZeroConfService): void =>
    set(
      produce((state: IStore) => {
        state.plugins.services = state.plugins.services.filter((svc) => svc.name !== service.name)
      }),
      false,
      'services/removeService'
    ),
  clearServices: (): void =>
    set(
      produce((state: IStore) => {
        state.plugins.services = []
      }),
      false,
      'services/clearServices'
    ),
  addService: (service: ZeroConfService): void =>
    set(
      produce((state: IStore) => {
        const index = state.plugins.services.findIndex((svc) => svc.name === service.name)
        if (index === -1) state.plugins.services.push(service)
        else state.plugins.services[index] = service
      }),
      false,
      'services/addService'
    ),
  setInfo: (newInfo: DeviceInfo): void =>
    set(
      produce((state: IStore) => {
        state.plugins.info = newInfo
      }),
      false,
      'info/setInfo'
    )
})

export default storePlugins
