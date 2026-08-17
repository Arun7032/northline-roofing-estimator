import { ApiLog } from '../models/ApiLog.js';

export function apiLogger(req, res, next) {
  const started = Date.now();
  res.on('finish', () => {
    ApiLog.create({
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      duration_ms: Date.now() - started,
      ip: req.ip,
      user_agent: req.get('user-agent'),
      actor: req.owner?.username || 'public'
    }).catch(() => {});
  });
  next();
}
