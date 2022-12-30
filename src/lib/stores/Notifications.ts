import { writable } from 'svelte/store';

/*
 * Notifications store
 * 
 * Reference:
 * {
 *   severity: 'info/success/warning/error',
 *   message: 'This is a message',
 * }
 * 
 * Make sure to have a setTimeout to clear the notification after a few seconds.
 */

// function example() {
//   notificationStore.set({
//     severity: 'info',
//     message: 'This is a test notification',
//   });
//   setTimeout(() => {
//     notificationStore.set(null);
//   }, 3000);
// }

export const notificationStore = writable<{severity: string, message: string} | null>(null);