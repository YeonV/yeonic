import { Box, Chip, Divider, FormControl, InputLabel, MenuItem, OutlinedInput, Select, Slider, Stack, TextField, Typography } from '@mui/material'
import React, { useRef, useEffect, useState } from 'react'
import ColorPicker from '../ColorPicker'
import useStore from '../../store/useStore'
import { SendWledUdpProps, sendWledUdp, sendWledDdp } from '../../plugins/wled'
import Effect, { effects } from '../../effects/Effect'
import { Visualizer } from './Visualizer/Visualizer'
import type { AudioVisualizerProps } from './AudioVisualizer.props'

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ udpRef, audioContext, frequencyBandArray, getFrequencyData, isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const timeStarted = useRef<number | null>(null)
  const animationFrameId = useRef<number | null>(null)
  const [visualizationType, setVisualizationType] = useState<keyof typeof Visualizer>('bars')
  const [protocol, setProtocol] = useState<'udp' | 'ddp'>('ddp')
  const devices = useStore((state) => state.devices)
  const color = useStore((state) => state.color)
  const setColor = useStore((state) => state.setColor)
  const bgColor = useStore((state) => state.bgColor)
  const setBgColor = useStore((state) => state.setBgColor)
  const minVolume = useStore((state) => state.minVolume)
  const setMinVolume = useStore((state) => state.setMinVolume)
  const selectedBands = useStore((state) => state.selectedBands)
  const setSelectedBands = useStore((state) => state.setSelectedBands)
  const effect = useStore((state) => state.effect)
  const setEffect = useStore((state) => state.setEffect)
  const gcolor = useStore((state) => state.gcolor)
  const setGcolor = useStore((state) => state.setGcolor)
  const [selectedDevices, setSelectedDevices] = useState<string[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !audioContext) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const renderFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (isPlaying) {
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
            const pixels = Effect({
              type: effect,
              config: {
                ampValues: amplitudeArray,
                pixel_count: devices.find((d) => d.ip === ip)?.ledCount || 297,
                color,
                bgColor,
                gcolor,
                activeFb: selectedBands[0],
                activeRightFb: selectedBands[1],
                volume: minVolume,
                timeStarted: timeStarted
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

    if (isPlaying) {
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
    isPlaying,
    minVolume,
    selectedBands,
    visualizationType,
    selectedDevices,
    devices,
    udpRef,
    protocol
  ])

  return (
    <Stack direction='column' spacing={2}>
      <Stack direction='row' spacing={2}>
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
      </Stack>
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
      <Divider sx={{ p: '1rem 0' }} />
      <Typography textAlign={'left'} variant='h6' pb={2}>
        WLED
      </Typography>
      <Stack direction='row' spacing={2}>
        <TextField select variant='outlined' label='Effect' value={effect} onChange={(e) => setEffect(e.target.value)}>
          {effects.map((effect) => (
            <MenuItem key={effect} value={effect}>
              {effect}
            </MenuItem>
          ))}
        </TextField>
        <ColorPicker color={color} onChange={setColor} label='Color' />
        <ColorPicker color={bgColor} onChange={setBgColor} label='BgColor' />
        <ColorPicker color={gcolor} gradient onChange={setGcolor} label='GColor' />
      </Stack>
      <Stack direction='row' spacing={2}>
        <FormControl sx={{ flexGrow: 1 }}>
          <InputLabel id='send-to-label'>Send effect to</InputLabel>
          <Select
            labelId='send-to-label'
            fullWidth
            id='send-to'
            multiple
            value={selectedDevices}
            onChange={(e) => setSelectedDevices(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
            input={<OutlinedInput id='select-multiple-chip' label='Send effect to' />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={devices.find((d) => d.ip === value)?.name} />
                ))}
              </Box>
            )}
          >
            {devices.map((device) => (
              <MenuItem key={device.ip} value={device.ip}>
                {device.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          select
          variant='outlined'
          label='Protocol'
          value={protocol}
          onChange={(e) => setProtocol(e.target.value as 'udp' | 'ddp')}
          style={{ maxWidth: '100%', minWidth: '100px', textAlign: 'left' }}
        >
          <MenuItem value='udp'>UDP</MenuItem>
          <MenuItem value='ddp'>DDP</MenuItem>
        </TextField>
      </Stack>
    </Stack>
  )
}

export default AudioVisualizer
