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
  IonToast,
  IonToolbar,
  IonText,
  useIonViewDidEnter,
} from '@ionic/react'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { yupResolver } from '@hookform/resolvers/yup'
import { arrowBack } from 'ionicons/icons'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import Input, { InputProps } from '../components/Input'
import LocalStorage from '../utils/LocalStorage'
import { Client } from '../utils/Types'
import UseApi from '../utils/UseApi'
import './ModifyClientData.css'

const ModifyClientData: React.FC = () => {
  const history = useHistory()

  type Dictionary = { [index: string]: string }

  const { get } = UseApi()

  const [reload, setReload] = useState(true)

  useEffect(() => {
    if (!reload) return
    get({ path: '/api/dishes/' }).then((response: any) => {
      if (response.response?.data?.status === 'unauthorized') {
        history.replace(`/login`)
        return
      }
    })
    setReload(false)
  }, [get, reload, history])

  const { getItem, setItem } = LocalStorage()
  const { put } = UseApi()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const [client, setClient] = useState<Client>(getItem('client'))

  const validationSchemaPassword = yup.object().shape({
    newPassword: yup
      .string()
      .required('Requerido')
      .min(4, 'Debe tener más de 4 caracteres')
      .max(40, 'Debe tener menos de 40 caracteres'),
    currentPassword: yup.string().required('Requerido'),
  })

  const {
    register: passwordFormRegister,
    handleSubmit: passwordFormHandleSubmit,
    formState: { errors: passwordFormErrors },
    setValue: passwordFormSetValue,
  } = useForm({
    resolver: yupResolver(validationSchemaPassword),
  })

  const formPasswordFields: InputProps[] = [
    {
      name: 'currentPassword',
      type: 'password',
      label: 'Contraseña actual',
      clearOnEdit: false,
    },
    {
      name: 'newPassword',
      type: 'password',
      label: 'Nueva Contraseña',
      clearOnEdit: false,
    },
  ]

  const onClientModifyPassword = (data: any) => {
    put({
      path: 'api/client/password',
      id: client.id,
      body: {
        current_password: data.currentPassword,
        new_password: data.newPassword,
      },
    }).then((result: any) => {
      if (result.status === 'accepted') {
        passwordFormSetValue('newPassword', '', { shouldValidate: false })
        passwordFormSetValue('currentPassword', '', { shouldValidate: false })
        setToastMessage('Se actualizó la contraseña correctamente')
        setShowToast(true)
      } else {
        setToastMessage('Contraseña actual incorrecta')
        setShowToast(true)
      }
    })
  }

  const validationSchemaClientData = yup.object().shape({
    firstname: yup
      .string()
      .required('Requerido')
      .min(2, 'Debe tener al menos 2 caracteres')
      .max(40, 'Debe tener máximo 40 caracteres')
      .default('d'),
    lastname: yup
      .string()
      .required('Requerido')
      .min(2, 'Debe tener al menos 2 caracteres')
      .max(40, 'Debe tener máximo 40 caracteres'),
    direction: yup
      .string()
      .required('Requerido')
      .min(10, 'Debe tener al menos 10 caracteres')
      .max(200, 'Debe tener máximo 200 caracteres'),
    currentPassword: yup.string().required('Requerido'),
  })
  const {
    register: clientDataFormRegister,
    handleSubmit: clientDataFormHandleSubmit,
    formState: { errors: clientDataFormerrors },
    setValue: clientDataFormSetValue,
    reset: clientDataFormReset,
  } = useForm({
    resolver: yupResolver(validationSchemaClientData),
  })

  useIonViewDidEnter(() => {
    clientDataFormReset({
      firstname: client.firstname,
      lastname: client.lastname,
      direction: client.direction,
      currentPassword: '',
    })
  })
  const formDataClientFields: InputProps[] = [
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
      name: 'currentPassword',
      type: 'password',
      label: 'Contraseña',
      clearOnEdit: false,
    },
  ]
  const onClientModifyData = (data: any) => {
    put({
      path: 'api/client',
      id: client.id,
      body: {
        current_password: data.currentPassword,
        firstname: data.firstname,
        lastname: data.lastname,
        direction: data.direction,
      },
    }).then((result: any) => {
      if (result.client) {
        setItem('client', result.client as Client)
        setClient(result.client as Client)
        clientDataFormSetValue('currentPassword', '', { shouldValidate: false })
        setToastMessage('Se actualizaron los datos correctamente')
        setShowToast(true)
      } else if (result.response?.status === 401) {
        setToastMessage('Contraseña incorrecta')
        setShowToast(true)
      }
      const client = getItem('client') as Dictionary
      clientDataFormReset({
        firstname: client.firstname,
        lastname: client.lastname,
        direction: client.direction,
        currentPassword: '',
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
          <IonTitle>Editar Cuenta</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonCardContent>
            <form onSubmit={clientDataFormHandleSubmit(onClientModifyData)}>
              {formDataClientFields.map((field, index) => (
                <Input
                  {...field}
                  register={clientDataFormRegister(field.name, {
                    value: field.defaultValue,
                  })}
                  key={`clientDataFormInput${index}`}
                  errors={clientDataFormerrors}
                />
              ))}
              <IonButton
                type='submit'
                color='success'
              >
                <IonText className='Ion__Text__Modify'>
                  Actualizar Información
                </IonText>
              </IonButton>
            </form>
          </IonCardContent>
        </IonCard>
        <IonCard>
          <IonCardContent>
            <form onSubmit={passwordFormHandleSubmit(onClientModifyPassword)}>
              {formPasswordFields.map((field, index) => (
                <Input
                  {...field}
                  register={passwordFormRegister(field.name)}
                  key={`form-password-input${index}`}
                  errors={passwordFormErrors}
                />
              ))}
              <IonButton
                type='submit'
                color='success'
              >
                <IonText className='Ion__Text__Modify'>
                  Actualizar Contraseña
                </IonText>
                
              </IonButton>
            </form>
          </IonCardContent>
        </IonCard>
        <IonToast
          onDidDismiss={() => {
            setShowToast(false)
            setToastMessage('')
          }}
          isOpen={showToast}
          duration={4000}
          message={toastMessage}
        />
      </IonContent>
    </IonPage>
  )
}

export default ModifyClientData
