import { cookies } from "next/headers";

export async function getSessionUser() {
  const token = (await cookies()).get("__session")?.value;
  if (!token) return null;
  try {
    const { adminAuth } = await import("@/lib/firebase/admin");
    return await adminAuth.verifyIdToken(token);
  } catch {
    return null;
  }
}
