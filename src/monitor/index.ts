import axios from "axios"

import logger from "./helpers/logger"
import { VividSeatsMonitor } from "./modules/vivid-seats"

const monitorEvent = async (): Promise<void> => {
  try {
    const response = await axios("http://localhost:3000/api/event", {
      responseType: "json",
    })
    const eventsArray = response.data.events

    eventsArray.forEach((eventInfo: any) => {
      const performerId = eventInfo.performerId
      const venueId = eventInfo.venueId
      let event = new VividSeatsMonitor(performerId, venueId)
      event.monitorVenue()
    })

    logger.info("Successfully monitored events.", {
      label: "Vivid Seats",
    })
  } catch (error: any) {
    logger.error(`Error monitoring events: ${error.message}`, {
      label: "Vivid Seats",
    })
  }
}

monitorEvent()

setInterval(monitorEvent, 30 * 60 * 1000)
