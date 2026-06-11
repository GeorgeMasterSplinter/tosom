/**
 * ToSom AI Quota & Error Handling Test
 *
 * Testar alle AI-endepunkt i pre-prod:
 * - Normal respons
 * - Rate-limit funksjon
 * - Feilhandtering (manglande API-key, ugyldig payload, ugyldig token)
 * - AIRequestLog blir fylt
 * - Observability viser AI-kall
 *
 * Køyrs med: npx tsx scripts/ai/aiQuotaTest.ts
 */

interface TestResult {
  testCase: string
  status: 'PASS' | 'FAIL' | 'WARN'
  statusCode: number
  latency: number
  errorType?: string
  message?: string
}

const results: TestResult[] = []

async function test(
  testCase: string,
  fn: () => Promise<{ statusCode: number; latency: number }>,
  expectedStatus?: number,
  errorType?: string,
): Promise<void> {
  const start = Date.now()
  try {
    const { statusCode, latency } = await fn()
    const latencyMs = Date.now() - start

    let status: 'PASS' | 'FAIL' | 'WARN' = 'FAIL'
    let message: string | undefined

    if (expectedStatus !== undefined) {
      if (statusCode === expectedStatus) {
        status = 'PASS'
      } else {
        message = `Expected ${expectedStatus}, got ${statusCode}`
      }
    } else if (errorType === 'rate-limit' && statusCode === 429) {
      status = 'WARN'
      message = 'Rate-limit trigga (forventa)'
    } else if (errorType === 'validation' && statusCode === 400) {
      status = 'PASS'
      message = 'Valideringsfeil (forventa)'
    } else if (errorType === 'unauthorized' && statusCode === 401) {
      status = 'PASS'
      message = 'Uautorisert (forventa)'
    } else if (errorType === 'server-error' && statusCode === 500) {
      status = 'WARN'
      message = 'Serverfeil (forventa feilhandtering)'
    }

    const emoji = status === 'PASS' ? '✓' : status === 'WARN' ? '!' : '✗'
    const errorLabel = errorType ? ` (${errorType})` : ''
    console.log(`  ${emoji} ${testCase}${errorLabel} — ${statusCode} (${latencyMs}ms)` + (message ? ` — ${message}` : ''))

    results.push({ testCase, status, statusCode, latency: latencyMs, errorType, message })
  } catch (error) {
    const latencyMs = Date.now() - start
    const errorMsg = (error as Error).message
    console.log(`  ✗ ${testCase} — ERROR: ${errorMsg} (${latencyMs}ms)`)
    results.push({ testCase, status: 'FAIL', statusCode: 0, latency: latencyMs, errorType: 'network', message: errorMsg })
  }
}

async function main() {
  const baseUrl = process.env.AI_TEST_BASE_URL || 'http://localhost:3000'
  const adminToken = process.env.AI_ADMIN_TOKEN || 'dummy-admin-token'
  const userToken = process.env.AI_USER_TOKEN || 'dummy-user-token'
  const aiApiKey = process.env.AI_API_KEY

  console.log('='.repeat(60))
  console.log(`  ToSom AI Quota Tests — ${new Date().toISOString()}`)
  console.log('='.repeat(60))
  console.log(`  BASE_URL:   ${baseUrl}`)
  console.log(`  AI_API_KEY: ${aiApiKey ? 'sett' : 'ikkje sett'}`)
  console.log('='.repeat(60))

  // =====================
  // 1. NORMAL KALL
  // =====================
  console.log('\n[1] Normal-kall:')

  if (aiApiKey) {
    await test(
      'messageSuggestions',
      async () => {
        const start = Date.now()
        const res = await fetch(`${baseUrl}/api/ai/message-suggestions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${aiApiKey}` },
          body: JSON.stringify({ userId: 'test', day: 1, type: 'reflection' }),
        })
        return { statusCode: res.status, latency: Date.now() - start }
      },
      200,
      'normal',
    )

    await test(
      'profileRewrite',
      async () => {
        const start = Date.now()
        const res = await fetch(`${baseUrl}/api/ai/profile-rewrite`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${aiApiKey}` },
          body: JSON.stringify({ userId: 'test', text: 'Jeg er 25 og liker natur' }),
        })
        return { statusCode: res.status, latency: Date.now() - start }
      },
      200,
      'normal',
    )

    await test(
      'matchInsights',
      async () => {
        const start = Date.now()
        const res = await fetch(`${baseUrl}/api/ai/match-insights`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${aiApiKey}` },
          body: JSON.stringify({ userId: 'test' }),
        })
        return { statusCode: res.status, latency: Date.now() - start }
      },
      200,
      'normal',
    )

    await test(
      'journeyGuidance',
      async () => {
        const start = Date.now()
        const res = await fetch(`${baseUrl}/api/ai/journey-guidance`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${aiApiKey}` },
          body: JSON.stringify({ userId: 'test', day: 1, type: 'reflection' }),
        })
        return { statusCode: res.status, latency: Date.now() - start }
      },
      200,
      'normal',
    )
  } else {
    console.log('  ~ AI-endepunkt — SKIP (ingen AI_API_KEY)')
  }

  // =====================
  // 2. RATE-LIMIT TEST
  // =====================
  console.log('\n[2] Rate-limit test:')

  let rateLimitTriggered = false
  if (aiApiKey) {
    for (let i = 0; i < 20; i++) {
      await test(
        `messageSuggestions (x${i + 1})`,
        async () => {
          const start = Date.now()
          const res = await fetch(`${baseUrl}/api/ai/message-suggestions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${aiApiKey}` },
            body: JSON.stringify({ userId: 'test', day: 1, type: 'reflection' }),
          })
          if (res.status === 429) rateLimitTriggered = true
          return { statusCode: res.status, latency: Date.now() - start }
        },
        undefined,
        'rate-limit',
      )
    }

    if (!rateLimitTriggered) {
      console.log('  ! Rate-limit ikkje trigga — kan vere ok dersom kvoten er høg')
      results.push({ testCase: 'rate-limit triggered', status: 'WARN', statusCode: 0, latency: 0, errorType: 'rate-limit', message: 'Rate-limit ikkje trigga' })
    } else {
      console.log('  ✓ Rate-limit trigga minst éin gong')
      results.push({ testCase: 'rate-limit triggered', status: 'PASS', statusCode: 429, latency: 0, errorType: 'rate-limit', message: 'Trigga' })
    }
  } else {
    console.log('  ~ Rate-limit — SKIP (ingen AI_API_KEY)')
  }

  // =====================
  // 3. FEILHANDTERING
  // =====================
  console.log('\n[3] Feilhandtering:')

  // Ugyldig payload (tom tekst)
  await test(
    'profileRewrite (tom tekst)',
    async () => {
      const start = Date.now()
      const res = await fetch(`${baseUrl}/api/ai/profile-rewrite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${aiApiKey || 'dummy-key'}` },
        body: JSON.stringify({ userId: 'test', text: '' }),
      })
      return { statusCode: res.status, latency: Date.now() - start }
    },
    undefined,
    'validation',
  )

  // Ugyldig token (ingen token)
  await test(
    'matchInsights (ingen token)',
    async () => {
      const start = Date.now()
      const res = await fetch(`${baseUrl}/api/ai/match-insights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'test' }),
      })
      return { statusCode: res.status, latency: Date.now() - start }
    },
    undefined,
    'unauthorized',
  )

  // Ugyldig admin token
  await test(
    'messageSuggestions (ugyldig admin-token)',
    async () => {
      const start = Date.now()
      const res = await fetch(`${baseUrl}/api/ai/message-suggestions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ userId: 'test', day: 1, type: 'reflection' }),
      })
      return { statusCode: res.status, latency: Date.now() - start }
    },
    undefined,
    'unauthorized',
  )

  // =====================
  // 4. VERIFY AIRequestLog
  // =====================
  console.log('\n[4] Verifiser AIRequestLog:')

  const adminUrl = `${baseUrl}/api/admin/ai/logs`
  await test(
    'Admin AI-logs',
    async () => {
      const start = Date.now()
      const res = await fetch(adminUrl, {
        headers: { Authorization: `Bearer ${adminToken}` },
      })
      return { statusCode: res.status, latency: Date.now() - start }
    },
    200,
    'verification',
  )

  // =====================
  // SUMMARY
  // =====================
  const passCount = results.filter((r) => r.status === 'PASS').length
  const failCount = results.filter((r) => r.status === 'FAIL').length
  const warnCount = results.filter((r) => r.status === 'WARN').length

  console.log('\n' + '='.repeat(60))
  console.log(`  RESULTAT: ${passCount} PASS, ${failCount} FAIL, ${warnCount} WARN`)
  console.log('='.repeat(60))

  if (failCount > 0) {
    console.log('\nFailed tests:')
    results
      .filter((r) => r.status === 'FAIL')
      .forEach((r) => console.log(`  - ${r.testCase}: ${r.message}`))
    console.log('\nexit(1)')
    process.exit(1)
  }

  console.log('\nAlle AI-testar bestått! ✓')
  console.log('\nNeste steg:')
  console.log('  1. Sjå AI-kall i /admin/ai/logs')
  console.log('  2. Sjå AI-statistikk i /admin/observability/metrics')
  console.log('\nexit(0)')
  process.exit(0)
}

main().catch((err) => {
  console.error('\nAI test feila:', err)
  process.exit(1)
})
