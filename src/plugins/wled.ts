import { sendUdp } from './udp'
import type { SendUdpProps } from './udp'

export interface SendWledUdpProps {
  /**
   * The mode of the UDP packet:
   *
   * 0 - WLED Notifier
   *
   * 1 - WARLS
   *
   * 2 - DRGB
   *
   * 3 - DRGBW
   *
   * 4 - DNRGB
   */
  mode?: 0 | 1 | 2 | 3 | 4
  /**
   * The timeout of the UDP packet in seconds
   */
  timeout?: number
  /**
   * The pixels to send
   *
   * see [docs](https://kno.wled.ge/interfaces/udp-realtime/) for the format
   */
  pixels?: number[]
  /**
   * The IP address of the target device
   */
  ip: string
  /**
   * The port of the target device
   */
  port?: number
  /**
   * The size of the buffer
   */
  u: any
}

/**
 * Convert an array of numbers to a base64 string
 */
export function arrayToBase64String(a: number[]) {
  return btoa(String.fromCharCode(...a))
}

/**
 * A class to send DDP packets to a WLED device
 */
export class WledDdpDevice {
  private static readonly HEADER_LEN = 10
  private static readonly MAX_PIXELS = 480
  private static readonly MAX_DATALEN = WledDdpDevice.MAX_PIXELS * 3
  private static readonly VER1 = 0x40
  private static readonly PUSH = 0x01
  private static readonly DATATYPE = 0x01
  private static readonly SOURCE = 0x01

  private frameCount: number = 0
  private destination: string
  private port: number
  private u: any

  constructor(destination: string, port: number, u: any) {
    this.destination = destination
    this.port = port
    this.u = u
  }

  public async flush(pixels: number[]): Promise<void> {
    this.frameCount += 1
    const sequence = (this.frameCount % 15) + 1
    const byteData = new Uint8Array(pixels)
    const packets = Math.ceil(byteData.length / WledDdpDevice.MAX_DATALEN)

    for (let i = 0; i < packets; i++) {
      const dataStart = i * WledDdpDevice.MAX_DATALEN
      const dataEnd = dataStart + WledDdpDevice.MAX_DATALEN
      await this.sendPacket(sequence, i, byteData.slice(dataStart, dataEnd))
    }
  }

  private async sendPacket(sequence: number, packetCount: number, data: Uint8Array): Promise<void> {
    const bytesLength = data.length
    const header = new Uint8Array(WledDdpDevice.HEADER_LEN)
    header[0] = WledDdpDevice.VER1 | (bytesLength === WledDdpDevice.MAX_DATALEN ? WledDdpDevice.VER1 : WledDdpDevice.PUSH)
    header[1] = sequence
    header[2] = WledDdpDevice.DATATYPE
    header[3] = WledDdpDevice.SOURCE
    new DataView(header.buffer).setUint32(4, packetCount * WledDdpDevice.MAX_DATALEN, false) // Big endian
    new DataView(header.buffer).setUint16(8, bytesLength, false) // Big endian

    const udpData = new Uint8Array([...header, ...data])
    const pixels = Array.from(udpData)

    const props: SendUdpProps = {
      data: arrayToBase64String(pixels),
      ip: this.destination,
      port: this.port,
      u: this.u
    }

    await sendUdp(props)
  }
}

/**
 * Send a DDP packet to a wled device
 */
export async function sendWledDdp(props: SendWledUdpProps): Promise<void> {
  const ddpDevice = new WledDdpDevice(props.ip, props.port || 4048, props.u)
  if (props.pixels) await ddpDevice.flush(props.pixels)
}

/**
 * Send a UDP packet to a wled device
 */
export const sendWledUdp = async ({ mode = 2, timeout = 1, pixels = Array(297).fill([255, 0, 0]).flat(), ip, port = 21324, u }: SendWledUdpProps) => {
  const ledDataPrefix = [mode, timeout]
  const data = arrayToBase64String([...ledDataPrefix, ...pixels])
  if (u && typeof u.socketId === 'number') {
    try {
      const props: SendUdpProps = {
        data,
        ip,
        port,
        u
      }
      await sendUdp(props)
    } catch (error) {
      console.error('Error with UDP:', error)
    }
  }
}
