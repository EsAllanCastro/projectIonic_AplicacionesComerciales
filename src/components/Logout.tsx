import UseApi from '../utils/UseApi'
import { useHistory } from 'react-router'
import { IonButton, IonIcon } from '@ionic/react'
import { power } from 'ionicons/icons'
import LocalStorage from '../utils/LocalStorage'
import '../pages/MainMenu.css'

const Logout = () => {
  const { remove } = UseApi()
  const history = useHistory()
  const { clear } = LocalStorage()

  const handleLogOut = async (e: any) => {
    e.preventDefault()
    try {
      remove({
        path: 'api/client/logout',
      }).then(() => {
        clear()
        history.replace('/login')
      })
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <IonButton className='Button-Cart' color='light' onClick={handleLogOut}>
      <IonIcon icon={power} slot='icon-only' color='dark' />
    </IonButton>
  )
}

export default Logout
