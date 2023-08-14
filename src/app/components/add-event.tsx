import * as React from "react";

import { Button } from "@/src/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/app/components/ui/card";
import { Input } from "@/src/app/components/ui/input";
import { Label } from "@/src/app/components/ui/label";
import toast, { Toaster } from 'react-hot-toast';

const backgroundColor = 'var(--background)';
const textColor = 'var(--foreground)';

const toastStyle = {
  borderRadius: '10px',
  background: backgroundColor,
  color: textColor,
};


export function CardWithFormAdd() {
  const [venueId, setVenueId] = React.useState("");
  const [performerId, setPerformerId] = React.useState("");

  const isFormValid = venueId.trim() !== "" && performerId.trim() !== "";

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!isFormValid) {
      toast.error('Both VenueId and PerformerId must be filled.');
      return;
    }

    // Making the API call
    try {
      const response = await fetch('http://localhost:3000/api/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          venueId: venueId,
          performerId: performerId
        })
      });

      if (response.ok) {
        toast(`Successfully added event!`,
          {
            icon: '🎉',
            style: toastStyle
          }
        );
      } else {
        toast('Error adding event',
        {
          icon: '❌',
          style: toastStyle
        });
      }
    } catch (error:any) {
      toast.error(`An error occurred: ${error.message}`);
    }
  }

  return (
    <Card className="w-[350px] h-[350px]">
      <Toaster position="bottom-right" reverseOrder={false}/>
      <CardHeader>
        <CardTitle>Add a new event</CardTitle>
        <CardDescription>Monitor listing count and prices on VividSeats.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="venueId">VenueId</Label>
              <Input id="venueId" autoComplete="off" placeholder="VenueId of the listing" value={venueId} onChange={e => setVenueId(e.target.value)} />
              <Label htmlFor="performerId">PerformerId</Label>
              <Input id="performerId" autoComplete="off" placeholder="PerformerId of the listing" value={performerId} onChange={e => setPerformerId(e.target.value)} />
            </div>
            <div className="flex flex-col space-y-1.5">
            </div>
          </div>
          <CardFooter className="flex justify-center">
            <Button type="submit" disabled={!isFormValid}>Add</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  )
}
