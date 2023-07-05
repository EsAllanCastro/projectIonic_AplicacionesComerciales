import './DishesList.css';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonText,
} from '@ionic/react'
import { useHistory } from 'react-router'

type Props = {
  dishes: any
}

const DishesList = ({ dishes }: Props) => {
  const history = useHistory()
  if (!dishes) return <h1> Cargando...</h1>
  return (
    <IonGrid>
      {dishes?.map((dish: any) => {
        return (
          <IonRow
            class='ion-justify-content-center'
            key={`${dish?.id}${dish?.name}`}
          >
            <IonCard
              className='Ion__Card__Menu'
              style={{ minWidth: '95%' }}
              onClick={() => {
                history.push(`dish_details/${dish?.id}`)
              }}
              type='button'
            >
              <IonCardHeader>
                <IonCardTitle className='Ion__Card__Title__Menu'>{dish?.name}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonText className='Ion__Text__Menu'>Precio: ₡{dish?.price}</IonText>
              </IonCardContent>
            </IonCard>
          </IonRow>
        )
      })}
    </IonGrid>
  )
}

export default DishesList
