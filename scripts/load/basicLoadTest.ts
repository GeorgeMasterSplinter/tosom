/**
 * ToSom Basic Load Test
 *
 * Simulerer moderat last mot serveren for å måle:
 * - latency (p50, p90, p95, p99, worst-case)
 * - error-rate
 * - stabilitet under trykk
 *
 * Koyrs med: npx tsx scripts/load/basicLoadTest.ts
 */

interface EndpointResult {
  endpoint: string
  totalRequests: number
  success: number
  fail: number
  errorRate: number
  p50: number
  p90: number
  p95: number
  p99: number
  worst: number
  pass: boolean
}

interface TestConfig {
  concurrency: number
  requestsPerWorker: number
  baseUrl: string
  userToken: string
  adminToken: string
}

function parseConfig(): TestConfig {
  const CONCURRENCY = parseInt(process.env.LOAD_CONCURRENCY || '20', 10)
  const REQUESTS_PER_WORKER = parseInt(process.env.LOAD_REQUESTS || '50', 10)
  const baseUrl = process.env.LOAD_BASE_URL || 'http://localhost:3000'
  const userToken = process.env.LOAD_USER_TOKEN || 'dummy-user-token'
  const adminToken = process.env.LOAD_ADMIN_TOKEN || 'dummy-admin-token'

  return {
    concurrency: CONCURRENCY,
    requestsPerWorker: REQUESTS_PER_WORKER,
    baseUrl: baseUrl.replace(/\/$/, ''),
    userToken,
    adminToken,
  }
}

function calcPercentile(sorted: number[], percentile: number): number {
  if (sorted.length === 0) return 0
  const index = Math.floor((percentile / 100) * sorted.length)
  return sorted[Math.min(index, sorted.length - 1)]
}

async function runEndpointTest(
  config: TestConfig,
  url: string,
  label: string,
  headers?: Record<string, string>,
): Promise<EndpointResult> {
  const latencies: number[] = []
  let success = 0
  let fail = 0
  const totalPerWorker = config.requestsPerWorker
  const totalRequests = config.concurrency * totalPerWorker

  console.log(`\n[TEST] ${label}`)
  console.log(`      URL: ${url}`)
  console.log(`      Konkurranse: ${config.concurrency}, Per worker: ${totalPerWorker}`)

  for (let batch = 0; batch < config.concurrency; batch++) {
    const batchPromises: Promise<void>[] = []
    for (let i = 0; i < totalPerWorker; i++) {
      batchPromises.push(
        (async () => {
          const start = Date.now()
          try {
            await fetch(url, { headers })
            latencies.push(Date.now() - start)
            success++
          } catch {
            fail++
          }
        })(),
      )
    }
    await Promise.allSettled(batchPromises)
  }

  const errorRate = totalRequests > 0 ? (fail / totalRequests) * 100 : 0
  const sorted = [...latencies].sort((a, b) => a - b)

  const p50 = calcPercentile(sorted, 50)
  const p90 = calcPercentile(sorted, 90)
  const p95 = calcPercentile(sorted, 95)
  const p99 = calcPercentile(sorted, 99)
  const worst = sorted.length > 0 ? sorted[sorted.length - 1] : 0

  const avg = latencies.length > 0 ? latencies.reduce((a, b) => a + b, 0) / latencies.length : 0

  const pass = errorRate < 5 && p95 < 5000

  console.log(`      Total: ${totalRequests} | Success: ${success} | Fail: ${fail} | Error-rate: ${errorRate.toFixed(1)}%`)
  console.log(`      p50=${p50}ms p90=${p90}ms p95=${p95}ms p99=${p99}ms worst=${worst}ms avg=${avg.toFixed(0)}ms`)
  console.log(`      ${pass ? 'PASS' : 'FAIL'}\n`)

  return {
    endpoint: label,
    totalRequests,
    success,
    fail,
    errorRate,
    p50,
    p90,
    p95,
    p99,
    worst,
    pass,
  }
}

async function main() {
  const config = parseConfig()

  console.log('='.repeat(60))
  console.log(`  ToSom Load Test — ${new Date().toISOString()}`)
  console.log('='.repeat(60))
  console.log(`  BASE_URL:    ${config.baseUrl}`)
  console.log(`  CONCURRENCY: ${config.concurrency}`)
  console.log(`  REQUESTS/WR: ${config.requestsPerWorker}`)
  console.log('='.repeat(60))

  const results: EndpointResult[] = []

  // 1. Health check
  results.push(
    await runEndpointTest(config, `${config.baseUrl}/api/system/health`, 'Health Check'),
  )

  // 2. Latency
  results.push(
    await runEndpointTest(config, `${config.baseUrl}/api/system/latency`, 'Latency Check'),
  )

  // 3. Messages list (requires user token)
  results.push(
    await runEndpointTest(
      config,
      `${config.baseUrl}/api/messages/list`,
      'Messages List',
      { Authorization: `Bearer ${config.userToken}` },
    ),
  )

  // 4. AI message suggestions (requires token)
  const aiUrl = `${config.baseUrl}/api/ai/message-suggestions`
  results.push(
    await runEndpointTest(
      config,
      aiUrl,
      'AI Message Suggestions',
      { Authorization: `Bearer ${config.userToken}`, 'Content-Type': 'application/json' },
    ),
  )

  // 5. Admin system overview (requires admin token)
  results.push(
    await runEndpointTest(
      config,
      `${config.baseUrl}/api/admin/system/overview`,
      'Admin System Overview',
      { Authorization: `Bearer ${config.adminToken}` },
    ),
  )

  // Summary table
  const totalRequests = results.reduce((s, r) => s + r.totalRequests, 0)
  const totalSuccess = results.reduce((s, r) => s + r.success, 0)
  const totalFail = results.reduce((s, r) => s + r.fail, 0)
  const overallErrorRate = totalRequests > 0 ? (totalFail / totalRequests) * 100 : 0
  const passCount = results.filter((r) => r.pass).length
  const failCount = results.length - passCount

  console.log('='.repeat(60))
  console.log(`  SUMMARY`)
  console.log('='.repeat(60))
  console.log(`  Total requests:    ${totalRequests}`)
  console.log(`  Total success:     ${totalSuccess}`)
  console.log(`  Total fail:        ${totalFail}`)
  console.log(`  Overall error-rate:${overallErrorRate.toFixed(1)}%`)
  console.log('='.repeat(60))
  const headerLabel = 'Endpoint'.padEnd(25) + '  p50    p90    p95    p99   worst  errors  result';
  console.log(`  ${headerLabel}`);
  console.log('-'.repeat(60));

  for (const r of results) {
    console.log(
      `  ${r.endpoint.padEnd(25)} ${String(r.p50).padStart(5)}ms ${String(r.p90).padStart(5)}ms ${String(r.p95).padStart(5)}ms ${String(r.p99).padStart(5)}ms ${String(r.worst).padStart(6)}ms ${String(r.fail).padStart(7)}   ${r.pass ? 'PASS' : 'FAIL'}`,
    )
  }

  console.log('='.repeat(60))

  if (overallErrorRate >= 5 || failCount > 0) {
    console.log(`  RESULT: ${failCount} endpoint(s) FAILED, error-rate ${overallErrorRate.toFixed(1)}%`)
    console.log('='.repeat(60))
    process.exit(1)
  }

  console.log('  RESULT: ALL PASSED (error-rate < 5%)')
  console.log('='.repeat(60))
  process.exit(0)
}

main().catch((err) => {
  console.error('Load test feila:', err)
  process.exit(1)
})
