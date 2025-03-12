<template>
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
			<LeftSection />
		</div>
		<div style="flex: 2">
			<MiddleSection />
		</div>
		<div style="flex: 1">
			<RightSection />
		</div>
	</div>
</template>

<script setup lang="ts">
import LeftSection from "../components/LeftSection.vue";
import MiddleSection from "../components//MiddleSection.vue";
import RightSection from "../components//RightSection.vue";
</script>
