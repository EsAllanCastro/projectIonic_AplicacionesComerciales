import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonSplitPane,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { cart } from 'ionicons/icons'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import DishesList from '../components/DishesList'
import Menu from '../components/Menu'
import Searchbar from '../components/Searchbar'
import { Dish } from '../utils/Types'
import UseApi from '../utils/UseApi'
import './MainMenu.css'

const MainMenu: React.FC = () => {
  const history = useHistory()
  const [dishes, setDishes] = useState<Dish[]>([])
  const { get } = UseApi()

  const [reload, setReload] = useState(true)
  const [searchParams, setSearchParams] = useState()

  useEffect(() => {
    if (!reload) return
    get({ path: '/api/dishes/', params: searchParams }).then(
      (response: any) => {
        if (response.response?.data?.status === 'unauthorized') {
          history.replace(`/login`)
          return
        }
        setDishes(response)
      }
    )
    setReload(false)
  }, [get, reload, searchParams, history])

  const refetch = (searchParams: any) => {
    setSearchParams(searchParams)
    setReload(true)
  }

  if (!dishes) return <h1>Cargando</h1>
  return (
    <IonSplitPane contentId='main'>
      <Menu />
      <IonPage id='main'>
        <IonHeader>
          <IonToolbar>
            <IonTitle className='Ion__Title__Menu'>¡Molcajete MX!</IonTitle>
            <IonButtons slot='end'>
              <IonButton
                fill='clear'
                onClick={() => {
                  history.push(`/order_review`)
                }}
              >
              <IonIcon icon={cart}/>
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <Searchbar refetch={refetch} />
          <DishesList dishes={dishes} />
        </IonContent>
      </IonPage>
    </IonSplitPane>
  )
}

export default MainMenu
