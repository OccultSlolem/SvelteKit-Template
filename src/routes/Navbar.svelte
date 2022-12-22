<script>

    import "./tailwind.css";
    import SvgIcon from '@jamescoyle/svelte-icon';
    import { mdiMenu, mdiHome } from '@mdi/js';

</script>

    
<div class="navbar bg-base-100">
    <div class="navbar-start">
      <!-- Sidebar button -->
      <label for="page-drawer" class="btn btn-square btn-ghost drawer-button">
        <SvgIcon type="mdi" path={mdiMenu} />
      </label>
      <button class="btn btn-square btn-ghost">
        <SvgIcon type="mdi" path={mdiHome} />
      </button>
    </div>

    <div class="navbar-center max-md:hidden">
      <h1>Template!</h1>
    </div>

    <div class="navbar-end">
      <h1>Template!</h1>
    </div>
</div>