# SvelteKit-Template

A SvelteKit + Tailwind/DaisyUI + Firebase app template. Some assembly required.

## Setup

1.) Clone the repository.
2.) Place a .env file on the project root and fill it with the requisite keys from Firebase.
3.) Under src/routes/+layout.svelte, set up the navigation links.
4.) Run `npm i` to install dependencies.
5.) Run `npm run dev` to build for devlopment.
6.) Run `npm run build` to build for production.
7.) Set up reCAPTCHA for AppCheck

The SvelteKit router is filesystem based, so if you want to create a new route you have to
create a new folder under the src/routes folder, like so:

- src
 - routes
  - route-name
   - +page.svelte
   - +layout.svelte (Use <slot/> to insert the contents of +page.svelte)

## Features

 - Tailwind + DaisyUI
  - Automatic dark mode switcher
 - Firebase
  - Auth
   - User settings, signin/signout, etc
  - Functions
  - Firestore
  - Storage
  - AppCheck with reCAPTCHA
  - Analytics
   - When in supported environment (ie production)
  - Emulators
   - Automatically uses emulators when in development mode
 - Hiding sensitive values (like the Firebase API key) using DotENV
  - See .env.example to see what values you need to insert

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Special instructions for Codespaces

To access a desktop environment using noVNC, forward port 6080 in the ports view.

You should also be able to access a proper VNC environment by forwarding 5901, but I haven't had much luck here.