import { useEffect, useState } from 'react'
import logo from '/logo.svg'
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
          <img src={logo} alt="Vite logo" />
      </div>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {(window as any).Capacitor.isNative ? `native app on ${info.operatingSystem}` : `${info.operatingSystem} on web`}<br/>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  )
}

export default App
