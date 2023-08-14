import mongoose, { Document, Model, Schema } from "mongoose"

interface IVenue extends Document {
  id: number
  artist: string
  stadium: string
  vividUrl: string
  date: {
    day: string
    time: string
  }
  ticketCount: number[]
  minPrice: number[]
  updated: number[]
}

const venueSchema = new Schema<IVenue>({
  id: { type: Number, required: true },
  artist: { type: String, required: false },
  stadium: { type: String, required: false },
  vividUrl: { type: String, required: false },
  date: {
    day: { type: String, required: true },
    time: { type: String, required: true },
  },
  ticketCount: { type: [Number], required: true },
  minPrice: { type: [Number], required: true },
  updated: { type: [Number], required: true },
})

const Venue: Model<IVenue> =
  mongoose.models.Venue || mongoose.model<IVenue>("Venue", venueSchema, "venue")

export default Venue
