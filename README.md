# Ticket Tracker

A Next.js web application that monitors ticket pricing and availability from VividSeats. This project works in conjunction with the [ticket-tracker-monitor](https://github.com/RightNxw/ticket-tracker-monitor) service to collect and visualize ticket data over time.

## Overview

Ticket Tracker is a dashboard application that allows users to:
- Monitor multiple events on VividSeats
- Track ticket pricing trends over time
- View ticket availability changes
- Visualize data with interactive charts

## Architecture

This application consists of two main components:

1. **Frontend Dashboard** (this repository): Next.js web interface for visualization and event management
2. **Data Collection Service** ([ticket-tracker-monitor](https://github.com/RightNxw/ticket-tracker-monitor)): Background service that collects data from VividSeats API

### How It Works

1. Users add events to monitor via the Settings page by providing a `venueId` and `performerId`
2. The monitor service (separate repository) periodically fetches data from VividSeats API for tracked events
3. Data is stored in MongoDB with timestamps for historical tracking
4. The dashboard displays real-time charts showing price and ticket count trends

## Features

- **Event Management**: Add and remove events to monitor
- **Real-time Charts**: Interactive line charts showing price and ticket count trends using Recharts
- **Event Selection**: Dropdown search to select and view specific events
- **Dark/Light Mode**: Theme toggle support
- **Responsive Design**: Built with Tailwind CSS and Radix UI components

## Tech Stack

- **Framework**: Next.js 13 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB (via Mongoose)
- **UI Components**: Radix UI
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **State Management**: React Hooks

## Project Structure

```
src/app/
├── api/
│   ├── event/route.ts       # API endpoints for event management (POST, GET, DELETE)
│   └── venue/route.ts       # API endpoints for venue data (POST, GET)
├── components/
│   ├── add-event.tsx        # Form to add new events to monitor
│   ├── remove-event.tsx     # Form to remove events from monitoring
│   ├── event-table.tsx      # Table displaying currently monitored events
│   ├── chart.tsx            # Line chart component for visualizing data
│   ├── search.tsx           # Event search/selection dropdown
│   └── ui/                  # Reusable UI components (buttons, cards, etc.)
├── models/
│   ├── event.ts             # Mongoose schema for events (performerId, venueId)
│   └── venue.ts             # Mongoose schema for venue data (prices, counts, timestamps)
├── lib/
│   └── mongodb.ts           # MongoDB connection utility
├── config/
│   └── site.ts              # Site configuration
├── page.tsx                 # Home page with chart visualization
├── settings/
│   └── page.tsx             # Settings page for event management
└── layout.tsx               # Root layout with theme provider
```

## Data Models

### Event
Represents an event being monitored:
- `performerId`: VividSeats performer ID
- `venueId`: VividSeats venue ID (unique)

### Venue
Stores historical ticket data:
- `id`: Unique venue identifier
- `artist`: Performer name
- `stadium`: Venue name
- `vividUrl`: Link to VividSeats listing
- `date`: Event date and time
- `ticketCount`: Array of ticket counts over time
- `minPrice`: Array of minimum prices over time
- `updated`: Array of timestamps for each data point

## API Endpoints

### Events API (`/api/event`)
- **POST**: Add a new event to monitor (requires `performerId` and `venueId`)
- **GET**: Retrieve all monitored events
- **DELETE**: Stop monitoring an event (requires `venueId` query parameter)

### Venue API (`/api/venue`)
- **POST**: Update venue data (called by monitor service)
- **GET**: Retrieve venue data
  - With `id` parameter: Get specific venue
  - Without parameter: Get all venues

## Prerequisites

- Node.js (v16 or higher)
- MongoDB database
- The companion [ticket-tracker-monitor](https://github.com/RightNxw/ticket-tracker-monitor) service running

## Installation

1. Clone the repository:
```bash
git clone https://github.com/RightNxw/ticket-tracker.git
cd ticket-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Adding Events to Monitor

1. Navigate to the Settings page
2. Enter the `venueId` and `performerId` from VividSeats
   - These can be found in VividSeats URLs: `vividseats.com/[performer]/[venue]-tickets-[venueId].html`
3. Click "Add" to start monitoring

### Viewing Data

1. Go to the Home page
2. Use the dropdown to select an event
3. View the interactive chart showing:
   - Red line: Minimum ticket price over time
   - Blue line: Total ticket count over time
4. Click the event title to open the VividSeats listing

### Removing Events

1. Go to the Settings page
2. Enter the `venueId` of the event to stop monitoring
3. Click "Remove"

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues
- `npm run typecheck` - Run TypeScript type checking
- `npm run format:write` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |

## Related Projects

- [ticket-tracker-monitor](https://github.com/RightNxw/ticket-tracker-monitor) - Background service for collecting VividSeats data