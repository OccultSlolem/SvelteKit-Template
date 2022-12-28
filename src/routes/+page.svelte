<!-- Front page -->
<script lang="ts">
	import "../tailwind.css";
	import SignInModal from "../components/SignInModal.svelte";
	import SignupModal from "../components/SignupModal.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<SignInModal />
<SignupModal />

<div class="hero min-h-screen bg-base-300">
	<div class="hero-content text-center">
		<div class="max-w-md">
			<h1 class="text-5xl font-bold">Template!</h1>
			<p class="mt-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>
		</div>
	</div>
</div>