import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
} from '@ionic/react'
import UseApi from '../utils/UseApi'
import { useHistory } from 'react-router'
import { useLocation } from 'react-router-dom'
import { cart, power, list, person} from 'ionicons/icons'
import LocalStorage from '../utils/LocalStorage'
import './Menu.css'

interface AppPage {
  iosIcon: string
  mdIcon: string
  title: string
  onClick?: any
  url?: string
}

const Menu: React.FC = () => {
  const location = useLocation()
  const history = useHistory()
  const { remove } = UseApi()
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

  const appPages: AppPage[] = [
    {
      title: 'Menú de platillos',
      url: '/main',
      iosIcon: list,
      mdIcon: list,
    },
    {
      title: 'Carrito',
      url: '/order_review',
      iosIcon: cart,
      mdIcon: cart,
    },
    {
      title: 'Editar Cuenta',
      url: '/edit_client',
      iosIcon: person,
      mdIcon: person,
    },
    {
      title: 'Cerrar Sesión',
      url: '/login',
      iosIcon: power,
      mdIcon: power,
      onClick: handleLogOut,
    },
  ]

  return (
    <IonMenu side='start' contentId='main' type='overlay' swipeGesture={true}>
      <IonContent>
        <IonList id='inbox-list'>
          {appPages.map(({ url, title, iosIcon, mdIcon, onClick }, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem
                  className={location.pathname === url ? 'selected' : ''}
                  routerLink={url}
                  routerDirection='forward'
                  lines='none'
                  detail={false}
                  onClick={onClick}
                >
                  <IonIcon slot='start' ios={iosIcon} md={mdIcon} />
                  <IonLabel>{title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            )
          })}
        </IonList>
      </IonContent>
    </IonMenu>
  )
}

export default Menu
