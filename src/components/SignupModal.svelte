<script lang="ts">
  import "../tailwind.css";
  import { auth } from "$lib/Firebase";
  import { 
    type User,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    OAuthProvider,
    signInWithPopup
  } from "firebase/auth";
  import { mdiAlertCircle, mdiInformationOutline } from '@mdi/js';
  import SvgIcon from '@jamescoyle/svelte-icon';

  const signupOptions = [
    {
      name: "Sign up with Google",
      follow: handleGoogleSignup
    },
    {
      name: "Sign up with Apple",
      follow: handleAppleSignup
    }
  ]

  const appleProvider = new OAuthProvider("apple.com");
  appleProvider.addScope('email');
  const googleProvider = new GoogleAuthProvider();

  let is_loading = false;
  let error: string | undefined = undefined;
  let info: string | undefined = undefined;
  let email = "";
  let password = "";
  let confirmPassword = "";

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
    },
    {
      label: "Confirm Password",
      placeholder: "********",
      type: "password",
      bind: (e: Event) => { confirmPassword = (e.target as HTMLInputElement).value }
    }
  ]

  function closeModal() {
    const modal = document.getElementById("signup-modal") as HTMLInputElement;
    modal.checked = false;

    // Delay other resets by 250 ms to allow the modal to close
    // before anything else changes.
    setTimeout(() => {
      error = undefined;
      info = undefined;
      is_loading = false;
      email = "";
      password = "";
      confirmPassword = "";
    }, 250);
  }

  /**
   * Respond to keydown events. Closes the modal on escape.
   *
   * @param e The keydown event.
   */
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      closeModal()
    }
  };

  function tellUser(message: string) {
    info = message;
    setTimeout(() => {
      info = undefined;
    }, 7500);
  }

  function handleSuccess() {
    is_loading = false;
    closeModal();
  }

  function handleFail(err: any) {
    is_loading = false;
    if (import.meta.env.DEV) console.error(err);

    setTimeout(() => {
      error = undefined;
    }, 7500);
    
    if (typeof err === "string") {
      error = err; 
      return;
    }

    if (typeof err != "object") error = "An error occured. Please try again later";

    switch (err.code) {
      case "auth/email-already-in-use":
        error = "Email already in use";
        break;
      case "auth/invalid-email":
        error = "Invalid email";
        break;
      case "auth/operation-not-allowed":
        error = "Operation not allowed";
        break;
      case "auth/weak-password":
        error = "Password must be at least 6 characters";
        break;
      case "auth/popup-closed-by-user":
        // Do nothing. This is expected behavior.
        break;
      default:
        error = "An error occured. Please try again later";
        break;
    }
  }

  function handlePasswordSignup() {
    if (is_loading) return;
    // validate
    if (password.length < 6) {
      handleFail("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      handleFail("Passwords do not match");
      return;
    }
    if (email === "") {
      handleFail("Email is required");
      return;
    }
    const tosConsent = document.getElementById("tos-consent") as HTMLInputElement;
    if (!tosConsent.checked) {
      handleFail("You must agree to the terms and privacy policy");
      return;
    }

    // validate with regex
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      error = "Invalid email";
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential: User) => {
        // Signed in 
        const user = userCredential.user;
        if (import.meta.env.DEV) console.log(user);
        handleSuccess();
      })
      .catch((error: any) => {
        handleFail(error);
      });

  }

  function handleGoogleSignup() {
    if (is_loading) return;
    is_loading = true;
    signInWithPopup(auth, googleProvider)
      .then((_: any) => handleSuccess())
      .catch((err: any) => handleFail(err));
  }

  function handleAppleSignup() {
    // TODO: pay daddy steve jobs for this (Apple Developer Program)
    if (is_loading) return;
    is_loading = true;
    // No substantial .then as we're using a state change listener to handle navigation
    signInWithPopup(auth, appleProvider)
      .then((_: any) => handleSuccess())
      .catch((err: any) => handleFail(err));
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- Invisible checkbox to toggle the modal -->
<!-- You can programatically open/close the modal by accessing this element in the DOM -->
<input type="checkbox" id="signup-modal" class="modal-toggle" />

<div class="modal">
  <div class="modal-box">
    <!-- Header -->
    <div class="flex items-center">
      <label
        for="signup-modal"
        class="btn btn-square btn-ghost"
      >
        X
      </label>
      <h2 
        class="font-bold text-xl"
      >
        Sign up
      </h2>
    </div>

    <!-- Body -->
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
      
    <!-- Center, terms privacy links -->
    <div class="flex justify-center pt-2 pb-2">
      <a href="#" class="text-sm text-gray-600">Terms of Service</a>
      <span class="text-sm text-gray-600">&nbsp; | &nbsp;</span>
      <a href="#" class="text-sm text-gray-600">Privacy Policy</a>
    </div>

    <!-- TODO: Align with buttons -->
    <div class="form-control">
      <label class="label cursor-pointer pl-2 pr-2">
        <span class="label-text">I agree to the terms and privacy policy</span> 
        <input id="tos-consent" type="checkbox" class="checkbox" />
      </label>
    </div>
    
    <div class="flex pt-2 pb-2">
      <button 
        class="btn btn-ghost"
        on:click={handlePasswordSignup}
      >
        Sign up
      </button>
    </div>

    <!-- Federated auth -->
    <div class="flex">
      {#each signupOptions as item}
        <div class="flex pt-2 pb-2">
          <button 
            class="btn btn-ghost"
            on:click={item.follow}
          >
            {item.name}
          </button>
        </div>
      {/each}
    </div>

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

  </div>
</div>
