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
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("./helpers/logger"));
const vivid_seats_1 = require("./modules/vivid-seats");
const monitorEvent = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, axios_1.default)("http://localhost:3000/api/event", {
            responseType: "json",
        });
        const eventsArray = response.data.events;
        eventsArray.forEach((eventInfo) => {
            const performerId = eventInfo.performerId;
            const venueId = eventInfo.venueId;
            let event = new vivid_seats_1.VividSeatsMonitor(performerId, venueId);
            event.monitorVenue();
        });
        logger_1.default.info("Successfully monitored events.", {
            label: "Vivid Seats",
        });
    }
    catch (error) {
        logger_1.default.error(`Error monitoring events: ${error.message}`, {
            label: "Vivid Seats",
        });
    }
});
monitorEvent();
setInterval(monitorEvent, 5 * 60 * 1000);
