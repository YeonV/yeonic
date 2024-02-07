import { Button } from '@mui/material'
// import { Android } from '@mui/icons-material'
// import Linux from './Os/Linux'
// import Mac from './Os/Mac'
// import Win from './Os/Win'

const Asset = ({ asset }: {asset: {
  browser_download_url: string;
  name: string;
}}) => {
  const text = asset.name.replace('yeonic-0.0.5', '').replace('android', '').replace('mac', '').replace('win', '').replace('linux', '').replaceAll('-', '')
  return (
      <Button size='small' onClick={() => window.open(asset.browser_download_url)}>
        {text[0] === '.' ? text.slice(1) : text}
      </Button>
    
  )
}

export default Asset
