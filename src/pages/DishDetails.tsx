import './DishDetails.css';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from '@ionic/react'
import { add, arrowBack, cart } from 'ionicons/icons'
import { useEffect, useState } from 'react'
import { RouteComponentProps, useHistory } from 'react-router'
import LocalStorage from '../utils/LocalStorage'
import { Dish, DishInOrder } from '../utils/Types'
import UseApi from '../utils/UseApi'

interface DishDetailsPageProps
  extends RouteComponentProps<{
    id: string
  }> {}

const DishDetails: React.FC<DishDetailsPageProps> = ({
  match: {
    params: { id },
  },
}) => {
  const { get } = UseApi()
  const { getItem, setItem } = LocalStorage()
  const history = useHistory()
  const [dish, setDish] = useState<Dish>()
  const [reload, setReload] = useState(true)
  const [clientOrder, setClientOrder] = useState<DishInOrder[]>(
    getItem('clientOrder')
  )

  useEffect(() => {
    if (!reload) return
    get({ path: `/api/dishes`, id: id }).then((response: any) => {
      if (response.response?.data?.status === 'unauthorized') {
        history.replace(`/login`)
        return
      }
      setDish(response.dish as Dish)
    })
    setReload(false)
  }, [get, reload, id, history])

  const [presentAlert] = useIonAlert()
  const [amountInvalidAlert] = useIonAlert()

  if (!dish) return <h1> Cargando...</h1>

  const addDish = (amount: number, dish: Dish) => {
    console.log(
      '🚀 ~ file: DishDetails.tsx ~ line 60 ~ addDish ~ clientOrder',
      clientOrder
    )
    let dishInOrderIndex = clientOrder.findIndex(
      (dishInOrder: DishInOrder) => dishInOrder.id === dish.id
    )
    if (dishInOrderIndex >= 0) {
      clientOrder[dishInOrderIndex].amount =
        Number(clientOrder[dishInOrderIndex].amount) + Number(amount)
      setItem('clientOrder', clientOrder)
      setClientOrder(clientOrder)
    } else {
      let newDishInOrder: DishInOrder = {
        amount: amount,
        ...dish,
      }
      clientOrder.push(newDishInOrder)
      setItem('clientOrder', clientOrder)
      setClientOrder(clientOrder)
      console.log(getItem('clientOrder'))
    }
  }

  const onAddDish = () => {
    presentAlert({
      header: `¿Cuántos platos desea agregar?`,
      buttons: [
        {
          text: 'Confirmar',
          handler: ({ amount }: { amount: number }) => {
            if (amount <= 0 || amount > 100) {
              amountInvalidAlert({
                header: `Error`,
                subHeader: `Cantidad inválida`,
                buttons: ['Ok'],
              })
            } else {
              addDish(amount, dish)
              history.goBack()
            }
          },
        },
      ],
      inputs: [
        {
          name: 'amount',
          id: 'alert-input',
          type: 'number',
          placeholder: 'Cantidad',
        },
      ],
    }).then(() => {
      document.getElementById('alert-input')?.focus()
    })
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonButton
              fill='clear'
              onClick={() => {
                history.goBack()
              }}
            >
              <IonIcon icon={arrowBack} slot='icon-only'/>
            </IonButton>
          </IonButtons>
          <IonButtons slot='end'>
            <IonButton
              fill='clear'
              onClick={() => {
                history.push(`/order_review`)
              }}
            >
              <IonIcon icon={cart} slot='icon-only'/>
            </IonButton>
          </IonButtons>
          <IonTitle>{dish.name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard className='Ion__Card__Details'>
        <IonRow className='Ion__Row'>
          <IonImg className="Ion__Img" src={dish.photography} alt=''/>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonText className='Ion__Text__Details'>
                  <h2>
                    <strong>Descripción:</strong>
                  </h2>
                </IonText>
              </IonRow>
              <IonRow>
                <IonCol size='auto' offset='1'>
                  <IonText className='Ion__Text__Details'>
                    <h2>{` ${dish.description}`}</h2>
                  </IonText>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonText className='Ion__Text__Details'>
                  <h2>
                    <strong>Precio: </strong>
                  </h2>
                </IonText>
              </IonRow>
              <IonRow>
                <IonCol size='auto' offset='1'>
                  <IonText className='Ion__Text__Details'>
                    <h2>₡{dish.price}</h2>
                  </IonText>
                </IonCol>
              </IonRow>
              <IonRow className='ion-justify-content-end ion-margin'>
                <IonButton
                  className='Button-Rounded'
                  color='success'
                  onClick={onAddDish}
                >
                  <IonIcon icon={add} />
                </IonButton>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonRow>
        </IonCard>
      </IonContent>
    </IonPage>
  )
}

export default DishDetails
