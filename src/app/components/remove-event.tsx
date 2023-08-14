import * as React from "react"
import { Button } from "@/src/app/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/app/components/ui/card"
import { Input } from "@/src/app/components/ui/input"
import { Label } from "@/src/app/components/ui/label"
import toast, { Toaster } from "react-hot-toast"

const backgroundColor = "var(--background)"
const textColor = "var(--foreground)"

const toastStyle = {
  borderRadius: "10px",
  background: backgroundColor,
  color: textColor,
}

export function CardWithFormRemove() {
  const [venueId, setVenueId] = React.useState("")

  const isFormValid = venueId.trim() !== ""

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (!isFormValid) {
      toast.error("VenueId must be filled")
      return
    }

    try {
      const response = await fetch(`/api/event?venueId=${venueId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        toast(`Successfully deleted event!`, {
          icon: "🎉",
          style: toastStyle,
        })
      } else {
        toast("Error deleting event", {
          icon: "❌",
          style: toastStyle,
        })
      }
    } catch (error: any) {
      toast.error(`An error occurred: ${error.message}`)
    }
  }

  return (
    <Card className="w-[350px] h-[350px]">
      <Toaster position="bottom-right" reverseOrder={false} />
      <CardHeader>
        <CardTitle>Delete event</CardTitle>
        <CardDescription>
          Remove event so it doesn't monitor listing count and prices on
          VividSeats.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="venueId">VenueId</Label>
              <Input
                id="venueId"
                autoComplete="off"
                placeholder="VenueId of the listing"
                value={venueId}
                onChange={(e) => setVenueId(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5"></div>
          </div>
          <CardFooter className="flex justify-center">
            <Button type="submit" disabled={!isFormValid}>
              Remove
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  )
}
