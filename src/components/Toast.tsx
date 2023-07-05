import { IonToast } from '@ionic/react';
const Toast = ({ showToast, message} :any) => {
        return (
            <IonToast
                isOpen={showToast}
                duration={4000}
                header="Ops!"
                message={message}
            />
        );
      };

export default Toast
