import React, { useState, useRef, useEffect } from 'react'
import AudioVisualizer from './AudioVisualizer'
import { IUDP } from '../../plugins/udp'
import { MenuItem, TextField } from '@mui/material'

interface AudioDataContainerProps {
  audioDeviceId: string
  fft: number
  bandCount: number
  videoDevice?: string
  theStream: React.MutableRefObject<MediaStream | null>
  isPlaying: boolean
  udpRef: React.MutableRefObject<IUDP | null>
}
function logScale(index: number, total: number, base = 2) {
  const logMax = Math.log(total) / Math.log(base)
  const exp = (logMax * index) / total
  return Math.pow(base, exp) - 1
}

const AudioDataContainer: React.FC<AudioDataContainerProps> = ({ udpRef, audioDeviceId, fft, bandCount, videoDevice = 'none', theStream, isPlaying }) => {
  const [frequencyBandArray] = useState<number[]>(Array.from({ length: bandCount }, (_, i) => i))
  const audioData = useRef<AnalyserNode | null>(null)
  const audioContext = useRef<AudioContext | null>(new AudioContext())
  const theGain = useRef<GainNode | null>(null)
  const [scale, setScale] = useState<'log' | 'default'>('log')

  useEffect(() => {
    const initializeAudioAnalyser = async () => {
      const stream = await getMedia(audioDeviceId)
      if (stream && audioContext.current && audioContext.current.state !== 'closed') {
        const source = audioContext.current.createMediaStreamSource(stream)
        const analyser = audioContext.current.createAnalyser()
        analyser.fftSize = fft
        const gain = audioContext.current.createGain()
        theGain.current = gain
        source.connect(gain)

        // // Create a BiquadFilterNode
        // const filter = audioContext.current.createBiquadFilter()
        // filter.type = 'lowshelf'
        // filter.frequency.value = 1000
        // filter.gain.value = 25

        // // Connect the gain node to the filter, and the filter to the analyser
        // gain.connect(filter)
        // filter.connect(analyser)

        // audioData.current = analyser

        gain.connect(analyser)
        audioData.current = analyser
      }
    }

    const getMedia = async (clientDevice: string | null) => {
      const ad = await navigator.mediaDevices
        ?.enumerateDevices()
        .then((devices) => (clientDevice !== null && devices.find((d) => d.deviceId === clientDevice) ? clientDevice : null))
      let videoStream: MediaStream | null = null

      if (ad) {
        try {
          if (videoDevice !== 'screen') {
            videoStream = await navigator.mediaDevices.getUserMedia({
              audio: { deviceId: { exact: ad } },
              video: videoDevice !== 'none'
            })
          } else {
            videoStream = await navigator.mediaDevices.getDisplayMedia({
              audio: { deviceId: { exact: ad } },
              video: true
            })
          }
        } catch (err) {
          console.log('Error:', err)
        }
      } else {
        try {
          if (videoDevice !== 'screen') {
            videoStream = await navigator.mediaDevices.getUserMedia({
              audio: true,
              video: videoDevice !== 'none'
            })
          } else {
            videoStream = await navigator.mediaDevices.getDisplayMedia({
              audio: true,
              video: true
            })
          }
        } catch (err) {
          console.log('Error:', err)
        }
      }
      if (videoStream) {
        theStream.current = videoStream
        return videoStream
      }
      return null
    }

    if (isPlaying) initializeAudioAnalyser()
  }, [audioDeviceId, fft, videoDevice, theStream, isPlaying])

  useEffect(() => {
    if (isPlaying) {
      // Resume the audio context when isPlaying is true
      audioContext.current?.resume()
    } else {
      // Suspend the audio context when isPlaying is false
      audioContext.current?.suspend()
    }
  }, [isPlaying])

  const getFrequencyData = (styleAdjuster: (_arg0: Uint8Array) => void) => {
    if (!audioData.current) {
      return
    }
    const bufferLength = audioData.current.frequencyBinCount
    const amplitudeArray = new Uint8Array(bufferLength)

    audioData.current.getByteFrequencyData(amplitudeArray)

    // Map the amplitude array to a logarithmic scale
    if (scale === 'log') {
      const logAmplitudeArray = amplitudeArray.map((_amp, index) => {
        const logIndex = logScale(index, amplitudeArray.length)
        return amplitudeArray[logIndex]
      })

      styleAdjuster(logAmplitudeArray)
      // styleAdjuster(amplitudeArray)
    } else {
      styleAdjuster(amplitudeArray)
    }
  }

  return (
    <div style={{ position: 'relative', top: 0 }}>
      <TextField select variant='outlined' label='Scale' value={scale} onChange={(e) => setScale(e.target.value as 'log' | 'default')}>
        <MenuItem value='default'>Default</MenuItem>
        <MenuItem value='log'>Log</MenuItem>
      </TextField>
      <AudioVisualizer
        udpRef={udpRef}
        audioContext={audioContext.current}
        frequencyBandArray={frequencyBandArray}
        getFrequencyData={getFrequencyData}
        isPlaying={isPlaying}
      />
    </div>
  )
}

export default AudioDataContainer
