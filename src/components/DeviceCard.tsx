import type { DeviceProps } from '../store/storeDevices'
import { Accordion, AccordionDetails, AccordionSummary, Button, IconButton, MenuItem, Stack, Switch, TextField, Typography, useTheme } from '@mui/material'
import { ChevronLeft, ChevronRight, Delete, DragIndicator, ExpandMore } from '@mui/icons-material'
import { ZeroConfService } from 'capacitor-zeroconf'
import { effectNames } from '../effects/Effect'
import ColorPicker from './ColorPicker'
import useStore from '../store/useStore'
import { colorType } from '../store/storeEffects'
import { useState } from 'react'

const DeviceCard = ({ device, onClick, dragHandleProps }: { device: DeviceProps; dragHandleProps: any; onClick: (s: ZeroConfService) => void }) => {
  const theme = useTheme()
  const [expanded, setExpanded] = useState(false)
  const removeService = useStore((s) => s.removeService)
  const activeService = useStore((s) => s.plugins.activeService)
  const removeDeviceByIp = useStore((s) => s.removeDeviceByIp)
  const services = useStore((s) => s.plugins.services)
  const setDeviceEffectName = useStore((s) => s.setDeviceEffectName)
  const setDeviceColor = useStore((s) => s.setDeviceColor)
  const setDeviceBgColor = useStore((s) => s.setDeviceBgColor)
  const setDeviceGColor = useStore((s) => s.setDeviceGColor)
  const setDeviceBandStart = useStore((s) => s.setDeviceBandStart)
  const setDeviceBandStop = useStore((s) => s.setDeviceBandStop)
  const setDeviceMinVolume = useStore((s) => s.setDeviceMinVolume)
  const service = services.find((s) => s.name === device.name)
  const selectedDevices = useStore((s) => s.selectedDevices)
  const selectedBands = useStore((s) => s.audio.selectedBands)
  const minVolume = useStore((s) => s.audio.minVolume)
  const toggleSelectedDevice = useStore((s) => s.toggleSelectedDevice)
  return (
    <Accordion expanded={expanded}>
      <AccordionSummary
        expandIcon={<ExpandMore onClick={() => setExpanded(!expanded)} />}
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
            <Switch
              size='small'
              checked={selectedDevices.includes(device.ip)}
              onChange={(e) => {
                e.stopPropagation()
                toggleSelectedDevice(device.ip)
              }}
            />
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
          <Stack direction='row' spacing={2} width={'100%'}>
            <TextField
              select
              variant='outlined'
              label='Effect'
              value={device.effect?.name}
              onChange={(e) => setDeviceEffectName(device.ip, e.target.value)}
              sx={{ 'flexGrow': 1, '& .MuiInputBase-root': { height: 65 } }}
            >
              <MenuItem key={'None'} value={''}>
                None
              </MenuItem>
              {effectNames.map((effectName) => (
                <MenuItem key={effectName} value={effectName}>
                  {effectName}
                </MenuItem>
              ))}
            </TextField>

            {device.effect?.name && (
              <Stack direction='row' spacing={2}>
                <ColorPicker color={device.effect?.config.color} onChange={(e: colorType) => setDeviceColor(device.ip, e)} label='Color' />
                <ColorPicker color={device.effect?.config.bgColor} onChange={(e: colorType) => setDeviceBgColor(device.ip, e)} label='BgColor' />
                <ColorPicker color={device.effect?.config.gcolor} gradient onChange={(e: string) => setDeviceGColor(device.ip, e)} label='GColor' />
              </Stack>
            )}
          </Stack>
          <Stack direction='row' spacing={2} width={'100%'}>
            <TextField
              label='BandStart'
              InputProps={{ inputProps: { min: 0, max: 512 } }}
              type='number'
              value={device.effect?.config.bandStart || selectedBands[0]}
              onChange={(e) => setDeviceBandStart(device.ip, parseInt(e.target.value))}
            />
            <TextField
              label='BandStop'
              InputProps={{ inputProps: { min: 0, max: 512 } }}
              type='number'
              value={device.effect?.config.bandStop || selectedBands[1]}
              onChange={(e) => setDeviceBandStop(device.ip, parseInt(e.target.value))}
            />
            <TextField
              label='MinVolume'
              InputProps={{ inputProps: { min: 0, max: 100 } }}
              type='number'
              value={device.effect?.config.minVolume || minVolume}
              onChange={(e) => setDeviceMinVolume(device.ip, parseInt(e.target.value))}
            />
            <Button
              variant='text'
              onClick={() => {
                removeDeviceByIp(device.ip)
                if (service) removeService(service)
              }}
            >
              <Delete />
            </Button>
          </Stack>

          {/* <Stack direction={'row'} justifyContent={'space-between'}>
            <Typography>Led Count</Typography>
            <Typography>{device.ledCount}</Typography>
          </Stack> */}
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}

export default DeviceCard
