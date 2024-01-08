import { useEffect, useState } from "react";
import LineChartComponent from "./LineChartComponent";
import SelectorComponent from "./SelectorComponent";
import axios from "axios";
import { toast } from "react-toastify";
import { map, sortBy } from "lodash";

export default function CurrencyDynamicsComponent({currencies}) {
  const [currency, setСurrency] = useState(null)
  const [currencyIn, setСurrencyIn] = useState(null)
  const [daysAmount, setDaysAmount] = useState(null)
  const [chartData, setChartData] = useState(null)

  useEffect(() => {
    if (!currency) return

    axios.get('https://economia.awesomeapi.com.br/json/available')
    .then(response => {
      console.log(response.data)

    })
  }, [currency, currencyIn])

  const handleSelectedCurrency = (selectedOption) => {
    console.log(`Currency ${selectedOption}`)
    setСurrency(selectedOption)
  }

  const handleSelectedCurrencyIn = (selectedOption) => {
    console.log(`CurrencyIn ${selectedOption}`)
    setСurrencyIn(selectedOption)
  }

  const handleSelectedDaysAmount = (selectedOption) => {
    console.log(`DaysAmount ${selectedOption}`)
    setDaysAmount(selectedOption)
  }

  const calculate = () => {
    console.log("calculate")

    if (!currency || !currencyIn) {
      toast.error("Выберите валюту", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
        theme: "dark"
      })
      return
    }

    if (!daysAmount) {
      toast.error("Выберите период", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
        theme: "dark"
      })
      return
    }
    
    axios.get(`https://economia.awesomeapi.com.br/json/daily/${currency}-${currencyIn}/${daysAmount}`)
      .then(response => {
        
        const orderedByTimestampData = sortBy(response.data, 'timestamp')

        setChartData({
          labels: map(orderedByTimestampData, (record) => {
            const currentDate = new Date(record.timestamp * 1000)
            const day = currentDate.getUTCDate().toString().padStart(2, '0')
            const month = (currentDate.getUTCMonth() + 1).toString().padStart(2, '0')

            return `${day}.${month}`
          }),
          datasets: [
          {
            label: 'Продажа',
            data: map(orderedByTimestampData, 'ask'),
            borderWidth: 1,
          },
          {
            label: 'Покупка',
            data: map(orderedByTimestampData, 'bid'),
            borderWidth: 1,
          }
        ]})

        console.log(orderedByTimestampData)
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

  const periods = [
    {key: 5, value: "5 дней"},
    {key: 10, value: "10 дней"},
    {key: 15, value: "15 дней"},
    {key: 30, value: "30 дней"},
  ]

  return (
    <>
      <h2 className="mb-2">Динамика валюты</h2>
      <div className="mb-4">
        <SelectorComponent options={currencies} onSelect={handleSelectedCurrency} placeholder="Выберите валюту" />
        <span className="mx-1">в</span>
        <SelectorComponent options={currencies} onSelect={handleSelectedCurrencyIn} placeholder="Выберите валюту" />
        <span className="mx-1">за</span>
        <SelectorComponent options={periods} onSelect={handleSelectedDaysAmount} placeholder="Выберите период" />
        <span className="ml-1 mr-3">дней</span>
        <button className="is-dark" onClick={calculate}>Рассчитать</button>
      </div>
      <LineChartComponent data={chartData} />
    </>
  )
}