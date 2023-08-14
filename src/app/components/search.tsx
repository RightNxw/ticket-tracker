import * as React from "react"
import { Button } from "@/src/app/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/src/app/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/app/components/ui/popover"
import { cn } from "@/src/app/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"

interface Venue {
  id: number
  artist: string
  stadium: string
  vividSeats: string
  date: {
    day: string
    time: string
  }
  ticketCount: number[]
  minPrice: number[]
  updated: number[]
}

interface FormattedVenue {
  value: number
  label: string
}

function formatVenueData(venues: Venue[]): FormattedVenue[] {
  return venues.map((venue: Venue) => {
    const label = `${venue.artist} at ${venue.stadium} on ${venue.date.day} at ${venue.date.time}`
    return {
      value: venue.id,
      label: label,
    }
  })
}

export function SearchBox() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState<number | string>("")
  const [events, setEvents] = React.useState<FormattedVenue[]>([])

  async function fetchEvents() {
    const response = await fetch("/api/venue")
    const data = await response.json()
    const formattedData = formatVenueData(data.venues)
    setEvents(formattedData)
  }

  const selectedEvent = events.find((event) => event.value === value)
  const selectedDate = selectedEvent
    ? selectedEvent.label.split(" on ")[1].split(" at ")[0]
    : ""

  React.useEffect(() => {
    fetchEvents()
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
          title={selectedEvent?.label || "Select Event..."}
        >
          {value ? selectedDate : "Select Event..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search event..." />
          <CommandEmpty>No event found.</CommandEmpty>
          <CommandGroup>
            {events.map((event) => (
              <CommandItem
                key={event.value.toString()}
                onSelect={() => {
                  setValue(event.value)
                  const queryParams = new URLSearchParams({
                    selectedEvent: JSON.stringify(event.value),
                  })
                  window.history.replaceState({}, "", `?${queryParams}`)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === event.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {event.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
