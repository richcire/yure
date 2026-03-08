import { INotifications, IUserInfo } from "@/types/supabase-table";
import { BellIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Notification() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<INotifications[]>([]);
  const supabase = createClient();

  const markAsReadAll = async () => {
    if (notifications.length === 0) {
      return;
    }
    const { data, error } = await supabase.from("notifications").upsert(
      notifications.map((notification) => ({
        ...notification,
        is_read: true,
      })),
      {
        onConflict: "id",
      }
    );
    setNotifications([]);
  };

  const getNotifications = async (user_id: string, role: string) => {
    const { data, error } =
      role === "admin"
        ? await supabase
            .from("notifications")
            .select("*")
            .eq("is_read", false)
            .order("created_at", { ascending: false })
            .returns<INotifications[]>()
        : await supabase
            .from("notifications")
            .select("*")
            .eq("recipient_user_id", user_id)
            .eq("is_read", false)
            .order("created_at", { ascending: false })
            .returns<INotifications[]>();
    return { data, error };
  };

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        return;
      }
      const { data: userData } = await supabase
        .from("user_info")
        .select("name, role")
        .eq("user_id", data.session?.user.id)
        .single<IUserInfo>();

      const { data: notifications } = await getNotifications(
        data.session?.user.id,
        userData?.role || ""
      );
      if (notifications) {
        setNotifications(notifications);
      }
    };
    getSession();
  }, []);
  return (
    <div>
      <button
        className="hover:text-primary transition-colors flex items-center justify-center relative"
        onClick={() => setShowNotifications((prev) => !prev)}
        aria-label="알림 목록 열기"
        aria-expanded={showNotifications}
        aria-haspopup="dialog"
      >
        <BellIcon size={20} aria-hidden="true" />
        {notifications.length > 0 && (
          <div
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
            aria-label={`읽지 않은 알림 ${notifications.length}개`}
          >
            {notifications.length > 9 ? "9+" : notifications.length}
          </div>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-1 top-full pt-2" role="dialog" aria-label="알림">
          <div className="w-80 bg-comfortWhite backdrop-blur-sm shadow-sm border rounded-md p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">알림</h3>
              <button
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                onClick={markAsReadAll}
              >
                모두 읽음 표시
              </button>
            </div>

            <div className="space-y-4">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <Link
                    href={notification.relevant_url || "#"}
                    key={notification.id}
                    className="flex items-start gap-3 p-2 rounded-md"
                  >
                    <div className="flex-1">
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-sm text-center text-muted-foreground">
                  새로운 알림이 없습니다
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
