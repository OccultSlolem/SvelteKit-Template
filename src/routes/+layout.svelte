<script lang="ts">
  import Footer from '../footer/Footer.svelte';
  import Navbar from '../components/Navbar.svelte';
  import SvgIcon from '@jamescoyle/svelte-icon';
  import type { PageData } from './$types';
  import { goto } from '$app/navigation';
  import { type User } from 'firebase/auth';
  import ReauthenticateModal from '../components/ReauthenticateModal.svelte';
  import { userStore } from '$lib/Firebase';
  import { notificationStore } from '$lib/stores/Notifications';
  import { 
    mdiHome,
    mdiAccount,
    mdiMessage,
    mdiInformationOutline,
    mdiCheckCircleOutline,
    mdiAlertCircleOutline,
    mdiAlertBoxOutline,
  } from '@mdi/js';

  let user: User | null = null;
  let currentNotification: {severity: string, message: string} | null = null;
  let notificationIcon = mdiInformationOutline;
  let notificationAlertClass = 'alert-info';

  $: {
    if (currentNotification)
    switch (currentNotification.severity) {
      case 'success':
        notificationIcon = mdiCheckCircleOutline;
        notificationAlertClass = 'alert-success';
        break;
      case 'error':
        notificationIcon = mdiAlertCircleOutline;
        notificationAlertClass = 'alert-error';
        break;
      case 'warning':
        notificationIcon = mdiAlertBoxOutline;
        notificationAlertClass = 'alert-warning';
        break;
      case 'info':
      default:
        notificationIcon = mdiInformationOutline;
        notificationAlertClass = 'alert-info';
        break;
    }
  }

  userStore.subscribe((value: User | null) => {
    user = value;
  });

  notificationStore.subscribe((value: {severity: string, message: string} | null) => {
    currentNotification = value;
  });

  export let data: PageData;

  const navItems = [
    // On desktop, these will be shown in the center of the navbar
    // On mobile, these will be shown as a sidebar
    {
      name: 'Home',
      icon: mdiHome,
      link: '/',
    },
    {
      name: 'Account',
      icon: mdiAccount,
      link: '/account',
    },
    {
      name: 'Messaging',
      icon: mdiMessage,
      link: '/messaging',
    },
  ];
</script>

<!-- On mobile screens, the drawer will be used for navigation -->
<!-- On desktop screens, the navbar will be used for navigation -->

<div class="app">
  <div class="drawer">
    <!-- Invisible drawer toggle checkbox to programmatically close/open drawer -->
    <input id="page-drawer" type="checkbox" class="drawer-toggle invisible" />

    <div class="drawer-content">
      <!-- Page content goes here -->
      <Navbar {navItems} />
      
      {#if user}
        <ReauthenticateModal />
      {/if}
      <main>
        <slot />
      </main>

      <!-- DaisyUI alert box that follows the screen around -->
      {#if currentNotification}
        <div class="alert {notificationAlertClass} fixed bottom-0 w-max m-4 z-50">
          <SvgIcon type="mdi" path={notificationIcon} />
          <span>{currentNotification.message}</span>
        </div>
      {/if}

      <Footer />
    </div>

    <div class="drawer-side">
      <label for="page-drawer" class="drawer-overlay" />
      <!-- Sidebar stuff goes here -->
      <ul class="menu p-4 w-64 bg-base-100 text-base-content">
        {#each navItems as item}
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
