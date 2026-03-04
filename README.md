# SpaceTraders Front

A Svelte-based frontend for the SpaceTraders API, connecting to the local SpaceTradersFrontAPI backend.

## Structure

### API Client (`src/lib/api.ts`)
Centralized API client with functions for all backend endpoints:
- `fetchAgent()` - Get agent information
- `fetchShips()` - Get all ships
- `fetchShip(shipSymbol)` - Get specific ship details
- `shipAction(shipSymbol, action)` - Execute ship actions (orbit, dock, extract, etc.)
- `navigateShip(shipSymbol, waypointSymbol)` - Navigate ship to waypoint
- `fetchSystem(systemSymbol)` - Get system information
- `fetchWaypoint(systemSymbol, waypointSymbol)` - Get waypoint details
- `fetchMarket(systemSymbol, waypointSymbol)` - Get market data

### Routes

#### `/` - Home
Landing page with navigation links

#### `/agent` - Agent Info
Display agent information (name, ID, status)

#### `/ships` - Ships List
List all ships with basic info and links to details

#### `/ships/[shipSymbol]` - Ship Details
- View ship navigation status, fuel, and cargo
- Execute actions: orbit, dock, extract, survey
- Navigate to waypoints

#### `/systems/[systemSymbol]` - System View
Display system information and list of waypoints

#### `/systems/[systemSymbol]/waypoints/[waypointSymbol]` - Waypoint Details
View waypoint information including type, position, and orbitals

#### `/systems/[systemSymbol]/waypoints/[waypointSymbol]/market` - Market View
Display market data with imports, exports, and trade goods in tables

### Types (`src/lib/types.ts`)
TypeScript interfaces for:
- Agent
- Ship (with Nav, Route, CargoItem)
- System (with SystemWaypoint, Faction)
- Waypoint
- Market (with ExchangeItem, TradeGood, Transaction)

## Backend Endpoints

The frontend connects to `http://localhost:5000` with these endpoints:

- `GET /my/agent` - Agent info
- `GET /ships` - All ships
- `GET /ships/{shipSymbol}` - Ship details
- `GET /ships/{shipSymbol}/{action}` - Ship actions
- `GET /ships/{shipSymbol}/navigate/{waypointSymbol}` - Navigate
- `GET /systems/{systemSymbol}` - System info
- `GET /systems/{systemSymbol}/waypoints/{waypointSymbol}` - Waypoint info
- `GET /systems/{systemSymbol}/waypoints/{waypointSymbol}/market` - Market data

## Development

```bash
npm install
npm run dev
```

Ensure the SpaceTradersFrontAPI backend is running on port 5000.
