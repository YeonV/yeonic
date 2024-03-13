import {
  Box,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Slider,
  Stack,
  TextField,
  useMediaQuery
  // Typography
} from '@mui/material'
import React, { useRef, useEffect, useState } from 'react'
import ColorPicker from '../ColorPicker'
import useStore from '../../store/useStore'
import { SendWledUdpProps, sendWledUdp, sendWledDdp } from '../../plugins/wled'
import Effect, { effectNames } from '../../effects/Effect'
import { Visualizer } from './Visualizer/Visualizer'
import type { AudioVisualizerProps } from './AudioVisualizer.props'
import { Capacitor } from '@capacitor/core'

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ udpRef, audioContext, frequencyBandArray, getFrequencyData, audioPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const timeStarted = useRef<number | null>(null)
  const animationFrameId = useRef<number | null>(null)
  const [visualizationType, setVisualizationType] = useState<keyof typeof Visualizer>('bars')
  const [protocol, setProtocol] = useState<'udp' | 'ddp'>('ddp')
  const devices = useStore((s) => s.devices.devices)
  const color = useStore((s) => s.effects.color)
  const setColor = useStore((s) => s.setColor)
  const bgColor = useStore((s) => s.effects.bgColor)
  const setBgColor = useStore((s) => s.setBgColor)
  const effect = useStore((s) => s.effects.effect)
  const setEffect = useStore((s) => s.setEffect)
  const gcolor = useStore((s) => s.effects.gcolor)
  const setGcolor = useStore((s) => s.setGcolor)
  const minVolume = useStore((s) => s.audio.minVolume)
  const setMinVolume = useStore((s) => s.setMinVolume)
  const selectedBands = useStore((s) => s.audio.selectedBands)
  const setSelectedBands = useStore((s) => s.setSelectedBands)
  const selectedDevices = useStore((s) => s.selectedDevices)
  const setSelectedDevices = useStore((s) => s.setSelectedDevices)
  // const [selectedDevices, setSelectedDevices] = useState<string[]>([])
  const [smooth, setSmooth] = useState<'yes' | 'no'>('no')
  const breakSmall = useMediaQuery('(max-width: 480px)')
  const breakMedium = useMediaQuery('(max-width: 640px)')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !audioContext) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const renderFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (audioPlaying) {
        getFrequencyData((amplitudeArray) => {
          const config = {
            canvas,
            bgColor,
            color,
            bands: frequencyBandArray.length,
            minVolume,
            selectedBands
          }
          Visualizer[visualizationType](amplitudeArray, config)

          selectedDevices.forEach((ip) => {
            const device = devices?.find((d) => d.ip === ip)
            const pixels = Effect({
              type: device?.effect?.name || effect,
              config: {
                ampValues: Array.from(amplitudeArray),
                pixel_count: device?.ledCount || 297,
                color: device?.effect?.config?.color || color,
                bgColor: device?.effect?.config?.bgColor || bgColor,
                gcolor: device?.effect?.config?.gcolor || gcolor,
                bandStart: device?.effect?.config?.bandStart || selectedBands[0],
                bandStop: device?.effect?.config?.bandStop || selectedBands[1],
                minVolume: device?.effect?.config?.minVolume || minVolume,
                timeStarted: device?.effect?.config?.timeStarted || timeStarted,
                smooth: device?.effect?.config?.smooth || smooth === 'yes'
              }
            })
            if (udpRef.current) {
              const props: SendWledUdpProps = {
                mode: 2,
                timeout: 1,
                pixels,
                ip,
                u: udpRef.current
              }
              if (protocol === 'udp') {
                sendWledUdp(props)
              } else if (protocol === 'ddp') {
                sendWledDdp(props)
              }
            }
          })
        })
      }
      animationFrameId.current = requestAnimationFrame(renderFrame)
    }

    if (audioPlaying) {
      renderFrame()
    } else if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current)
    }
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [
    audioContext,
    bgColor,
    color,
    effect,
    frequencyBandArray,
    gcolor,
    getFrequencyData,
    audioPlaying,
    minVolume,
    selectedBands,
    visualizationType,
    selectedDevices,
    devices,
    udpRef,
    protocol,
    smooth
  ])

  return (
    <>
      <Card sx={{ overflow: 'unset', width: `min(700px, calc(95vw - ${breakSmall ? 0 : 44}px))`, margin: '0 auto' }}>
        <CardContent>
          {!Capacitor.isNativePlatform() && (
            <TextField
              select
              variant='outlined'
              label='Visualization Type'
              value={visualizationType}
              onChange={(e) => setVisualizationType(e.target.value as keyof typeof Visualizer)}
              style={{ maxWidth: '100%', minWidth: '150px', textAlign: 'left' }}
            >
              {Object.keys(Visualizer).map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          )}
          <Stack direction='column' spacing={2}>
            <Stack sx={{ height: 350 }} spacing={1} direction='row' alignItems={'baseline'}>
              <Slider
                value={minVolume}
                onChange={(_e: Event, value: number | number[]) => setMinVolume(Array.isArray(value) ? value[0] : value)}
                step={1}
                min={0}
                max={100}
                valueLabelDisplay='auto'
                orientation='vertical'
                sx={{ height: 320 }}
              />
              <Stack spacing={1} direction='column' height={350} width={'100%'}>
                <canvas ref={canvasRef} style={{ width: '100%' }} />
                <Slider
                  defaultValue={selectedBands}
                  onChange={(_e: Event, value: number | number[]) => setSelectedBands(Array.isArray(value) ? value : [value, value])}
                  step={1}
                  min={0}
                  max={frequencyBandArray.length || 16}
                  valueLabelDisplay='auto'
                />
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
      <Card sx={{ overflow: 'unset', width: `min(700px, calc(95vw - ${breakSmall ? 0 : 44}px))`, margin: '1rem auto 0' }}>
        <CardContent>
          <Stack direction='column' spacing={2}>
            {/* <Typography textAlign={'left'} variant='h6' pb={2}>
              WLED
            </Typography> */}
            <Stack direction='row' spacing={2} flexWrap={'wrap'}>
              <TextField
                select
                variant='outlined'
                label='Effect'
                value={effect}
                onChange={(e) => setEffect(e.target.value)}
                sx={{ 'flexGrow': 1, 'minWidth': 280, '& .MuiInputBase-root': { height: 65 } }}
              >
                {effectNames.map((effect) => (
                  <MenuItem key={effect} value={effect}>
                    {effect}
                  </MenuItem>
                ))}
              </TextField>
              <Stack
                direction='row'
                spacing={2}
                width={breakMedium ? '100%' : 'auto'}
                style={{ marginLeft: breakMedium ? 0 : '1rem', marginTop: breakMedium ? '1rem' : 0 }}
              >
                <ColorPicker color={color} onChange={setColor} label='Color' />
                <ColorPicker color={bgColor} onChange={setBgColor} label='BgColor' />
                <ColorPicker color={gcolor} gradient onChange={setGcolor} label='GColor' />
              </Stack>
            </Stack>
            <Stack direction='row' spacing={2} flexWrap={'wrap'}>
              <FormControl sx={{ 'flexGrow': 1, '& .MuiInputBase-root': { height: 65 } }}>
                <InputLabel id='send-to-label'>Send effect to</InputLabel>
                <Select
                  labelId='send-to-label'
                  fullWidth
                  sx={{ minWidth: 280 }}
                  id='send-to'
                  multiple
                  value={selectedDevices}
                  onChange={(e) => setSelectedDevices(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                  input={<OutlinedInput id='select-multiple-chip' label='Send effect to' />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={devices?.find((d) => d.ip === value)?.name} />
                      ))}
                    </Box>
                  )}
                >
                  {devices?.map((device) => (
                    <MenuItem key={device.ip} value={device.ip}>
                      {device.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Stack
                direction='row'
                spacing={2}
                width={breakMedium ? '100%' : 'auto'}
                style={{ marginLeft: breakMedium ? 0 : '1rem', marginTop: breakMedium ? '1rem' : 0 }}
              >
                <TextField
                  select
                  variant='outlined'
                  label='Protocol'
                  value={protocol}
                  onChange={(e) => setProtocol(e.target.value as 'udp' | 'ddp')}
                  sx={{ 'maxWidth': '100%', 'minWidth': '110px', 'textAlign': 'left', 'height': 65, '& .MuiInputBase-root': { height: 65 } }}
                >
                  <MenuItem value='udp'>UDP</MenuItem>
                  <MenuItem value='ddp'>DDP</MenuItem>
                </TextField>
                <TextField
                  select
                  variant='outlined'
                  label='Smooth'
                  value={smooth}
                  onChange={(e) => setSmooth(e.target.value as 'yes' | 'no')}
                  sx={{ 'maxWidth': '100%', 'minWidth': '110px', 'textAlign': 'left', '& .MuiInputBase-root': { height: 65 } }}
                >
                  <MenuItem value={'yes'}>Yes</MenuItem>
                  <MenuItem value={'no'}>No</MenuItem>
                </TextField>
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </>
  )
}

export default AudioVisualizer
