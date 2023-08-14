"use client"

import React, { PureComponent } from "react"
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const backgroundColor = "var(--background)"
const textColor = "var(--foreground)"
type VenueChartState = {
  venues: Array<{
    artist: string
    stadium: string
    date: {
      day: string
      time: string
    }
    updated: any[] // Use a more specific type if possible
    minPrice: number[]
    ticketCount: number[]
  }>
}

export default class VenueChart extends PureComponent<{}, VenueChartState> {
  constructor(props: any) {
    super(props)
    this.state = {
      venues: [],
    }
  }

  componentDidMount() {
    fetch("/api/venue")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ venues: data.venues })
      })
      .catch((error) => {
        console.error("Error fetching the data", error)
      })
  }

  formatDate(timestamp: any) {
    const date = new Date(timestamp)
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const formattedTime = `${hours < 10 ? "0" + hours : hours}:${
      minutes < 10 ? "0" + minutes : minutes
    }`
    return `${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()} ${formattedTime}`
  }

  render() {
    return (
      <div>
        {this.state.venues.map((venue: any, idx: any): any => {
          const chartData = venue.updated.map((timestamp: any, index: any) => ({
            date: this.formatDate(timestamp),
            minPrice: venue.minPrice[index],
            ticketCount: venue.ticketCount[index],
          }))

          return (
            <div key={idx} className="mb-8">
              <h2>
                {venue.artist} at {venue.stadium} on {venue.date.day},{" "}
                {venue.date.time}
              </h2>
              <div className="h-[300px]">
                <ResponsiveContainer>
                  <LineChart
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        color: textColor,
                        backgroundColor: backgroundColor,
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="minPrice"
                      stroke="rgb(59 130 246 / 0.5)"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="ticketCount"
                      stroke="rgb(59 130 246 / 0.5)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}
