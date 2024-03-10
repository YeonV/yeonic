import { produce } from 'immer'
import type { IStore } from './useStore'

export interface DeviceProps {
  name: string
  ip: string
  port: number
  type: string
  ledCount: number
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
  addOrUpdateDevice: (device: DeviceProps): void =>
    set(
      produce((state: IStore) => {
        const index = state.devices.devices?.findIndex((d) => d.ip === device.ip) || -1
        if (index === -1) {
          state.devices.devices.push(device)
        } else {
          state.devices.devices[index] = device
        }
      }),
      false,
      'devices/addOrUpdateDevice'
    )
})

export default storeDevices
