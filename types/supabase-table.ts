export interface ITranslations {
  id: string;
  title: string;
  artist: string;
  content: string;
  category_id: string;
  categories: {
    id: number;
    name: string;
  }[];
  thumbnail_url: string | null;
  created_at: string;
  release_date: string | null;
  permalink: string;
  keyword: string;
  views: number;
  is_hidden?: boolean;
  updated_at: string;
}

export interface IArticles {
  id: string;
  title: string;
  content: string;
  user_info: IUserInfo;
  created_at: string;
  updated_at: string;
  slug: string;
  thumbnail_url: string | null;
  banner_url: string | null;
}

export interface ITranslationCategories {
  translation_id: string;
  category_id: number;
}

export interface ICategories {
  id: number;
  name: string;
  created_at: string;
}

export type IFeaturedArticles = Pick<
  IArticles,
  "id" | "title" | "thumbnail_url" | "slug" | "banner_url"
>;

export interface IComments {
  id: string;
  translation_id: string;
  author_name: string;
  author_id: string;
  content: string;
  parent_comment_id: string | null;
  created_at: string;
  is_deleted?: boolean;
}

export type UserRole = "admin" | "employee" | "none";

export interface IUserInfo {
  user_id: string;
  name: string;
  role: UserRole;
  created_at: string;
}

export interface IKaraokeSongs {
  id: string;
  song_title: string;
  singer: string;
  tj: string | null;
  ky: string | null;
  js: string | null;
  keyword: string;
  created_at: string;
  updated_at: string;
}

export interface INews {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  thumbnail_url: string | null;
  user_info: IUserInfo;
  created_at: string;
  updated_at: string;
}

export type IFeaturedNews = Pick<
  INews,
  "id" | "thumbnail_url" | "title" | "summary" | "slug"
>;

export type NotificationType =
  | "comment_reply"
  | "mention"
  | "system"
  | string;

export interface INotifications {
  id: string;
  recipient_user_id: string;
  message: string;
  type: NotificationType;
  relevant_url: string;
  is_read: boolean;
  created_at: string;
}

export interface IEvents {
  id: string;
  event_types: IEventTypes;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

export interface IEventTypes {
  id: string;
  name: string;
  bg_color: string;
  border_color: string;
}

export interface IUserFavoriteSongs {
  user_id: string;
  song_id: string;
  created_at: string;
}

export interface IPosts {
  id: string;
  author_id: IUserInfo;
  title: string;
  content: string;
  like_count: number;
  comment_count: number;
  created_at: string;
}
