// Landing page for browsers visiting the root URL. API clients still receive JSON from "/".

export const landingHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>LedgerLink API</title>
  <style>
    :root { --bg:#ffffff; --fg:#14181f; --muted:#5b6472; --card:#f4f6f9; --border:#e2e6ec; --accent:#1a56db; --btn-fg:#ffffff; }
    @media (prefers-color-scheme: dark) {
      :root { --bg:#0f1319; --fg:#e8ecf2; --muted:#9aa4b2; --card:#171d26; --border:#262e3a; --accent:#6ea0ff; --btn-fg:#0f1319; }
    }
    * { box-sizing: border-box; }
    body { margin:0; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif; background:var(--bg); color:var(--fg); line-height:1.5; }
    main { max-width:720px; margin:0 auto; padding:56px 20px; }
    h1 { font-size:2rem; margin:0 0 6px; }
    .lead { color:var(--muted); margin:0 0 20px; }
    .status { display:flex; align-items:center; gap:8px; font-size:.9rem; color:var(--muted); margin-bottom:24px; }
    .dot { width:9px; height:9px; border-radius:50%; background:#9aa4b2; }
    .dot.ok { background:#1f9d55; } .dot.bad { background:#d64545; }
    .actions { display:flex; gap:12px; flex-wrap:wrap; margin-bottom:32px; }
    a.btn { padding:10px 18px; border-radius:8px; text-decoration:none; font-weight:600; border:1px solid var(--border); color:var(--fg); }
    a.btn.primary { background:var(--accent); border-color:var(--accent); color:var(--btn-fg); }
    ul { list-style:none; padding:0; margin:0 0 28px; display:grid; gap:10px; }
    li { background:var(--card); border:1px solid var(--border); border-radius:8px; padding:12px 14px; }
    li b { display:block; }
    li span { color:var(--muted); font-size:.92rem; }
    .hint { color:var(--muted); font-size:.92rem; }
    code { background:var(--card); padding:2px 6px; border-radius:4px; }
  </style>
</head>
<body>
  <main>
    <h1>LedgerLink API</h1>
    <p class="lead">A financial-ledger REST API built with Node.js, Express, TypeScript, and PostgreSQL.</p>
    <div class="status"><span id="dot" class="dot"></span><span id="status">Checking database...</span></div>
    <div class="actions">
      <a class="btn primary" href="/docs">Open API docs</a>
      <a class="btn" href="https://github.com/Isha2004-coder/ledgerlink-api">View source on GitHub</a>
    </div>
    <ul>
      <li><b>Authentication</b><span>Passwords hashed with bcrypt, JWT sessions that expire after 1 hour.</span></li>
      <li><b>Validation</b><span>Zod checks every request body before it reaches the database.</span></li>
      <li><b>Rate limiting</b><span>60 requests per minute per client.</span></li>
      <li><b>Database</b><span>PostgreSQL with an indexed transactions table. The schema is created automatically at startup.</span></li>
      <li><b>Deployment</b><span>Docker container deployed on Render.</span></li>
    </ul>
    <p class="hint">To try it: open the docs, run <code>POST /auth/signup</code> and <code>POST /auth/login</code>, then paste the token into <b>Authorize</b> to call the protected routes.</p>
  </main>
  <script>
    fetch("/health/db")
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var ok = d && d.ok === true;
        document.getElementById("dot").className = "dot " + (ok ? "ok" : "bad");
        document.getElementById("status").textContent = ok ? "Database connected" : "Database unavailable";
      })
      .catch(function () {
        document.getElementById("dot").className = "dot bad";
        document.getElementById("status").textContent = "Status unavailable";
      });
  </script>
</body>
</html>`;
