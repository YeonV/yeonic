import React, { useState, useRef, useEffect } from 'react'
import AudioDataContainer from './AudioDataContainer'
import useStore from '../../store/useStore'
import { Button, MenuItem, TextField } from '@mui/material'
import { Pause, PlayArrow,  Stop } from '@mui/icons-material'

const AudioContainer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const theStream = useRef<MediaStream | null>(null)

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
    }, 400);
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

 

  return (
    <div>
      {audioDevices?.length > 0 && <TextField
        select
        variant='outlined'
        label='Audio Input'
        disabled={isPlaying}
        value={audioDevice || 'default'}
        style={{ width: '100%' }}
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
      </TextField>}
      <Button onClick={togglePlay}>{isPlaying ? <><Pause />Pause</> : <><PlayArrow />Play</>}</Button>
      <Button disabled={!isPlaying} onClick={stopStream}><Stop />Stop</Button>
      <AudioDataContainer
        audioDeviceId={audioDevice}
        fft={audioSettings.fft}
        bandCount={audioSettings.bands}
        theStream={theStream}
        isPlaying={isPlaying}
        videoDevice="none"
      />
    </div>
  )
}

export default AudioContainer