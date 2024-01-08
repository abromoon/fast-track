import axios from 'axios';
import {map, entries} from 'lodash';
import { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify';
import CurrencyDynamicsComponent from './components/CurrencyDynamicsComponent';
import DepositCalculatorComponent from './components/DepositCalculatorComponent';
import 'react-toastify/dist/ReactToastify.css';
import './styles/App.sass'

export default function App() {
  const [currencies, setСurrencies] = useState(null)

  useEffect(() => {
    axios.get('https://economia.awesomeapi.com.br/json/available/uniq')
    .then(response => {
      console.log(response.data)

      setСurrencies(map(entries(response.data), ([key, value]) => ({ key, value })))
    })

    console.log(currencies)
  }, [])

  return (
    <>
      <h1 className="mb-4">Главная</h1>
      <CurrencyDynamicsComponent currencies={currencies}></CurrencyDynamicsComponent>
      <DepositCalculatorComponent currencies={currencies}></DepositCalculatorComponent>
      <ToastContainer />
    </>
  )
}

