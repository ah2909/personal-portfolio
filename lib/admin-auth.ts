import type { ChatGPTUser } from "../app/chatgpt-auth";
import { profile } from "./profile";

export function isPortfolioAdmin(user: ChatGPTUser | null): boolean {
  if (!user) return false;
  if (user.email.toLowerCase() === profile.email.toLowerCase()) return true;
  return (
    process.env.NODE_ENV === "development" &&
    user.userId === "local_seedy" &&
    user.email === "seedy@sites.test"
  );
}
