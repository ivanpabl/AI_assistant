import { AssistantDashboard } from "@/components/AssistantDashboard";
import { isAuthEnabled } from "@/lib/auth";

export default function Home() {
  return <AssistantDashboard canLogout={isAuthEnabled()} />;
}
