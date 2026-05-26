import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RegistrationForm } from "@/components/registration/RegistrationForm";
import { Button } from "@/components/ui/Button";
import { getSessionUser } from "@/lib/server/session";

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ tournamentId: string }>;
}) {
  const { tournamentId } = await params;

  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    redirect(`/login?next=/register/${tournamentId}`);
  }

  const locale = await getLocale();
  const t = await getTranslations("registration");

  let tournamentName = "Tournament";
  try {
    const { adminDb } = await import("@/lib/firebase/admin");
    const doc = await adminDb.collection("tournaments").doc(tournamentId).get();
    if (doc.exists) {
      tournamentName = doc.data()!.name;
    }
  } catch {}

  return (
    <>
      <Navbar locale={locale} />
      <main className="min-h-screen bg-muted py-10">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="mb-6">
            <Button href={`/tournaments/${tournamentId}`} variant="ghost" size="sm">
              ← Back to Dashboard
            </Button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-border p-6 sm:p-8">
            <h1 className="font-display text-3xl sm:text-4xl text-foreground tracking-wide mb-1">
              {t("title")}
            </h1>
            <p className="text-muted-foreground text-sm mb-6">
              {tournamentName}
            </p>

            <RegistrationForm tournamentId={tournamentId} userId={sessionUser.uid} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
