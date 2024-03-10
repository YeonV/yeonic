import { Capacitor } from '@capacitor/core'
import { ZeroConf, ZeroConfService, ZeroConfWatchResult } from 'capacitor-zeroconf'

export const scanZeroconf = ({
  serviceType,
  domain,
  onServiceFound
}: {
  serviceType: string
  domain: string
  onServiceFound: (service: ZeroConfService) => void
}) => {
  console.log(Capacitor.getPlatform(), serviceType, domain)
  ZeroConf.watch(
    {
      type: serviceType,
      domain: domain
    },
    Capacitor.getPlatform() === 'electron'
      ? undefined
      : (res) => {
          // console.log('watch YYY', res)
          if (res?.action === 'resolved') onServiceFound(res.service)
        }
  ).then((res) => console.log('watched', res))
  ZeroConf.addListener('discover', (result: ZeroConfWatchResult) => {
    // console.log('watch XXX', result)
    if (result?.action === 'resolved' || (result?.action === 'added' && result.service.ipv4Addresses.length > 0)) onServiceFound(result.service)
  })
}
