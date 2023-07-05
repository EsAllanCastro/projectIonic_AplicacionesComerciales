import React, { FC } from 'react'
import { IonItem, IonLabel, IonInput, IonText, IonNote } from '@ionic/react'
import './Input.css'
export interface InputProps {
  name: string
  register?: any
  type?: string
  label?: string
  defaultValue?: any
  errors?: any
  clearOnEdit?:boolean
}

const Input: FC<InputProps> = ({
  type = 'text',
  name,
  label,
  errors,
  register,
  clearOnEdit,
}) => {
  return (
    <IonItem class={`item-transparent-bg-color item-invalid`}>
      {label && <IonLabel position='floating'>{label}</IonLabel>}
      <IonInput type={type} {...register} clearOnEdit={clearOnEdit}/>
      {errors && errors[name] ? (
        <IonNote slot='error'>
          <IonText color='danger'>
            <small>{errors[name].message}</small>
          </IonText>
        </IonNote>
      ) : (
        <IonNote slot='error' class='ion-padding'></IonNote>
      )}
    </IonItem>
  )
}

export default Input
