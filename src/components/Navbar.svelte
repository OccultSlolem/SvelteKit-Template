<script lang="ts">
  import "../tailwind.css";
  import SignInModal from "./SignInModal.svelte";
  import SvgIcon from "@jamescoyle/svelte-icon";
  import { mdiMenu, mdiHome, mdiAccount, mdiMessage } from "@mdi/js";
  // import { type User } from "firebase/auth";
  import { auth, userStore } from "$lib/Firebase";
  import { goto } from "$app/navigation";
  import { type User, signOut } from "firebase/auth";
  
  export let navItems: { name: string; icon: string; link: string }[] = [];

  let user: User | null;

  userStore.subscribe((value: User | null) => {
    user = value;
  });

  function handleSignout() {
    signOut(auth);
    goto("/");
  }
</script>

<div class="navbar bg-base-100">
  <div class="navbar-start">
    <!-- Sidebar button -->
    <label
      for="page-drawer"
      class="btn btn-square md:hidden btn-ghost drawer-button"
    >
      <SvgIcon type="mdi" path={mdiMenu} />
    </label>
    <a rel="external" href="/" class="btn btn-square btn-ghost">
      <SvgIcon type="mdi" path={mdiHome} />
    </a>
  </div>

  <!-- {#if user} -->
  <div class="navbar-center max-md:hidden">
    <div class="btn-group">
      {#each navItems as item}
        <div class="tooltip tooltip-bottom" data-tip={item.name}>
          <a href={item.link}>
            <button class="btn btn-ghost">
              <SvgIcon type="mdi" path={item.icon} />
            </button>
          </a>
        </div>
      {/each}
    </div>
  </div>
  <!-- {/if} -->

  <div class="navbar-end">
    <!-- DaisyUI avatar with a dropdown -->
    <div class="dropdown dropdown-end">
      <label tabindex="0" class="m-1 btn btn-ghost rounded-full">
        <div class="avatar online avatar-placeholder">
          <span>u</span>
        </div>
        <!-- <img src={user.photo} alt="Avatar" class="avatar" /> -->
      </label>
      <ul
        tabindex="0"
        class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-fit min-w-52"
      >
        {#if user}
          <li>{user.email}</li>
          <div class="divider"></div>
          <li><a href="/settings" class="btn btn-ghost">Settings</a></li>
          <li>
            <button
              class="btn btn-ghost"
              on:click={handleSignout}
            >
              Sign out
            </button>
          </li>
        {:else}
          <li><label for="signin-modal" class="btn btn-ghost">Log in</label></li>
          <li><label for="signup-modal" class="btn btn-ghost">Sign up</label></li>
        {/if} 
      </ul>
    </div>
  </div>
</div>
