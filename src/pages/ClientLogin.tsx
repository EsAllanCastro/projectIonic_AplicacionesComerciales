import { yupResolver } from '@hookform/resolvers/yup'
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRouterLink,
  IonRow,
  IonText,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router'
import * as yup from 'yup'
import Input, { InputProps } from '../components/Input'
import LocalStorage from '../utils/LocalStorage'
import { DishInOrder } from '../utils/Types'
import UseApi from '../utils/UseApi'
import './ClientLogin.css'

const ClientLogin: React.FC = () => {
  const history = useHistory()
  const { post } = UseApi()
  const { setItem } = LocalStorage()
  const [showToast, setShowToast] = useState(false)

  const validationSchemaClientLogin = yup.object().shape({
    email: yup.string().required('Requerido'),
    password: yup.string().required('Requerido'),
  })
  const {
    register,
    handleSubmit: clientLoginFormHandleSubmit,
    formState: { errors: clientLoginFormerrors },
    setValue: clientLoginFromSetValue,
    reset: resetForm,
  } = useForm({
    resolver: yupResolver(validationSchemaClientLogin),
  })

  const formClientLoginFields: InputProps[] = [
    {
      name: 'email',
      label: 'Correo electrónico',
    },
    {
      name: 'password',
      type: 'password',
      label: 'Contraseña',
    },
  ]
  const onClientLogin = (data: any) => {
    post({
      path: 'api/client/sign_in',
      body: {
        email: data.email,
        password: data.password,
      },
    }).then((result: any) => {
      if (result.status === 'accepted') {
        resetForm()
        setItem('client', result.client)
        let dishesInOrder: DishInOrder[] = []
        setItem('clientOrder', dishesInOrder)
        history.replace('/main')
      } else {
        clientLoginFromSetValue('password', '')
        setShowToast(true)
      }
    })
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style = {{justufyContent: 'center'}}>
          <IonTitle>Inicia de Sesión</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonCardContent>
            <IonGrid>
              <form onSubmit={clientLoginFormHandleSubmit(onClientLogin)}>
                {formClientLoginFields.map((field, index) => (
                  <Input
                    {...field}
                    register={register(field.name)}
                    key={`clientLoginFormInput${index}`}
                    errors={clientLoginFormerrors}
                  />
                ))}
                <IonButton
                  type='submit'
                  color={'success'}
                >
                  <IonTitle className='Ion__Text__Login'>
                    Ingresar
                  </IonTitle>
                </IonButton>
              </form>

              <IonRow class='ion-padding ion-justify-content-center'>
                <IonText>
                  ¿No posees una cuenta?{' '}
                  <IonRouterLink href='/register' routerDirection='forward' className='Ion__Router__Login'>
                    Regístrate aquí
                  </IonRouterLink>
                </IonText>
              </IonRow>
            </IonGrid>

            <IonToast
              onDidDismiss={() => {
                setShowToast(false)
              }}
              isOpen={showToast}
              duration={4000}
              message='El correo y/o la contraseña son incorrectos'
            />
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  )
}

export default ClientLogin
