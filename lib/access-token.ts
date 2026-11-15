type AccessClaims = {
  iss: string;
  aud: string[];
  exp: number;
  nbf?: number;
  email: string;
};

function decode(value: string): Uint8Array<ArrayBuffer> {
  return Uint8Array.from(atob(value.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));
}

export async function verifyAccessToken(
  token: string,
  teamDomain: string,
  audience: string,
): Promise<{ email: string } | null> {
  try {
    if (!/^[a-z0-9-]+\.cloudflareaccess\.com$/.test(teamDomain)) return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const header = JSON.parse(new TextDecoder().decode(decode(parts[0])));
    const claims: AccessClaims = JSON.parse(new TextDecoder().decode(decode(parts[1])));
    const issuer = `https://${teamDomain}`;
    const now = Date.now() / 1000;
    if (
      header.alg !== "RS256" || typeof header.kid !== "string" ||
      claims.iss !== issuer || !Array.isArray(claims.aud) || !claims.aud.includes(audience) ||
      typeof claims.exp !== "number" || claims.exp <= now ||
      (claims.nbf !== undefined && (typeof claims.nbf !== "number" || claims.nbf > now)) ||
      typeof claims.email !== "string" || !claims.email
    ) return null;

    const response = await fetch(`${issuer}/cdn-cgi/access/certs`, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) return null;
    const { keys } = await response.json() as { keys: (JsonWebKey & { kid: string })[] };
    const jwk = keys.find((key) => key.kid === header.kid && key.kty === "RSA");
    if (!jwk) return null;
    const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
    const valid = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, decode(parts[2]), new TextEncoder().encode(`${parts[0]}.${parts[1]}`));
    return valid ? { email: claims.email } : null;
  } catch {
    return null;
  }
}
