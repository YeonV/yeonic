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
  devices: [] as DeviceProps[],
  addDevice: (device: DeviceProps): void =>
    set(
      produce((state: IStore) => {
        state.devices.push(device)
      }),
      false,
      'devices/addDevice'
    ),
  removeDeviceByIp: (ip: string): void =>
    set(
      produce((state: IStore) => {
        state.devices = state.devices.filter((d) => d.ip !== ip)
      }),
      false,
      'devices/removeDeviceByIp'
    ),
  removeDeviceByName: (name: string): void =>
    set(
      produce((state: IStore) => {
        state.devices = state.devices.filter((d) => d.name !== name)
      }),
      false,
      'devices/removeDeviceByName'
    ),
  clearDevices: (): void =>
    set(
      produce((state: IStore) => {
        state.devices = []
      }),
      false,
      'devices/clearDevices'
    ),
  setDevices: (devices: DeviceProps[]): void =>
    set(
      produce((state: IStore) => {
        state.devices = devices
      }),
      false,
      'devices/setDevices'
    ),
  updateDeviceByIp: (ip: string, device: DeviceProps): void =>
    set(
      produce((state: IStore) => {
        state.devices = state.devices.map((d) => (d.ip === ip ? device : d))
      }),
      false,
      'devices/updateDeviceByIp'
    )
})

export default storeDevices
