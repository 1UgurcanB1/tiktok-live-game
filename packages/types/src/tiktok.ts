/* =========================
 * TikTok Live — Shared Types
 * ========================= */

/** 0 = none; 1 = follower; 2 = friends */
export type FollowRole = 0 | 1 | 2;

/** Common user badges we see in samples; allow unknown future shapes too */
export interface ModeratorBadge {
  type: "pm_mt_moderator_im";
  name: "Moderator";
}
export interface ImageBadge {
  type: "image";
  displayType: number; // examples show 1
  url: string;
}
export type UserBadge =
  | ModeratorBadge
  | ImageBadge
  | { type: string; [k: string]: unknown }; // forward-compatible

export interface UserDetails {
  createTime: string; // often "0" or epoch seconds as string
  bioDescription: string;
  profilePictureUrls: string[];
}

export interface FollowInfo {
  followingCount: number;
  followerCount: number;
  followStatus: number;
  pushStatus: number;
}

/** Base fields that appear on (almost) all user-bearing events */
export interface CommonUser {
  userId: string;
  secUid: string;
  uniqueId?: string; // sometimes missing in certain lists
  nickname?: string;
  profilePictureUrl?: string | null;
  followRole?: FollowRole;
  userBadges?: UserBadge[];
  userDetails?: Partial<UserDetails>;
  followInfo?: Partial<FollowInfo>;
  isModerator?: boolean;
  isNewGifter?: boolean;
  isSubscriber?: boolean;
  topGifterRank?: number | null;
}

/** Display type fields are free-form strings in samples */
export type DisplayType = string;

/* =========================
 * 1) member
 * ========================= */

export interface MemberEventData extends CommonUser {
  actionId: number; // e.g. 1
  msgId?: string;
  createTime?: string; // ms epoch as string
  displayType?: DisplayType; // e.g. "live_room_enter_toast"
  label?: string; // e.g. "{0:user} joined"
}

export interface MemberEvent {
  type: "tiktok.member";
  timestamp: string;
  data: MemberEventData;
}

/* =========================
 * 2) chat
 * ========================= */

export interface ChatEventData extends CommonUser {
  comment: string;
  msgId?: string;
  createTime?: string;
  displayType?: DisplayType;
}

export interface ChatEvent {
  type: "tiktok.chat";
  timestamp: string;
  data: ChatEventData;
}

/* =========================
 * 3) gift
 * ========================= */

export interface GiftMonitorExtra {
  anchor_id?: number;
  from_idc?: string;
  from_user_id?: number;
  gift_id?: number;
  gift_type?: number;
  log_id?: string;
  msg_id?: number;
  repeat_count?: number;
  repeat_end?: number;
  // …leave open for future:
  [k: string]: unknown;
}

export interface GiftCompact {
  gift_id: number;
  repeat_count: number;
  repeat_end: number; // 1=end, 0=continue
  gift_type: number;
}

export interface GiftEventData extends CommonUser {
  // Gift details
  giftId: number;
  repeatCount: number;
  repeatEnd: boolean;
  groupId?: string;
  monitorExtra?: GiftMonitorExtra;

  // Sender details inherited from CommonUser

  // Message meta
  msgId?: string;
  createTime?: string;
  displayType?: DisplayType;
  label?: string;

  // Convenience fields (from sample tail)
  gift?: GiftCompact;
  describe?: string; // e.g. "Sent Nevalyashka doll"
  giftType?: number;
  diamondCount?: number;
  giftName?: string;
  giftPictureUrl?: string;
  timestamp?: number;

  // Receiver details
  receiverUserId?: string;
}

export interface GiftEvent {
  type: "tiktok.gift";
  timestamp: string;
  data: GiftEventData;
}

/* =========================
 * 4) roomUser
 * ========================= */

export interface RoomUserTopViewer {
  user: CommonUser;
  coinCount: number;
}

export interface RoomUserEventData {
  topViewers: RoomUserTopViewer[];
  viewerCount: number;
}

export interface RoomUserEvent {
  type: "tiktok.roomUser";
  timestamp: string;
  data: RoomUserEventData;
}

/* =========================
 * 5) like
 * ========================= */

export interface LikeEventData extends CommonUser {
  likeCount: number; // user taps in this burst
  totalLikeCount: number; // stream-wide total likes
  msgId?: string;
  createTime?: string;
  displayType?: DisplayType;
}

export interface LikeEvent {
  type: "tiktok.like";
  timestamp: string;
  data: LikeEventData;
}

/* =========================
 * 6) social
 * ========================= */

export interface SocialEventData extends CommonUser {
  msgId?: string;
  createTime?: string;
  displayType?: DisplayType; // e.g. "pm_main_follow_message_viewer_2" | "pm_mt_guidance_share"
  label?: string; // e.g. "{0:user} followed the host"
}

export interface SocialEvent {
  type: "tiktok.social";
  timestamp: string;
  data: SocialEventData;
}

/* =========================
 * 7) emote
 * ========================= */

export interface EmoteEventData extends CommonUser {
  emoteId: string;
  emoteImageUrl: string;
}

export interface EmoteEvent {
  type: "tiktok.emote";
  timestamp: string;
  data: EmoteEventData;
}

/* =========================
 * 8) envelope
 * ========================= */

export interface EnvelopeEventData extends CommonUser {
  coins: number; // e.g. 20
  canOpen: number; // remaining opens
  timestamp: number; // seconds epoch
}

export interface EnvelopeEvent {
  type: "tiktok.envelope";
  timestamp: string;
  data: EnvelopeEventData;
}

/* =========================
 * 9) questionNew (Q&A)
 * ========================= */

export interface QuestionNewEventData extends CommonUser {
  questionText: string;
}

export interface QuestionNewEvent {
  type: "tiktok.questionNew";
  timestamp: string;
  data: QuestionNewEventData;
}

/* =========================
 * 10) linkMicBattle
 * ========================= */

export interface LinkMicBattleUser {
  userId: string; // host or participant
  uniqueId?: string;
  nickname?: string;
  profilePictureUrl?: string;
  userBadges?: UserBadge[];
  userDetails?: Partial<UserDetails>;
  isModerator?: boolean;
  isNewGifter?: boolean;
  isSubscriber?: boolean;
  topGifterRank?: number | null;
}

export interface LinkMicBattleEventData {
  battleUsers: LinkMicBattleUser[]; // typically 2 sides (hosts)
}

export interface LinkMicBattleEvent {
  type: "tiktok.linkMicBattle";
  timestamp: string;
  data: LinkMicBattleEventData;
}

/* =========================
 * 11) linkMicArmies
 * ========================= */

export interface LinkMicArmyParticipant extends CommonUser {}

export interface LinkMicArmySide {
  hostUserId: string;
  points: number;
  participants: LinkMicArmyParticipant[];
}

export interface LinkMicArmiesEventData {
  battleStatus: number; // e.g. 1
  battleArmies: LinkMicArmySide[];
}

export interface LinkMicArmiesEvent {
  type: "tiktok.linkMicArmies";
  timestamp: string;
  data: LinkMicArmiesEventData;
}

/* =========================
 * 12) liveIntro
 * ========================= */

export interface LiveIntroEventData extends CommonUser {
  id: string;
  description: string;
}

export interface LiveIntroEvent {
  type: "tiktok.liveIntro";
  timestamp: string;
  data: LiveIntroEventData;
}

/* =========================
 * 13) subscribe
 * ========================= */

export interface SubscribeEventData extends CommonUser {
  subMonth: number;
  oldSubscribeStatus: number;
  subscribingStatus: number;
  msgId?: string;
  createTime?: string;
  displayType?: DisplayType; // e.g. "pm_mt_subinfo_user"
  label?: string; // "{0:user} just subscribed to the host"
}

export interface SubscribeEvent {
  type: "tiktok.subscribe";
  timestamp: string;
  data: SubscribeEventData;
}

/* =========================
 * 14) follow
 * ========================= */

export interface FollowEventData extends CommonUser {
  msgId?: string;
  createTime?: string;
  displayType?: DisplayType;
  label?: string; // e.g. "{0:user} followed the host"
}

export interface FollowEvent {
  type: "tiktok.follow";
  timestamp: string;
  data: FollowEventData;
}

/* =========================
 * 15) share
 * ========================= */

export interface ShareEventData extends CommonUser {
  msgId?: string;
  createTime?: string;
  displayType?: DisplayType; // e.g. "pm_mt_guidance_share"
  label?: string; // e.g. "{0:user} shared the live"
}

export interface ShareEvent {
  type: "tiktok.share";
  timestamp: string;
  data: ShareEventData;
}

/* =========================
 * Union — All events
 * ========================= */

export type TikTokLiveEvent =
  | MemberEvent
  | ChatEvent
  | GiftEvent
  | RoomUserEvent
  | LikeEvent
  | SocialEvent
  | EmoteEvent
  | EnvelopeEvent
  | QuestionNewEvent
  | LinkMicBattleEvent
  | LinkMicArmiesEvent
  | LiveIntroEvent
  | SubscribeEvent
  | FollowEvent
  | ShareEvent;

/* =========================
 * Connections
 * ========================= */

export type TikTokStatusEvent = {
  type: "tiktok.status";
  connected: boolean;
  roomId?: string;
  username?: string;
  timestamp: string;
};
