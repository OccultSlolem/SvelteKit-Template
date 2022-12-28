<script lang="ts" context="module">
  import { initializeApp } from "firebase/app";
  import { type Analytics, getAnalytics, isSupported } from "firebase/analytics";
  import { type User, getAuth, onAuthStateChanged, connectAuthEmulator } from "firebase/auth";
  import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
  import { connectStorageEmulator, getStorage } from "firebase/storage";
  import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
  import { goto } from "$app/navigation";

  const USE_EMULATORS_ON_DEV = true;

  // Master Firebase configuration
  // (See .env on local machine or Firebase console on remote)
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export const firestore = getFirestore(app);
  export const storage = getStorage(app);
  export const functions = getFunctions(app)

  // Export analytics if supported in the current environment
  export let analytics: Analytics | null = null;
  isSupported()
  .then((analyticsSupported: boolean) => {
    if (analyticsSupported) analytics = getAnalytics(app);
  })
  .catch((err: any) => console.error("Failed to initialize analytics", err));

  // Listen for auth state changes
  export let user: User | null = null;

  onAuthStateChanged(auth, (u: User) => {
    user = u;
    goto("/", { replaceState: true });
  });

  // Set up emulators if on dev
  if (import.meta.env.DEV && USE_EMULATORS_ON_DEV) {
    console.warn("Enabling Firebase emulators");
    connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
    connectFirestoreEmulator(firestore, "localhost", 8080);
    connectStorageEmulator(storage, "localhost", 9199);
    connectFunctionsEmulator(functions, "localhost", 5001);
  }

</script>