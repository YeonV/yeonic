import { UDP } from '@blade86/capacitor-udp'

export interface IUDP {
  socketId?: number
  ipv4?: string
  ipv6?: string
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

export interface SendUdpProps {
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
   * udp server object
   */
  u: IUDP
}

/**
 * Start a UDP server and
 * return the udp server object of type IUDP
 */
export const startUDP = async ({ port = 21324, bufferSize = 4096 }: StartUDPProps) => {
  let u: IUDP | null = null
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

/**
 * Stop a UDP server,
 * needs the udp server object of type IUDP which is returned from startUDP
 */
export const stopUDP = async ({ u }: StopUDPProps) => {
  try {
    if (u && typeof u.socketId === 'number') await UDP.close({ socketId: u.socketId })
  } catch (error) {
    console.error('Error closing UDP:', error)
  }
}

/**
 * Send a UDP packet to a device,
 * needs the udp server object of type IUDP which is returned from startUDP
 */
export const sendUdp = async ({ data, ip, port = 21324, u }: SendUdpProps) => {
  if (u && typeof u.socketId === 'number') {
    try {
      await UDP.send({ socketId: u.socketId, address: ip, port, buffer: data })
    } catch (error) {
      console.error('Error with UDP:', error)
    }
  }
}
