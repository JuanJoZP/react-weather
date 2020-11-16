import React from "react"
import ReactDOM from "react-dom"
import Day from "./Day"
import { Router } from "@reach/router"

class Main extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      data: [],
    }
  }

  setEndpoint(exclude) {
    const exclude_string = exclude.join(",")

    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${5.383}&lon=${-75.167}&exclude=${exclude_string}&appid=${
      process.env.API_KEY
    }&units=metric`

    return url
  }

  dayNumberToName(day) {
    var weekdays = new Array(7)
    weekdays[1] = "Lunes"
    weekdays[2] = "Martes"
    weekdays[3] = "Miercoles"
    weekdays[4] = "Jueves"
    weekdays[5] = "Viernes"
    weekdays[6] = "Sabado"
    weekdays[0] = "Domingo"

    return weekdays[day]
  }

  componentDidMount() {
    const exclude = ["current", "minutely", "houly", "alerts"]
    const url = this.setEndpoint(exclude)

    fetch(url)
      .then(res => res.json())
      .then(res => {
        let data = []
        for (let i = 0; i < res.daily.length; i++) {
          const date = [
            //en caso de no funcionar debido a UTC - 5, restar 5 horas en la creacion de el objeto date
            new Date(res.daily[i].dt * 1000).getFullYear(),
            new Date(res.daily[i].dt * 1000).getMonth() + 1,
            new Date(res.daily[i].dt * 1000).getDate(),
          ]

          data.push({
            day: this.dayNumberToName(new Date(res.daily[i].dt * 1000).getDay()),
            date: date.join("-"),
            weather_icon: res.daily[i].weather[0].icon,
            temperatures: `${Math.round(res.daily[i].temp.min)} - ${Math.round(
              res.daily[i].temp.max
            )}`,
          })
        }

        this.setState({
          data: data,
        })
      })
  }

  render() {
    return (
      <div>
        <h1>Clima</h1>
        <hr />
        {this.state.data.map(data => {
          return (
            <Day
              day={data.day}
              date={data.date}
              weather={data.weather_icon}
              temperatures={data.temperatures}
              key={data.date}
            />
          )
        })}
      </div>
    )
  }
}

export default Main
