import './OrderReview.css';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonFab,
  IonGrid,
  IonHeader,
  IonIcon,
  IonList,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from '@ionic/react'
import React, { useState } from 'react'
import { useHistory } from 'react-router'

import { arrowBack, trash } from 'ionicons/icons'
import LocalStorage from '../utils/LocalStorage'
import { DishInOrder } from '../utils/Types'
import UseApi from '../utils/UseApi'

const OrderReview: React.FC = () => {
  const history = useHistory()
  const { setItem, getItem } = LocalStorage()
  const { post } = UseApi()
  const [presentAlert] = useIonAlert()
  const [clientOrder, setClientOrder] = useState<DishInOrder[]>(
    getItem('clientOrder')
  )
  const onDeleteAlertOk = (id: number) => {
    
    console.log(id);
    let clienOrderTemp = clientOrder.filter((dishInOrder: DishInOrder) => dishInOrder.id !== id)
    setClientOrder(clienOrderTemp)
      console.log(clienOrderTemp);
    setItem('clientOrder', clienOrderTemp)
  }
  const onDeleteDish = (id: number) => {
    presentAlert({
      header: `Desea eliminar este plato?`,
      buttons: [
        { text: 'Cancel' },
        {
          text: 'OK',
          role: 'confirm',
          handler: onDeleteAlertOk.bind(this, id),
        },
      ],
    })
  }

  const onConfirmOrder = () => {
    post({
      path: 'api/orders',
      body: {
        client_id: getItem('client').id,
        dishes: clientOrder,
      },
    }).then((result: any) => {
      presentAlert({
        header: `Pedido`,
        message: `
          <p>Su pedido fue encargado con éxito<p>
          <li>Subtotal: ¢${result.order.subtotal}</li><br />
          <li>Total: ¢${result.order.total}</li>`,
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              setItem('clientOrder', [])
              history.goBack()
            },
          },
        ],
      })
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
          <IonTitle>Carrito</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {clientOrder.length === 0 && (
          <IonGrid style={{ height: '100%' }}>
            <IonRow
              class='ion-justify-content-center ion-align-items-center'
              style={{ height: '100%' }}
            >
              <IonText color='medium'>
                <h4>No hay platos en el carrito</h4>
              </IonText>
            </IonRow>
          </IonGrid>
        )}
        {clientOrder.length !== 0 && (
          <IonList>
            {clientOrder?.map(({ id, name, price, amount }) => {
              return (
                <IonCard key={`${id}${name}`} className='Ion__Card'>
                  <IonCardHeader>
                    <IonCardTitle className='Ion__Card__Title'>{name}</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonGrid>
                      <IonRow>
                        <IonText>
                          <IonText className='Ion__Subtitle'>Precio unitario: ₡{price}</IonText>
                        </IonText>
                      </IonRow>
                      <IonRow>
                        <IonText className='Ion__Subtitle'>Cantidad: {amount}</IonText>
                      </IonRow>
                      <IonRow class='ion-justify-content-center'>
                        <IonButton
                          color='danger'
                          onClick={onDeleteDish.bind(this, id)}
                        >
                          <IonIcon icon={trash}></IonIcon>
                        </IonButton>
                      </IonRow>
                    </IonGrid>
                  </IonCardContent>
                </IonCard>
              )
            })}
            <IonFab vertical='bottom' horizontal='end' slot='fixed'>
              <IonButton onClick={onConfirmOrder} color='success'>
                <IonText className='Ion__Title'>Confirmar</IonText>
              </IonButton>
            </IonFab>
          </IonList>
        )}
      </IonContent>
    </IonPage>
  )
}

export default OrderReview
