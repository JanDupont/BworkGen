import { Context } from "@oak/oak";
import { geneticAlgorithm } from "./stuffs/genetic.ts";
import { Effects } from "./types.ts";

const wsConnections = new Map<number, WebSocket>();
let connectionIdCounter = 0;

const getDefaultBaseEffects = (): Effects => ({
	ap: 8,
	mp: 4,
	range: 1,
	summons: 1,
	vitality: 1540,
	wisdom: 100,
	strength: 100,
	intelligence: 400,
	agility: 100,
	chance: 100,
	power: 0,
	critical: 0,
	pp: 0,
	lock: 0,
	dodge: 0,
	ap_red: 0,
	mp_red: 0,
	ap_parry: 0,
	mp_parry: 0,
	heals: 0,
	reflect: 0,
	initiative: 400,
	pods: 500,
	dmg_neutral: 0,
	dmg_earth: 0,
	dmg_fire: 0,
	dmg_water: 0,
	dmg_air: 0,
	dmg_critical: 0,
	dmg_pushback: 0,
	dmg_percent_spells: 0,
	dmg_percent_weapons: 0,
	dmg_percent_melee: 0,
	dmg_percent_distance: 0,
	res_percent_neutral: 0,
	res_percent_earth: 0,
	res_percent_fire: 0,
	res_percent_water: 0,
	res_percent_air: 0,
	res_neutral: 0,
	res_earth: 0,
	res_fire: 0,
	res_water: 0,
	res_air: 0,
	res_critical: 0,
	res_pushback: 0,
	res_spells: 0,
	res_weapons: 0,
	res_melee: 0,
	res_distance: 0,
});

function handleWebSocketMessage(ws: WebSocket, connectionId: number, event: MessageEvent) {
	try {
		const message = JSON.parse(event.data);
		console.log(`Received message: ${message.type} from connection ${connectionId}`);

		if (message.type === "start_algorithm") {
			console.log(`Starting algorithm for connection ${connectionId}`);

			// Get required effects from client or use empty object as fallback
			const requiredEffects: Effects = message.requiredEffects || {};
			console.log("Using required effects:", requiredEffects);

			const populationSize = message.populationSize || 300;
			const generations = message.generations || 1000;

			ws.send(JSON.stringify({ type: "start", message: "Starting genetic algorithm..." }));

			geneticAlgorithm(
				requiredEffects,
				getDefaultBaseEffects(),
				populationSize,
				generations,
				(generation, bestStuff, stats, fitness) => {
					console.log(`Callback for generation ${generation}`);

					if (ws.readyState === WebSocket.OPEN) {
						const lightweightStuff = structuredClone(bestStuff);

						console.log(`Sending progress update for generation ${generation}`);

						// Send progress update immediately
						ws.send(
							JSON.stringify({
								type: "progress",
								generation,
								fitness,
								stuff: lightweightStuff,
								stats,
							})
						);
					}
				}
			)
				.then((result) => {
					if (ws.readyState === WebSocket.OPEN) {
						// Send final result
						ws.send(
							JSON.stringify({
								type: "complete",
								stuff: result.stuff,
								stats: result.combinedStats,
							})
						);
					}
				})
				.catch((error) => {
					console.error(`Error in genetic algorithm for connection ${connectionId}:`, error);
					if (ws.readyState === WebSocket.OPEN) {
						ws.send(JSON.stringify({ type: "error", message: error.message }));
					}
				});
		}
	} catch (error) {
		console.error(`Error parsing message from connection ${connectionId}:`, error);
	}
}

// WebSocket handler for Oak middleware
export async function handleWebSocket(context: Context, next: () => Promise<unknown>) {
	if (context.request.url.pathname === "/ws/stuff") {
		if (!context.isUpgradable) {
			context.response.status = 400;
			context.response.body = "Cannot upgrade to WebSocket";
			return;
		}

		const ws = context.upgrade();
		const connectionId = connectionIdCounter++;
		wsConnections.set(connectionId, ws);

		console.log(`WebSocket connection established: ${connectionId}`);

		ws.onmessage = (event) => handleWebSocketMessage(ws, connectionId, event);

		ws.onopen = () => {
			console.log(`Connection ${connectionId} opened`);
		};

		ws.onclose = () => {
			console.log(`Connection ${connectionId} closed`);
			wsConnections.delete(connectionId);
		};

		ws.onerror = (error) => {
			console.error(`WebSocket error on connection ${connectionId}:`, error);
		};

		// Keep the connection alive until closed
		return;
	}

	await next();
}
