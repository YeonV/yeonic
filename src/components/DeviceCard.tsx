import type { DeviceProps } from '../store/storeDevices'
import { ChevronLeft, ChevronRight, Delete, DragIndicator, ExpandMore } from '@mui/icons-material'
import { Accordion, AccordionDetails, AccordionSummary, IconButton, Stack, Typography, useTheme } from '@mui/material'
import useStore from '../store/useStore'
import { ZeroConfService } from 'capacitor-zeroconf'

const DeviceCard = ({ device, onClick, dragHandleProps }: { device: DeviceProps; dragHandleProps: any; onClick: (s: ZeroConfService) => void }) => {
  const theme = useTheme()
  const removeService = useStore((s) => s.removeService)
  const activeService = useStore((s) => s.plugins.activeService)
  const removeDeviceByIp = useStore((s) => s.removeDeviceByIp)
  const services = useStore((s) => s.plugins.services)
  const service = services.find((s) => s.name === device.name)
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        sx={{
          bgcolor: activeService === device.name ? theme.palette.primary.main : '',
          color: activeService === device.name ? theme.palette.primary.contrastText : ''
        }}
      >
        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} width={'100%'}>
          <Stack direction={'row'} alignItems={'center'} spacing={2}>
            <div style={{ display: 'flex' }} {...dragHandleProps}>
              <DragIndicator />
            </div>
            <Typography variant='h6'>{device.name}</Typography>
          </Stack>
          <IconButton
            onClick={(e) => {
              e.stopPropagation()
              if (service) onClick(service)
            }}
          >
            {activeService === device.name ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack direction={'column'} spacing={2}>
          <Stack direction={'row'} justifyContent={'space-between'}>
            <Typography>Led Count</Typography>
            <Typography>{device.ledCount}</Typography>
          </Stack>
          <IconButton
            onClick={() => {
              removeDeviceByIp(device.ip)
              if (service) removeService(service)
            }}
          >
            <Delete />
          </IconButton>
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}

export default DeviceCard
