<script lang="ts">

    import "./tailwind.css";
    import SvgIcon from '@jamescoyle/svelte-icon';
    import { mdiMenu, mdiHome, mdiAccount, mdiMessage } from '@mdi/js';
	  import { onAuthStateChanged, type User } from "firebase/auth";
    import auth from "./Firebase.svelte"
    let user: User | null = null;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      user = user;
    })

    const centerNavbarButtons = [
      // These only get shown on desktop screens and when the user is signed in
      {
        name: 'Home',
        icon: mdiHome,
        link: '/'
      },
      {
        name: 'Account',
        icon: mdiAccount,
        link: '/account'
      },
      {
        name: 'Messaging',
        icon: mdiMessage,
        link: '/messaging'
      }
    ]

</script>

    
<div class="navbar bg-base-100">
    <div class="navbar-start">
      <!-- Sidebar button -->
      <label for="page-drawer" class="btn btn-square lg:hidden btn-ghost drawer-button">
        <SvgIcon type="mdi" path={mdiMenu} />
      </label>
      <a rel="external" href="/" class="btn btn-square btn-ghost">
        <SvgIcon type="mdi" path={mdiHome} />
      </a>
    </div>

    {#if user}
      <div class="navbar-center max-md:hidden">
        <div class="btn-group">
          {#each centerNavbarButtons as item}
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
    {/if}

    <div class="navbar-end">
      <!-- TODO: Hover dropdown -->
      <div class="avatar pr-5 placeholder">
        <div class="w-8 rounded-full bg-base-300">
          T
        </div>
      </div>
    </div>
</div>