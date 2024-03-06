import { SendRawUDPProps, SendUDPProps, arrayToBase64String, sendRawUDP } from './UDP'

export class DDPDevice {
  private static readonly HEADER_LEN = 10
  private static readonly MAX_PIXELS = 480
  private static readonly MAX_DATALEN = DDPDevice.MAX_PIXELS * 3
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
    const packets = Math.ceil(byteData.length / DDPDevice.MAX_DATALEN)

    for (let i = 0; i < packets; i++) {
      const dataStart = i * DDPDevice.MAX_DATALEN
      const dataEnd = dataStart + DDPDevice.MAX_DATALEN
      await this.sendPacket(sequence, i, byteData.slice(dataStart, dataEnd))
    }
  }

  private async sendPacket(sequence: number, packetCount: number, data: Uint8Array): Promise<void> {
    const bytesLength = data.length
    const header = new Uint8Array(DDPDevice.HEADER_LEN)
    header[0] = DDPDevice.VER1 | (bytesLength === DDPDevice.MAX_DATALEN ? DDPDevice.VER1 : DDPDevice.PUSH)
    header[1] = sequence
    header[2] = DDPDevice.DATATYPE
    header[3] = DDPDevice.SOURCE
    new DataView(header.buffer).setUint32(4, packetCount * DDPDevice.MAX_DATALEN, false) // Big endian
    new DataView(header.buffer).setUint16(8, bytesLength, false) // Big endian
  
    const udpData = new Uint8Array([...header, ...data])
    const pixels = Array.from(udpData)
  
    const props: SendRawUDPProps = {
        data: arrayToBase64String(pixels),
        ip: this.destination,
        port: this.port,
        u: this.u,
      }
      
      await sendRawUDP(props)
  }
  
}

export async function sendDDP(props: SendUDPProps): Promise<void> {
  const ddpDevice = new DDPDevice(props.ip, props.port || 4048, props.u)
  if (props.pixels) await ddpDevice.flush(props.pixels)    
}
