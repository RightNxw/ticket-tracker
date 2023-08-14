import connectMongoDB from "@/src/app/lib/mongodb";
import Event from "@/src/app/models/event";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

interface EventPayload {
  performerId: number;
  venueId: number;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { performerId, venueId } = await request.json() as EventPayload;
  await connectMongoDB();
  const existingEvent = await Event.findOne({"venueId": venueId});
  if (existingEvent) return NextResponse.json(
    { message: "Duplicate event" },
    { status: 400 }
  );
  
  await Event.create({ performerId, venueId });
  return NextResponse.json(
    { message: "Event being monitored" },
    { status: 201 }
  );
}

export async function GET(): Promise<NextResponse> {
  await connectMongoDB();
  const events = await Event.find();
  return NextResponse.json({ events });
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const id = request.nextUrl.searchParams.get("venueId");
  if (!id) {
    return NextResponse.json(
      { message: "VenueId ID is missing" },
      { status: 400 }
    );
  }
  await connectMongoDB();
  await Event.findOneAndDelete({"venueId": id});
  return NextResponse.json(
    { message: "Event no longer being monitored" },
    { status: 200 }
  );
}
