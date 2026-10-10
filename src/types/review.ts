export interface UserReview {
  id: string;
  phoneId: string;
  authorName: string;
  authorAvatar?: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  date: string;
  storePurchasedFrom?: string;
  periodOfUse?: string;
  recommend: boolean;
  pros?: string[];
  cons?: string[];
  helpfulCount: number;
  isVerifiedPurchase: boolean;
}

export interface ReviewRatingBreakdown {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}
