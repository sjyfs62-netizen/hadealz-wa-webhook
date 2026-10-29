const express = require('express');
const app = express();
app.use(express.json({ type: '*/*' }));
const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN || 'London@2020';
const forwardUrl = process.env.FORWARD_URL || '';

function verify(req, res) {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && token === verifyToken && challenge) {
    console.log('WEBHOOK VERIFIED');
    return res.status(200).type('text/plain').send(String(challenge));
  }
  return res.status(403).end();
}

async function receive(req, res) {
  res.status(200).end();
  console.log('POST', JSON.stringify(req.body));
  if (!forwardUrl) return;
  try {
    await fetch(forwardUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
  } catch (e) {
    console.error('forward', e);
  }
}

app.get('/', verify);
app.get('/webhook', verify);
app.post('/', receive);
app.post('/webhook', receive);

app.listen(port, () => console.log('listening', port, 'verify set'));
