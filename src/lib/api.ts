import { getCached, setCached, invalidateCache } from './cache.svelte';

const API_BASE = 'http://localhost:5247';

export async function fetchAgent() {
    const cached = getCached('agent');
    if (cached) return cached;
    
    const res = await fetch(`${API_BASE}/my/agent`);
    if (!res.ok) throw new Error('Failed to fetch agent');
    const data = await res.json();
    setCached('agent', data);
    return data;
}

export async function fetchShips() {
    const cached = getCached('ships');
    if (cached) return cached;
    
    const res = await fetch(`${API_BASE}/ships`);
    if (!res.ok) throw new Error('Failed to fetch ships');
    const data = await res.json();
    setCached('ships', data);
    return data;
}

export async function fetchShip(shipSymbol: string) {
    const cached = getCached('ship', shipSymbol);
    if (cached) return cached;
    
    const res = await fetch(`${API_BASE}/ships/${shipSymbol}`);
    if (!res.ok) throw new Error('Failed to fetch ship');
    const data = await res.json();
    setCached('ship', data, shipSymbol);
    return data;
}

export async function shipAction(shipSymbol: string, action: string) {
    const res = await fetch(`${API_BASE}/ships/${shipSymbol}/${action}`);
    const data = await res.text();
    if (!res.ok) throw new Error(data || `Failed to ${action}`);
    invalidateCache('ship', shipSymbol);
    invalidateCache('ships');
    return data;
}

export async function navigateShip(shipSymbol: string, waypointSymbol: string) {
    const res = await fetch(`${API_BASE}/ships/${shipSymbol}/navigate/${waypointSymbol}`);
    if (!res.ok) throw new Error('Failed to navigate');
    const data = await res.json();
    invalidateCache('ship', shipSymbol);
    invalidateCache('ships');
    return data;
}

export async function purchaseCargo(shipSymbol: string, tradeSymbol: string, units: number) {
    const res = await fetch(`${API_BASE}/ships/${shipSymbol}/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tradeSymbol, units })
    });
    if (!res.ok) throw new Error('Failed to purchase cargo');
    const data = await res.json();
    invalidateCache('ship', shipSymbol);
    invalidateCache('ships');
    invalidateCache('agent');
    return data;
}

export async function sellCargo(shipSymbol: string, tradeSymbol: string, units: number) {
    const res = await fetch(`${API_BASE}/ships/${shipSymbol}/sell`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tradeSymbol, units })
    });
    if (!res.ok) throw new Error('Failed to sell cargo');
    const data = await res.json();
    invalidateCache('ship', shipSymbol);
    invalidateCache('ships');
    invalidateCache('agent');
    return data;
}

export async function jettisonCargo(shipSymbol: string, tradeSymbol: string, units: number) {
    const res = await fetch(`${API_BASE}/ships/${shipSymbol}/jettison`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tradeSymbol, units })
    });
    if (!res.ok) throw new Error('Failed to jettison cargo');
    const data = await res.json();
    invalidateCache('ship', shipSymbol);
    invalidateCache('ships');
    return data;
}

export async function transferCargo(shipSymbol: string, tradeSymbol: string, units: number, targetShipSymbol: string) {
    const res = await fetch(`${API_BASE}/ships/${shipSymbol}/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tradeSymbol, units, targetShipSymbol })
    });
    if (!res.ok) throw new Error('Failed to transfer cargo');
    const data = await res.json();
    invalidateCache('ship', shipSymbol);
    invalidateCache('ship', targetShipSymbol);
    invalidateCache('ships');
    return data;
}

export async function refuelShip(shipSymbol: string, units?: number) {
    const res = await fetch(`${API_BASE}/ships/${shipSymbol}/refuel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ units })
    });
    if (!res.ok) throw new Error('Failed to refuel');
    const data = await res.json();
    invalidateCache('ship', shipSymbol);
    invalidateCache('ships');
    invalidateCache('agent');
    return data;
}

export async function jumpShip(shipSymbol: string, systemSymbol: string) {
    const res = await fetch(`${API_BASE}/ships/${shipSymbol}/jump`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemSymbol })
    });
    if (!res.ok) throw new Error('Failed to jump');
    const data = await res.json();
    invalidateCache('ship', shipSymbol);
    invalidateCache('ships');
    return data;
}

export async function purchaseShip(shipType: string, waypointSymbol: string) {
    const res = await fetch(`${API_BASE}/ships/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shipType, waypointSymbol })
    });
    if (!res.ok) throw new Error('Failed to purchase ship');
    const data = await res.json();
    invalidateCache('ships');
    invalidateCache('agent');
    return data;
}

export async function fetchSystems(page: number = 1, limit: number = 20) {
    const cached = getCached('systems', String(page), String(limit));
    if (cached) return cached;
    
    const res = await fetch(`${API_BASE}/systems?page=${page}&limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch systems');
    const data = await res.json();
    setCached('systems', data, String(page), String(limit));
    return data;
}

export async function fetchSystem(systemSymbol: string) {
    const cached = getCached('system', systemSymbol);
    if (cached) return cached;
    
    const res = await fetch(`${API_BASE}/systems/${systemSymbol}`);
    if (!res.ok) throw new Error('Failed to fetch system');
    const data = await res.json();
    setCached('system', data, systemSymbol);
    return data;
}

export async function fetchWaypoint(systemSymbol: string, waypointSymbol: string) {
    const cached = getCached('waypoint', systemSymbol, waypointSymbol);
    if (cached) return cached;
    
    const res = await fetch(`${API_BASE}/systems/${systemSymbol}/waypoints/${waypointSymbol}`);
    if (!res.ok) throw new Error('Failed to fetch waypoint');
    const data = await res.json();
    setCached('waypoint', data, systemSymbol, waypointSymbol);
    return data;
}

export async function searchWaypointsByTrait(systemSymbol: string, trait: string) {
    const res = await fetch(`${API_BASE}/systems/${systemSymbol}/waypoints?traits=${trait}`);
    if (!res.ok) throw new Error('Failed to search waypoints');
    return await res.json();
}

export async function fetchMarket(systemSymbol: string, waypointSymbol: string) {
    const cached = getCached('market', systemSymbol, waypointSymbol);
    if (cached) return cached;
    
    const res = await fetch(`${API_BASE}/systems/${systemSymbol}/waypoints/${waypointSymbol}/market`);
    if (!res.ok) throw new Error('Failed to fetch market');
    const data = await res.json();
    setCached('market', data, systemSymbol, waypointSymbol);
    return data;
}

export async function fetchShipyard(systemSymbol: string, waypointSymbol: string) {
    const cached = getCached('shipyard', systemSymbol, waypointSymbol);
    if (cached) return cached;
    
    const res = await fetch(`${API_BASE}/systems/${systemSymbol}/waypoints/${waypointSymbol}/shipyard`);
    if (!res.ok) throw new Error('Failed to fetch shipyard');
    const data = await res.json();
    setCached('shipyard', data, systemSymbol, waypointSymbol);
    return data;
}

export async function fetchJumpGate(systemSymbol: string, waypointSymbol: string) {
    const cached = getCached('jumpGate', systemSymbol, waypointSymbol);
    if (cached) return cached;
    
    const res = await fetch(`${API_BASE}/systems/${systemSymbol}/waypoints/${waypointSymbol}/jump-gate`);
    if (!res.ok) throw new Error('Failed to fetch jump gate');
    const data = await res.json();
    setCached('jumpGate', data, systemSymbol, waypointSymbol);
    return data;
}

export async function fetchConstruction(systemSymbol: string, waypointSymbol: string) {
    const cached = getCached('construction', systemSymbol, waypointSymbol);
    if (cached) return cached;
    
    const res = await fetch(`${API_BASE}/systems/${systemSymbol}/waypoints/${waypointSymbol}/construction`);
    if (!res.ok) throw new Error('Failed to fetch construction');
    const data = await res.json();
    setCached('construction', data, systemSymbol, waypointSymbol);
    return data;
}

export async function supplyConstruction(systemSymbol: string, waypointSymbol: string, shipSymbol: string, tradeSymbol: string, units: number) {
    const res = await fetch(`${API_BASE}/systems/${systemSymbol}/waypoints/${waypointSymbol}/construction/supply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shipSymbol, tradeSymbol, units })
    });
    if (!res.ok) throw new Error('Failed to supply construction');
    const data = await res.json();
    invalidateCache('construction', systemSymbol, waypointSymbol);
    invalidateCache('ship', shipSymbol);
    invalidateCache('ships');
    return data;
}

export async function fetchContracts() {
    const cached = getCached('contracts');
    if (cached) return cached;
    
    const res = await fetch(`${API_BASE}/contracts`);
    if (!res.ok) throw new Error('Failed to fetch contracts');
    const data = await res.json();
    setCached('contracts', data);
    return data;
}

export async function fetchContract(contractId: string) {
    const cached = getCached('contract', contractId);
    if (cached) return cached;
    
    const res = await fetch(`${API_BASE}/contracts/${contractId}`);
    if (!res.ok) throw new Error('Failed to fetch contract');
    const data = await res.json();
    setCached('contract', data, contractId);
    return data;
}

export async function acceptContract(contractId: string) {
    const res = await fetch(`${API_BASE}/contracts/${contractId}/accept`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to accept contract');
    const data = await res.json();
    invalidateCache('contract', contractId);
    invalidateCache('contracts');
    invalidateCache('agent');
    return data;
}

export async function deliverContract(contractId: string, shipSymbol: string, tradeSymbol: string, units: number) {
    const res = await fetch(`${API_BASE}/contracts/${contractId}/deliver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shipSymbol, tradeSymbol, units })
    });
    if (!res.ok) throw new Error('Failed to deliver contract');
    const data = await res.json();
    invalidateCache('contract', contractId);
    invalidateCache('contracts');
    invalidateCache('ship', shipSymbol);
    invalidateCache('ships');
    return data;
}

export async function fulfillContract(contractId: string) {
    const res = await fetch(`${API_BASE}/contracts/${contractId}/fulfill`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to fulfill contract');
    const data = await res.json();
    invalidateCache('contract', contractId);
    invalidateCache('contracts');
    invalidateCache('agent');
    return data;
}

export async function fetchFactions(page: number = 1, limit: number = 20) {
    const cached = getCached('factions', String(page), String(limit));
    if (cached) return cached;
    
    const res = await fetch(`${API_BASE}/factions?page=${page}&limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch factions');
    const data = await res.json();
    setCached('factions', data, String(page), String(limit));
    return data;
}

export async function fetchFaction(factionSymbol: string) {
    const cached = getCached('faction', factionSymbol);
    if (cached) return cached;
    
    const res = await fetch(`${API_BASE}/factions/${factionSymbol}`);
    if (!res.ok) throw new Error('Failed to fetch faction');
    const data = await res.json();
    setCached('faction', data, factionSymbol);
    return data;
}
