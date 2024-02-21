import { useEffect, useState } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardContent, Slider, Stack, TextField, Typography, useTheme } from '@mui/material'
import { Toast } from '@capacitor/toast'
import useStore from '../store/useStore'
import logo from '/logo.svg'
import Notify from 'react-desktop-notify'
import { ExpandMore } from '@mui/icons-material'
import { ScreenBrightness } from '@capacitor-community/screen-brightness';

const showHelloToast = async (text: string) => {
  await Toast.show({
    text: text
  })
}

export type ReleaseType = {
  name: string
  assets: {
    browser_download_url: string
    name: string
  }[]
  tag_name: string
  prerelease: boolean
}

const notify = async (title: string, text: string, icon: string) => {
  const notifyObject = new Notify()
  const permissionGranted = await notifyObject.requestPermission()
  if (permissionGranted) {
    notifyObject.setTitle(title).setText(text).setIcon(icon).show()
  }
}

const Features = () => {
  const theme = useTheme()
  const [bearState, setBearState] = useState(0)
  const darkMode = useStore((state) => state.darkMode)
  const services = useStore((state) => state.services)
  const setDarkMode = useStore((state) => state.setDarkMode)
  const bears = useStore((state) => state.bears)
  const setBears = useStore((state) => state.setBears)
  const [noteTitle, setNoteTitle] = useState('Yeonic Notification')
  const [noteText, setNoteText] = useState('Hello world')
  const [noteIcon, setNoteIcon] = useState('https://raw.githubusercontent.com/YeonV/yeonic/main/icons/icon-512.webp')
  const info = useStore((state) => state.info)
  const [brightness, setBrightness] = useState(0.5);
  
  const handleBrightness = async (_event: Event, newValue: number | number[]) => {
    ScreenBrightness.setBrightness({brightness: newValue as number})
    setBrightness(newValue as number);
  }

  useEffect(() => {
    const getBrightness = async () => {
      const {brightness: currentBrightness} = await ScreenBrightness.getBrightness()
      setBrightness(currentBrightness);
    }
    getBrightness();
  }, [])

  return (
    <div className='content'>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 2, marginBottom: 5 }}>
        <img src={logo} alt='logo' style={{ maxWidth: '90%', filter: theme.palette.mode === 'dark' ? 'invert(100%)' : '' }} />
      </Box>
      <Stack direction={'column'} spacing={3}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Stack direction={'row'} justifyContent={'space-between'} width={'100%'} alignItems={'center'} paddingRight={2}>
              <Typography variant='h6'>Zeroconf</Typography>
              <Typography variant='caption' color={theme.palette.text.disabled}>
                {services.length} Services Discovered
              </Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Stack direction={'column'} spacing={2} fontSize={14}>
              {services.map((s) => (
                <Card key={s.name} elevation={5}>
                  <CardContent>
                    <Typography bgcolor={theme.palette.primary.main} color={theme.palette.primary.contrastText} borderRadius={4} marginBottom={1} variant='h6'>
                      {s.name}
                    </Typography>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                      <Typography>IP Address</Typography>
                      <Typography>{s.ipv4Addresses?.[0] || s.ipv6Addresses?.[0]}</Typography>
                    </Stack>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                      <Typography>Port</Typography>
                      <Typography>{s.port}</Typography>
                    </Stack>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                      <Typography>Service Type</Typography>
                      <Typography>{s.type}</Typography>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Stack direction={'row'} justifyContent={'space-between'} width={'100%'} alignItems={'center'} paddingRight={2}>
              <Typography variant='h6'>Device Info</Typography>
              <Typography variant='caption' color={theme.palette.text.disabled}>
                {info.manufacturer} {info.model} - {info.operatingSystem} {info.osVersion}
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
            <Typography variant='h6'>Notifications</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack direction={'column'} spacing={2}>
              <TextField label='Title' variant='outlined' value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} />
              <TextField label='Text' variant='outlined' value={noteText} onChange={(e) => setNoteText(e.target.value)} />
              <TextField label='Icon-URL' variant='outlined' value={noteIcon} onChange={(e) => setNoteIcon(e.target.value)} />
              <Stack direction={'row'} justifyContent={'center'} spacing={2}>
                <Button variant='contained' onClick={() => notify(noteTitle, noteText, noteIcon)}>
                  Web Desktop Notification
                </Button>
                <Button variant='contained' onClick={() => showHelloToast(noteTitle + ' - ' + noteText)}>
                  Mobile Toast
                </Button>
              </Stack>
            </Stack>
          </AccordionDetails>
        </Accordion>

        <Card elevation={5}>
          <CardContent>
            <Slider value={brightness} onChange={handleBrightness} />
          </CardContent>
        </Card>

        <Stack direction={'row'} justifyContent={'center'} spacing={2}>
          <Button variant='contained' onClick={() => setBearState(bearState + 1)}>
            State is {bearState}
          </Button>
          <Button variant='contained' onClick={() => setBears(bears + 1)}>
            Zustand is {bears}
          </Button>
          <Button variant='contained' onClick={() => setDarkMode(!darkMode)}>
            {theme.palette.mode} mode
          </Button>
        </Stack>
      </Stack>
    </div>
  )
}

export default Features
