<script lang="ts">
  import { userStore, auth } from "$lib/Firebase";
  import { type User, deleteUser } from "firebase/auth";
  import { goto } from "$app/navigation";

  $: authProvider = user?.providerData[0].providerId;
  const deleteConsent = document.getElementById('delete-consent') as HTMLInputElement;
  let error: string | undefined = undefined;
  let user: User | null = null;

  userStore.subscribe((value: User | null) => {
    user = value;
  });
  
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
    <div class="modal-body justify-center items-center">
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
      {/if}
      <div class="pb-2">
        <div class="form-control">
          <label class="label cursor-pointer">
            <span class="label-text">I understand that I will not be able to recover my account</span> 
            <input type="checkbox" id="delete-consent" class="checkbox checkbox-warning" />
          </label>
        </div>
      </div>

      <div class="flex justify-center items-center">
        <button class="btn btn-warning rounded-btn">
          Delete Account
        </button>
      </div>
    </div>
  </div>
</div>