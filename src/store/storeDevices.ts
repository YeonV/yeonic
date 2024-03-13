import { produce } from 'immer'
import type { IStore } from './useStore'
import { WledConfigInfo } from '../interfaces/WledConfigInfo'
import { colorType } from './storeEffects'
import { IEffectConfig } from '../effects/Effect'

export interface DeviceProps {
  name: string
  ip: string
  port: number
  type: string
  ledCount: number
  order?: number
  config?: WledConfigInfo | null
  effect?: {
    name: string
    config: IEffectConfig
  }
}

const storeDevices = (set: any) => ({
  devices: {
    devices: [] as DeviceProps[]
  },
  addDevice: (device: DeviceProps): void =>
    set(
      produce((state: IStore) => {
        state.devices.devices.push(device)
      }),
      false,
      'devices/addDevice'
    ),
  removeDeviceByIp: (ip: string): void =>
    set(
      produce((state: IStore) => {
        state.devices.devices = state.devices.devices.filter((d) => d.ip !== ip)
      }),
      false,
      'devices/removeDeviceByIp'
    ),
  removeDeviceByName: (name: string): void =>
    set(
      produce((state: IStore) => {
        state.devices.devices = state.devices.devices.filter((d) => d.name !== name)
      }),
      false,
      'devices/removeDeviceByName'
    ),
  clearDevices: (): void =>
    set(
      produce((state: IStore) => {
        state.devices.devices = []
      }),
      false,
      'devices/clearDevices'
    ),
  setDevices: (devices: DeviceProps[]): void =>
    set(
      produce((state: IStore) => {
        state.devices.devices = devices
      }),
      false,
      'devices/setDevices'
    ),
  updateDeviceByIp: (ip: string, device: DeviceProps): void =>
    set(
      produce((state: IStore) => {
        state.devices.devices = state.devices.devices.map((d) => (d.ip === ip ? device : d))
      }),
      false,
      'devices/updateDeviceByIp'
    ),
  setDeviceEffect: (ip: string, effect: { name: string; config: any }): void =>
    set(
      produce((state: IStore) => {
        const index = state.devices.devices?.findIndex((d) => d.ip === ip) || -1
        if (index !== -1) {
          state.devices.devices[index].effect = effect
        }
      }),
      false,
      'devices/setDeviceEffect'
    ),
  setDeviceEffectName: (ip: string, effect: string): void =>
    set(
      produce((state: IStore) => {
        const index = state.devices.devices?.findIndex((d) => d.ip === ip) || -1
        if (index !== -1) {
          state.devices.devices[index].effect!.name = effect
        }
      }),
      false,
      'devices/setDeviceEffectName'
    ),
  setDeviceColor: (ip: string, color: colorType): void =>
    set(
      produce((state: IStore) => {
        const index = state.devices.devices?.findIndex((d) => d.ip === ip) || -1
        if (index !== -1) {
          state.devices.devices[index].effect!.config.color = color
        }
      }),
      false,
      'devices/setDeviceColor'
    ),
  setDeviceBgColor: (ip: string, color: colorType): void =>
    set(
      produce((state: IStore) => {
        const index = state.devices.devices?.findIndex((d) => d.ip === ip) || -1
        if (index !== -1) {
          state.devices.devices[index].effect!.config.bgColor = color
        }
      }),
      false,
      'devices/setDeviceBgColor'
    ),
  setDeviceGColor: (ip: string, gcolor: string): void =>
    set(
      produce((state: IStore) => {
        const index = state.devices.devices?.findIndex((d) => d.ip === ip) || -1
        if (index !== -1) {
          state.devices.devices[index].effect!.config.gcolor = gcolor
        }
      }),
      false,
      'devices/setDeviceGcolor'
    ),
  setDeviceBandStart: (ip: string, bandStart: number): void =>
    set(
      produce((state: IStore) => {
        const index = state.devices.devices?.findIndex((d) => d.ip === ip) || -1
        if (index !== -1) {
          state.devices.devices[index].effect!.config.bandStart = bandStart
        }
      }),
      false,
      'devices/setDeviceBandStart'
    ),
  setDeviceBandStop: (ip: string, bandStop: number): void =>
    set(
      produce((state: IStore) => {
        const index = state.devices.devices?.findIndex((d) => d.ip === ip) || -1
        if (index !== -1) {
          state.devices.devices[index].effect!.config.bandStop = bandStop
        }
      }),
      false,
      'devices/setDeviceBandStop'
    ),
  setDeviceMinVolume: (ip: string, minVolume: number): void =>
    set(
      produce((state: IStore) => {
        const index = state.devices.devices?.findIndex((d) => d.ip === ip) || -1
        if (index !== -1) {
          state.devices.devices[index].effect!.config.minVolume = minVolume
        }
      }),
      false,
      'devices/setDeviceMinVolume'
    ),

  addOrUpdateDevice: (device: DeviceProps): void =>
    set(
      produce((state: IStore) => {
        const index = state.devices.devices?.findIndex((d) => d.ip === device.ip) || -1
        if (index === -1) {
          device.order = state.devices.devices.length
          state.devices.devices.push(device)
        } else {
          state.devices.devices[index] = { ...state.devices.devices[index], ...device }
        }
      }),
      false,
      'devices/addOrUpdateDevice'
    ),
  setOrder: (order: number, ip: string): void =>
    set(
      produce((state: IStore) => {
        const index = state.devices.devices?.findIndex((d) => d.ip === ip) || -1
        if (index !== -1) {
          state.devices.devices[index].order = order
        }
      }),
      false,
      'devices/setOrder'
    ),
  swapOrder: (sourceIndex: number, destinationIndex: number): void =>
    set(
      produce((state: IStore) => {
        const devices = state.devices.devices
        const [removed] = devices.splice(sourceIndex, 1)
        devices.splice(destinationIndex, 0, removed)
        devices.forEach((d, i) => {
          d.order = i
        })
      }),
      false,
      'devices/swapOrder'
    )
})

export default storeDevices
