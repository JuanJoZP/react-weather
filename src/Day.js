import React from "react"
import { Link } from "@reach/router"

import images from "../assets/*.png"

class Day extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      day: "",
      date: "",
      weather: "",
      temperatures: "",
    }
  }

  componentDidMount() {
    this.setState({
      day: this.props.day,
      date: this.props.date,
      img: `http://openweathermap.org/img/wn/${this.props.weather}@2x.png`,
      temperatures: this.props.temperatures.split("-"),
    })
  }

  render() {
    return (
      <Link className="day-container" to={this.state.date}>
        <h2>{this.state.day}</h2>
        <img src={this.state.img} className="weather-img"></img>
        <div className="temperatures">
          <strong>
            {this.state.temperatures[0]}° - {this.state.temperatures[1]}°
          </strong>
        </div>
      </Link>
    )
  }
}

export default Day
