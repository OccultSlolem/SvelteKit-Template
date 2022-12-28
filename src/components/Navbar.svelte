<script lang="ts">

    import "../tailwind.css";
    import SvgIcon from '@jamescoyle/svelte-icon';
    import { mdiMenu, mdiHome, mdiAccount, mdiMessage } from '@mdi/js';

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

    <!-- {#if user} -->
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
    <!-- {/if} -->

    <div class="navbar-end">
      <!-- DaisyUI avatar with a dropdown -->
      <!-- {#if user} -->
        <div class="dropdown dropdown-end">
          <div tabindex="0" class="m-1 btn btn-ghost rounded-full">
            <div class="avatar online avatar-placeholder">
              <span>u</span>
            </div>
            <!-- <img src={user.photo} alt="Avatar" class="avatar" /> -->
          </div>
          <ul tabindex="0" class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52">
            <!-- {#if user} -->
              <li>a</li>
              <li>b</li>
            <!-- {:else}
            {/if} -->
          </ul>
        </div>
      <!-- {/if} -->
    </div>
</div>