import mongoose, { Document, Model, Schema } from "mongoose"

interface IEvent extends Document {
  performerId: number
  venueId: number
}

const eventSchema = new Schema<IEvent>({
  performerId: { type: Number, required: true },
  venueId: { type: Number, required: true },
})

const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", eventSchema, "event")

export default Event
