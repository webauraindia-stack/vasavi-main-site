import { redirect } from "next/navigation";

export default function DonorPortalLoginPage() {
  redirect("/login?callbackUrl=/donor-portal");
}
