import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import logoForeground from '/logo_foreground.png'
import logo from '/logo.svg'
import { useTheme } from '@mui/material'
import { Menu } from '@mui/icons-material'
import useStore from '../store/useStore'

export default function TopBar({ position = 'fixed' }: {
  position?: 'absolute'
  | 'fixed'
  | 'relative'
  | 'static'
  | 'sticky'
}) {
  const theme = useTheme()
  const info = useStore((state) => state.info)

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position={position}>
        <Toolbar sx={{ justifyContent: 'space-between', paddingTop: info.operatingSystem === 'ios' ? 6 : 0 }}>
          <img src={logoForeground} width={40} alt='logo' />
          <img src={logo} height={30} alt='logo' style={{ maxWidth: '90%', filter: theme.palette.mode === 'dark' ? 'invert(100%)' : '' }} />
          <Box height={50} width={50} justifyContent={'center'} alignItems={'center'} display={'flex'}>
            <Menu />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
