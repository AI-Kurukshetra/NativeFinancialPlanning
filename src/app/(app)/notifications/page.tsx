import { NotificationCenter } from "@/components/app/notification-center";
import { AppTopbar } from "@/components/shell/app-topbar";
import { getNotificationsPageData } from "@/lib/server/app-data";

export default async function NotificationsPage() {
  const data = await getNotificationsPageData();

  return (
    <div className="space-y-6">
      <AppTopbar
        subtitle="Workflow, review, and system alerts tied to the active workspace"
        title="Inbox"
      />
      <NotificationCenter items={data.items} unreadCount={data.unreadCount} />
    </div>
  );
}
