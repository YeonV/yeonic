import type { ZeroConfService } from 'capacitor-zeroconf'
import { ChevronLeft, ChevronRight, Delete, ExpandMore } from '@mui/icons-material'
import { Accordion, AccordionDetails, AccordionSummary, IconButton, Stack, Typography, useTheme } from '@mui/material'
import { useEffect } from 'react'
import useStore from '../store/useStore'
import qFetch from '../utils/qFetch'

const DeviceCard = ({ service, onClick }: { service: ZeroConfService; onClick: () => void }) => {
  const theme = useTheme()
  const removeService = useStore((s) => s.removeService)
  const devices = useStore((s) => s.devices.devices)
  const addOrUpdateDevice = useStore((s) => s.addOrUpdateDevice)
  const activeService = useStore((s) => s.plugins.activeService)

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

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        sx={{
          bgcolor: activeService === service.name ? theme.palette.primary.main : '',
          color: activeService === service.name ? theme.palette.primary.contrastText : ''
        }}
      >
        <Stack direction={'row'} justifyContent={'space-between'} width={'100%'}>
          <Typography variant='h6'>{device.name}</Typography>
          <IconButton
            onClick={(e) => {
              e.stopPropagation()
              onClick()
            }}
          >
            {activeService === service.name ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack direction={'column'} spacing={2}>
          <Stack direction={'row'} justifyContent={'space-between'}>
            <Typography>Led Count</Typography>
            <Typography>{device.ledCount}</Typography>
          </Stack>

          <IconButton onClick={() => removeService(service)}>
            <Delete />
          </IconButton>
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}

export default DeviceCard
