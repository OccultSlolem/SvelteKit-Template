<script lang="ts">
  import Footer from "../footer/Footer.svelte";
  import Navbar from "../components/Navbar.svelte";
  import SvgIcon from "@jamescoyle/svelte-icon";
  import { mdiHome, mdiAccount, mdiMessage } from "@mdi/js";
  import type { PageData } from "./$types";
  import { goto } from "$app/navigation";
  import { type User, onAuthStateChanged } from "firebase/auth";
  import ReauthenticateModal from "../components/ReauthenticateModal.svelte";
  import { userStore } from "$lib/Firebase";

  let user: User | null = null;

  userStore.subscribe((value: User | null) => {
    user = value;
  });

  export let data: PageData;

  const navItems = [
    // On desktop, these will be shown in the center of the navbar
    // On mobile, these will be shown as a sidebar
    {
      name: "Home",
      icon: mdiHome,
      link: "/",
    },
    {
      name: "Account",
      icon: mdiAccount,
      link: "/account",
    },
    {
      name: "Messaging",
      icon: mdiMessage,
      link: "/messaging",
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
