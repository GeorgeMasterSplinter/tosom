/**
 * ToSom Smoke Tests
 * 
 * Enkel script for å verifisere at alle kritiske endpoint funger.
 * Køyr med: npx tsx scripts/smoke/smokeTest.ts
 */

// createClient is used for future Supabase integration
// import { createClient } from '@/lib/supabase'

interface Result {
  endpoint: string
  status: 'PASS' | 'FAIL'
  latency: number
  message?: string
}

const results: Result[] = []

async function testEndpoint(
  url: string,
  name: string,
  expectedStatus: number = 200,
  adminToken?: string,
): Promise<void> {
  const start = Date.now()
  try {
    const res = await fetch(url, {
      headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
    })
    const latency = Date.now() - start
    const pass = res.status === expectedStatus
    results.push({
      endpoint: name,
      status: pass ? 'PASS' : 'FAIL',
      latency,
      message: pass ? undefined : `Expected ${expectedStatus}, got ${res.status}`,
    })
    console.log(`  ${pass ? '✓' : '✗'} ${name} — ${res.status} (${latency}ms)`)
  } catch (error) {
    const latency = Date.now() - start
    results.push({
      endpoint: name,
      status: 'FAIL',
      latency,
      message: (error as Error).message,
    })
    console.log(`  ✗ ${name} — ERROR: ${(error as Error).message}`)
  }
}

async function main() {
  const baseUrl = process.env.SMOKE_BASE_URL || 'http://localhost:3000'
  const adminToken = process.env.SMOKE_ADMIN_TOKEN

  console.log(`\n🔍 ToSom Smoke Tests — ${new Date().toISOString()}`)
  console.log(`   Base URL: ${baseUrl}\n`)

  // Health checks
  console.log('Health Checks:')
  await testEndpoint(`${baseUrl}/api/system/health`, 'health')
  await testEndpoint(`${baseUrl}/api/system/latency`, 'latency')

  // Admin checks
  if (adminToken) {
    console.log('\nAdmin Checks:')
    await testEndpoint(`${baseUrl}/api/admin/system/overview`, 'admin system overview', 200, adminToken)
    await testEndpoint(`${baseUrl}/api/admin/observability/metrics`, 'admin observability metrics', 200, adminToken)
    await testEndpoint(`${baseUrl}/api/admin/security/overview`, 'admin security overview', 200, adminToken)
  }

  // AI checks
  console.log('\nAI Checks:')
  await testEndpoint(`${baseUrl}/api/ai/match-insights`, 'AI match-insights', 401)

  // Summary
  const passCount = results.filter((r) => r.status === 'PASS').length
  const failCount = results.filter((r) => r.status === 'FAIL').length

  console.log(`\n${'='.repeat(40)}`)
  console.log(`Resultat: ${passCount} PASS, ${failCount} FAIL`)
  console.log(`${'='.repeat(40)}\n`)

  if (failCount > 0) {
    console.log('Failed tests:')
    results
      .filter((r) => r.status === 'FAIL')
      .forEach((r) => console.log(`  - ${r.endpoint}: ${r.message}`))
    process.exit(1)
  }

  console.log('Alle smoke tests bestått! ✓')
  process.exit(0)
}

main().catch((err) => {
  console.error('Smoke test feila:', err)
  process.exit(1)
})
