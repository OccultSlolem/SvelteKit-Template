import type { PageLoad } from "./$types";
import { user, auth } from "$lib/Firebase";

export const load = (({params}) => {
  return {
    user: user,
    auth: auth
  }
}) satisfies PageLoad
