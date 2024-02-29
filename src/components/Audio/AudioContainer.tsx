import React, { useState, useRef } from 'react'
import AudioDataContainer from './AudioDataContainer'
import useStore from '../../store/useStore'
import { Button } from '@mui/material'
import { PlayArrow, Stop } from '@mui/icons-material'

const AudioContainer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const theStream = useRef<MediaStream | null>(null)

  const audioDevice = useStore((state) => state.audioDevice)
  const audioSettings = useStore((state) => state.audioSettings)

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div>
      <Button onClick={togglePlay}>{isPlaying ? <><Stop />Stop</> : <><PlayArrow />Play</>}</Button>
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