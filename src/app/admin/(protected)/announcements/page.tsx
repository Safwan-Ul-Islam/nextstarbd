import { AnnouncementComposer } from "@/components/admin/AnnouncementComposer";
import { serialize } from "@/lib/utils/serialize";
import type { Announcement, Tournament } from "@/lib/types";
import { timeAgo } from "@/lib/utils/formatDate";

async function getData() {
  const { adminDb } = await import("@/lib/firebase/admin");
  const [annSnap, tSnap] = await Promise.all([
    adminDb.collection("announcements").orderBy("createdAt", "desc").limit(30).get(),
    adminDb.collection("tournaments").orderBy("startsAt", "desc").limit(20).get(),
  ]);
  return serialize({
    announcements: annSnap.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as Announcement)),
    tournaments: tSnap.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as Tournament)),
  });
}

export default async function AdminAnnouncementsPage() {
  const { announcements, tournaments } = await getData();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-foreground tracking-wide">Announcements</h1>

      <div className="bg-white rounded-2xl border border-border p-6">
        <h2 className="font-semibold mb-4">Post Announcement</h2>
        <AnnouncementComposer tournaments={tournaments} />
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-semibold">Recent Announcements</h2>
        </div>
        {announcements.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">No announcements yet.</div>
        ) : (
          <div className="divide-y divide-border">
            {announcements.map((a) => (
              <div key={a.id} className="px-6 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground uppercase">
                        {a.type}
                      </span>
                      {a.isPinned && <span className="text-xs">📌</span>}
                      <span className="text-xs text-muted-foreground">{timeAgo(a.createdAt)}</span>
                    </div>
                    {a.title && <p className="font-semibold text-sm">{a.title}</p>}
                    <p className="text-sm text-muted-foreground line-clamp-2">{a.body}</p>
                  </div>
                  <DeleteAnnouncementButton id={a.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DeleteAnnouncementButton({ id }: { id: string }) {
  return (
    <form
      action={async () => {
        "use server";
        const { adminDb } = await import("@/lib/firebase/admin");
        await adminDb.collection("announcements").doc(id).delete();
      }}
    >
      <button
        type="submit"
        className="text-xs text-primary hover:underline shrink-0 font-medium"
      >
        Delete
      </button>
    </form>
  );
}
