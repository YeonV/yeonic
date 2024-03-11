import { Delete } from '@mui/icons-material'
import { scanZeroconf } from '../plugins/zeroconf'
import { ZeroConfService } from 'capacitor-zeroconf'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Box, Button, Card, CardContent, Stack, useMediaQuery } from '@mui/material'
import useStore from '../store/useStore'
import DeviceCard from '../components/DeviceCard'
import ServiceCard from '../components/ServiceCard'
import AudioContainer from '../components/Audio/AudioContainer'
import FullScreenDialog from '../components/Dialogs/FullScreen'
import '../styles/Dashboard.styles.css'

const Dashboard = () => {
  const swapOrder = useStore((s) => s.swapOrder)
  const addService = useStore((s) => s.addService)
  const clearServices = useStore((s) => s.clearServices)
  const setActiveService = useStore((s) => s.setActiveService)
  const devices = useStore((s) => s.devices.devices)
  const services = useStore((s) => s.plugins.services)
  const activeService = useStore((s) => s.plugins.activeService)
  // const breakMedium = useMediaQuery('(max-width: 1350px)')
  const serviceType = '_http._tcp.'
  const domain = 'local.'
  const breakSmall = useMediaQuery('(max-width: 480px)')
  // const breakMedium = useMediaQuery('(max-width: 640px)')
  const breakLarge = useMediaQuery('(max-width: 1200px)')

  const handleServiceClick = (service: ZeroConfService) => {
    if (service.name === activeService) setActiveService('')
    else setActiveService(service.name)
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return
    swapOrder(result.source.index, result.destination.index)
  }

  return (
    <Box flexGrow={1} className='dashboard'>
      <div className='wrapper'>
        <div className='col1'>
          <AudioContainer />
        </div>

        <div className='col2and3' style={{ minWidth: activeService === '' ? 'min(400px, 95vw)' : 'min(821px, 95vw)' }}>
          <div className='col2'>
            <Stack direction={'column'} flexGrow={1} spacing={2}>
              <Card
                sx={{
                  overflow: 'unset',
                  width: breakLarge && activeService === '' ? `min(700px, calc(95vw - ${breakSmall ? 0 : 44}px))` : 'auto',
                  margin: '2rem auto 0'
                }}
              >
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
              {services.map((s) => {
                return <ServiceCard key={s.name} service={s} />
              })}
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId='devices'>
                  {(provided, snapshot) => (
                    <Stack
                      direction={'column'}
                      spacing={1}
                      fontSize={14}
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      sx={{ backgroundColor: snapshot.isDraggingOver ? '#00000099' : 'transparent' }}
                    >
                      {devices.map((d, i) => {
                        return (
                          <Draggable key={d.name} draggableId={d.name} index={i}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                style={{ backgroundColor: snapshot.isDragging ? 'transparent' : 'transparent', ...provided.draggableProps.style }}
                              >
                                <DeviceCard device={d} onClick={handleServiceClick} dragHandleProps={{ ...provided.dragHandleProps }} />
                              </div>
                            )}
                          </Draggable>
                        )
                      })}
                      {provided.placeholder}
                    </Stack>
                  )}
                </Droppable>
              </DragDropContext>
            </Stack>
          </div>
          {activeService !== '' && (
            <div className='col3'>
              <FullScreenDialog title={activeService} open={activeService !== ''} setOpen={setActiveService} />
            </div>
          )}
        </div>
      </div>
    </Box>
  )
}

export default Dashboard
