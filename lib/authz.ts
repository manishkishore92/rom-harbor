import { redirect } from "next/navigation";
import { auth } from "@/auth";

export async function requireMaintainer() {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/sign-in");
  }
  return session;
}
