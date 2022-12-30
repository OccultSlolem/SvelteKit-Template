<!-- SEE: src/lib/stores/Reauth.ts -->

<script lang="ts">
  import "../tailwind.css";
  import SvgIcon from "@jamescoyle/svelte-icon";
  import { mdiInformationOutline, mdiAlertCircle } from "@mdi/js";
  import { userStore } from "$lib/Firebase";
  import { reauthFunctionStore } from "$lib/stores/Reauth";
  import { 
    type User,
    reauthenticateWithCredential,
    GoogleAuthProvider,
    EmailAuthProvider,
    OAuthProvider
  } from "firebase/auth";

  let user: User | null;
  let followOnFunction: () => void;

  reauthFunctionStore.subscribe((value: () => void) => {
    followOnFunction = value;
  });

  userStore.subscribe((value: User | null) => {
    user = value;
  });

  const googleAuthProvider = new GoogleAuthProvider();
  const appleAuthProvider = new OAuthProvider('apple.com');

  $: authProvider = user?.providerData[0].providerId;
  let error: string | undefined = undefined;
  let is_loading = false;
  let password = '';

  function closeModal() {
    const modal = document.getElementById('reauth-modal') as HTMLInputElement;
    modal.checked = false;
    reauthFunctionStore.set(() => {});
  }

  function handleSuccess() {
    is_loading = false;
    closeModal();
    const fn = followOnFunction;
    reauthFunctionStore.set(() => {});
    fn();
  }

  function handleError(err: any, suppressConsole = false) {
    is_loading = false;
    const errorCode = err.code;
    const errorMessage = err.message;
    
    if (import.meta.env.DEV && !suppressConsole) console.error(errorCode, errorMessage);

    setTimeout(() => {
      error = undefined;
    }, 5000);

    if ((typeof err) === "string") {
      error = err;
      return;
    }

    if ((typeof err) != "object") {
      error = "An unknown error occurred.";
      return;
    }

    switch (errorCode) {
      // TODO
    }
  }

  function reauthWithPassword() {
    if (is_loading) return;
    if (!user) return;
    if (password === '') {
      handleError('Please enter your password');
      return;
    }

    is_loading = true;

    const credential = EmailAuthProvider.credential(user.email, password);
    reauthenticateWithCredential(user, credential)
      .then(() => {
        handleSuccess();
      })
      .catch((err: any) => {
        is_loading = false;
        handleError(err);
      });
  }

  // TODO: Add more providers if you are using them

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      closeModal();
    }
  }
</script>

<svelte:window on:click={closeModal} />

<!-- Invisible checkbox to toggle the modal -->
<!-- You can programatically open/close the modal by accessing this element in the DOM -->
<input type="checkbox" id="reauth-modal" class="modal-toggle" />

<div class="modal">
  <div class="modal-box">
    <!-- Header -->
    <div class="flex items-center">
      <label for="reauth-modal" class="modal-close">
        X
      </label>
      <h1 class="font-bold text-lg">Reauthenticate</h1>
    </div>
    <div class="flex items-center">
      <SvgIcon type="mdi" path={mdiInformationOutline} />
      <h2>Please enter your password again to confirm that action.</h2>
    </div>

    <!-- Body -->
    <div class="form-control">
      <label class="input-group mt-2 mb-2">
        <span>Email</span>
        <input 
          type="email"
          placeholder={user.email}
          class="input input-bordered w-full"
          disabled
        />
      </label>
      
      {#if authProvider === 'password'}
      <label class="input-group mt-2 mb-2">
        <span>Password</span>
        <input 
          type="password"
          placeholder="Password"
          class="input input-bordered w-full"
          bind:value={password}
        />
      </label>
      {/if}
    </div>

    <!-- Provider buttons -->
    <!-- TODO: Add more providers if you are using them -->
    {#if authProvider === 'google.com'}
    <button class="btn btn-primary">
      Sign in with Google
    </button>
    {:else if authProvider === 'apple.com'}
    <button class="btn btn-primary">
      Sign in with Apple
    </button>
    {/if}

    <div class="divider"></div>

    <!-- Buttons -->
    <div class="flex justify-end">
      <button
        class="btn btn-ghost"
        on:click={closeModal}
      >
        Cancel
      </button>
      <button
        class="btn btn-primary"
      >
        Reauthenticate
      </button>
    </div>

    <!-- Error box -->
    {#if error}
      <div class="alert alert-error">
        <SvgIcon type="mdi" path={mdiAlertCircle} />
        <div class="alert-description">{error}</div>
      </div>
    {/if}
  </div>
</div>