<script lang="ts">
  import { userStore, auth } from "$lib/Firebase";
  import {
    type User,
    deleteUser,
    reauthenticateWithCredential,
    reauthenticateWithPopup,
    EmailAuthProvider,
    GoogleAuthProvider,
    OAuthProvider 
  } from "firebase/auth";
  import { goto } from "$app/navigation";

  const googleProvider = new GoogleAuthProvider();
  const appleProvider = new OAuthProvider('apple.com');

  let error: string | undefined = undefined;
  let user: User | null = null;
  let deleteConsent = false;
  let isLoading = false;
  let hasReauthed = false;
  let deleteReady = true;
  let password = '';
  $: authProvider = user?.providerData[0].providerId;
  $: {
    // Delete is ready when the user has checked the box and has reauthenticated
    // If user is password, they must have entered their password
    // If user is not password, they must have reauthenticated
    deleteReady = deleteConsent.checked 
      && (
        (authProvider === 'password' && password === '')
        || (authProvider != 'password' && hasReauthed)
      );
  }

  userStore.subscribe((value: User | null) => {
    user = value;
  });

  function handleFail(err: any, suppressConsole = false) {
    const errorCode = err.code;
    const errorMessage = err.message;
    isLoading = false;
    
    if (import.meta.env.DEV && !suppressConsole) console.error(errorCode, errorMessage);

    setTimeout(() => {
      error = undefined;
    }, 5000);

    if ((typeof err) === "string") {
      error = err;
      return;
    }

    error = "Something went wrong. Please contact support.";
  }

  async function reauthenticateWithProvider() {
    if (isLoading) return;
    isLoading = true;

    function followOn() {
      isLoading = false;
      hasReauthed = true;
    }

    switch (authProvider) {
      case 'google.com':
        await reauthenticateWithPopup(auth, googleProvider)
        .catch((err: any) => { handleFail(err); });

        followOn();
        break;
      case 'apple.com':
        reauthenticateWithPopup(auth, appleProvider)
        .then(followOn)
        .catch((err: any) => { handleFail(err); });
        break;
      default:
        handleFail("Something went wrong. Please contact support.", true);
        return;
    }
  }

  function startDelete() {
    if (isLoading) return;
    if (!deleteConsent) {
      error = "You must check the box to confirm you want to delete your account.";
      return;
    }
    if (authProvider === 'password' && password === '') {
      error = "You must enter your password to confirm you want to delete your account.";
      return;
    }
    
    function deleteAccount() {
      isLoading = true;
      deleteUser(auth)
        .then(() => {
          goto('/');
        })
        .catch((err: any) => {
          handleFail(err);
        });
    }

    switch (authProvider) {
      case 'password':
        const credential = EmailAuthProvider.credential(user?.email, password);
        reauthenticateWithCredential(auth, credential)
        .then(deleteAccount)
        .catch((err: any) => { handleFail(err); });
        break;
    }
  }
  
</script>

<!-- Invisible checkbox to toggle the modal -->
<input type="checkbox" id="delete-account" class="modal-toggle" />

<div class="modal" id="delete-account">
  <div class="modal-box">
    <div class="flex items-center justify-start">
      <label for="delete-account" class="btn btn-ghost btn-sm rounded-btn">
        X
      </label>
      <h1 class="font-bold text-lg">Delete your account</h1>
    </div>

    <!-- Body -->
    <p class="text-base">
      We're sorry to see you go. If you delete your account now, here's what will happen:
    </p>
    <br />

    <ul>
      <li>Your account will be permanently unable to access.</li>
      <li>
        Your data will be deleted or retained in accordance with the 
        <a href="/terms" class="link">Terms of Service</a> and 
        <a href="/privacy" class="link">Privacy Policy.</a>
      </li>    
    </ul>
    <br />

    <p class="text-base">
      Make sure to download your data if you want to keep it.
    </p>

    <br />

    {#if authProvider === 'password'}
      <p class="font-bold">
        Please enter your password to confirm.
      </p>
      
      <div class="pb-2">
        <label class="input-group">
          <span>Password</span>
          <input
            type="password"
            placeholder="*******"
            class="input input-bordered w-full"
          />
        </label>
      </div>
    {:else}
      <p class="font-bold">
        Please confirm your identity to delete your account.
      </p>
      <div class="flex justify-center items-center">
        <button class="btn btn-primary" on:click={reauthenticateWithProvider}>Reauthenticate</button>
      </div>
    {/if}
    <div class="pb-2">
      <div class="form-control">
        <label class="label cursor-pointer">
          <span class="label-text">I understand that I will not be able to recover my account</span> 
          <input 
            type="checkbox"
            id="delete-consent"
            class="checkbox checkbox-warning"
            bind:checked={deleteConsent}
          />
        </label>
      </div>
    </div>

    <div class="flex justify-center items-center">
      {#if !deleteReady}
      <button class="btn btn-disabled rounded-btn" disabled>
        Delete Account
      </button>
      {:else}
      <button class="btn btn-warning rounded-btn" on:click={startDelete}>
        Delete Account
      </button>
      {/if}
    </div>
  </div>
</div>