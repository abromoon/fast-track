import { useEffect, useState } from "react"
import calculateDeposit from "../helpers/calculateDeposit"
import SelectorComponent from "./SelectorComponent"
import { toast } from "react-toastify"
import { includes, keys } from "lodash"
import axios from "axios"

export default function DepositCalculatorComponent({ currencies }) {
  const [firstCurrency, setFirstCurrency] = useState(null)
  const [secondCurrency, setSecondCurrency] = useState(null)
  const [firstPercent, setFirstPercent] = useState(null)
  const [secondPercent, setSecondPercent] = useState(null)
  const [availableExchanges, setAvailableExchanges] = useState(null)
  const [result, setResult] = useState(undefined)


  useEffect(() => {
    axios.get('https://economia.awesomeapi.com.br/json/available')
    .then(response => {
      console.log(response.data)
      console.log(keys(response.data))
      setAvailableExchanges(keys(response.data))
    })
  }, [])

  const handleFirstPercentChange = (event) => {
    console.log(event.target.value)
    setFirstPercent(event.target.value)
  }

  const handleSecondPercentChange = (event) => {
    console.log(event.target.value)
    setSecondPercent(event.target.value)
  }

  const calculate = () => {
    
    if (!firstCurrency || !secondCurrency) {
      toast.error("Выберите валюту", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
        theme: "dark"
      })
      return
    }

    if (!firstPercent || !secondPercent) {
      toast.error("Выберите процент", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
        theme: "dark"
      })
      return
    }
    
    if (firstCurrency === secondCurrency) {
      toast.error(`Выбраны одинаковые валюты ${firstCurrency}-${secondCurrency}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
        theme: "dark"
      })
      return
    }

    if (!includes(availableExchanges, `${firstCurrency}-${secondCurrency}`)) {
      toast.error(`В API отсутствуют данные для курса ${firstCurrency}-${secondCurrency}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
        theme: "dark"
      })
      return
    }

    axios.get(`https://economia.awesomeapi.com.br/json/last/${firstCurrency}-${secondCurrency}`)
      .then(response => {
        const data = response.data
        console.log(data)
        setResult(calculateDeposit(firstCurrency, firstPercent, data[`${firstCurrency}${secondCurrency}`].bid, secondCurrency, secondPercent))
      })
      .catch((error) => {
        console.error("Error:", error.message);
        toast.error(error.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000,
          theme: "dark"
        })
      }
    )
  }

  return (
    <>
      <h2 className="mb-2">Калькулятор вкладов</h2>
      <div className="mb-4 is-flex is-flex-direction-row is-justify-content-center is-align-items-center">
        <div className="mr-3 is-flex is-flex-direction-column">
          <SelectorComponent options={currencies} onSelect={(selectedCurrency) => setFirstCurrency(selectedCurrency)} placeholder="Выберите валюту" />
          <SelectorComponent options={currencies} onSelect={(selectedCurrency) => setSecondCurrency(selectedCurrency)} placeholder="Выберите валюту" />
        </div>
        <div className="mr-3 is-flex is-flex-direction-column">
          <input className="input mx-2" type="number" min={0} max={100} placeholder="Процент" onChange={handleFirstPercentChange}></input>
          <input className="input mx-2" type="number" min={0} max={100} placeholder="Процент" onChange={handleSecondPercentChange}></input>
        </div>
        <div>
          <button className="is-dark ml-3" onClick={calculate}>Рассчитать</button>
        </div>
      </div>
      <p>{result && `Выгоднее вкладывать в ${result}.`}</p>
    </>
  )
}