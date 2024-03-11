import { useState } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Button, Stack, TextField, Typography, useTheme } from '@mui/material'
import useStore from '../store/useStore'
import { ClearAll, ExpandMore } from '@mui/icons-material'
import { notifyDesktop, notifyMobile, toast } from '../plugins/notify'
import { scanZeroconf } from '../plugins/zeroconf'
import ServiceCard from '../components/ServiceCard'
import { Capacitor } from '@capacitor/core'
import FullScreenDialog from '../components/Dialogs/FullScreen'
// import { ZeroConfService } from 'capacitor-zeroconf'
import AudioContainer from '../components/Audio/AudioContainer'
// import { WledDdpDevice } from '../plugins/WledDdpDevice'

const Features = () => {
  const theme = useTheme()
  const platform = Capacitor.getPlatform()
  const mobile = ['ios', 'android'].includes(platform)

  const bears = useStore((s) => s.bears)
  const setBears = useStore((s) => s.setBears)

  const info = useStore((s) => s.plugins.info)
  const darkMode = useStore((s) => s.ui.darkMode)
  const setDarkMode = useStore((s) => s.setDarkMode)
  const services = useStore((s) => s.plugins.services)
  const addService = useStore((s) => s.addService)
  const clearServices = useStore((s) => s.clearServices)
  const audioPlaying = useStore((s) => s.audio.audioPlaying)
  const activeService = useStore((s) => s.plugins.activeService)
  const setActiveService = useStore((s) => s.setActiveService)
  // const audioDevices = useStore((s) => s.audio.audioDevices)

  const [bearState, setBearState] = useState(0)
  const [noteTitle, setNoteTitle] = useState('Yeonic Notification')
  const [noteText, setNoteText] = useState('Hello world')
  const [noteIcon, setNoteIcon] = useState('https://raw.githubusercontent.com/YeonV/yeonic/main/icons/icon-512.webp')
  const [serviceType, setServiceType] = useState('_http._tcp.')
  const [domain, setDomain] = useState('local.')

  // const handleServiceClick = (service: ZeroConfService) => {
  //   if (service.name === activeService) setActiveService('')
  //   else setActiveService(service.name)
  // }

  // console.log('audiotest', audioDevices)
  return (
    <div className='content' style={{ justifyContent: 'flex-start' }}>
      <Stack direction={'row'} spacing={3}>
        <Stack direction={'column'} spacing={3}>
          {Capacitor.isNativePlatform() && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Stack direction={'row'} justifyContent={'space-between'} width={'100%'} alignItems={'center'} paddingRight={2}>
                  <Typography variant='h6'>Zeroconf</Typography>
                  <Typography variant='caption' color={theme.palette.text.disabled}>
                    {services.length} Service{services.length > 1 ? 's' : ''} Discovered
                  </Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Stack direction={'column'} spacing={2} fontSize={14}>
                  <Stack direction={'row'} justifyContent={'space-between'}>
                    <TextField label='Service Type' value={serviceType} onChange={(e) => setServiceType(e.target.value)} />
                    <TextField label='Domain' value={domain} onChange={(e) => setDomain(e.target.value)} />
                    <Button
                      onClick={() =>
                        scanZeroconf({
                          serviceType,
                          domain,
                          onServiceFound: (service) => addService(service)
                        })
                      }
                    >
                      Scan
                    </Button>
                  </Stack>
                  <Stack direction={'row'} justifyContent={'space-between'} spacing={2}>
                    <Typography variant='h6'>Discovered:</Typography>
                    <Button onClick={() => clearServices()}>
                      <ClearAll />
                    </Button>
                  </Stack>
                  {services.map((s) => (
                    <ServiceCard key={s.name} service={s} />
                    // <ServiceCard key={s.name} service={s} onClick={() => handleServiceClick(s)} />
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>
          )}

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Stack direction={'row'} justifyContent={'space-between'} width={'100%'} alignItems={'center'} paddingRight={2}>
                <Typography variant='h6'>Device Info</Typography>
                <Typography variant='caption' color={theme.palette.text.disabled}>
                  {info.operatingSystem}
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              {Object.entries(info).map(([key, value]) => (
                <Stack key={key} direction={'row'} justifyContent={'space-between'}>
                  <Typography>{key}</Typography>
                  <Typography>{value}</Typography>
                </Stack>
              ))}
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Stack direction={'row'} justifyContent={'space-between'} width={'100%'} alignItems={'center'} paddingRight={2}>
                <Typography variant='h6'>Notifications</Typography>
                <Typography variant='caption' color={theme.palette.text.disabled}>
                  {Capacitor.isNativePlatform() ? 'Native' : 'Web'}
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Stack direction={'column'} spacing={2}>
                <TextField label='Title' value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} />
                <TextField label='Text' value={noteText} onChange={(e) => setNoteText(e.target.value)} />
                <TextField label='Icon-URL' value={noteIcon} onChange={(e) => setNoteIcon(e.target.value)} />
                <Stack direction={'row'} justifyContent={'center'} spacing={2}>
                  {!mobile && <Button onClick={() => notifyDesktop(noteTitle, noteText, noteIcon)}>Web Desktop Notification</Button>}
                  {mobile && (
                    <>
                      <Button
                        onClick={() =>
                          notifyMobile({
                            title: noteTitle,
                            body: noteText
                          })
                        }
                      >
                        Mobile Local Notification
                      </Button>
                      <Button onClick={() => toast(noteTitle + ' - ' + noteText)}>Mobile Toast</Button>
                    </>
                  )}
                </Stack>
              </Stack>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Stack direction={'row'} justifyContent={'space-between'} width={'100%'} alignItems={'center'} paddingRight={2}>
                <Typography variant='h6'>Audio</Typography>
                <Typography variant='caption' color={theme.palette.text.disabled}>
                  {audioPlaying ? 'Playing' : 'Stopped'}
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <AudioContainer />
            </AccordionDetails>
          </Accordion>

          <Stack direction={'row'} justifyContent={'center'} spacing={2}>
            <Button onClick={() => setBearState(bearState + 1)}>State is {bearState}</Button>
            <Button onClick={() => setBears(bears + 1)}>Zustand is {bears}</Button>
            <Button onClick={() => setDarkMode(!darkMode)}>{theme.palette.mode} mode</Button>
          </Stack>
        </Stack>
        {/* <Button onClick={() => WledDdpDevice.flush(pixelBuffer)}>sendPixels</Button> */}
        <FullScreenDialog title={activeService} open={activeService !== ''} setOpen={setActiveService} />
      </Stack>
    </div>
  )
}

export default Features
