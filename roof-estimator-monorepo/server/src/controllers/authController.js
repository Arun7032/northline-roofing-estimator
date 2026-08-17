import jwt from 'jsonwebtoken';

export function login(req, res) {
  const { username, password } = req.body || {};
  if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ username, role: 'owner' }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.cookie('owner_token', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 8 * 60 * 60 * 1000 });
  res.json({ authenticated: true, username });
}

export function me(req, res) { res.json({ authenticated: true, username: req.owner.username, role: req.owner.role }); }
export function logout(req, res) { res.clearCookie('owner_token'); res.json({ authenticated: false }); }
