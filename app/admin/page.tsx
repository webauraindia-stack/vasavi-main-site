import { redirect } from "next/navigation";
import { ROLE_PORTAL_URL } from "@/lib/constants/site";

/** Staff ERP lives in the role portal — not the public main site. */
export default function AdminRedirectPage() {
  redirect(ROLE_PORTAL_URL);
}
