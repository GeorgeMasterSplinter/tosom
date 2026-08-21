/**
 * Tosom — Latency-wrapper for API-ruter
 *
 * Legger måling rundt en route handler uten å endre logikken.
 * Generisk slik at både NextRequest/Request og NextResponse/Response fungerer.
 */

import { recordMetric } from './metric';

type Handler<Req, Res> = (req: Req, ctx?: unknown) => Promise<Res>;

export function withMetrics<Req extends Request, Res extends Response>(
  routeName: string,
  handler: Handler<Req, Res>,
): (req: Req, ctx?: unknown) => Promise<Res> {
  return async (req, ctx) => {
    const started = Date.now();
    try {
      const res = await handler(req, ctx);
      recordMetric('api.latency_ms', Date.now() - started, 'ms', {
        route: routeName,
        status: res.status,
      });
      if (res.status >= 500) {
        recordMetric('error.5xx', 1, 'count', { route: routeName });
      }
      return res;
    } catch (err) {
      recordMetric('api.latency_ms', Date.now() - started, 'ms', {
        route: routeName,
        status: 500,
      });
      recordMetric('error.5xx', 1, 'count', { route: routeName });
      throw err;
    }
  };
}