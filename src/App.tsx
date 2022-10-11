import React, { useRef, useState } from 'react'
import {
  IonApp,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonRow,
  IonTitle,
  IonToolbar,
  setupIonicReact,
  IonAlert,
} from '@ionic/react'

import BmiControls from './components/BmiControls'
import BmiResult from './components/BmiResult'
import InputControl from './components/InputControl'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'

/* Theme variables */
import './theme/variables.css'

setupIonicReact()

const App: React.FC = () => {
  const [calculatedBMI, setCalcBMI] = useState<number>()
  const [error, serError] = useState<string>()
  const [calcUnits, serCalcUnits] = useState<'mkg' | 'ftlbs'>('mkg')

  const weightInputRef = useRef<HTMLIonInputElement>(null)
  const heightInputRef = useRef<HTMLIonInputElement>(null)

  const calculateBMI = () => {
    const enteredWeight = weightInputRef.current!.value
    const enteredHeight = heightInputRef.current!.value

    if (
      !enteredHeight ||
      !enteredWeight ||
      +enteredHeight <= 0 ||
      +enteredWeight <= 0
    ) {
      serError('Please enter a valid non negative input value')
      return
    }

    const weightConversionFactor = calcUnits === 'ftlbs' ? 2.2 : 1
    const heightConversionFactor = calcUnits === 'ftlbs' ? 3.28 : 1

    const Weight = +enteredWeight / weightConversionFactor
    const height = +enteredHeight / heightConversionFactor

    const bmi = Weight / (height * height)

    setCalcBMI(bmi)
  }

  const resetInputs = () => {
    weightInputRef.current!.value = ''
    heightInputRef.current!.value = ''
  }

  const clearError = () => {
    serError('')
  }

  const selectCalcUnitHandler = (selectedValue: 'mkg' | 'ftlbs') => {
    serCalcUnits(selectedValue)
  }

  return (
    <>
      <IonAlert
        isOpen={!!error}
        message={error}
        buttons={[
          {
            text: 'okay',
            handler: clearError,
          },
        ]}
      />
      <IonApp>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>BMI Calculator</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonGrid>
            <IonRow>
              <IonCol>
                <InputControl
                  selectedValue={calcUnits}
                  onSelectValue={selectCalcUnitHandler}
                />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItem>
                  <IonLabel position="floating">
                    Your Height ({calcUnits === 'mkg' ? 'meters' : 'feet'})
                  </IonLabel>
                  <IonInput type="number" ref={heightInputRef}></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItem>
                  <IonLabel position="floating">
                    Your Weight ({calcUnits === 'mkg' ? 'kg' : 'lbs'})
                  </IonLabel>
                  <IonInput type="number" ref={weightInputRef}></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
            <BmiControls onCalc={calculateBMI} onReset={resetInputs} />
            {calculatedBMI && <BmiResult result={calculatedBMI} />}
          </IonGrid>
        </IonContent>
      </IonApp>
    </>
  )
}

export default App
