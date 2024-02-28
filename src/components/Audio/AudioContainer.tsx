import { useState, useRef } from 'react'
import Visualizer from './Visualizer'

const AudioDataContainer = ({
  audioDeviceId,
  fft,
  bandCount,
  drawerBottomHeight,
  videoDevice = 'none',
  theStream,
  selectedPixels,
  is2D = false,
  ctx
}: any) => {
  const [frequencyBandArray] = useState([...Array(bandCount).keys()])
  const audioData = useRef<AnalyserNode | null>(null)
  const audioContext = useRef<AudioContext | any>(new AudioContext())
  const theGain = useRef<AudioParam | null>(null)

  const initializeAudioAnalyser = () => {
    getMedia(audioDeviceId).then((stream) => {
      if (stream) {
        if (!audioContext.current || audioContext.current.state === 'closed') {
          return
        }
        const source = audioContext.current.createMediaStreamSource(stream)
        const analyser = audioContext.current.createAnalyser()
        analyser.fftSize = fft
        const gain = audioContext.current.createGain()
        theGain.current = gain.gain
        source.connect(gain)
        gain.connect(analyser)
        audioData.current = analyser
      }
    })
  }

  const getFrequencyData = (styleAdjuster: (_arg0: Uint8Array) => void) => {
    if (!audioData.current) {
      return
    }
    const bufferLength = audioData.current.frequencyBinCount
    const amplitudeArray = new Uint8Array(bufferLength)

    audioData.current.getByteFrequencyData(amplitudeArray)
    styleAdjuster(amplitudeArray)
  }

  const getMedia = async (clientDevice: string | null) => {
    const ad = await navigator.mediaDevices?.enumerateDevices()
      .then((devices) =>
        clientDevice !== null && devices.find((d) => d.deviceId === clientDevice) ? clientDevice : null
      )
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

  return (
    <div
      style={{
        height: 255,
        position: 'relative',
        top: drawerBottomHeight === 800 ? 390 : 0
      }}
    >
      <Visualizer
        is2D={is2D}
        ctx={ctx}
        selectedPixels={selectedPixels}
        fft={fft}
        bandCount={bandCount}
        key={bandCount}
        initializeAudioAnalyser={initializeAudioAnalyser}
        audioContext={audioContext.current}
        frequencyBandArray={frequencyBandArray}
        getFrequencyData={getFrequencyData}
        refresh={() => {
          if (audioContext.current && audioContext.current.state === 'running') {
            audioContext.current.state !== 'closed' &&
              theStream.current &&
              theStream.current.getTracks().forEach((track :any) => track.stop())

            audioContext.current.state !== 'closed' && audioContext.current.suspend()

            audioContext.current.state !== 'closed' && audioContext.current.resume()
            audioData.current = null
          }
        }}
        stop={() => {
          if (audioContext.current && audioContext.current.state === 'running') {
            if (theGain.current) {
              theGain.current.value = 0
            }
            setTimeout(() => {
              if (audioContext.current) {
                audioContext.current.state !== 'closed' &&
                  theStream.current &&
                  theStream.current.getTracks().forEach((track: any) => track.stop())
                audioContext.current.state !== 'closed' && audioContext.current.suspend()
                audioContext.current.state !== 'closed' && audioContext.current.resume()
                audioData.current = null
              }
            }, 800)
          }
        }}
      />
    </div>
  )
}

export default AudioDataContainer