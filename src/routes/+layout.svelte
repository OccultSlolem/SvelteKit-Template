<script lang="ts">
	import Footer from '../footer/Footer.svelte';
	import Navbar from '../components/Navbar.svelte';
	import SvgIcon from '@jamescoyle/svelte-icon';
	import { mdiHome, mdiAccount, mdiEmail } from '@mdi/js';

	// import './styles.css';

	const sidebarMenuItems = [
		{
			name: 'Home',
			icon: mdiHome,
			link: '/'
		},
		{
			name: 'About',
			icon: mdiAccount,
			link: '/about'
		},
		{
			name: 'Contact',
			icon: mdiEmail,
			link: '/contact'
		}
	]
</script>

<!-- On mobile screens, the drawer will be used for navigation -->
<!-- On desktop screens, the navbar will be used for navigation -->

<div class="app">
	<div class="drawer">
	  <!-- Invisible drawer toggle checkbox to programmatically close/open drawer -->
	  <input id="page-drawer" type="checkbox" class="drawer-toggle invisible" />
  
	  <div class="drawer-content">
		<!-- Page content goes here -->
		<Navbar />
  
		<main>
		  <slot />
		</main>
  
		<Footer />
	  </div>
  
	  <div class="drawer-side">
		<label for="page-drawer" class="drawer-overlay"></label>
		<!-- Sidebar stuff goes here -->
		<ul class="menu p-4 w-64 bg-base-100 text-base-content">
		  {#each sidebarMenuItems as item}
			<li>
			  <a href="#" class="flex pl-2 justify-center items-center">
				{item.name}
				<SvgIcon type="mdi" path={item.icon} />
			  </a>
			</li>
		  {/each}
		</ul>
  
		<!-- Drawer overlay (dark overlay that covers the screen while open) -->
	  </div>
	</div>
  </div>
  