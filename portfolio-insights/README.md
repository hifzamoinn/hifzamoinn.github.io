# Hifza Moin — Portfolio Insights

Same analytics system as Muhammad Ashar's portfolio, but completely separate Cloudflare D1 database, Worker and admin secret. The dashboard is public static HTML; actual analytics require a secret administrator token.

## Cloudflare web-dashboard setup (no terminal required)

1. Sign in at https://dash.cloudflare.com and select **Storage & databases → D1 SQL database** (or **Workers & Pages → D1**). Create a D1 database named `hifza-portfolio-insights`.
2. Open its **Console** and run the full SQL in **`portfolio-insights/worker/schema.sql`**. The SQL creates all base, optional return-visit, context, and visitor-journey tables. Use only Hifza's new database.
3. Under **Workers & Pages → Create → Worker**, create `hifza-portfolio-insights`. Open **Edit Code**, replace the starter code with the exact contents of **`portfolio-insights/worker/src/index.js`**, and deploy.
4. On the Worker, open **Settings → Bindings**. Add a **D1 database** binding with variable name **`DB`** and select **`hifza-portfolio-insights`**. Save/deploy.
5. Open **Settings → Variables and Secrets** and create an encrypted **Secret** called **`ADMIN_TOKEN`**. Generate a new random 64-character hex value with a trusted password manager. Save it privately, not in GitHub, and not as a plaintext variable.
6. Under **Settings → Triggers → Cron Triggers**, add daily schedule **`0 3 * * *`** to enforce 90-day automatic cleanup. If your Cloudflare UI differs, search the Worker settings for “Cron Trigger.”
7. Copy the Worker's HTTPS URL (it ends in `.workers.dev`). Check `https://YOUR-WORKER-URL/health` for JSON with `status: ok`.
8. On GitHub, edit **`portfolio-insights/config.js`**. Set `window.HIFZA_INSIGHTS_ENDPOINT = "https://hifza-portfolio-insights.YOUR-SUBDOMAIN.workers.dev";` with your *actual* URL. Commit. There are no tracking requests until this value is configured.
9. Open **https://hifzamoinn.github.io/portfolio-insights/**. Enter the same Worker URL, enter the private admin token, and click **Connect**. The token is used in browser memory only; do not share screenshots of it.
10. Visit the public portfolio from another browser, click projects, scroll, and reopen Insights with the **Last 1 hour** filter. Optional returning-browser and journey data require explicitly selecting **Allow analytics cookies** on the website, then revisiting.

## Capabilities

Time windows, visits, LinkedIn referrals, projects, source domains, scroll depth, section time, client device and approximate country; optional returning-browser recognition, journey paths and repeat-visit timing, region/city/network and browser summaries under informed consent.

## Privacy and limits

- No identity by name, LinkedIn account or employer. Aggregate pageviews are not unique people.
- The static dashboard can be loaded by anybody, but real Worker stats require the secret ADMIN_TOKEN. Cloudflare Access is an option for stricter dashboard privacy.
- Baseline ephemeral analytics and optional analytics cookies have separate privacy behavior. Read `portfolio-insights/privacy.html`.
- Historical visits before activation cannot be recovered. Demo data is fictional and must not be confused with live data.
- Worker requests check Origin and admin bearer token for /stats. Public ingest endpoints still need monitoring and abuse controls if needed.
- The Worker scheduled cleanup retains at most 90 days when its cron is enabled.
- Never reuse Muhammad Ashar's database, Worker, or token: data from both websites must remain separate.

## Optional Wrangler

The included `worker/wrangler.toml` is a CLI template. If you deploy from a terminal, replace its D1 database_id with the ID Cloudflare assigns to Hifza's database, then run Wrangler from the worker folder. This is optional; all steps above can be done through the dashboard.
