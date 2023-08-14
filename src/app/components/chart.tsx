"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
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

type Venue = {
  id: number
  artist: string
  stadium: string
  vividUrl: string
  date: {
    day: string
    time: string
  }
  updated: number[]
  minPrice: number[]
  ticketCount: number[]
}

export function VenueChart() {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const searchParams = useSearchParams()
  const selectedEventParam = searchParams.get("selectedEvent")

  useEffect(() => {
    if (selectedEventParam) {
      fetch("/api/venue?id=" + selectedEventParam)
        .then((response) => response.json())
        .then((data) => {
          setSelectedVenue(data)
        })
        .catch((error) => {
          console.error("Error fetching venue data:", error)
        })
    }
  }, [selectedEventParam])

  const formatDate = (timestamp: number) => {
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

  if (!selectedVenue) {
    return <div>Select an event to view its chart.</div>
  }

  const chartData = selectedVenue.updated.map((timestamp, index) => ({
    date: formatDate(timestamp),
    minPrice: selectedVenue.minPrice[index],
    ticketCount: selectedVenue.ticketCount[index],
  }))

  return (
    <div>
      <h2>
        {selectedVenue.artist} at {selectedVenue.stadium} on{" "}
        {selectedVenue.date.day}, {selectedVenue.date.time}
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
}
