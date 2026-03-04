export interface Agent {
    name: string;
    id: string;
    status: string;
}

export interface Ship {
    symbol: string;
    registration: Registration;
    nav: Nav;
    crew: Crew;
    frame: Frame;
    reactor: Reactor;
    engine: Engine;
    modules: Module[];
    mounts: Mount[];
    cargo: Cargo;
    fuel: Fuel;
    cooldown?: Cooldown;
}

export interface Registration {
    name: string;
    factionSymbol: string;
    role: string;
}

export interface Crew {
    current: number;
    required: number;
    capacity: number;
    rotation: string;
    morale: number;
    wages: number;
}

export interface Requirements {
    power?: number;
    crew?: number;
    slots?: number;
}

export interface Frame {
    symbol: string;
    name: string;
    description: string;
    condition: number;
    integrity: number;
    moduleSlots: number;
    mountingPoints: number;
    fuelCapacity: number;
    requirements: Requirements;
}

export interface Reactor {
    symbol: string;
    name: string;
    description: string;
    condition: number;
    integrity: number;
    powerOutput: number;
    requirements: Requirements;
}

export interface Engine {
    symbol: string;
    name: string;
    description: string;
    condition: number;
    integrity: number;
    speed: number;
    requirements: Requirements;
}

export interface Module {
    symbol: string;
    name: string;
    description: string;
    requirements: Requirements;
    capacity?: number;
}

export interface Mount {
    symbol: string;
    name: string;
    description: string;
    requirements: Requirements;
    strength: number;
    deposits?: string[];
}

export interface Cargo {
    capacity: number;
    units: number;
    inventory: CargoItem[];
}

export interface Fuel {
    current: number;
    capacity: number;
    consumed: {
        amount: number;
        timestamp: string;
    };
}

export interface Cooldown {
    shipSymbol: string;
    totalSeconds: number;
    remainingSeconds: number;
}

export interface Nav {
    systemSymbol: string;
    waypointSymbol: string;
    route: Route;
    status: string;
    flightMode: string;
}

export interface Route {
    destination: RouteWaypoint;
    origin: RouteWaypoint;
    departureTime: string;
    arrival: string;
}

export interface RouteWaypoint {
    symbol: string;
    type: string;
    systemSymbol: string;
    x: number;
    y: number;
}

export interface CargoItem {
    symbol: string;
    name: string;
    description: string;
    units: number;
}

export interface System {
    symbol: string;
    name: string;
    sectorSymbol: string;
    type: string;
    constellation: string;
    waypoints: SystemWaypoint[];
    factions: Faction[];
}

export interface SystemWaypoint {
    symbol: string;
    type: string;
    x: number;
    y: number;
}

export interface Faction {
    symbol: string;
}

export interface Waypoint {
    symbol: string;
    type: string;
    systemSymbol: string;
    x: number;
    y: number;
    orbitals: Orbital[];
    orbits: string;
    isUnderConstruction: boolean;
}

export interface Orbital {
    symbol: string;
}

export interface Market {
    symbol: string;
    exports: ExchangeItem[];
    imports: ExchangeItem[];
    exchange: ExchangeItem[];
    transactions: Transaction[];
    tradeGoods: TradeGood[];
}

export interface ExchangeItem {
    symbol: string;
    name: string;
    description: string;
}

export interface TradeGood {
    symbol: string;
    type: string;
    tradeVolume: number;
    supply: string;
    activity: string;
    purchasePrice: number;
    sellPrice: number;
}

export interface Transaction {
    waypointSymbol: string;
    shipSymbol: string;
    tradeSymbol: string;
    type: string;
    units: number;
    pricePerUnit: number;
    totalPrice: number;
    timestamp: Date;
}
