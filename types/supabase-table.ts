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
  thumbnail_url: string;
  created_at: string;
  release_date: string;
  permalink: string;
  keyword: string;
}

export interface IArticles {
  id: string;
  title: string;
  content: string;
  user_info: IUserInfo;
  created_at: string;
  updated_at: string;
  slug: string;
  thumbnail_url: string;
  banner_url: string;
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

export interface IFeaturedArticles {
  id: string;
  title: string;
  thumbnail_url: string;
  slug: string;
  banner_url: string;
}

export interface IComments {
  id: string;
  translation_id: string;
  author_name: string;
  author_id: string;
  content: string;
  parent_comment_id: string;
  created_at: string;
}

export interface IUserInfo {
  id: string;
  name: string;
  role: string;
  created_at: string;
}

export interface IKaraokeSongs {
  id: string;
  song_title: string;
  singer: string;
  tj: string;
  ky: string;
  js: string;
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
  thumbnail_url: string;
  user_info: IUserInfo;
  created_at: string;
  updated_at: string;
}
