import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import useStore from '../../store/useStore'
import { ChevronLeft } from '@mui/icons-material'
import { useMediaQuery, useTheme } from '@mui/material'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction='left' ref={ref} {...props} />
})

export default function FullScreenDialog({ title, open, setOpen }: { title: string; open: boolean; setOpen: (open: string) => void }) {
  const theme = useTheme()
  const mobileWidth = useMediaQuery(theme.breakpoints.down('md'))
  const info = useStore((s) => s.plugins.info)
  const services = useStore((s) => s.plugins.services)
  const service = services.find((service) => service.name === title)

  if (!service) return null

  const handleClose = () => {
    setOpen('')
  }
  const renderIframe = () => (
    <>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar
          sx={{
            paddingTop: info.operatingSystem === 'ios' ? 6 : 0
          }}
        >
          <IconButton edge='start' color='inherit' onClick={handleClose} aria-label='close'>
            <ChevronLeft />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <iframe title={title} src={`http://${service?.ipv4Addresses}:${service?.port}`} style={{ border: 0, width: '100%', height: '100%' }}></iframe>
    </>
  )

  return (
    <React.Fragment>
      {mobileWidth ? (
        <Dialog open={open} onClose={handleClose} TransitionComponent={Transition} fullScreen>
          {renderIframe()}
        </Dialog>
      ) : (
        <iframe
          title={title}
          src={`http://${service?.ipv4Addresses}:${service?.port}`}
          style={{ border: 0, width: '421px', height: '100%', borderRadius: 5 }}
        ></iframe>
      )}
    </React.Fragment>
  )
}
