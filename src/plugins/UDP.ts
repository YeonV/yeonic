import { UDP } from '@blade86/capacitor-udp'

export function arrayToBase64String(a: number[]) {
  return btoa(String.fromCharCode(...a))
}

export interface IUDP {
    socketId?: number;
    ipv4?: string;
    ipv6?: string;
}

export interface SendUDPProps {
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

export interface StartUDPProps {
    /**
     * The port to bind to
     */
    port?: number
    /**
     * The size of the buffer
     */
    bufferSize?: number
}

export interface StopUDPProps {
    u: IUDP
}

export interface SendRawUDPProps {
    /**
     * The data to send
     */
    data: string
    /**
     * The IP address of the target device
     */
    ip: string
    /**
     * The port of the target device
     */
    port?: number
    /**
     * the udp ref
     */
    u: any
}

/**
 * Send a UDP packet to a device
 */
export const sendUDP = async ({
  mode = 2,
  timeout = 1,
  pixels = Array(297).fill([255, 0, 0]).flat(),
  ip,
  port = 21324,
  u,
}: SendUDPProps) => {
  const ledDataPrefix = [mode, timeout]
  const data = arrayToBase64String([...ledDataPrefix, ...pixels])
  if (u && typeof u.socketId === 'number') {
      try {
        await UDP.send({ socketId: u.socketId, address: ip, port, buffer: data })
      } catch (error) {
        console.error('Error with UDP:', error)
      }
  }
}

export const sendRawUDP = async ({
    data,
    ip,
    port = 21324,
    u,
  }: SendRawUDPProps) => {
    if (u && typeof u.socketId === 'number') {
      try {
        await UDP.send({ socketId: u.socketId, address: ip, port, buffer: data })
      } catch (error) {
        console.error('Error with UDP:', error)
      }
    }
  }

export const startUDP = async ({
    port = 21324,
    bufferSize = 4096,
  }: StartUDPProps) => {
    let u
    try {
      u = await UDP.create({ properties: { name: 'yz', bufferSize: bufferSize } })
      if (u && typeof u.socketId === 'number') {            
          await UDP.bind({ socketId: u.socketId, address: '0.0.0.0', port })
          return u
      }
    } catch (error) {
      console.error('Error with UDP:', error)
    } 
  }

export const stopUDP = async ({ u }: StopUDPProps) => {
    try {
        if (u && typeof u.socketId === 'number') await UDP.close({ socketId: u.socketId })
      } catch (error) {
        console.error('Error closing UDP:', error)
      }
  }