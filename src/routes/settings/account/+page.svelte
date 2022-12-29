<script lang="ts">
  import "../../../tailwind.css";
  import SvgIcon from "@jamescoyle/svelte-icon";
  import DeleteAccountModal from "./DeleteAccountModal.svelte";
  import DownloadDataModal from "./DownloadDataModal.svelte";
  import EditAccountModal from "./EditAccountModal.svelte";
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
      const checkboxD = document.getElementById("download-data") as HTMLInputElement;
      const checkboxE = document.getElementById("edit-account") as HTMLInputElement;
      const checkboxDel = document.getElementById("delete-account") as HTMLInputElement;
      checkboxD.checked = false;
      checkboxE.checked = false;
      checkboxDel.checked = false;
    }
  }
  
</script>

<!-- Download data modal -->

<svelte:window on:keydown="{handleKeydown}" />

<DownloadDataModal />
<EditAccountModal />
<DeleteAccountModal />

<div class="flex justify-center align-middle">
  <div class="hero min-h-screen w-4/5 bg-base-200">
    <div class="hero-content">
      <!-- align middle, stack vertical -->
      <div class="flex flex-col justify-center items-center">
        
        <div class="flex items-center">
          <button
            class="btn btn-ghost btn-sm rounded-btn"
            on:click="{() => goto("/settings")}"
          >
            &lt; &lt; Back
          </button>
          <SvgIcon type="mdi" class="h-12 w-12" path={mdiAccountCircleOutline} />
        </div>
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
  