import ScheduleEditor from "@/components/schedule/schedule-editor";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ScheduleModifyPage({ params }: Props) {
  const { id } = await params;

  return <ScheduleEditor id={id} />;
}
