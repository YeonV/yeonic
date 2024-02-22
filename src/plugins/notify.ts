import Notify from 'react-desktop-notify'
import { LocalNotifications } from '@capacitor/local-notifications'
import { Toast } from '@capacitor/toast'

export const notifyDesktop = async (title: string, text: string, icon: string) => {
  const notifyObject = new Notify()
  const permissionGranted = await notifyObject.requestPermission()
  if (permissionGranted) {
    notifyObject.setTitle(title).setText(text).setIcon(icon).show()
  }
}

export const notifyMobile = ({ title, body }: { title: string; body: string }) => {
  const send = async () => {
    LocalNotifications.schedule({
      notifications: [
        {
          id: 1,
          title,
          body
        }
      ]
    })
  }
  LocalNotifications.checkPermissions().then((res) => {
    if (res.display !== 'granted') LocalNotifications.requestPermissions().then(() => send())
    else send()
  })
}

export const toast = async (text: string) => {
  await Toast.show({
    text: text
  })
}
