export interface ITranslations {
  id: string;
  title: string;
  artist: string;
  content: string;
  category_id: string;
  categories: {
    id: number;
    name: string;
    created_at: string;
  };
  thumbnail_url: string;
  created_at: string;
  release_date: string;
  permalink: string;
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
