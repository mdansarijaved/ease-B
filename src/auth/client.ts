import { customSessionClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import type { auth } from "./server";

export const authClient = createAuthClient({
  plugins: [customSessionClient<typeof auth>()],
});
