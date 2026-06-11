/**
 * ToSom Quick Check (Post-Deploy)
 * 
 * Koyr health, latency, observability og security checks raskt.
 * Koyrs med: npx tsx scripts/monitoring/quickCheck.ts
 */

interface QuickCheckResult {
  name: string
  status: 'PASS' | 'WARN' | 'FAIL'
  latency: number
  message?: string
}

const quickResults: QuickCheckResult[] = []

async function check(
  name: string,
  url: string,
  expectedStatus: number = 200,
  headers?: Record<string, string>,
): Promise<void> {
  const start = Date.now()
  try {
    const res = await fetch(url, { headers })
    const latency = Date.now() - start
    let status: 'PASS' | 'WARN' | 'FAIL' = 'FAIL'
    let message: string | undefined

    if (res.status === expectedStatus) {
      status = 'PASS'
    } else if (res.status === 401 && expectedStatus === 200) {
      status = 'WARN'
      message = `Uautorisert (${res.status})`
    } else {
      status = 'FAIL'
      message = `Forventa ${expectedStatus}, fekk ${res.status}`
    }

    quickResults.push({ name, status, latency, message })

    const emoji = status === 'PASS' ? 'OK' : status === 'WARN' ? 'WARN' : 'FAIL'
    console.log(`  ${emoji} ${name} — ${res.status} (${latency}ms)` + (message ? ` — ${message}` : ''))
  } catch (err) {
    const latency = Date.now() - start
    quickResults.push({ name, status: 'FAIL', latency, message: (err as Error).message })
    console.log(`  FAIL ${name} — ${err}`)
  }
}

async function main() {
  const BASE = process.env.QUICK_CHECK_URL || 'https://api.tosom.no'
  const ADMIN_TOKEN = process.env.ADMIN_TOKEN || ''

  console.log('\n== ToSom Quick Check ==')
  console.log(`BASE: ${BASE}`)
  console.log(`Start: ${new Date().toISOString()}\n`)

  // Health
  await check('Health', `${BASE}/api/system/health`)
  await check('Latency', `${BASE}/api/system/latency`)

  // Observability
  if (ADMIN_TOKEN) {
    await check('Observability', `${BASE}/api/admin/observability/metrics`, 200, { Authorization: `Bearer ${ADMIN_TOKEN}` })
    await check('Security', `${BASE}/api/admin/security/overview`, 200, { Authorization: `Bearer ${ADMIN_TOKEN}` })
  }

  // Summary
  const pass = quickResults.filter((r) => r.status === 'PASS').length
  const warn = quickResults.filter((r) => r.status === 'WARN').length
  const fail = quickResults.filter((r) => r.status === 'FAIL').length

  console.log(`\n== Result: ${pass} PASS, ${warn} WARN, ${fail} FAIL ==\n`)

  if (fail > 0) {
    console.log('Failed checks:')
    quickResults.filter((r) => r.status === 'FAIL').forEach((r) => console.log(`  - ${r.name}: ${r.message}`))
    process.exit(1)
  }

  console.log('Alle checks OK!')
  process.exit(0)
}

main().catch((err) => {
  console.error('Quick Check feila:', err)
  process.exit(1)
})
