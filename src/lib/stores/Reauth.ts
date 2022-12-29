// If the user needs to reauthenticate, store the follow-on
// function to call when they do so.

import { writable } from 'svelte/store';

export const reauthFunctionStore = writable<() => void>(() => {});