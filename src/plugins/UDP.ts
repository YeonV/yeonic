import { UDP } from '@frontall/capacitor-udp'

function arrayToBase64String(a: number[]) {
  return btoa(String.fromCharCode(...a))
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
  bufferSize?: number
}

/**
 * Send a UDP packet to a device
 */
export const sendUDP = async ({ mode = 2, timeout = 5, pixels = Array(297).fill([255, 0, 0]).flat(), ip, port = 21324, bufferSize = 4096 }: SendUDPProps) => {
  //   console.log('sendUDP', mode, timeout, pixels, ip, port, bufferSize)
  const ledDataPrefix = [mode, timeout]
  const data = arrayToBase64String([...ledDataPrefix, ...pixels])
  const u = await UDP.create({
    properties: { name: 'yz', bufferSize: bufferSize }
  })
  try {
    await UDP.bind({ socketId: u.socketId, address: '0.0.0.0', port })
    await UDP.send({ socketId: u.socketId, address: ip, port, buffer: data })
  } catch (error) {
    console.error('Error with UDP:', error)
  } finally {
    await UDP.close({ socketId: u.socketId })
  }
}
