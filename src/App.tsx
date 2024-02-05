import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Device } from '@capacitor/device';

const logDeviceInfo = async () => await Device.getInfo()

function App() {
  const [count, setCount] = useState(0)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [info, setInfo] = useState<Record<string, any>>({})

  useEffect(() => {
    logDeviceInfo().then((i) => {
      console.log('Device info:', i);
      setInfo(i);
    })
  }, []);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" onClick={()=> logDeviceInfo()} />
        </a>
      </div>
      <h1>Yeonic2</h1>
      os:{info.operatingSystem}<br/>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {(window as any).Capacitor.isNative ? 'Native' : 'Web'}<br/>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
