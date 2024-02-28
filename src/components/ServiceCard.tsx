import { Delete, Settings } from '@mui/icons-material'
import { Card, CardContent, IconButton, Stack, Typography, useTheme } from '@mui/material'
import type { ZeroConfService } from 'capacitor-zeroconf'
import useStore from '../store/useStore'

const ServiceCard = ({ service, onClick }: { service: ZeroConfService, onClick: ()=>void }) => {
  const theme = useTheme()
  const removeService = useStore((state) => state.removeService)
  return (
    <Card key={service.name} elevation={5}>
      <Stack
        color={theme.palette.secondary.contrastText}
        bgcolor={theme.palette.secondary.main}
        borderRadius={'4px 4px 0 0'}
        direction={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <IconButton>
          <Settings />
        </IconButton>
        <Typography variant='h6' onClick={onClick}>{service.name}</Typography>
        <IconButton onClick={() => removeService(service)}>
          <Delete />
        </IconButton>
      </Stack>
      <CardContent onClick={onClick}>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Typography>IP Address</Typography>
          <Typography>{service.ipv4Addresses?.[0] || service.ipv6Addresses?.[0]}</Typography>
        </Stack>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Typography>Port</Typography>
          <Typography>{service.port}</Typography>
        </Stack>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Typography>Service Type</Typography>
          <Typography>{service.type}</Typography>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default ServiceCard
