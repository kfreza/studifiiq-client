import { toNextJsHandler } from "better-auth/next-js";
import { cs_auth } from "@/lib/auth";

export const { GET, POST } = toNextJsHandler(cs_auth);
