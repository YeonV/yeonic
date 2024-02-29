// import dgram from 'dgram'

// export class DDPDevice {
//   private static readonly HEADER_LEN = 0x0a
//   private static readonly MAX_PIXELS = 480
//   private static readonly MAX_DATALEN = DDPDevice.MAX_PIXELS * 3
//   private static readonly VER1 = 0x40
//   private static readonly PUSH = 0x01
//   private static readonly DATATYPE = 0x01
//   private static readonly SOURCE = 0x01

//   private frameCount: number = 0
//   private sock: dgram.Socket
//   private destination: string
//   private port: number

//   constructor(destination: string, port: number) {
//     this.sock = dgram.createSocket('udp4')
//     this.destination = destination
//     this.port = port
//   }

//   public flush(data: Buffer): void {
//     this.frameCount += 1
//     const sequence = (this.frameCount % 15) + 1
//     const byteData = Buffer.from(data.buffer as ArrayBuffer)
//     const packets = Math.ceil(byteData.length / DDPDevice.MAX_DATALEN)

//     for (let i = 0; i < packets; i++) {
//       const dataStart = i * DDPDevice.MAX_DATALEN
//       const dataEnd = dataStart + DDPDevice.MAX_DATALEN
//       this.sendPacket(sequence, i, byteData.slice(dataStart, dataEnd))
//     }
//   }

//   private sendPacket(sequence: number, packetCount: number, data: Buffer): void {
//     const bytesLength = data.length
//     const header = Buffer.alloc(DDPDevice.HEADER_LEN)
//     header.writeUInt8(DDPDevice.VER1 | (bytesLength === DDPDevice.MAX_DATALEN ? DDPDevice.VER1 : DDPDevice.PUSH), 0)
//     header.writeUInt8(sequence, 1)
//     header.writeUInt8(DDPDevice.DATATYPE, 2)
//     header.writeUInt8(DDPDevice.SOURCE, 3)
//     header.writeUInt32BE(packetCount * DDPDevice.MAX_DATALEN, 4)
//     header.writeUInt16BE(bytesLength, 8)
 
//     const udpData = Buffer.concat([header, data])
//     this.sock.send(udpData, this.port, this.destination)
//   }
// }
