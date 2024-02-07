import { Accordion, AccordionDetails, AccordionSummary,  Stack, Typography } from '@mui/material'
import { ReleaseType } from '../App'
import { Android, ExpandMore } from '@mui/icons-material'
import Linux from './Os/Linux'
import Mac from './Os/Mac'
import Win from './Os/Win'

const Releases = ({ releases }: { releases: ReleaseType[] }) => {
  const osIcon = (name: string) => {
    const extension = name.split('.').pop()
    const lowerCaseName = name.toLowerCase()

    switch (extension) {
      case 'exe':
        return <Win />
      case 'AppImage':
      case 'snap':
        return <Linux />
      case 'dmg':
      case 'app':
        return <Mac />
      case 'apk':
        return <Android />
      default:
        if (lowerCaseName.includes('mac')) {
          return <Mac />
        } else if (lowerCaseName.includes('win')) {
          return <Win />
        } else {
          return null
        }
    }
  }

  return (
      <Accordion elevation={1} sx={{ maxWidth: 550}}>
            <AccordionSummary expandIcon={<ExpandMore />} sx={{ textAlign: 'center'}}>
              All Releases
            </AccordionSummary>
            <AccordionDetails>
        {releases.map((r) => (
          <Accordion key={r.tag_name} elevation={3}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              {r.tag_name} {r.prerelease ? 'pre-release' : ''}
            </AccordionSummary>
            <AccordionDetails>
              {r.assets.map((a) => (
                <Stack
                  direction={'row'}
                  sx={{ cursor: 'pointer' }}
                  alignItems={'center'}
                  key={a.name}
                  spacing={1}
                  onClick={() => window.open(a.browser_download_url)}
                >
                  {osIcon(a.name)}
                  <Typography>{a.name}</Typography>
                </Stack>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}

</AccordionDetails>
          </Accordion>
  )
}

export default Releases
