"use client"

import { CardWithFormAdd } from "../components/add-event"
import { CardWithFormRemove } from "../components/remove-event"
import { EventTable } from "../components/event-table"
export default function IndexPage() {
  return (
    <section className="container flex flex-col items-center justify-center pt-4">
      <div className="flex flex-row items-center gap-8 mb-4">
        <CardWithFormAdd />
        <CardWithFormRemove />
      </div>
      <div className="w-3/4 max-w-xl max-h-96 overflow-auto">
        <EventTable />
      </div>
    </section>
  )
}

