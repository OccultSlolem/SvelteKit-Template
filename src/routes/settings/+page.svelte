<script lang="ts">
  import "../../tailwind.css";
  import SvgIcon from "@jamescoyle/svelte-icon";
  import { 
    mdiAccountCircleOutline,
    mdiBellCircleOutline,
    mdiEyeCircleOutline,
    mdiLifebuoy,
    mdiCogOutline
  } from "@mdi/js";
  import { goto } from "$app/navigation";

  const settingsMenu = [
    {
      icon: mdiAccountCircleOutline,
      title: "Account",
      link: "/settings/account",
    },
    {
      icon: mdiBellCircleOutline,
      title: "Notifications",
      link: "/settings/notifications",
    },
    {
      icon: mdiEyeCircleOutline,
      title: "Privacy",
      link: "/settings/privacy",
    },
    {
      icon: mdiLifebuoy,
      title: "Help",
      link: "/settings/help",
    },
  ];
</script>


<div class="flex justify-center align-middle">
  <div class="hero min-h-screen w-4/5 bg-base-200">
    <div class="hero-content">
      <div class="w-max">
        <h1 class="text-5xl pb-5 font-bold">Settings</h1>
        {#each settingsMenu as menu}
          <div 
            class="flex justify-center items-center cursor-pointer"
            on:click={() => { goto(menu.link) }} 
          >
            <SvgIcon class="w-8 h-8 pr-2" type="mdi" path={menu.icon} />
            <h1>{menu.title}</h1>
          </div>
          <div class="divider"></div>
        {/each}
      </div>
    </div>
  </div>
</div>
