import type { ZeroConfService } from 'capacitor-zeroconf'
import { useEffect } from 'react'
import useStore from '../store/useStore'
import qFetch from '../utils/qFetch'

const ServiceCard = ({ service }: { service: ZeroConfService }) => {
  const devices = useStore((s) => s.devices.devices)
  const addOrUpdateDevice = useStore((s) => s.addOrUpdateDevice)

  useEffect(() => {
    const getInfo = async () => {
      const r = await qFetch(`http://${service.ipv4Addresses[0]}:80/json/info`)
      const j = await r.json()
      if (j?.leds?.count)
        addOrUpdateDevice({
          name: service.name,
          ip: service.ipv4Addresses[0],
          port: service.port,
          type: service.type,
          ledCount: j.leds.count
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
