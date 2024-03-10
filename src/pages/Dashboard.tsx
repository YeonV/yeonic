import { Box, Button, Card, CardContent, Stack, useMediaQuery } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { scanZeroconf } from '../plugins/zeroconf'
import { ZeroConfService } from 'capacitor-zeroconf'
import Grid from '@mui/material/Unstable_Grid2'
import useStore from '../store/useStore'
import DeviceCard from '../components/DeviceCard'
import FullScreenDialog from '../components/Dialogs/FullScreen'
import AudioContainer from '../components/Audio/AudioContainer'

const Dashboard = () => {
  const services = useStore((s) => s.plugins.services)
  const addService = useStore((s) => s.addService)
  const clearServices = useStore((s) => s.clearServices)
  const activeService = useStore((s) => s.plugins.activeService)
  const setActiveService = useStore((s) => s.setActiveService)
  const breakMedium = useMediaQuery('(max-width: 1350px)')
  // const breakSmall = useMediaQuery('(max-width: 920px)')
  const serviceType = '_http._tcp.'
  const domain = 'local.'

  const handleServiceClick = (service: ZeroConfService) => {
    if (service.name === activeService) setActiveService('')
    else setActiveService(service.name)
  }

  return (
    <Box flexGrow={1}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem', width: 680 }}>
          <AudioContainer />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            minWidth: 821,
            flexGrow: breakMedium ? 1 : 0,
            alignSelf: 'stretch'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              padding: '1rem',
              minWidth: 400,
              flexGrow: breakMedium ? 1 : 0,
              alignSelf: 'stretch'
            }}
          >
            <Stack direction={'column'} flexGrow={1} spacing={2}>
              <Card>
                <CardContent>
                  <Stack direction={'row'} justifyContent={'space-between'} spacing={2}>
                    <Button
                      sx={{ height: 56 }}
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
                    <Button sx={{ height: 56 }} onClick={() => clearServices()} startIcon={<Delete />}>
                      Clear
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
              <Stack direction={'column'} spacing={1} fontSize={14}>
                {services.map((s) => (
                  <DeviceCard key={s.name} service={s} onClick={() => handleServiceClick(s)} />
                ))}
              </Stack>
            </Stack>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              padding: '1rem',
              minWidth: 421,
              alignSelf: 'stretch'
            }}
          >
            <FullScreenDialog title={activeService} open={activeService !== ''} setOpen={setActiveService} />
          </div>
        </div>
      </div>
      <Grid container spacing={6} display={'none'}>
        <Grid xs={12} md={4}>
          <AudioContainer />
        </Grid>
        <Grid xs={12} md={4}>
          <Stack direction={'column'} spacing={2} fontSize={14}>
            <Stack direction={'row'} justifyContent={'space-between'} spacing={2}>
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
              <Button onClick={() => clearServices()} startIcon={<Delete />}>
                Clear
              </Button>
            </Stack>
            <Stack direction={'column'} spacing={1} fontSize={14}>
              {services.map((s) => (
                <DeviceCard key={s.name} service={s} onClick={() => handleServiceClick(s)} />
              ))}
            </Stack>
          </Stack>
        </Grid>
        <Grid xs={12} md={4}>
          <FullScreenDialog title={activeService} open={activeService !== ''} setOpen={setActiveService} />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
