import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const source = await readFile(
  new URL("../lib/admin-auth.ts", import.meta.url),
  "utf8",
);
const profileSource = await readFile(
  new URL("../lib/profile.ts", import.meta.url),
  "utf8",
);
const { profile } = await import(
  `data:text/javascript;base64,${Buffer.from(ts.transpileModule(profileSource, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText).toString("base64")}`
);
const moduleSource = source.replace(
  'import { profile } from "./profile";',
  `const profile = ${JSON.stringify(profile)};`,
);
const owner = {
  userId: "site-owner",
  email: profile.email,
  displayName: profile.name,
  fullName: profile.name,
};
const local = {
  userId: "local_seedy",
  email: "seedy@sites.test",
  displayName: "Local",
  fullName: null,
};
let checks = 0;
for (const mode of ["production", "development"]) {
  const compiled = ts.transpileModule(
    moduleSource.replaceAll("process.env.NODE_ENV", JSON.stringify(mode)),
    {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ESNext,
      },
    },
  ).outputText;
  const { isPortfolioAdmin } = await import(
    `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
  );
  const cases = [
    [null, false, "anonymous visitor"],
    [owner, true, "configured owner"],
    [
      { ...owner, email: owner.email.toUpperCase() },
      true,
      "case-normalized owner email",
    ],
    [
      { ...owner, email: "other@example.com" },
      false,
      "another signed-in account",
    ],
    [local, mode === "development", "development mock identity"],
    [{ ...local, userId: "forged-local" }, false, "incorrect mock identity"],
  ];
  for (const [user, expected, label] of cases) {
    assert.equal(isPortfolioAdmin(user), expected, `${mode}: ${label}`);
    checks++;
  }
}
console.log(
  `${checks} admin authorization checks passed, including production rejection of local mock identities.`,
);
