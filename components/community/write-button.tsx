import Link from "next/link";
import { Pencil } from "lucide-react";

export default function WriteButton() {
  return (
    <Link
      href="/community/write"
      className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 z-50 hover:scale-110"
    >
      <Pencil className="w-6 h-6" />
    </Link>
  );
}
