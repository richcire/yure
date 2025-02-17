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
  excerpt: string;
  user_info: {
    name: string;
  };
  created_at: string;
  updated_at: string;
  slug: string;
  thumbnail_url: string;
}
