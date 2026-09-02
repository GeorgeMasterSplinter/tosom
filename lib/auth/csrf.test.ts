import { generateCsrfToken } from "./csrf";

/** Bygg en minimal NextRequest-mock med headers og cookies */
function fakeReq({
  headers = {},
  cookies = {},
}: {
  headers?: Record<string, string>;
  cookies?: Record<string, string>;
}) {
  return {
    headers: {
      get: (name: string) => headers[name.toLowerCase()] ?? null,
    },
    cookies: {
      get: (name: string) =>
        name in cookies ? { value: cookies[name] } : undefined,
    },
  } as unknown as import("next/server").NextRequest;
}

/**
 * serverFlags verdistast ved modul-import, så hver test som endrar
 * ENABLE_CSRF_PROTECTION må resette modulane og hente csrf på nytt.
 */
async function loadCsrf() {
  jest.resetModules();
  const mod = await import("./csrf");
  return mod;
}

describe("generateCsrfToken", () => {
  it("skal returnere et UUID-formatert token", () => {
    const token = generateCsrfToken();
    expect(token).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  });

  it("skal returnere unike token ved følgende kall", () => {
    const tokens = new Set(
      Array.from({ length: 200 }, () => generateCsrfToken())
    );
    expect(tokens.size).toBe(200);
  });
});

describe("verifyCsrfToken / csrfCheck med flag ENABLE_CSRF_PROTECTION", () => {
  const original = process.env.ENABLE_CSRF_PROTECTION;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.ENABLE_CSRF_PROTECTION;
    } else {
      process.env.ENABLE_CSRF_PROTECTION = original;
    }
  });

  it("skal late alle gjennom når flagget er av (default)", async () => {
    delete process.env.ENABLE_CSRF_PROTECTION;
    const { verifyCsrfToken, csrfCheck } = await loadCsrf();

    const v = await verifyCsrfToken(fakeReq({}));
    // Suksess-tilfelle er { ok: true } (ikke NextResponse)
    expect((v as { ok: boolean }).ok).toBe(true);

    const c = await csrfCheck(fakeReq({}));
    expect(c).toBe(true);
  });

  it("skal avvise med 403 når flagget er på og header mangler", async () => {
    process.env.ENABLE_CSRF_PROTECTION = "true";
    const { verifyCsrfToken, csrfCheck } = await loadCsrf();

    const v = (await verifyCsrfToken(fakeReq({}))) as { status: number };
    expect(v.status).toBe(403);

    const c = (await csrfCheck(fakeReq({}))) as { status: number };
    expect(c.status).toBe(403);
  });

  it("skal avvise med 403 når cookie og header ikke stemmer", async () => {
    process.env.ENABLE_CSRF_PROTECTION = "true";
    const { verifyCsrfToken } = await loadCsrf();

    const v = (await verifyCsrfToken(
      fakeReq({
        cookies: { csrf_token: "cookie-token-123456789" },
        headers: { "x-csrf-token": "another-token-987654321" },
      })
    )) as { status: number };
    expect(v.status).toBe(403);
  });

  it("skal godkjenne når cookie og header stemmer (flagget på)", async () => {
    process.env.ENABLE_CSRF_PROTECTION = "true";
    const { verifyCsrfToken, csrfCheck } = await loadCsrf();

    const req = fakeReq({
      cookies: { csrf_token: "cookie-token-123456789" },
      headers: { "x-csrf-token": "cookie-token-123456789" },
    });

    const v = (await verifyCsrfToken(req)) as {
      ok: boolean;
      _newToken?: string;
    };
    expect(v.ok).toBe(true);
    // Rotasjon: nytt token blir returnert
    expect(v._newToken).toHaveLength(36);

    expect(await csrfCheck(fakeReq({
      cookies: { csrf_token: "cookie-token-123456789" },
      headers: { "x-csrf-token": "cookie-token-123456789" },
    }))).toBe(true);
  });

  it("skal avvise med 403 når header-token kommer uten csrf-cookie (F-117-02: ingen cookie = ingen referanse)", async () => {
    process.env.ENABLE_CSRF_PROTECTION = "true";
    const { verifyCsrfToken } = await loadCsrf();

    // Et token med gyldig lengde uten cookie må ikke lenger slippes gjennom —
    // det var bypass-hullet (F-117-02).
    const v = (await verifyCsrfToken(
      fakeReq({ headers: { "x-csrf-token": "api-token-123456789" } })
    )) as { status: number };
    expect(v.status).toBe(403);
  });

  it("skal avvise med 403 når csrf-cookie mangler (korte/ugyldige token)", async () => {
    process.env.ENABLE_CSRF_PROTECTION = "true";
    const { verifyCsrfToken } = await loadCsrf();

    const v = (await verifyCsrfToken(
      fakeReq({ headers: { "x-csrf-token": "forshort" } })
    )) as { status: number };
    expect(v.status).toBe(403);
  });
});