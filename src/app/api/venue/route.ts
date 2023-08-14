import { NextRequest, NextResponse } from "next/server"
import connectMongoDB from "@/src/app/lib/mongodb"
import Venue from "@/src/app/models/venue"

interface VenuePayload {
  id?: number
  artist?: string
  stadium?: string
  vividUrl?: string
  date?: {
    day: string
    time: string
  }
  ticketCount?: number
  minPrice?: number
  updated?: number
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const payload = (await request.json()) as VenuePayload
  await connectMongoDB()
  console.log(payload)
  if (!payload.id) {
    return NextResponse.json(
      { message: "Invalid payload: Missing ID" },
      { status: 400 }
    )
  }

  const existingVenue = await Venue.findOne({ id: payload.id })

  if (existingVenue) {
    if (payload.artist || payload.stadium || payload.vividUrl) {
      if (payload.artist) existingVenue.artist = payload.artist
      if (payload.stadium) existingVenue.stadium = payload.stadium
      if (payload.vividUrl) existingVenue.vividUrl = payload.vividUrl

      await existingVenue.save()
      return NextResponse.json(
        { message: "Venue updated successfully" },
        { status: 200 }
      )
    }

    if (
      !payload.date ||
      !payload.ticketCount ||
      !payload.minPrice ||
      !payload.updated
    ) {
      return NextResponse.json(
        { message: "Invalid payload for full update" },
        { status: 400 }
      )
    }

    existingVenue.ticketCount.push(payload.ticketCount)
    existingVenue.minPrice.push(payload.minPrice)
    existingVenue.updated.push(payload.updated)

    await existingVenue.save()
    return NextResponse.json(
      { message: "Venue updated successfully" },
      { status: 200 }
    )
  } else {
    if (
      !payload.date ||
      !payload.ticketCount ||
      !payload.minPrice ||
      !payload.updated
    ) {
      return NextResponse.json(
        { message: "Invalid payload for insertion" },
        { status: 400 }
      )
    }

    await Venue.create({
      ...payload,
      ticketCount: [payload.ticketCount],
      minPrice: [payload.minPrice],
      updated: [payload.updated],
    })
    return NextResponse.json(
      { message: "Venue added successfully" },
      { status: 201 }
    )
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  await connectMongoDB()

  const id = request.nextUrl.searchParams.get("id")

  if (id) {
    const venue = await Venue.findOne({ id: Number(id) })

    if (venue) {
      return NextResponse.json(venue)
    } else {
      return NextResponse.json({ message: "Venue not found" }, { status: 404 })
    }
  } else {
    const venues = await Venue.find()
    return NextResponse.json({ venues })
  }
}
