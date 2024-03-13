export interface WledConfigInfo {
  ver: string // WLED version
  vid: number // Variant ID
  leds: {
    count: number // Number of LEDs
    pwr: number // Estimated current LED power usage in milliamps
    fps: number // Frames per second
    maxpwr: number // Maximum allowed power usage in milliamps
    maxseg: number // Maximum number of segments
    seglc: number[] // Array of segment lengths
    lc: number // Total number of segments
    rgbw: boolean // Whether RGBW mode is enabled
    wv: number // White value
    cct: number // Correlated color temperature
    matrix?: {
      w: number // Matrix width
      h: number // Matrix height
    }
  }
  str: boolean // Whether the strip is currently on or off
  name: string // User-defined name of the device
  udpport: number // UDP port
  live: boolean // Whether live data (e.g. E1.31, TPM2) is currently being received
  liveseg: number // The index of the segment that live data is being written to
  lm: string // Live data source IP
  lip: string // Last received UDP packet IP
  ws: number // Websockets connection count
  fxcount: number // Number of effects
  palcount: number // Number of palettes
  cpalcount: number // Number of custom palettes
  maps: {
    id: number // Map ID
  }[]
  wifi: {
    bssid: string // BSSID of the connected network
    rssi: number // Received signal strength indication
    signal: number // Signal quality in percent
    channel: number // WiFi channel
  }
  fs: {
    u: number // Unused file system space in kilobytes
    t: number // Total file system size in kilobytes
    pmt: number // Preset modified time
  }
  ndc: number // Number of connected clients
  arch: string // Architecture of the device (e.g. esp32)
  core: string // Core version
  lwip: number // LWIP version
  freeheap: number // Free heap memory in bytes
  uptime: number // Uptime in seconds
  time: string // Current time
  opt: number // Option flags
  brand: string // Brand (always "WLED")
  product: string // Product (always "FOSS")
  mac: string // MAC address
  ip: string // IP address
}
