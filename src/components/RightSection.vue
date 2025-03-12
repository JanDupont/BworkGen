<template>
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
				v-for="(value, key) in store.bestStats.value"
				:key="key"
				style="display: flex; justify-content: space-between; align-items: center; width: 100%"
				:style="{ color: resultEffectColor(key, value) }"
			>
				<span>{{ key }}</span>
				<span>{{ value }}</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import * as store from "../store";

function resultEffectColor(key: string, value: number) {
	const requiredValue = store.requiredStats.value[key] || 0;
	if (!requiredValue) return "white";
	if (value >= requiredValue) return "green";
	else if (value >= requiredValue * 0.85) return "yellow";
	else if (value >= requiredValue * 0.75) return "orange";
	else return "red";
}
</script>

<style scoped>
.card {
	background-color: #161616;
	border-radius: 20px;
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
	transition: 0.3s;
}
</style>
