<template>
	<div class="card" style="width: 100%; height: 100%">
		<div class="container">
			<div v-if="store.bestStuff.value" class="left-side">
				<ItemPreview
					v-for="key in ['amulet', 'shield', 'ring1', 'belt', 'boots']"
					:key="key + store.bestStuff.value.items[key]?.picture"
					:src="
						'https://www.dofusbook.net/static/dist/items/' +
						store.bestStuff.value.items[key]?.picture +
						'-70.webp'
					"
				/>
			</div>

			<div v-if="store.bestStuff.value" class="right-side">
				<ItemPreview
					v-for="key in ['hat', 'weaponSlot', 'ring2', 'cape', 'petSlot']"
					:key="key + store.bestStuff.value.items[key]?.picture"
					:src="
						'https://www.dofusbook.net/static/dist/items/' +
						store.bestStuff.value.items[key]?.picture +
						'-70.webp'
					"
				/>
			</div>

			<div v-if="store.bestStuff.value" class="bottom-row">
				<ItemPreview
					v-for="key in ['DofusSlot1', 'DofusSlot2', 'DofusSlot3', 'DofusSlot4', 'DofusSlot5', 'DofusSlot6']"
					:key="key + store.bestStuff.value.items[key]?.picture"
					:src="
						'https://www.dofusbook.net/static/dist/items/' +
						store.bestStuff.value.items[key]?.picture +
						'-70.webp'
					"
				/>
			</div>

			<div class="rectangle">
				<h1>BworkGen 🦕</h1>
				<button
					:loading="store.algorithmRunning.value"
					@click="startAlgorithm"
					:disabled="store.algorithmRunning.value"
					class="start-algorithm-btn"
				>
					<span v-if="store.algorithmRunning.value">
						{{ "Generation: " + store.currentGeneration.value + " Fitness: " + store.currentFitness.value }}
					</span>
					<span v-else>
						{{ "Start Genetic Algorithm" }}
					</span>
				</button>

				<div
					v-if="
						!store.algorithmRunning.value &&
						store.currentGeneration.value > 0 &&
						store.currentFitness.value > 0
					"
				>
					{{
						"Finished with Generation: " +
						store.currentGeneration.value +
						" Fitness: " +
						store.currentFitness.value
					}}
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import ItemPreview from "./ItemPreview.vue";
import * as store from "../store";

const socket = new WebSocket("ws://localhost:8000/ws/stuff");
let isConnected = false;
socket.onopen = () => {
	console.log("WebSocket connection established");
	isConnected = true;
};

function startAlgorithm() {
	if (!isConnected) {
		console.error("WebSocket not connected");
		return;
	}

	store.algorithmRunning.value = true;

	socket.send(
		JSON.stringify({
			type: "start_algorithm",
			requiredEffects: store.requiredStats.value,
			populationSize: 1000,
			generations: 200,
		})
	);
}

socket.onmessage = (event) => {
	try {
		const data = JSON.parse(event.data);

		if (data.type === "start") {
			store.algorithmRunning.value = true;
		} else if (data.type === "progress") {
			// Update reactive state
			store.currentGeneration.value = data.generation;
			store.currentFitness.value = data.fitness;

			store.bestStuff.value = data.stuff;
			store.bestStats.value = data.stats;
		} else if (data.type === "complete") {
			store.algorithmRunning.value = false;
			// Final result
			store.bestStuff.value = data.stuff;
			store.bestStats.value = data.stats;
		} else if (data.type === "error") {
			console.error("Error:", data.message);
			store.algorithmRunning.value = false;
		}
	} catch (error) {
		console.error("Error parsing message:", error);
	}
};

socket.onclose = (event) => {
	console.log("Connection closed:", event.code, event.reason);
	isConnected = false;
};

socket.onerror = (error) => {
	console.error("WebSocket error:", error);
};

window.addEventListener("beforeunload", () => {
	if (socket && socket.readyState === WebSocket.OPEN) {
		socket.close();
	}
});
</script>

<style scoped>
.start-algorithm-btn {
	margin: 1rem 0;
	padding: 0.5rem 1rem;
	font-size: 1rem;
	background-color: #4caf50;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
}

.start-algorithm-btn:disabled {
	background-color: #cccccc;
	cursor: not-allowed;
}

.container {
	position: relative;
	width: 100%; /* Total width: 400px for the rectangle, plus space for the left/right side */
	height: 100%; /* Total height: 400px for the rectangle, plus space for the bottom row */
	margin: 0 auto; /* Center the entire container */
}

.rectangle {
	width: 400px;
	height: 400px;
	margin: 0 auto;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

.left-side,
.right-side,
.bottom-row {
	position: absolute;
	margin: 10px;
}

.left-side {
	height: 80%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.right-side {
	height: 80%;
	right: 0px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.bottom-row {
	margin: 10px 0;
	left: 50%; /* Center horizontally with the rectangle */
	bottom: 0px; /* Place below the rectangle */
	transform: translateX(-50%); /* Adjust to be exactly in the center */
	display: flex;
	justify-content: space-between;
	width: calc(100% - 20px); /* Ensure it spans the full width */
}

.card {
	background-color: #161616;
	border-radius: 20px;
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
	transition: 0.3s;
}
</style>
