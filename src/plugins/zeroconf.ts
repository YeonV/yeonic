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
  ZeroConf.watch(
    {
      type: serviceType,
      domain: domain
    },
    (res) => {
      console.log('watch YYY', res)
      if (res?.action === 'resolved') onServiceFound(res.service)
    }
  ).then((res) => console.log('watched', res))
  ZeroConf.addListener('discover', (result: ZeroConfWatchResult) => console.log(result))
}
