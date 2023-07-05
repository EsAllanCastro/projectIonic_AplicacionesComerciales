import { IonButton } from '@ionic/react';
import { useHistory } from 'react-router';


const ButtonEditClient = () => {
    const history = useHistory()
    
        return (
            <IonButton
                color='primary'
                onClick={() => {
                    history.push({ pathname: `/edit_client` })
                }}
                >
                Administrar Datos
            </IonButton>
        );
      };

export default ButtonEditClient
