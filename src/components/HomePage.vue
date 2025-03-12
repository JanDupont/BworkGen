<template>
	<div style="position: absolute; top: 30%; left: 50%; transform: translate(-50%, -50%); text-align: center">
		<h1>BworkGen 🦕</h1>

		<button @click="startAlgorithm" :disabled="algorithmRunning" class="start-algorithm-btn">
			<span v-if="algorithmRunning">
				{{ "Generation: " + currentGeneration + " Fitness: " + currentFitness }}
			</span>
			<span v-else>
				{{ "Start Genetic Algorithm" }}
			</span>
		</button>
	</div>

	<div
		style="
			display: flex;
			justify-content: space-around;
			width: calc(100vw - 40px);
			height: calc(100vh - 40px);
			gap: 10px;
			margin: 20px;
		"
	>
		<div style="flex: 1">
			<div class="card" style="width: calc(100% - 20px); height: calc(100% - 20px); display: flex; padding: 10px">
				<div
					style="
						display: grid;
						grid-template-columns: 1fr 1fr;
						column-gap: 60px;
						grid-auto-rows: 1fr;
						height: 100%;
						width: 100%;
					"
				>
					<div
						v-for="(value, key) in requiredStats"
						:key="key"
						style="display: flex; justify-content: space-between; align-items: center; width: 100%"
					>
						<span>{{ key }}</span>
						<span>{{ value }}</span>
					</div>
				</div>
			</div>
		</div>
		<div style="flex: 2">
			<div class="card" style="width: 100%; height: 100%">
				<div v-if="bestStuff" class="container">
					<!-- Left Side (Vertical stack to the left of the rectangle) -->
					<div class="left-side">
						<img
							v-for="key in ['amulet', 'shield', 'ring1', 'belt', 'boots']"
							:key="key + bestStuff.items[key]?.picture"
							:src="
								'https://www.dofusbook.net/static/dist/items/' +
								bestStuff.items[key]?.picture +
								'-70.webp'
							"
							:alt="key"
							class="stuff-image"
						/>
					</div>

					<!-- Right Side (Vertical stack to the right of the rectangle) -->
					<div class="right-side">
						<img
							v-for="key in ['hat', 'weaponSlot', 'ring2', 'cape', 'petSlot']"
							:key="key + bestStuff.items[key]?.picture"
							:src="
								'https://www.dofusbook.net/static/dist/items/' +
								bestStuff.items[key]?.picture +
								'-70.webp'
							"
							:alt="key"
							class="stuff-image"
						/>
					</div>

					<!-- Bottom Row (Horizontal, below the rectangle) -->
					<div class="bottom-row">
						<img
							v-for="key in [
								'DofusSlot1',
								'DofusSlot2',
								'DofusSlot3',
								'DofusSlot4',
								'DofusSlot5',
								'DofusSlot6',
							]"
							:key="key + bestStuff.items[key]?.picture"
							:src="
								'https://www.dofusbook.net/static/dist/items/' +
								bestStuff.items[key]?.picture +
								'-70.webp'
							"
							:alt="key"
							class="stuff-image"
						/>
					</div>

					<!-- Central Rectangle -->
					<div class="rectangle">
						<!-- Central rectangle content can go here if needed -->
						<button
							:loading="algorithmRunning"
							@click="startAlgorithm"
							:disabled="algorithmRunning"
							class="start-algorithm-btn"
						>
							<span v-if="algorithmRunning">
								{{ "Generation: " + currentGeneration + " Fitness: " + currentFitness }}
							</span>
							<span v-else>
								{{ "Start Genetic Algorithm" }}
							</span>
						</button>
					</div>
				</div>
			</div>
		</div>
		<div style="flex: 1">
			<div class="card" style="width: calc(100% - 20px); height: calc(100% - 20px); display: flex; padding: 10px">
				<div
					style="
						display: grid;
						grid-template-columns: 1fr 1fr;
						column-gap: 60px;
						grid-auto-rows: 1fr;
						height: 100%;
						width: 100%;
					"
				>
					<div
						v-for="(value, key) in bestStats"
						:key="key"
						style="display: flex; justify-content: space-between; align-items: center; width: 100%"
						:style="{ color: resultEffectColor(key, value) }"
					>
						<span>{{ key }}</span>
						<span>{{ value }}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const algorithmRunning = ref(false);
const currentGeneration = ref(0);
const currentFitness = ref(0);
const bestStuff = ref<any>(null);
const bestStats = ref<Record<string, number>>({});

const requiredStats = ref<Record<string, number>>({
	ap: 12,
	mp: 5,
	range: 6,
	summons: 2,
	vitality: 4600,
	intelligence: 1100,
	power: 100,
	res_percent_neutral: 25,
	res_percent_earth: 45,
	res_percent_fire: 45,
	res_percent_water: 40,
	res_percent_air: 45,
	res_pushback: 300,
	dmg_fire: 120,
	heals: 100,
});

function resultEffectColor(key: string, value: number) {
	const requiredValue = requiredStats.value[key] || 0;
	if (!requiredValue) return "white";
	if (value >= requiredValue) return "green";
	else if (value >= requiredValue * 0.85) return "yellow";
	else if (value >= requiredValue * 0.75) return "orange";
	else return "red";
}

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
	console.log("Starting genetic algorithm...");
	algorithmRunning.value = true;

	socket.send(
		JSON.stringify({
			type: "start_algorithm",
			requiredEffects: requiredStats.value,
			populationSize: 400,
			generations: 1000,
		})
	);
}

socket.onmessage = (event) => {
	try {
		const data = JSON.parse(event.data);
		console.log("Received:", data.type);

		if (data.type === "start") {
			console.log("Algorithm starting:", data.message);
			algorithmRunning.value = true;
		} else if (data.type === "progress") {
			console.log(`Generation ${data.generation}: Fitness = ${data.fitness}`);
			// Update reactive state
			currentGeneration.value = data.generation;
			currentFitness.value = data.fitness;

			bestStuff.value = data.stuff;
			bestStats.value = data.stats;
		} else if (data.type === "complete") {
			console.log("Algorithm complete!", data.stuff, data.stats);
			algorithmRunning.value = false;
			// Final result
			bestStuff.value = data.stuff;
			bestStats.value = data.stats;
		} else if (data.type === "error") {
			console.error("Error:", data.message);
			algorithmRunning.value = false;
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
	display: none;
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

.stuff-image {
	width: 70px;
	height: 70px;
	margin: 10px;
	padding: 5px;
	object-fit: contain;
	transition: transform 0.3s ease, opacity 0.3s ease;
	border: 2px solid #ddd;
	border-radius: 5px;

	transition: transform 0.5s ease, opacity 0.5s ease;
}

.stuff-image[src]:not([src=""]) {
	animation: lightUp 0.5s ease-out;
}

@keyframes lightUp {
	0% {
		transform: scale(1);
		opacity: 1;
	}
	50% {
		transform: scale(1.1);
		opacity: 1.5;
	}
	100% {
		transform: scale(1);
		opacity: 1;
	}
}

.card {
	background-color: #161616;
	border-radius: 20px;
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
	transition: 0.3s;
}
</style>
