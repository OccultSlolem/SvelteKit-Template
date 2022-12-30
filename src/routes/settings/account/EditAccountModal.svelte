<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import SvgIcon from '@jamescoyle/svelte-icon';
  import { mdiAlertCircleOutline } from '@mdi/js';
  import { userStore, functions } from '$lib/Firebase';
  import { type User, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
  import { httpsCallable } from 'firebase/functions';
  import { notificationStore } from '$lib/stores/Notifications';

  let user: User | null = null;
  let authProvider: string | null = null;
  let error: string | null = null;
  let email = '';
  let displayName = '';
  let oldPassword = '';
  let newPassword = '';
  let confirmPassword = '';
  let userIsPassword = false;

  $: {
    authProvider = user?.providerData[0].providerId;
    userIsPassword = authProvider === 'password';    
  }

  userStore.subscribe((value: User | null) => {
    user = value;
    displayName = user?.displayName || '';
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

  function handleFail(message: string) {
    error = message;
    setTimeout(() => {
      error = null;
    }, 5000);
  }

  function closeModal() {
    const editAccount = document.getElementById('edit-account') as HTMLInputElement;
    editAccount.checked = false;
  }

  function tellUserAndClose(message: string, severity = 'info') {
    const msg = {
      message: message,
      severity: severity
    }

    notificationStore.set(msg);
    setTimeout(() => {
      notificationStore.set(null);
    }, 5000);

    closeModal();    
  }

  async function updateAccount() {
    const userChangedPassword = newPassword !== '';
    const userChangedDisplayName = displayName !== user?.displayName;
    const userNeedsReauth = email !== user?.email || newPassword !== '';

    if (userChangedPassword && oldPassword === '') {
      handleFail('You must enter your old password to update your account.');
      return;
    }
    if (userChangedPassword && newPassword !== confirmPassword) {
      handleFail('Your new password and confirmation password do not match.');
      return;
    }
    if (userChangedPassword && newPassword.length < 6) {
      handleFail('Your new password must be at least 6 characters long.');
      return;
    }
    if (userChangedDisplayName && displayName.length < 3) {
      handleFail('Your new username must be at least 3 characters long.');
      return;
    }
    if (userChangedDisplayName && displayName.length > 20) {
      handleFail('Your new username must be less than 20 characters long.');
      return;
    }
    let promises = [];
    if (userNeedsReauth && userIsPassword) {
      const credential = EmailAuthProvider.credential(email, oldPassword);
      const reauthenticate = reauthenticateWithCredential(user, credential);
      promises.push(reauthenticate);
    }
    if (userChangedDisplayName) {
      const updateProfile = httpsCallable(functions, 'updateDisplayName');
      promises.push(updateProfile({ displayName: displayName }));
    }
    if (userChangedPassword) {
      const updatePassword = updatePassword(user, newPassword);
      promises.push(updatePassword);
    }

    if (promises.length === 0) {
      closeModal();
      return;
    }
    
    await Promise.all(promises)
      .then(() => {
        tellUserAndClose('Your account has been updated.');
      })
      .catch((err: any) => {
        if (import.meta.env.DEV) console.error(err)
        tellUserAndClose('Something went wrong. Please try again later.', 'error');
      });
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
          <label class="input-group mt-2 mb-2">
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
    {#if error}
      <div class="alert alert-error mt-2">
        <SvgIcon type="mdi" path={mdiAlertCircleOutline} />
        {error}
      </div>
    {/if}
  </div>
</div>