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

  const settingsLink = [
    {
      icon: mdiAccountCircleOutline,
      title: "Account",
      link: "/settings/account",
    },
    {
      icon: mdiLifebuoy,
      title: "Support",
      link: "/settings/support",
    },
  ];

  const modalSettings = [
    {
      icon: mdiEyeCircleOutline,
      title: "Privacy",
      for: "privacy-settings",
    },
    {
      icon: mdiBellCircleOutline,
      title: "Notifications",
      for: "notification-settings",
    }
  ]

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      const checkboxP = document.getElementById("privacy-settings") as HTMLInputElement;
      const checkboxN = document.getElementById("notification-settings") as HTMLInputElement;
      checkboxP.checked = false;
      checkboxN.checked = false;
    }
  }
</script>


<div class="flex justify-center align-middle">
  <div class="hero min-h-screen w-4/5 bg-base-200">
    <div class="hero-content">
      <div class="w-max">
        <h1 class="text-5xl pb-5 font-bold">Settings</h1>
        {#each modalSettings as modal}
          <label for={modal.for} class="flex justify-center items-center cursor-pointer">
            <SvgIcon class="w-8 h-8 pr-2" type="mdi" path={modal.icon} />
            <h1>{modal.title}</h1>
          </label>
          <div class="divider"></div>
        {/each}
        {#each settingsLink as menu}
          <div 
            class="flex justify-center items-center cursor-pointer"
            on:click={() => { goto(menu.link) }} 
          >
            <SvgIcon class="w-8 h-8 pr-2" type="mdi" path={menu.icon} />
            <h1>{menu.title}</h1>
          </div>
          <div class="divider"></div>
        {/each}
        <!-- Privacy settings -->

        
      </div>
    </div>
  </div>
</div>

<!-- Privacy settings modal -->

<svelte:window on:keydown={handleKeydown} />

<input type="checkbox" id="privacy-settings" class="modal-toggle" />

<div class="modal" id="privacy-settings">
  <div class="modal-box">
    <div class="flex items-center justify-start">
      <label for="privacy-settings" class="btn btn-ghost btn-sm rounded-btn">
        X
      </label>
      <h1 class="font-bold text-lg">Privacy Settings</h1>
    </div>
    
    <div class="w-1/2">
      <label class="label cursor-pointer">
        <input type="checkbox" class="toggle" />
        <span class="label-text">Show my profile</span>
      </label>
      <label class="label cursor-pointer">
        <input type="checkbox" class="toggle" />
        <span class="label-text">Allow analytics</span>
      </label>
    </div>
  </div>
</div>

<!-- Notification settings -->

<input type="checkbox" id="notification-settings" class="modal-toggle" />

<div class="modal" id="notification-settings">
  <div class="modal-box">
    <div class="flex items-center justify-start">
      <label for="notification-settings" class="btn btn-ghost btn-sm rounded-btn">
        X
      </label>
      <h1 class="font-bold text-lg">Notification Settings</h1>
    </div>
    
    <div class="w-1/2">
      <label class="label cursor-pointer">
        <input type="checkbox" class="toggle" />
        <span class="label-text">Email</span>
      </label>
      <label class="label cursor-pointer">
        <input type="checkbox" class="toggle" />
        <span class="label-text">SMS</span>
      </label>
    </div>
  </div>
</div>