export interface User {
  id: string;
  fullName: string;
  email: string;
  country: string;
  role: 'artist' | 'label_manager' | 'admin';
  selectedPlanId?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  type: 'one-time' | 'monthly' | 'annual';
  badge?: string;
  priceINR: number;
  billingText: string;
  allowance: string;
  annualCalculation?: string;
  description: string;
  features: string[];
  popular?: boolean;
}

export interface ReleaseTrack {
  trackNumber: number;
  title: string;
  isrc?: string;
  primaryArtist: string;
  featuredArtists?: string;
  composer: string;
  lyricist: string;
  producer?: string;
  duration?: string;
  audioFileName?: string;
  audioFileUrl?: string;
  audioQuality?: {
    format: string;
    sampleRate?: number;
    bitDepth?: number;
    channels?: number;
    duration?: number;
    bitrate?: number;
    cbrVbr?: string;
    isCompliant?: boolean;
    issues?: string[];
  };
  explicit: boolean;
}

export interface Release {
  id: string;
  userId: string;
  title: string;
  version?: string;
  artist: string;
  featuredArtists?: string;
  label: string;
  upc: string;
  type: 'Single' | 'EP' | 'Album';
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Action Required' | 'Approved' | 'Delivered' | 'Live' | 'Rejected' | 'Takedown Requested';
  language: string;
  primaryGenre: string;
  secondaryGenre?: string;
  releaseDate: string;
  tracks: ReleaseTrack[];
  artworkUrl?: string;
  copyrightOwner: string;
  copyrightYear: number;
  recordingOwner: string;
  territories: string;
  rightsConfirmed: boolean;
  submittedAt: string;
  lastReviewedAt?: string;
  adminReviewNotes?: string;
  adminRejectReason?: string;
  adminChangesRequired?: string;
}

export interface LabelItem {
  id: string;
  name: string;
  code: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  catalogCount: number;
  date: string;
}

export interface ArtistProfile {
  id: string;
  name: string;
  primaryGenre: string;
  spotifyId?: string;
  appleMusicId?: string;
  releasesCount: number;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'Pending' | 'Resolved';
  updatedAt: string;
  messages: Array<{ sender: string; text: string; time: string }>;
}

export interface SmartLink {
  id: string;
  title: string;
  artist: string;
  slug: string;
  clicks: number;
  stores: {
    spotify?: string;
    apple?: string;
    youtube?: string;
    amazon?: string;
    jiosaavn?: string;
  };
}

export interface OtherRequest {
  id: string;
  type: 'Metadata Correction' | 'Takedown' | 'Artist Name Update' | 'Other';
  details: string;
  status: 'Under Review' | 'Completed' | 'Pending';
  date: string;
}

export interface TransactionItem {
  id: string;
  type: 'Credit' | 'Debit' | 'Payout' | 'Refund';
  amount: number;
  description: string;
  status: 'Completed' | 'Processing';
  reference: string;
  date: string;
}

export interface NotificationItem {
  id: string;
  recipient_user_id: string;
  release_id: string;
  notification_type: 'approved' | 'changes_requested' | 'rejected';
  title: string;
  message: string;
  admin_reason?: string;
  release_title: string;
  artist_name: string;
  artwork_url?: string;
  created_at: string;
  expires_at: number;
  read_at?: string;
  dismissed_at?: string;
}

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedDate: string;
  author: string;
  content: string[];
}

export interface MonthlyRoyalty {
  month: string;
  monthLabel: string;
  grossRoyalty: number;
  netRoyalty: number;
  streams: number;
  spotify: number;
  appleMusic: number;
  youtubeMusic: number;
  jioSaavn: number;
  amazonMusic: number;
  otherDSPs: number;
  status: 'Cleared' | 'In Clearance' | 'Processing';
  statementId: string;
  payoutDate?: string;
}

export interface DspRoyaltyShare {
  name: string;
  royalties: number;
  streams: number;
  percentage: number;
  color: string;
}

export interface TrackRoyalty {
  id: string;
  title: string;
  artist: string;
  streams: number;
  royalties: number;
  topPlatform: string;
}

export interface RazorpayOrder {
  orderId: string;
  userId: string;
  userEmail: string;
  userName: string;
  planId: string;
  planName: string;
  planType: 'one-time' | 'monthly' | 'annual';
  amount: number;
  amountPaise: number;
  currency: string;
  status: 'created' | 'paid' | 'failed' | 'cancelled';
  recurringConsent: boolean;
  autoRenew: boolean;
  paymentId?: string;
  signature?: string;
  failureReason?: string;
  createdAt: string;
  paidAt?: string;
  isTestMode: boolean;
}

export interface UserSubscription {
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  planId: string;
  planName: string;
  billingFrequency: 'one-time' | 'monthly' | 'annual';
  startedAt: string;
  renewsAt?: string;
  expiresAt?: string;
  orderId: string;
  paymentId?: string;
  amount: number;
  autoRenew: boolean;
  cancelledAt?: string;
}

