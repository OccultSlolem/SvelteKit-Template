<!-- Front page -->
<script lang="ts">
	import "../tailwind.css";
	import SignInModal from "../components/SignInModal.svelte";
	import SignupModal from "../components/SignupModal.svelte";
	import type { PageData } from "./$types";
	import { notificationStore } from "$lib/stores/Notifications";
  import { userStore } from "$lib/Firebase";
  import { type User } from 'firebase/auth';
	export let data: PageData;

  let user: User | null = null;

  userStore.subscribe((value: User | null) => {
    user = value;
  });

	
</script>

{#if !user}
<SignInModal />
<SignupModal />
{/if}

<div class="hero min-h-screen bg-base-300">
	<div class="hero-content text-center">
		<div class="max-w-md">
			<h1 class="text-5xl font-bold">Template!</h1>
			<p class="mt-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>
			<button class="btn" on:click={testNotif}>Alley oop</button>
		</div>
	</div>
</div>