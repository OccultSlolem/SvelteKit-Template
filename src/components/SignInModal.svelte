<script lang="ts">
  import {
    type User,
    GoogleAuthProvider,
    OAuthProvider,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup
  } from "firebase/auth";
  import { auth } from "../routes/Firebase.svelte";
  import { mdiAlertCircle, mdiInformationOutline } from '@mdi/js';
  import SvgIcon from '@jamescoyle/svelte-icon';

  const appleProvider = new OAuthProvider("apple.com");
  appleProvider.addScope('email');
  const googleProvider = new GoogleAuthProvider();

  let is_forgot_password = false;
  let is_loading = false;

  let error: string | undefined = undefined;
  let info: string | undefined = undefined;

  let email = "";
  let password = "";

  /**
   * Changes between sign in and reset password mode. Clears the email and password fields.
   */
  function changeMode() {
    is_forgot_password = !is_forgot_password;
    email = "";
    password = "";
  }

  /**
   * Respond to keydown events. Closes the modal on escape.
   *
   * @param e The keydown event.
   */
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      const modal = document.getElementById("signin-modal");
      modal.checked = false;

      // Delay other resets by 250 ms to allow the modal to close
      // before anything else changes.
      setTimeout(() => {
        error = undefined;
        info = undefined;
        is_loading = false;
        is_forgot_password = false;
        email = "";
        password = "";
      }, 250);
    }
  };

  /**
   * Handle the sign in form submission. Logs error if in dev.
   *
   * @param err The auth error.
   * @param suppressConsole If true, will not log the error to the console.
   */
  function handleFail(err: any, suppressConsole = false) {
    const errorCode = err.code;
    const errorMessage = err.message;
    is_loading = false;
    
    if (import.meta.env.DEV && !suppressConsole) console.error(errorCode, errorMessage);

    setTimeout(() => {
      error = undefined;
    }, 5000);

    if (is_forgot_password) {
      error = "Failed to send password reset email. Please check your email address.";
      return;
    }

    switch (errorMessage) {
      case "auth/user-disabled":
        error = "Your account has been disabled. Please contact support.";
        break;
      case "auth/popup-closed-by-user":
        // Do nothing. User closed the popup.
        break;
      case "auth/invalid-email":
      case "auth/user-not-found":
      case "auth/wrong-password":
      default:
        error = "Invalid email or password.";
        break;
    }
  }

  /**
   * Tell the user something with the info box for 5 seconds.
   * @param message
   */
  function tellUser(message: string) {
    info = message;
    setTimeout(() => {
      info = undefined;
    }, 5000);
  }

  /**
   * Send a password reset email to the user.
   */
  function handleResetPassword() {
    if (is_loading) return;
    sendPasswordResetEmail(auth, email)
      .then(() => {
        tellUser("Password reset email sent. Please check your email.");
      })
      .catch((err: any) => handleFail(err));
  }

  /**
   * Handle the sign in form submission.
   */
  function handlePasswordSignIn() {
    if (is_loading) return;
    // validate
    if (email === "") {
      handleFail("Please enter your email address.", true);
      return;
    }
    if (password === "") {
      handleFail("Please enter your password.", true);
      return;
    }
    if (password.length < 6) {
      handleFail("Password must be at least 6 characters.", true);
      return;
    }

    is_loading = true;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential: User) => {
        is_loading = false;
        // Signed in
        const user = userCredential.user;
        // State change listener will handle navigation from here
        // (See: /src/Firebase.ts)
      })
      .catch((err: any) => handleFail(err));
  }

  function handleGoogleSignIn() {
    if (is_loading) return;
    is_loading = true;
    signInWithPopup(auth, googleProvider)
      .then(() => is_loading = false)
      .catch((err: any) => handleFail(err));
  }

  function handleAppleSignIn() {
    // TODO: pay daddy steve jobs for this (Apple Developer Program)
    if (is_loading) return;
    is_loading = true;
    // No substantial .then as we're using a state change listener to handle navigation
    signInWithPopup(auth, appleProvider)
      .then(() => is_loading = false)
      .catch((err: any) => handleFail(err));
  }

  const signInOptions = [
    {
      name: "Sign in with Google",
      follow: handleGoogleSignIn,
    },
    {
      name: "Sign in with Apple",
      follow: handleAppleSignIn,
    },
  ]
</script>

<svelte:window on:keydown="{handleKeydown}" />

<!-- Invisible checkbox to toggle the modal -->
<!-- You can programatically open/close the modal by accessing this element in the DOM -->
<input type="checkbox" id="signin-modal" class="modal-toggle" />

<div class="modal">
  <div class="modal-box">
    <!-- Header -->
    <div class="flex items-center">
      {#if is_forgot_password}
        <button 
          for="signin-modal"
          class="btn btn-ghost"
          on:click={changeMode}
        >
          <!-- &lt; = less than symbol = "<" -->
          &lt;&lt; Back
        </button>
        <h2 class="font-bold text-lg">Forgot password</h2>
      {:else}
        <label
          for="signin-modal"
          class="btn btn-square btn-ghost"
        >
          X
        </label>
        <button
          class="font-bold text-lg"
          on:click={handlePasswordSignIn}
        >
          Log in
        </button>
      {/if}
    </div>
    <!-- Body -->
    <div class="modal-body">
      <form>
        <div class="form-group">

          <label for="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            class="input w-full"
            bind:value={email}
          />

        {#if !is_forgot_password}
          <label for="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            class="input w-full"
            bind:value={password}
          />
        {/if}
        </div>

        <div class="divider"></div>

        <!-- Buttons -->
        {#if is_forgot_password}
          <div class="form-group">
            <button class="btn btn-ghost" on:click={handleResetPassword}>
              Send Password Reset Email
            </button>
          </div>
        {:else}
          <div class="form-group">
            <button 
              class="btn btn-ghost"
              on:click={handlePasswordSignIn}
            >
              Log in
            </button>
            <label 
              for="forgot-modal"
              class="btn btn-ghost"
              on:click={changeMode}
            >
              Forgot password?
            </label>
          </div>
          <div class="form-group">
            <!-- Sign in with google, apple, etc -->
            {#each signInOptions as option}
              <button
                class="btn btn-ghost"
                on:click={option.follow}
              >
                {option.name}
              </button>
            {/each}
          </div>
        {/if}

        <!-- Error Box -->
        {#if error}
          <div class="alert alert-error">
            <SvgIcon type="mdi" path={mdiAlertCircle} />
            {error}
          </div>
        {/if}

        {#if info}
          <div class="alert alert-info">
            <SvgIcon type="mdi" path={mdiInformationOutline} />
            {info}
          </div>
        {/if}

      </form>
    </div>
  </div>
</div>
