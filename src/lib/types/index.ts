import type { Timestamp } from "firebase/firestore";

export type TournamentStatus = "upcoming" | "ongoing" | "completed" | "cancelled";
export type AnnouncementType = "info" | "warning" | "roomInfo" | "result";
export type ApprovalStatus = "pending" | "approved" | "rejected";
export type SponsorSlot = "hero" | "banner" | "sidebar";

export interface Tournament {
  id: string;
  name: string;
  description: string;
  mode: string;
  prizePool: string;
  maxSlots: number;
  startsAt: Timestamp;
  registrationDeadline: Timestamp;
  status: TournamentStatus;
  isRegistrationOpen: boolean;
  roomId: string | null;
  roomPassword: string | null;
  bannerUrl: string | null;
  registeredCount: number;
  waitlistCount: number;
  allUids: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Registration {
  id: string;
  tournamentId: string;
  squadName: string;
  leaderName: string;
  leaderUid: string;
  whatsapp: string;
  player2Uid: string;
  player3Uid: string;
  player4Uid: string;
  allUids: string[];
  slotNumber: number | null;
  isWaitlisted: boolean;
  approvalStatus: ApprovalStatus;
  registeredAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Announcement {
  id: string;
  tournamentId: string | null;
  title: string | null;
  body: string;
  type: AnnouncementType;
  isPinned: boolean;
  postedByEmail: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Winner {
  id: string;
  tournamentId: string;
  tournamentName: string;
  squadName: string;
  players: string[];
  prize: string;
  position: 1 | 2 | 3;
  photoUrl: string | null;
  tournamentDate: Timestamp;
  createdAt: Timestamp;
}

export interface MvpPlayer {
  id: string;
  tournamentId: string;
  tournamentName: string;
  playerName: string;
  uid: string;
  kills: number;
  damage: number | null;
  photoUrl: string | null;
  achievement: string;
  tournamentDate: Timestamp;
  createdAt: Timestamp;
}

export interface Sponsor {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string | null;
  slotType: SponsorSlot;
  displayOrder: number;
  isActive: boolean;
  updatedAt: Timestamp;
}
