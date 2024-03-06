import React, { useState, useRef, useEffect } from 'react'
import AudioDataContainer from './AudioDataContainer'
import useStore from '../../store/useStore'
import { Button, MenuItem, Stack, TextField } from '@mui/material'
import { Pause, PlayArrow, Stop } from '@mui/icons-material'
import { IUDP, startUDP, stopUDP } from '../../plugins/udplib'

const AudioContainer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const theStream = useRef<MediaStream | null>(null)
  const udpRef = useRef<IUDP | null>(null)

  const audioDevice = useStore((state) => state.audioDevice)
  const setAudioDevice = useStore((state) => state.setAudioDevice)
  const audioDevices = useStore((state) => state.audioDevices)
  const setAudioDevices = useStore((state) => state.setAudioDevices)
  const audioSettings = useStore((state) => state.audioSettings)
  // const setAudioSettings = useStore((state) => state.setAudioSettings)

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }
  const stopStream = () => {
    theStream.current?.getTracks().forEach((track) => track.stop())
    setTimeout(() => {
      setIsPlaying(false)
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
    if (isPlaying) start()
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
  }, [isPlaying])

  return (
    <Stack direction='column' spacing={2}>
      <Stack direction='row' spacing={2}>
        {audioDevices?.length > 0 && (
          <TextField
            select
            variant='outlined'
            label='Audio Input'
            disabled={isPlaying}
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
          {isPlaying ? (
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
        <Button disabled={!isPlaying} onClick={stopStream}>
          <Stop />
          Stop
        </Button>
      </Stack>
      <AudioDataContainer
        audioDeviceId={audioDevice}
        fft={audioSettings.fft}
        bandCount={audioSettings.bands}
        theStream={theStream}
        isPlaying={isPlaying}
        udpRef={udpRef}
        videoDevice='none'
      />
    </Stack>
  )
}

export default AudioContainer
