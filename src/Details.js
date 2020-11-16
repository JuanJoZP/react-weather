require("dotenv").config()
import React from "react"
import { Link } from "@reach/router"

class Details extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      date: "",
      today: "",
      loading: true,
      error: false,
      data_by_hours: [],
      data_daily: {},
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
    weekdays[0] = "Lunes"
    weekdays[1] = "Martes"
    weekdays[2] = "Miercoles"
    weekdays[3] = "Jueves"
    weekdays[4] = "Viernes"
    weekdays[5] = "Sabado"
    weekdays[6] = "Domingo"

    return weekdays[day]
  }

  militaryTimeToHour(militaryTime) {
    let morning
    if (militaryTime <= 12) {
      morning = true
    } else {
      morning = false
    }

    let hour = militaryTime
    if (morning == false) {
      hour -= 12
    }

    return `${hour}${morning ? "AM" : "PM"}`
  }

  componentDidMount() {
    const difference = Math.ceil(
      (new Date(this.props.date).getTime() -
        (new Date().getTime() - 1000 * 60 * 60 * 5)) /
        (1000 * 60 * 60 * 24)
    )

    const today = new Date().getDay()
    const date = new Date(this.props.date).getDay()

    this.setState({
      today: today,
      date: date,
    })

    //validate API availability for the specified date
    if (difference < 0) {
      this.setState({
        error: true, //past date
      })
    } else if (difference > 7) {
      this.setState({
        error: true, //future date
      })
    } else if (difference < 2) {
      //hourly forecast API call
      if (difference == 0) {
        const exclude = ["current", "minutely", "daily", "alerts"]
        const url = this.setEndpoint(exclude)
        fetch(url)
          .then(res => res.json())
          .then(result => {
            let hours = []
            let requested_date = this.props.date.split("-")

            for (let i = 0; i < result.hourly.length; i++) {
              const date = new Date(result.hourly[i].dt * 1000).getTime()

              if (
                date >
                new Date(
                  +requested_date[0],
                  +requested_date[1] - 1,
                  +requested_date[2],
                  23
                ).getTime()
              ) {
                break
              }

              hours.push(result.hourly[i])
            }
            this.setState({
              data_by_hours: hours,
            })
          })
      } else {
        const exclude = ["current", "minutely", "daily", "alerts"]
        const url = this.setEndpoint(exclude)
        fetch(url)
          .then(res => res.json())
          .then(result => {
            let hours = []
            let requested_date = this.props.date.split("-")

            for (let i = 0; i < result.hourly.length; i++) {
              const date = new Date(result.hourly[i].dt * 1000).getTime()

              if (
                date >
                new Date(
                  +requested_date[0],
                  +requested_date[1] - 1,
                  +requested_date[2],
                  23
                ).getTime()
              ) {
                break
              }

              hours.push(result.hourly[i])
            }

            hours = hours.filter(
              data =>
                new Date(data.dt * 1000) >
                new Date(this.props.date).getTime() + 1000 * 60 * 60 * 4
            )

            this.setState({
              data_by_hours: hours,
            })
          })
      }
    } else {
      //daily forecast API call
      const exclude = ["current", "minutely", "hourly", "alerts"]
      const url = this.setEndpoint(exclude)

      fetch(url)
        .then(res => res.json())
        .then(res => {
          this.setState({
            data_daily: res.daily[difference],
          })
        })
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div>
          <h1>Error</h1>
          <p>
            <strong>No tenemos pronosticos disponibles para la fecha solicitada</strong>
          </p>
        </div>
      )
    } else if (Object.keys(this.state.data_daily).length !== 0) {
      return (
        <div className="daily-details">
          <h1 className="day">
            {this.dayNumberToName(new Date(this.props.date).getDay())} {this.props.date}
          </h1>
          <Link to="/">
            <i className="fas fa-home home-icon"></i>
          </Link>
          <hr />
          <h2>Clima</h2>
          <img
            src={`http://openweathermap.org/img/wn/${this.state.data_daily.weather[0].icon}@2x.png`}
            alt="icono del clima"
          />
          <br />
          <br />
          <strong>Amanecer: </strong>
          {this.militaryTimeToHour(
            new Date(this.state.data_daily.sunrise * 1000).getHours()
          )}
          <br />
          <strong>Anochecer: </strong>
          {this.militaryTimeToHour(
            new Date(this.state.data_daily.sunset * 1000).getHours()
          )}
          <br />
          <strong>Temperatura Minima: </strong>{" "}
          {Math.round(this.state.data_daily.temp.min)}°<br />
          <strong>Temperatura Maxima: </strong>{" "}
          {Math.round(this.state.data_daily.temp.max)}°
          <br />
          <strong>Presión:</strong> {this.state.data_daily.pressure} <br />
          <strong>Humedad: </strong>
          {this.state.data_daily.humidity}%
        </div>
      )
    } else {
      return (
        <div>
          <h1 className="day">
            {this.dayNumberToName(this.state.date)} {this.props.date}
          </h1>
          <Link to="/">
            <i className="fas fa-home home-icon"></i>
          </Link>

          <hr />
          <br />
          {this.state.data_by_hours.map(data => {
            return (
              <div className="data-hours-container" key={data.dt}>
                <h3>{this.militaryTimeToHour(new Date(data.dt * 1000).getHours())}</h3>
                <img
                  src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                  alt="icono del clima"
                  height="80"
                  width="80"
                />
                <h3>{Math.round(data.temp)}°</h3>
              </div>
            )
          })}
        </div>
      )
    }
  }
}

export default Details
