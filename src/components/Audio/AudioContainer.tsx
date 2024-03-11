import React, { useRef, useEffect } from 'react'
import AudioDataContainer from './AudioDataContainer'
import useStore from '../../store/useStore'
import { Button, Card, CardContent, MenuItem, Stack, TextField, useMediaQuery } from '@mui/material'
import { Pause, PlayArrow, Stop } from '@mui/icons-material'
import { IUDP, startUDP, stopUDP } from '../../plugins/udp'

const AudioContainer: React.FC = () => {
  const theStream = useRef<MediaStream | null>(null)
  const udpRef = useRef<IUDP | null>(null)

  const audioPlaying = useStore((s) => s.audio.audioPlaying)
  const setAudioPlaying = useStore((s) => s.setAudioPlaying)
  const audioDevice = useStore((s) => s.audio.audioDevice)
  const setAudioDevice = useStore((s) => s.setAudioDevice)
  const audioDevices = useStore((s) => s.audio.audioDevices)
  const setAudioDevices = useStore((s) => s.setAudioDevices)
  const audioSettings = useStore((s) => s.audio.audioSettings)
  // const setAudioSettings = useStore((s) => s.audio.setAudioSettings)
  const breakSmall = useMediaQuery('(max-width: 480px)')

  const togglePlay = () => {
    setAudioPlaying(!audioPlaying)
  }
  const stopStream = () => {
    theStream.current?.getTracks().forEach((track) => track.stop())
    setTimeout(() => {
      setAudioPlaying(false)
    }, 400)
  }
  useEffect(() => {
    // setAudioSettings({
    //   sampleRate: audioContext.sampleRate
    // })
    navigator.mediaDevices
      .enumerateDevices()
      .then(function (adevices) {
        setAudioDevices(adevices)
      })
      .catch(function (err) {
        console.log(err.name + ': ' + err.message)
      })
  }, [])

  useEffect(() => {
    const start = async () => {
      if (!udpRef.current) {
        const u = await startUDP({})
        if (u) {
          udpRef.current = u
        }
      }
    }
    if (audioPlaying) start()
    else if (udpRef.current) {
      stopUDP({ u: udpRef.current })
      udpRef.current = null
    }
    return () => {
      if (udpRef.current) {
        stopUDP({ u: udpRef.current })
        udpRef.current = null
      }
    }
  }, [audioPlaying])

  return (
    <Stack direction='column' spacing={2} maxWidth={`min(700px, calc(95vw - ${breakSmall ? 0 : 44}px))`}>
      <Card sx={{ overflow: 'unset', width: `min(700px, calc(95vw - ${breakSmall ? 0 : 44}px))`, margin: '2rem auto 0' }}>
        <CardContent>
          <Stack direction='row' spacing={2}>
            {audioDevices?.length > 0 && (
              <TextField
                select
                variant='outlined'
                label='Audio Input'
                disabled={audioPlaying}
                value={audioDevice || 'default'}
                onChange={(e) => {
                  setAudioDevice(e.target.value)
                }}
              >
                {audioDevices
                  .filter((cd) => cd.kind === 'audioinput')
                  .map((d, i) => (
                    <MenuItem key={i} value={d.deviceId}>
                      {/* {d.kind === 'audioinput' ? <Mic /> : <Speaker />} */}
                      {d.label}
                    </MenuItem>
                  ))}
              </TextField>
            )}
            <Button onClick={togglePlay}>
              {audioPlaying ? (
                <>
                  <Pause />
                  Pause
                </>
              ) : (
                <>
                  <PlayArrow />
                  Play
                </>
              )}
            </Button>
            <Button disabled={!audioPlaying} onClick={stopStream}>
              <Stop />
              Stop
            </Button>
          </Stack>
        </CardContent>
      </Card>
      <AudioDataContainer
        audioDeviceId={audioDevice}
        fft={audioSettings.fft}
        bandCount={audioSettings.bands}
        theStream={theStream}
        audioPlaying={audioPlaying}
        udpRef={udpRef}
        videoDevice='none'
      />
    </Stack>
  )
}

export default AudioContainer
