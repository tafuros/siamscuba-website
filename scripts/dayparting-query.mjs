// Day-parting pull: hour x day-of-week heatmap for Siam Scuba Google Ads.
// Read-only GAQL. Outputs JSON to Creative library. Run from Website/ (has google-ads-api + .env.local).
import fs from 'node:fs';
import { GoogleAdsApi } from 'google-ads-api';

const env = fs.readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
const get = (k) => (env.match(new RegExp('^' + k + '=(.*)$', 'm'))?.[1] || '').replace(/^["']|["'\r]+$/g, '');

const client = new GoogleAdsApi({
  client_id: get('GOOGLE_ADS_CLIENT_ID'),
  client_secret: get('GOOGLE_ADS_CLIENT_SECRET'),
  developer_token: get('GOOGLE_ADS_DEVELOPER_TOKEN'),
});
const customer = client.Customer({
  customer_id: get('GOOGLE_ADS_CUSTOMER_ID'),
  login_customer_id: get('GOOGLE_ADS_LOGIN_CUSTOMER_ID'),
  refresh_token: get('GOOGLE_ADS_REFRESH_TOKEN'),
});

// Explicit date window (Google Ads has no LAST_90_DAYS literal).
const END = process.argv[3] || new Date().toISOString().slice(0, 10);
const days = Number(process.argv[2] || 90);
const START = new Date(Date.now() - days * 864e5).toISOString().slice(0, 10);
const RANGE = `${START}..${END} (${days}d)`;
const WHERE = `segments.date BETWEEN '${START}' AND '${END}'`;

const gaql = `
  SELECT
    campaign.name,
    campaign.status,
    segments.day_of_week,
    segments.hour,
    metrics.impressions,
    metrics.clicks,
    metrics.cost_micros,
    metrics.conversions,
    metrics.conversions_value,
    metrics.all_conversions
  FROM campaign
  WHERE ${WHERE} AND campaign.status = 'ENABLED'
`;

// Campaign-level totals for context
const gaqlCamp = `
  SELECT campaign.name, campaign.status,
    metrics.impressions, metrics.clicks, metrics.cost_micros,
    metrics.conversions, metrics.conversions_value, metrics.all_conversions
  FROM campaign
  WHERE ${WHERE}
`;

// Account timezone (segments.hour is reported in this tz)
let accountTz = 'unknown';
try {
  for (const r of await customer.query(`SELECT customer.time_zone, customer.currency_code FROM customer LIMIT 1`)) {
    accountTz = r.customer.time_zone; break;
  }
} catch (e) { accountTz = 'query-failed'; }

function emptyGrid() {
  // days 0..7 (MONDAY..SUNDAY per enum), hours 0..23
  const g = {};
  return g;
}

const rows = await customer.query(gaql);
const grid = {}; // key `${day}-${hour}` => aggregated
const dayTotals = {}, hourTotals = {};
let total = { impressions: 0, clicks: 0, cost: 0, conv: 0, convVal: 0, allConv: 0 };

const DOW = { 2:'MONDAY',3:'TUESDAY',4:'WEDNESDAY',5:'THURSDAY',6:'FRIDAY',7:'SATURDAY',8:'SUNDAY' };
for (const r of rows) {
  const day = DOW[r.segments.day_of_week] || String(r.segments.day_of_week);
  const hour = r.segments.hour;
  const m = r.metrics;
  const rec = {
    impressions: Number(m.impressions || 0),
    clicks: Number(m.clicks || 0),
    cost: Number(m.cost_micros || 0) / 1e6,
    conv: Number(m.conversions || 0),
    convVal: Number(m.conversions_value || 0),
    allConv: Number(m.all_conversions || 0),
  };
  const key = `${day}-${hour}`;
  if (!grid[key]) grid[key] = { day, hour, impressions: 0, clicks: 0, cost: 0, conv: 0, convVal: 0, allConv: 0 };
  for (const k of ['impressions','clicks','cost','conv','convVal','allConv']) grid[key][k] += rec[k];
  dayTotals[day] = dayTotals[day] || { impressions:0,clicks:0,cost:0,conv:0,convVal:0,allConv:0 };
  hourTotals[hour] = hourTotals[hour] || { impressions:0,clicks:0,cost:0,conv:0,convVal:0,allConv:0 };
  for (const k of ['impressions','clicks','cost','conv','convVal','allConv']) { dayTotals[day][k]+=rec[k]; hourTotals[hour][k]+=rec[k]; }
  total.impressions+=rec.impressions; total.clicks+=rec.clicks; total.cost+=rec.cost; total.conv+=rec.conv; total.convVal+=rec.convVal; total.allConv+=rec.allConv;
}

const camps = [];
for (const r of await customer.query(gaqlCamp)) {
  camps.push({
    name: r.campaign.name, status: r.campaign.status,
    impressions: Number(r.metrics.impressions||0), clicks: Number(r.metrics.clicks||0),
    cost: Number(r.metrics.cost_micros||0)/1e6, conv: Number(r.metrics.conversions||0),
    convVal: Number(r.metrics.conversions_value||0), allConv: Number(r.metrics.all_conversions||0),
  });
}

const out = { range: RANGE, start: START, end: END, generated_utc: new Date().toISOString(),
  account_timezone: accountTz, currency: 'THB',
  grid_scope: 'ENABLED campaigns only (heatmap/day-parting)',
  campaigns_scope: 'ALL statuses (context)',
  total, grid: Object.values(grid), dayTotals, hourTotals, campaigns: camps };
const path = new URL('file:///Users/mainfolder/Projects/Creative/Documents/campaign-plans/day-parting/ads-dayparting-data.json');
fs.writeFileSync(path, JSON.stringify(out, null, 2));
console.log('WROTE', path.pathname);
console.log('TOTALS', JSON.stringify(total));
console.log('CAMPAIGNS', camps.length, 'GRID CELLS', Object.values(grid).length);
