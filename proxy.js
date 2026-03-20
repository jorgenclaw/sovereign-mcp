// proxy.js - MCP stdio bridge to sovereign-mcp hosted service
// This file allows Glama to inspect the server's tools without payment
const REMOTE = 'https://mcp.jorgenclaw.ai/mcp';

let buf = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (d) => {
  buf += d;
  let nl;
  while ((nl = buf.indexOf('\n')) !== -1) {
    const line = buf.slice(0, nl).trim();
    buf = buf.slice(nl + 1);
    if (line) handle(line);
  }
});

async function handle(line) {
  try {
    const msg = JSON.parse(line);
    const res = await fetch(REMOTE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
      },
      body: JSON.stringify(msg),
    });
    const text = await res.text();
    // Parse SSE format: "event: message\ndata: {...}\n\n"
    let json;
    for (const l of text.split('\n')) {
      if (l.startsWith('data: ')) {
        json = JSON.parse(l.slice(6));
        break;
      }
    }
    if (!json) json = JSON.parse(text);
    process.stdout.write(JSON.stringify(json) + '\n');
  } catch (e) {
    const err = { jsonrpc: '2.0', id: null, error: { code: -32603, message: String(e) } };
    process.stdout.write(JSON.stringify(err) + '\n');
  }
}
