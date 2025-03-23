import NewsEditor from "@/components/Tiptap/NewsEditor";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function NewsModifyPage({ params }: Props) {
  const { id } = await params;
  return <NewsEditor id={id} />;
}
