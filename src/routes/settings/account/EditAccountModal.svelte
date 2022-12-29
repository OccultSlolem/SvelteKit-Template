<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { type User, onAuthStateChanged } from 'firebase/auth';
  import { userStore } from '$lib/Firebase';

  let user: User | null = null;
  let authProvider: string | null = null;
  let email = '';
  let displayName = '';
  let oldPassword = '';
  let newPassword = '';
  let confirmPassword = '';
  let userIsPassword = false;
  let needsReauth = false;

  $: {
    authProvider = user?.providerData[0].providerId;
    userIsPassword = authProvider === 'password';

    needsReauth = email !== user?.email || newPassword !== '';
  }

  userStore.subscribe((value: User | null) => {
    user = value;
  });

  onMount(() => {
    if (!user) {
      goto('/');
    }
  });
  
  const formGroups = [
    {
      label: 'Email',
      placeholder: 'Email',
      defaultValue: user?.email,
      type: 'email',
      bind: (e: Event) => { email = (e.target as HTMLInputElement).value }
    },
    {
      label: 'Username',
      placeholder: 'Username',
      defaultValue: user?.displayName,
      type: 'text',
      bind: (e: Event) => { displayName = (e.target as HTMLInputElement).value }
    },
    {
      label: 'Old Password',
      placeholder: '********',
      defaultValue: '',
      type: 'password',
      bind: (e: Event) =>  { oldPassword = (e.target as HTMLInputElement).value }
    },
    {
      label: 'New Password',
      placeholder: '********',
      defaultValue: '',
      type: 'password',
      bind: (e: Event) => { newPassword = (e.target as HTMLInputElement).value }
    },
    {
      label: 'Confirm Password',
      placeholder: '********',
      defaultValue: '',
      type: 'password',
      bind: (e: Event) => { confirmPassword = (e.target as HTMLInputElement).value }
    }
  ];

  function updateAccount() {
    
  }
</script>

<!-- Invisible checkbox to toggle the modal -->
<input type="checkbox" id="edit-account" class="modal-toggle" />

<div class="modal" id="edit-account">
  <div class="modal-box">
    <div class="flex items-center justify-start">
      <label for="edit-account" class="btn btn-ghost btn-sm rounded-btn">
        X
      </label>
      <h1 class="font-bold text-lg">Edit account</h1>
    </div>
    <div class="modal-body">

      {#each formGroups as item}
        {#if item.type == "password" && !userIsPassword}
        <!-- Do nothing. Do not show password changers if user is not a password account. -->
        {:else}
          <label class="input-group pt-2 pb-2">
            <span class="text-sm">{item.label}</span>
            <!-- Disable email field if user is not a password account. -->
            <input 
              type={item.type}
              value={item.defaultValue}
              placeholder={item.placeholder}
              disabled={item.type == "email" && !userIsPassword}
              class="input input-bordered w-full"
              on:input={item.bind}
            />
          </label>
        {/if}
      {/each}
      

      <div class="divider"></div>

      <button class="btn btn-primary" on:click={updateAccount}>
        Update Account
      </button>
    </div>
  </div>
</div>