import './ClientRegister.css';
import { yupResolver } from '@hookform/resolvers/yup'
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from '@ionic/react'
import { arrowBack } from 'ionicons/icons'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router'
import * as yup from 'yup'
import Input, { InputProps } from '../components/Input'
import UseApi from '../utils/UseApi'

const ClientRegister: React.FC = () => {
  const history = useHistory()
  const { post } = UseApi()
  const [presentAlert] = useIonAlert()

  const validationSchemaClientRegistry = yup.object().shape({
    email: yup
      .string()
      .required('Es requerido')
      .email('Debe ser un email válido.(ejemplo@domain.com)'),
    firstname: yup
      .string()
      .required('Es requerido')
      .min(2, 'Debe tener al menos 2 caracteres')
      .max(40, 'Debe tener máximo 40 caracteres'),
    lastname: yup
      .string()
      .required('Es requerido')
      .min(2, 'Debe tener al menos 2 caracteres')
      .max(40, 'Debe tener máximo 40 caracteres'),
    direction: yup
      .string()
      .required('Es requerido')
      .min(10, 'Debe tener al menos 10 caracteres')
      .max(200, 'Debe tener máximo 200 caracteres'),
    password: yup
      .string()
      .required('Es requerido')
      .min(4, 'Debe tener al menos 4 caracteres')
      .max(40, 'Debe tener máximo 40 caracteres'),
    passwordConfirmation: yup
      .string()
      .required('Es requerido')
      .oneOf([yup.ref('password'), null], 'Contraseñas deben ser iguales'),
  })
  const {
    register,
    handleSubmit: clientRegistryFormHandleSubmit,
    formState: { errors: clientRegistryFormErrors },
    setValue: clientRegistryFromSetValue,
    reset: resetForm,
  } = useForm({
    resolver: yupResolver(validationSchemaClientRegistry),
  })

  const formDataClientFields: InputProps[] = [
    {
      name: 'email',
      label: 'Correo electrónico',
    },
    {
      name: 'firstname',
      label: 'Nombre',
    },
    {
      name: 'lastname',
      label: 'Apellido',
    },
    {
      name: 'direction',
      label: 'Dirección',
    },
    {
      name: 'password',
      type: 'password',
      label: 'Contraseña',
    },
    {
      name: 'passwordConfirmation',
      type: 'password',
      label: 'Confirmar Contraseña',
      defaultValue: 'asd',
    },
  ]
  const onRegistry = (data: any) => {
    post({
      path: 'api/client/sign_up',
      body: {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        direction: data.direction,
        password: data.password,
        password_confirmation: data.passwordConfirmation,
      },
    }).then((result: any) => {
      if (result.client) {
        resetForm()
        presentAlert({
          header: 'Felicidades',
          message: 'Registro completo',
          buttons: [
            {
              text: 'Ok',
              handler: () => {
                history.goBack()
              },
            },
          ],
        })
      } else {
        presentAlert({
          header: 'Error',
          message: 'El correo ya está en uso',
          buttons: [
            {
              text: 'Ok',
              handler: () => {
                clientRegistryFromSetValue('email', '')
              },
            },
          ],
        })
      }
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
              <IonIcon icon={arrowBack} slot='icon-only' />
            </IonButton>
          </IonButtons>
          <IonTitle>Registrate</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonCardContent>
            <form onSubmit={clientRegistryFormHandleSubmit(onRegistry)}>
              {formDataClientFields.map((field, index) => (
                <Input
                  {...field}
                  register={register(field.name)}
                  key={`clientRegistryFormInput${index}`}
                  errors={clientRegistryFormErrors}
                />
              ))}
              <IonButton
                type='submit'
                color={'success'}
              >
                <IonTitle className='Ion__Text__Register'>
                  Registrarse
                </IonTitle>
              </IonButton>
            </form>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  )
}

export default ClientRegister
