import { Delete, Settings } from '@mui/icons-material'
import { Card, CardContent, IconButton, Stack, Typography, useTheme } from '@mui/material'
import type { ZeroConfService } from 'capacitor-zeroconf'
import useStore from '../store/useStore'
// import { sendWledUdp } from '../plugins/wled'
import { useEffect } from 'react'
import qFetch from '../utils/qFetch'

const ServiceCard = ({ service, onClick }: { service: ZeroConfService; onClick: () => void }) => {
  const theme = useTheme()
  const removeService = useStore((state) => state.removeService)
  const devices = useStore((state) => state.devices)
  const addOrUpdateDevice = useStore((state) => state.addOrUpdateDevice)

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
    if (!devices.find((d) => d.ip === service.ipv4Addresses[0])) {
      getInfo()
    }
  }, [devices, service, addOrUpdateDevice])

  // const device = devices.find((d) => d.ip === service.ipv4Addresses[0])

  return (
    <Card key={service.name} elevation={5}>
      <Stack
        color={theme.palette.secondary.contrastText}
        bgcolor={theme.palette.secondary.main}
        borderRadius={'4px 4px 0 0'}
        direction={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <IconButton>
          <Settings />
        </IconButton>
        <div>
          <Typography variant='h6' onClick={onClick}>
            {service.name}
          </Typography>
          <IconButton onClick={() => removeService(service)}>
            <Delete />
          </IconButton>
        </div>
      </Stack>
      <CardContent onClick={onClick}>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Typography>IP Address</Typography>
          <Typography>{service.ipv4Addresses?.[0] || service.ipv6Addresses?.[0]}</Typography>
        </Stack>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Typography>Port</Typography>
          <Typography>{service.port}</Typography>
        </Stack>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Typography>Service Type</Typography>
          <Typography>{service.type}</Typography>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default ServiceCard
