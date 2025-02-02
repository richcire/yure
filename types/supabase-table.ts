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
}
