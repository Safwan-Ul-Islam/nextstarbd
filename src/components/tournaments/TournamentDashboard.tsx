"use client";

import Link from "next/link";
import { useAnnouncements } from "@/lib/hooks/useAnnouncements";
import { AnnouncementCard } from "@/components/announcements/AnnouncementCard";
import { MySquadCard } from "./MySquadCard";
import { RoomInfoCard } from "./RoomInfoCard";
import { Spinner } from "@/components/ui/Spinner";
import { useTranslations } from "next-intl";
import type { Tournament, Registration } from "@/lib/types";

interface TournamentDashboardProps {
  tournament: Tournament;
  myRegistration: Registration | null;
}

export function TournamentDashboard({ tournament, myRegistration }: TournamentDashboardProps) {
  const t = useTranslations("dashboard");
  const { announcements, loading } = useAnnouncements(tournament.id);

  const showRoomInfo =
    tournament.status === "ongoing" &&
    tournament.roomId &&
    tournament.roomPassword &&
    myRegistration?.approvalStatus === "approved";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Left: Announcements + Room Info */}
      <div className="lg:col-span-3 space-y-6">
        {/* Room info — only for approved registered players */}
        {showRoomInfo && (
          <RoomInfoCard
            roomId={tournament.roomId!}
            roomPassword={tournament.roomPassword!}
          />
        )}

        {/* Announcements */}
        <div>
          <h2 className="font-display text-2xl text-foreground tracking-wide mb-4">
            {t("announcements")}
          </h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-8 bg-muted rounded-xl">
              <p className="text-2xl mb-2">📢</p>
              <p className="text-muted-foreground text-sm">{t("noAnnouncements")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {announcements.map((a) => (
                <AnnouncementCard key={a.id} announcement={a} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Own squad or prompt */}
      <div className="lg:col-span-2">
        <h2 className="font-display text-2xl text-foreground tracking-wide mb-4">
          {t("squads")}
        </h2>
        {myRegistration ? (
          <MySquadCard registration={myRegistration} />
        ) : (
          <div className="text-center py-10 bg-muted rounded-2xl">
            <p className="text-3xl mb-3">👥</p>
            <p className="text-sm text-muted-foreground leading-relaxed px-4">
              <Link
                href={`/login?next=/tournaments/${tournament.id}`}
                className="text-primary font-semibold underline"
              >
                Sign in
              </Link>
              {tournament.isRegistrationOpen ? (
                <>
                  {" "}and{" "}
                  <Link
                    href={`/login?next=/register/${tournament.id}`}
                    className="text-primary font-semibold underline"
                  >
                    register your squad
                  </Link>
                  {" "}to see your slot details.
                </>
              ) : (
                " to see your squad details."
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
