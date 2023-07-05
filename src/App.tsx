import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { Redirect, Route } from 'react-router-dom'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/display.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/padding.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'

/* Theme variables */
// import { useEffect, useState } from 'react'
import DishDetails from './pages/DishDetails'
import MainMenu from './pages/MainMenu'
import OrderReview from './pages/OrderReview'
import './theme/variables.css'
// import UseApi from './utils/UseApi'
import ClientLogin from './pages/ClientLogin'
import ClientRegister from './pages/ClientRegister'
import ModifyClientData from './pages/ModifyClientData'
// import ModifyClientData from './pages/ModifyClientData'
// import { Dish } from './utils/Types'

setupIonicReact()

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path='/' exact={true}>
            <Redirect to='/login' />
          </Route>
          <Route path='/main' exact={true}>
            <MainMenu />
          </Route>
          <Route
            path='/dish_details/:id'
            exact={true}
            component={DishDetails}
          />
          <Route path='/order_review' component={OrderReview} exact={true} />
          <Route path='/login' exact={true} component={ClientLogin} />
          <Route path='/register' exact={true} component={ClientRegister} />
          <Route
            path='/edit_client'
            exact={true}
            component={ModifyClientData}
          />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  )
}

export default App
