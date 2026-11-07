import assert from "node:assert/strict";

const origin = process.env.PORTFOLIO_TEST_ORIGIN || "http://localhost:5173";
assert.ok(
  ["localhost", "127.0.0.1"].includes(new URL(origin).hostname),
  "Run this mutation test only against a local preview.",
);
const api = `${origin}/api/admin/projects`;
let checks = 0;
function check(condition, label) {
  assert.ok(condition, label);
  checks++;
  console.log(`PASS ${label}`);
}
async function request(method, body, cookie, requestOrigin = origin) {
  return fetch(api, {
    method,
    headers: {
      ...(cookie ? { Cookie: cookie } : {}),
      ...(method !== "GET"
        ? { "Content-Type": "application/json", Origin: requestOrigin }
        : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}

check((await fetch(origin)).status === 200, "homepage renders");
const home = await (await fetch(origin)).text();
check(
  home.includes("Huân") &&
    home.includes("caoanhhuan2909@gmail.com") &&
    home.includes("https://github.com/ah2909"),
  "personal identity and contact links render",
);
const adminRedirect = await fetch(`${origin}/admin`, { redirect: "manual" });
check(
  [302, 303, 307, 308].includes(adminRedirect.status) &&
    adminRedirect.headers.get("location")?.includes("signin-with-chatgpt"),
  "anonymous admin page redirects to sign-in",
);
for (const slug of ["cryptofolio", "e-commerce"]) {
  const response = await fetch(`${origin}/projects/${slug}`);
  const html = await response.text();
  check(
    response.status === 200 && html.includes("ABOUT THIS PRESENTATION"),
    `${slug} introduction renders with source limitations`,
  );
}
check((await request("GET")).status === 401, "anonymous admin API is denied");
check(
  (
    await fetch(api, {
      headers: {
        "oai-authenticated-user-id": "forged",
        "oai-authenticated-user-email": "forged@example.com",
      },
    })
  ).status === 401,
  "local auth strips forged identity headers",
);
const signIn = await fetch(`${origin}/signin-with-chatgpt?return_to=/admin`, {
  redirect: "manual",
});
const cookie = signIn.headers
  .getSetCookie()
  .map((part) => part.split(";")[0])
  .join("; ");
check(Boolean(cookie), "development sign-in creates a local session");
const collection = await request("GET", null, cookie);
check(collection.status === 200, "authenticated admin collection loads");
const data = await collection.json();
const template = data.projects.find(
  (project) => project.slug === "cryptofolio",
);
check(Boolean(template), "reviewed seed projects are available");
check(
  (
    await request(
      "POST",
      { project: template, expectedVersion: 0, create: true },
      cookie,
    )
  ).status === 409,
  "creating a duplicate seeded slug is rejected",
);
const slug = `verification-project-${Date.now()}`;
let project = {
  ...template,
  slug,
  title: "Verification Project",
  published: false,
  version: 0,
  order: 999,
};
let version = 0;
let created = false;
try {
  check(
    (
      await request(
        "POST",
        { project, expectedVersion: version },
        cookie,
        "https://untrusted.example",
      )
    ).status === 403,
    "cross-origin mutation is denied",
  );
  check(
    (
      await request(
        "POST",
        {
          project: { ...project, liveUrl: "javascript:alert(1)" },
          expectedVersion: version,
        },
        cookie,
      )
    ).status === 400,
    "unsafe external URLs are rejected",
  );
  let response = await request(
    "POST",
    { project, expectedVersion: 0, create: true },
    cookie,
  );
  check(response.status === 200, "new project draft saves");
  created = true;
  let saved = await response.json();
  version = saved.project.version;
  check(version === 1, "save returns the persisted revision");
  check(
    (await fetch(`${origin}/projects/${slug}`)).status === 404,
    "draft introduction stays hidden",
  );
  const reloaded = await (await request("GET", null, cookie)).json();
  check(
    reloaded.projects.some(
      (item) => item.slug === slug && item.version === version,
    ),
    "saved draft survives a fresh server read",
  );
  project = { ...project, published: true };
  response = await request(
    "POST",
    { project, expectedVersion: version },
    cookie,
  );
  check(response.status === 200, "draft can be published");
  saved = await response.json();
  version = saved.project.version;
  const page = await fetch(`${origin}/projects/${slug}`);
  check(
    page.status === 200 && (await page.text()).includes("Verification Project"),
    "published introduction becomes available without a rebuild",
  );
  check(
    (await request("POST", { project, expectedVersion: version - 1 }, cookie))
      .status === 409,
    "stale writes cannot overwrite newer content",
  );
  response = await request(
    "POST",
    { project: { ...project, published: false }, expectedVersion: version },
    cookie,
  );
  check(response.status === 200, "published project can return to draft");
  saved = await response.json();
  version = saved.project.version;
  check(
    (await fetch(`${origin}/projects/${slug}`)).status === 404,
    "unpublishing disables the introduction route",
  );
} finally {
  if (created) {
    const response = await request(
      "DELETE",
      { slug, expectedVersion: version },
      cookie,
    );
    check(response.status === 200, "temporary verification project is removed");
    const final = await (await request("GET", null, cookie)).json();
    check(
      !final.projects.some((item) => item.slug === slug),
      "removed project stays absent after reload",
    );
  }
}
console.log(`${checks} portfolio integration checks passed.`);
