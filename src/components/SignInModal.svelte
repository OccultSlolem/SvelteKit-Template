<script lang="ts">
  import {
    type User,
    type Auth,
    GoogleAuthProvider,
    OAuthProvider,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup
  } from "firebase/auth";
  import { mdiAlertCircle, mdiInformationOutline } from '@mdi/js';
  import SvgIcon from '@jamescoyle/svelte-icon';
  import { auth } from '$lib/Firebase';

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

  const formGroups = [
    {
      label: "Email",
      placeholder: "info@site.com",
      type: "email",
      // Sets relevant variables when the input changes.
      bind: (e: Event) => { email = (e.target as HTMLInputElement).value }
    },
    {
      label: "Password",
      placeholder: "********",
      type: "password",
      bind: (e: Event) => { password = (e.target as HTMLInputElement).value }
    }
  ]

  /**
   * When true, prevents email enumeration by only displaying a generic
   * "password reset email sent" message.
   */
  const PREVENT_EMAIL_ENUMERATION = true;
  const genericPassResetMessage = "If an account exists with that email, \
  a password reset email has been sent."

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
   * Changes between sign in and reset password mode. Clears the email and password fields.
   */
   function changeMode() {
    is_forgot_password = !is_forgot_password;
    email = "";
    password = "";
  }

  function handleSuccess() {
    const modal = document.getElementById("signin-modal") as HTMLInputElement;
    modal.checked = false;
    is_loading = false;
    is_forgot_password = false;
    email = "";
    password = "";
  }

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
      if (typeof err === "string") error = err;
      else error = "Invalid email address.";
      return;
    }

    switch (errorCode) {
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
   * Tell the user something with the info box for 7.5 seconds.
   * @param message
   */
  function tellUser(message: string) {
    info = message;
    setTimeout(() => {
      info = undefined;
    }, 7500);
  }

  /**
   * Send a password reset email to the user.
   */
  function handleResetPassword() {
    if (is_loading) return;
    // validate
    if (email === "") {
      handleFail("Please enter your email address.", true);
      return;
    }
    // check email with regex
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      handleFail("Please enter a valid email address.", true);
      return;
    }



    sendPasswordResetEmail(auth, email)
      .then(() => {
        tellUser(genericPassResetMessage);
      })
      .catch((err: any) => {
        if (PREVENT_EMAIL_ENUMERATION) {
          tellUser(genericPassResetMessage);
          return;
        }
        handleFail(err)
      });
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
      .then((userCredential: User) => handleSuccess())
      .catch((err: any) => handleFail(err));
  }

  function handleGoogleSignIn() {
    if (is_loading) return;
    is_loading = true;
    signInWithPopup(auth, googleProvider)
      .then((_: any) => handleSuccess())
      .catch((err: any) => handleFail(err));
  }

  function handleAppleSignIn() {
    // TODO: pay daddy steve jobs for this (Apple Developer Program)
    if (is_loading) return;
    is_loading = true;
    // No substantial .then as we're using a state change listener to handle navigation
    signInWithPopup(auth, appleProvider)
      .then((_: any) => handleSuccess())
      .catch((err: any) => handleFail(err));
  }

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
        <h2
          class="font-bold text-lg"
        >
          Log in
        </h2>
      {/if}
    </div>
    <!-- Body -->
    <div class="modal-body">
      <form>
        <div class="form-control">
          <!-- Inputs -->
          {#each formGroups as item}
            <label class="input-group pt-2 pb-2">
              <span>{item.label}</span>
              <input 
                type={item.type}
                placeholder={item.placeholder}
                class="input input-bordered w-full"
                on:input={item.bind}
              />
            </label>
          {/each}
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

        <!-- Error / Info Boxes -->
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
