import { PlayArrow, Stop } from '@mui/icons-material'
import { Box, Button, Paper } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { Microphone } from '@mozartec/capacitor-microphone';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Visualizer = ({
  is2D,
  ctx,
  selectedPixels,
  fft,
  bandCount,
  key,
  initializeAudioAnalyser,
  audioContext,
  frequencyBandArray,
  getFrequencyData,
  refresh,
}: any) => {
  const [playing, setPlaying] = useState(false)
  const amplitudeValues = useRef(null)

  const checkPermissions = async () => {
    try {
      const checkPermissionsResult = await Microphone.checkPermissions();
      console.log('checkPermissionsResult: ' + JSON.stringify(checkPermissionsResult));
    } catch (error) {
      console.error('checkPermissions Error: ' + JSON.stringify(error));
    }
  }
  const requestPermissions = async () => {
    try {
      const requestPermissionsResult = await Microphone.requestPermissions();
      console.log('requestPermissionsResult: ' + JSON.stringify(requestPermissionsResult));
    } catch (error) {
      console.error('requestPermissions Error: ' + JSON.stringify(error));
    }
  }
  const handleStart = () => {
    console.log('start')
    // window.api.udpStart()
    // // ipcRenderer.send('UDPSR-start')
    // timeStarted.current = performance.now()
    checkPermissions()
    requestPermissions()
    checkPermissions()
    setPlaying(true)
    initializeAudioAnalyser()
    // requestAnimationFrame(runSpectrum)
  }
  const handleStop = () => {
    console.log('stop')
    setPlaying(false)
    // window.api.udpStop()
    // // console.log(performance.now() - timeStarted.current)
    // // ipcRenderer.send('UDPSR-stop')
    // if (frequencyBandArray.length > 0) {
    //   const domElements = frequencyBandArray.map((num) => document.getElementById(num))
    //   for (let i = 0; i < frequencyBandArray.length; i++) {
    //     const num = frequencyBandArray[i]
    //     domElements[num].style.backgroundColor = theme.palette.background.paper
    //   }
    // }
    stop()
  }
  const color = { r: 50, g: 100, b: 150 }
  console.log(
    is2D,
    ctx,
    selectedPixels,
    fft,
    bandCount,
    key,
    audioContext,
    frequencyBandArray,
    getFrequencyData,
    refresh
  )
  function adjustFreqBandStyle(newAmplitudeData: any) {
    // console.log(newAmplitudeData)
    if (audioContext.state === 'closed') {
      cancelAnimationFrame(runSpectrum as any)
      return
    }
    amplitudeValues.current = newAmplitudeData
    if (frequencyBandArray.length > 0) {
      const domElements = frequencyBandArray.map((num: string) => document.getElementById(num))
      if (domElements.length > 0) {
        for (let i = 0; i < frequencyBandArray.length; i++) {
          const num = frequencyBandArray[i]
          if (domElements[num]) {
            domElements[num].style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`
            domElements[num].style.height = `${amplitudeValues.current?.[num]}px`
          }
        }
      }
    }
  }
  function runSpectrum() {
    if (audioContext.state === 'running') {
      getFrequencyData(adjustFreqBandStyle)
      requestAnimationFrame(runSpectrum)
    }
  }
  useEffect(() => {
    if (playing) {
      setTimeout(() => {
        initializeAudioAnalyser()
        requestAnimationFrame(runSpectrum)
      }, 100)
    }
  }, [playing])
  return (
    <div>
      <Button startIcon={playing ? <Stop /> : <PlayArrow />} onClick={() => playing ? handleStop() : handleStart()}>{playing ? 'Stop' : 'Start'}</Button>
      <div style={{ display: 'flex', paddingTop: 300 }}>
        {frequencyBandArray.map((num: string) => (
          <div style={{ position: 'relative' }} key={num}>
            <Paper
              style={{
                background: `rgb(${color.r}, ${color.g}, ${color.b})`,
                padding: `calc(100vw / ${frequencyBandArray.length * 4} )`
              }}
              sx={{
                flexShrink: 1,
                margin: 'calc(100vw / 500)',
                transform: 'rotateX(180deg)',
                transformOrigin: 'top',
                border: '1px solid transparent',
                cursor: 'pointer',
                zIndex: 10,
                '.selection-active &': {
                  opacity: 0.3
                },
                '&:hover': {
                  borderColor: '#999',
                  opacity: 1
                },
                '&.selected': {
                  borderColor: '#bbb',
                  opacity: 1
                }}}
              elevation={4}
              id={num}
              key={num}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                height: '255px',
                zIndex: -1,
            
                flexShrink: 1,
                margin: 'calc(100vw / 500)',
                transform: 'rotateX(180deg)',
                transformOrigin: 'top',
                border: '1px solid transparent',
                cursor: 'pointer',
                '.selection-active &': {
                  opacity: 0.3
                },
                '&:hover': {
                  opacity: 1
                },
                '&.selected': {
                  opacity: 1
                },
                '&&:not(.selected)': {
                  backgroundColor: 'transparent !important'
                }
              }}
              style={{
                padding: `calc(100vw / ${frequencyBandArray.length * 4} )`
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
export default Visualizer