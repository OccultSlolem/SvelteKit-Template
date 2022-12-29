<script lang="ts">
  import "../../../tailwind.css";
  import SvgIcon from "@jamescoyle/svelte-icon";
  import { 
    mdiAccountCircleOutline,
    mdiAccountEdit,
    mdiTextAccount,
    mdiAccountRemove,
  } from "@mdi/js";
  import { goto } from "$app/navigation";

  const settings = [
    {
      title: "Edit account details",
      icon: mdiAccountEdit,
      modal: "edit-account",
    },
    {
      title: "Download your data",
      icon: mdiTextAccount,
      modal: "download-data",
    },
    {
      title: "Delete your account",
      icon: mdiAccountRemove,
      modal: "delete-account",
    }
  ]

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      const checkbox = document.getElementById("download-data") as HTMLInputElement;
      checkbox.checked = false;
    }
  }
  
</script>
  

<!-- Download data modal -->

<svelte:window on:keydown="{handleKeydown}" />

<!-- Invisible checkbox to toggle the modal -->
<input type="checkbox" id="download-data" class="modal-toggle" />

<div class="modal" id="download-data">
  <div class="modal-box">
    <div class="flex items-center justify-start">
      <label for="download-data" class="btn btn-ghost btn-sm rounded-btn">
        X
      </label>
      <h1 class="font-bold text-lg">Download your data</h1>
    </div>
    <div class="modal-body">
      <p class="text-base">
        You can download your data in a JSON file. This file contains all of your data, including your account details, your posts, your comments, and your likes.
      </p>
      <div class="flex justify-center items-center">
        <button class="btn btn-primary btn-sm rounded-btn">
          Download data
        </button>
      </div>
    </div>
  </div>
</div>
  
<div class="flex justify-center align-middle">
  <div class="hero min-h-screen w-4/5 bg-base-200">
    <div class="hero-content">
      <!-- align middle, stack vertical -->
      <div class="flex flex-col justify-center items-center">
        <SvgIcon type="mdi" class="h-12 w-12" path={mdiAccountCircleOutline} />
        <h1 class="text-5xl pb-5 font-bold">Account Settings</h1>
        
        {#each settings as menu}
          <label
            class="flex justify-center items-center cursor-pointer"
            for={menu.modal}
          >
            <SvgIcon class="w-8 h-8 pr-2" type="mdi" path={menu.icon} />
            <h1>{menu.title}</h1>
          </label>
          <div class="divider"></div>
        {/each}

      </div>
    </div>
  </div>
</div>
  