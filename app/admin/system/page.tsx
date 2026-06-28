'use client';

import GlassCard from '@/components/ui/cards/GlassCard';

const mockSystem = {
  cronJobs: [
    { name: 'Matching run', schedule: '0 0 * * *', lastRun: '2026-06-25 00:00', status: 'ok', nextRun: '2026-06-26 00:00' },
    { name: 'Journey progress', schedule: '*/6 * * * *', lastRun: '2026-06-25 09:00', status: 'ok', nextRun: '2026-06-25 10:00' },
    { name: 'AI quota reset', schedule: '0 0 1 * *', lastRun: '2026-06-01 00:00', status: 'ok', nextRun: '2026-07-01 00:00' },
    { name: 'DB backup', schedule: '0 2 * * *', lastRun: '2026-06-25 02:00', status: 'ok', nextRun: '2026-06-26 02:00' },
    { name: 'Log rotation', schedule: '0 0 * * 0', lastRun: '2026-06-22 00:00', status: 'warning', nextRun: '2026-06-29 00:00' },
    { name: 'Cache purge', schedule: '0 */4 * * *', lastRun: '2026-06-25 08:00', status: 'ok', nextRun: '2026-06-25 12:00' },
    { name: 'Analytics sync', schedule: '0 */12 * * *', lastRun: '2026-06-25 06:00', status: 'ok', nextRun: '2026-06-25 18:00' },
    { name: 'Health check', schedule: '*/5 * * * *', lastRun: '2026-06-25 09:40', status: 'ok', nextRun: '2026-06-25 09:45' },
  ],
  apiStats: {
    totalRequests: 45678,
    errors: 91,
    errorRate: 0.002,
    avgLatency: 142,
    p95Latency: 380,
    p99Latency: 890,
  },
  db: {
    status: 'connected',
    latency: 45,
    connections: 12,
    maxConnections: 100,
    size: '2.4 GB',
  },
  deploy: {
    version: 'v3.2.1',
    status: 'deployed',
    region: 'oslo',
    deployedAt: '2026-06-24 14:30',
    branch: 'main',
    commit: 'a1b2c3d',
  },
  logs: [
    { time: '09:42:15', level: 'INFO', message: 'Matching run completed — 3 new matches' },
    { time: '09:30:00', level: 'INFO', message: 'Journey progress sync completed' },
    { time: '09:15:42', level: 'WARNING', message: 'AI quota at 67% — monitoring' },
    { time: '09:00:01', level: 'INFO', message: 'Cron job "journey-progress" executed' },
    { time: '08:45:33', level: 'ERROR', message: 'Rate limit exceeded for /api/chat/send' },
    { time: '08:30:00', level: 'INFO', message: 'DB backup completed successfully' },
    { time: '08:00:12', level: 'INFO', message: 'Cache purge completed' },
    { time: '07:15:44', level: 'WARNING', message: 'High latency on /api/match (890ms)' },
  ],
};

export default function AdminSystemPage() {
  return (
    <div className="flex flex-col gap-6 p-8 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-white/90">System status</h1>
        <p className="text-sm text-white/40 mt-1">Cron-jobbar, API-feil, DB-status og deploy-info</p>
      </div>

      {/* Deploy info */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white/70 mb-2">Deploy</h3>
            <div className="flex items-center gap-4">
              <div>
                <div className="text-xs text-white/40">Versjon</div>
                <div className="text-sm font-semibold" style={{ color: '#D4AF37' }}>{mockSystem.deploy.version}</div>
              </div>
              <div>
                <div className="text-xs text-white/40">Status</div>
                <div className="text-sm font-semibold flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span style={{ color: '#4DFF88' }}>{mockSystem.deploy.status}</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-white/40">Region</div>
                <div className="text-sm" style={{ color: '#60A5FA' }}>{mockSystem.deploy.region}</div>
              </div>
              <div>
                <div className="text-xs text-white/40">Branch</div>
                <div className="text-sm font-mono" style={{ color: '#FFD437' }}>{mockSystem.deploy.branch}@{mockSystem.deploy.commit}</div>
              </div>
              <div>
                <div className="text-xs text-white/40">Deployed</div>
                <div className="text-sm text-white/60">{mockSystem.deploy.deployedAt}</div>
              </div>
            </div>
          </div>
          <button className="px-4 py-2 rounded-lg text-xs font-medium" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: 'rgba(212,175,55,0.8)' }}>
            Deploy ny versjon
          </button>
        </div>
      </GlassCard>

      {/* DB status */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white/70">Database status</h3>
          <span className="flex items-center gap-1 text-xs font-medium" style={{ color: '#4DFF88' }}>
            <div className="w-2 h-2 rounded-full bg-green-400" />
            {mockSystem.db.status}
          </span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatRow label="Latens" value={`${mockSystem.db.latency}ms`} />
          <StatRow label="Connectors" value={`${mockSystem.db.connections}/${mockSystem.db.maxConnections}`} />
          <StatRow label="Storleik" value={mockSystem.db.size} />
          <StatRow label="Type" value="PostgreSQL" />
        </div>
      </GlassCard>

      {/* API stats */}
      <GlassCard className="p-5">
        <h3 className="text-sm font-semibold text-white/70 mb-4">API statistikk</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatRow label="Total føpørsel" value={mockSystem.apiStats.totalRequests.toLocaleString()} />
          <StatRow label="Feil-rate" value={`${(mockSystem.apiStats.errorRate * 100).toFixed(2)}%`} />
          <StatRow label="Snitt latens" value={`${mockSystem.apiStats.avgLatency}ms`} />
          <StatRow label="P99 latens" value={`${mockSystem.apiStats.p99Latency}ms`} />
        </div>
      </GlassCard>

      {/* Cron jobs */}
      <GlassCard className="p-5">
        <h3 className="text-sm font-semibold text-white/70 mb-4">Cron-jobbar</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Namn', 'Skjema', 'Sist kjørt', 'Status', 'Neste kjøring'].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-white/40 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockSystem.cronJobs.map((job) => (
                <tr key={job.name} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <td className="px-4 py-3 text-sm font-medium text-white/80">{job.name}</td>
                  <td className="px-4 py-3 text-sm font-mono text-white/40">{job.schedule}</td>
                  <td className="px-4 py-3 text-sm text-white/50">{job.lastRun}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                      job.status === 'ok' ? 'bg-[rgba(77,255,136,0.1)] text-[#4DFF88]' : 'bg-[rgba(255,212,55,0.1)] text-[#FFD437]'
                    }`}>{job.status}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-white/50">{job.nextRun}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Log stream */}
      <GlassCard className="p-5">
        <h3 className="text-sm font-semibold text-white/70 mb-4">Logg-strøm</h3>
        <div className="space-y-2">
          {mockSystem.logs.map((log, i) => {
            const levelColors: Record<string, string> = { INFO: '#60A5FA', WARNING: '#FFD437', ERROR: '#FF4D4D' };
            return (
              <div key={i} className="flex items-start gap-3 text-sm p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.01)' }}>
                <span className="text-xs text-white/30 font-mono w-16 flex-shrink-0">{log.time}</span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded flex-shrink-0" style={{ color: levelColors[log.level] || '#60A5FA', background: `${levelColors[log.level] || '#60A5FA'}15` }}>
                  {log.level}
                </span>
                <span className="text-sm text-white/60">{log.message}</span>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
      <div className="text-xs text-white/40">{label}</div>
      <div className="text-lg font-bold mt-1" style={{ color: '#D4AF37' }}>{value}</div>
    </div>
  );
}