import type { ZeroConfService } from 'capacitor-zeroconf'
import { useEffect } from 'react'
import useStore from '../store/useStore'
import qFetch from '../utils/qFetch'
import { WledConfigInfo } from '../interfaces/WledConfigInfo'

const ServiceCard = ({ service }: { service: ZeroConfService }) => {
  const devices = useStore((s) => s.devices.devices)
  const effects = useStore((s) => s.effects)
  const addOrUpdateDevice = useStore((s) => s.addOrUpdateDevice)

  useEffect(() => {
    const getInfo = async () => {
      const r = await qFetch(`http://${service.ipv4Addresses[0]}:80/json/info`)
      const j = (await r.json()) as WledConfigInfo
      if (j?.leds?.count)
        addOrUpdateDevice({
          name: service.name,
          ip: service.ipv4Addresses[0],
          port: service.port,
          type: 'wled',
          ledCount: j.leds.count,
          effect: {
            name: '',
            config: {
              color: effects.color || { r: 0, g: 0, b: 0 },
              bgColor: effects.bgColor || { r: 0, g: 0, b: 0 },
              gcolor: effects.gcolor || '',
              ampValues: [],
              bandStart: 0,
              bandStop: 512,
              minVolume: 0,
              pixel_count: j.leds.count,
              smooth: false,
              timeStarted: { current: null }
            }
          }
          // config: j
        })
    }

    if (!devices?.find((d) => d.ip === service.ipv4Addresses[0])) {
      getInfo()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service, addOrUpdateDevice])

  const device = devices.find((d) => d.ip === service.ipv4Addresses[0])
  if (!device) return null

  return <></>
}

export default ServiceCard
