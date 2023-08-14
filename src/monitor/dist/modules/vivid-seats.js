"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VividSeatsMonitor = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("../helpers/logger"));
const COMMON_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-language": "en-US,en;q=0.9",
    "cache-control": "max-age=0",
    "sec-ch-ua": '"Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "none",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
};
class VividSeatsMonitor {
    constructor(performerId, eventId) {
        this.performerId = performerId;
        this.eventId = eventId;
    }
    monitorVenue() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`https://www.vividseats.com/hermes/api/v1/productions/related?performerId=${this.performerId}&venueId=${this.eventId}&date=${Date.now()}`, {
                    headers: COMMON_HEADERS,
                    responseType: "json",
                });
                const venues = response.data.items;
                for (const venue of venues) {
                    logger_1.default.info(`Starting processing for venue ID: ${venue.id}`, {
                        label: "Vivid Seats",
                    });
                    const res = yield axios_1.default.post("http://localhost:3000/api/venue", {
                        id: venue.id,
                        date: {
                            day: venue.formattedDate.date,
                            time: venue.formattedDate.time,
                        },
                        ticketCount: venue.ticketCount,
                        minPrice: venue.minPrice,
                        updated: Date.now(),
                    });
                    if (res.status !== 200 && res.status !== 201) {
                        logger_1.default.error(`Error posting venue ID: ${venue.id}. Response: ${res.status} ${res.statusText}`, {
                            label: "Vivid Seats",
                        });
                        continue;
                    }
                    const venueResponse = yield axios_1.default.get(`http://localhost:3000/api/venue?id=${venue.id}`);
                    const existingVenue = venueResponse.data;
                    if (!existingVenue.artist ||
                        !existingVenue.stadium ||
                        !existingVenue.vividUrl) {
                        yield this.fetchAdditionalVenueInfo(venue.id);
                    }
                    logger_1.default.info(`Finished processing for venue ID: ${venue.id}`, {
                        label: "Vivid Seats",
                    });
                }
            }
            catch (error) {
                logger_1.default.error(`Error processing venue: ${error}`, {
                    label: "Vivid Seats",
                });
            }
        });
    }
    fetchAdditionalVenueInfo(venueId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`https://www.vividseats.com/hermes/api/v1/listings?productionId=${venueId}`, {
                    headers: COMMON_HEADERS,
                    responseType: "json",
                });
                const artistName = response.data.global[0].productionName;
                const stadiumName = response.data.global[0].mapTitle;
                const venueUrl = `https://www.vividseats.com/production/${venueId}`;
                yield axios_1.default.post("http://localhost:3000/api/venue", {
                    id: venueId,
                    artist: artistName,
                    stadium: stadiumName,
                    vividUrl: venueUrl,
                });
                logger_1.default.info(`Fetched additional info for venue ID: ${venueId}`, {
                    label: "Vivid Seats",
                });
            }
            catch (error) {
                logger_1.default.error(`Error fetching additional info for venue ID ${venueId}: ${error.message} `, {
                    label: "Vivid Seats",
                });
            }
        });
    }
}
exports.VividSeatsMonitor = VividSeatsMonitor;
