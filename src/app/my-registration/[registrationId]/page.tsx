import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementCard } from "@/components/announcements/AnnouncementCard";
import { serialize } from "@/lib/utils/serialize";
import type { Registration, Tournament, Announcement } from "@/lib/types";

const statusUI = {
  approved: {
    icon: "✅",
    label: "Approved",
    desc: "Your squad has been approved. Get ready to play!",
    bg: "bg-secondary-light border-secondary",
    text: "text-secondary",
    badge: "bg-secondary text-white",
  },
  pending: {
    icon: "⏳",
    label: "Pending Approval",
    desc: "Your registration is under review. The admin will approve or reject soon.",
    bg: "bg-amber-50 border-amber-200",
    text: "text-amber-700",
    badge: "bg-amber-500 text-white",
  },
  rejected: {
    icon: "❌",
    label: "Rejected",
    desc: "Unfortunately your squad was not approved for this tournament.",
    bg: "bg-primary-light border-primary",
    text: "text-primary",
    badge: "bg-primary text-white",
  },
};

async function getData(registrationId: string) {
  try {
    const { adminDb } = await import("@/lib/firebase/admin");

    const regDoc = await adminDb.collection("registrations").doc(registrationId).get();
    if (!regDoc.exists) return null;

    const reg = { id: regDoc.id, ...regDoc.data() } as unknown as Registration;

    const [tournamentDoc, announcementsSnap] = await Promise.all([
      adminDb.collection("tournaments").doc(reg.tournamentId).get(),
      adminDb
        .collection("announcements")
        .where("tournamentId", "==", reg.tournamentId)
        .orderBy("isPinned", "desc")
        .orderBy("createdAt", "desc")
        .limit(10)
        .get(),
    ]);

    return serialize({
      registration: reg,
      tournament: tournamentDoc.exists
        ? ({ id: tournamentDoc.id, ...tournamentDoc.data() } as unknown as Tournament)
        : null,
      announcements: announcementsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as Announcement)),
    });
  } catch {
    return null;
  }
}

export default async function MyRegistrationPage({
  params,
}: {
  params: Promise<{ registrationId: string }>;
}) {
  const { registrationId } = await params;
  const locale = await getLocale();
  const data = await getData(registrationId);

  if (!data) notFound();

  const { registration: reg, tournament, announcements } = data;
  const ui = statusUI[reg.approvalStatus || "pending"];

  return (
    <>
      <Navbar locale={locale} />
      <main className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-xl mx-auto px-4 sm:px-6 space-y-5">

          {/* Header */}
          <div>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Back to Home
            </Link>
            <h1 className="font-display text-3xl text-foreground tracking-wide mt-3">My Registration</h1>
            {tournament && (
              <p className="text-muted-foreground text-sm mt-0.5">{tournament.name}</p>
            )}
          </div>

          {/* Status Card */}
          <div className={`rounded-2xl border-2 ${ui.bg} p-6`}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{ui.icon}</span>
              <div>
                <span className={`inline-block text-sm font-bold px-3 py-1 rounded-full ${ui.badge} mb-1`}>
                  {ui.label}
                </span>
                <p className={`text-sm font-medium ${ui.text}`}>{ui.desc}</p>
              </div>
            </div>

            {reg.slotNumber && reg.approvalStatus === "approved" && (
              <div className="mt-3 pt-3 border-t border-current/20">
                <p className={`text-sm font-semibold ${ui.text}`}>
                  Slot #{reg.slotNumber} confirmed
                </p>
              </div>
            )}

            {reg.isWaitlisted && (
              <div className="mt-3 pt-3 border-t border-current/20">
                <p className={`text-sm font-semibold ${ui.text}`}>
                  You are on the waiting list
                </p>
              </div>
            )}
          </div>

          {/* Squad Details */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <h2 className="font-semibold text-foreground mb-4">Squad Details</h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Squad Name</span>
                <span className="font-bold text-foreground">{reg.squadName}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Leader</span>
                <span className="font-semibold">{reg.leaderName}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Leader UID</span>
                <span className="font-mono text-sm">{reg.leaderUid}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">WhatsApp</span>
                <span className="text-sm">{reg.whatsapp}</span>
              </div>
              <div className="py-2">
                <span className="text-sm text-muted-foreground block mb-2">Other Players</span>
                <div className="flex flex-wrap gap-2">
                  {[reg.player2Uid, reg.player3Uid, reg.player4Uid].map((uid, i) => (
                    <span key={i} className="bg-gray-100 text-sm font-mono px-3 py-1 rounded-full">
                      P{i + 2}: {uid}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Announcements */}
          {announcements.length > 0 && (
            <div>
              <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Tournament Announcements
              </h2>
              <div className="space-y-3">
                {announcements.map((a) => (
                  <AnnouncementCard key={a.id} announcement={a} />
                ))}
              </div>
            </div>
          )}

          {tournament && (
            <Link
              href={`/tournaments/${reg.tournamentId}`}
              className="block text-center bg-white border border-border rounded-xl py-3 text-sm font-semibold text-foreground hover:bg-gray-50 transition-colors"
            >
              View Tournament Dashboard →
            </Link>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
