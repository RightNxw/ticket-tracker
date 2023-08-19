import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/app/components/ui/table"

type Event = {
  _id: string
  performerId: number
  venueId: number
}

export function EventTable() {
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/event")
      const data = await response.json()
      setEvents(data.events)
    }

    const intervalId = setInterval(fetchData, 5000)

    fetchData()

    return () => clearInterval(intervalId)
  }, [])

  return (
    <Table>
      <TableCaption>Currently Monitoring</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>VenueId</TableHead>
          <TableHead>PerformerId</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => (
          <TableRow key={event._id}>
            <TableCell className="font-medium">{event.venueId}</TableCell>
            <TableCell>{event.performerId}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
