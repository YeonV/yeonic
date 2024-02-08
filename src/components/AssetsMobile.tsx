import { Button, Card, CardContent, Stack } from '@mui/material'
import Asset from './Asset'
import Mac from './Os/Mac'
import { Android } from '@mui/icons-material'
import type { ReleaseType } from '../pages/Home'

const AssetsMobile = ({ release }: { release: ReleaseType }) => {
  return (
    <Card>
      <CardContent>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Stack
            direction={'column'}
            flex={1}
            alignItems={'center'}
            sx={{
              borderRight: '1px solid #999'
            }}
          >
            <Mac style={{ width: 80, height: 80, marginBottom: '0rem' }} />
            {release.assets.filter((as) => as.name.includes('.ipa')).length > 0 ? (
              release.assets.filter((as) => as.name.includes('.ipa')).map((a) => <Asset asset={a} />)
            ) : (
              <Button size='small' disabled>
                No IPA yet
              </Button>
            )}
          </Stack>

          <Stack direction={'column'} flex={1} alignItems={'center'}>
            <Android style={{ width: 80, height: 80, marginBottom: '0rem' }} />
            {release.assets
              .filter((as) => as.name.includes('android'))
              .map((a) => (
                <Asset key={a.name} asset={a} />
              ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default AssetsMobile
