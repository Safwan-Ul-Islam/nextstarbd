"use client";

import { useAnnouncements } from "@/lib/hooks/useAnnouncements";
import { AnnouncementCard } from "@/components/announcements/AnnouncementCard";
import { Spinner } from "@/components/ui/Spinner";
import { useTranslations } from "next-intl";

export function AnnouncementsFeed() {
  const t = useTranslations("announcements");
  const { announcements, loading } = useAnnouncements(null);

  if (!loading && announcements.length === 0) return null;

  return (
    <section className="py-12 bg-gray-50 border-t border-border">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-2.5 h-2.5 bg-secondary rounded-full animate-pulse" />
          <h2 className="font-display text-3xl text-foreground tracking-wide">
            {t("latest")}
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : (
          <div className="space-y-3">
            {announcements.map((a) => (
              <AnnouncementCard key={a.id} announcement={a} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
