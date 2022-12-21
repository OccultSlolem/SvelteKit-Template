<script>
	import Navbar from './Navbar.svelte';
	// import './styles.css';
</script>

<div class="app">
	<Navbar />

	<main>
		<slot />
	</main>

	<footer>
		<p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p>
	</footer>
</div>
