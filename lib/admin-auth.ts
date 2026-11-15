import { env } from "cloudflare:workers";
import { headers } from "next/headers";
import { verifyAccessToken } from "./access-token";
import { profile } from "./profile";

export async function getAdminUser(): Promise<{ email: string } | null> {
  const token = (await headers()).get("cf-access-jwt-assertion");
  if (!token || !env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD) return null;
  return verifyAccessToken(token, env.ACCESS_TEAM_DOMAIN, env.ACCESS_AUD);
}

export function isPortfolioAdmin(user: { email: string } | null): boolean {
  return user?.email.toLowerCase() === profile.email.toLowerCase();
}
