// api/submit-chat.js
const Anthropic = require(’@anthropic-ai/sdk’);
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = require(‘docx’);
const { Resend } = require(‘resend’);

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {
if (req.method !== ‘POST’) {
return res.status(405).json({ error: ‘Method not allowed’ });
}

try {
const data = req.body;
const isPro = data.product === ‘pro’ || data.product === ‘pro-domain’;
const isProDomain = data.product === ‘pro-domain’;
const needsNameSuggestions = data.has_name === ‘I need suggestions’;

```
// Generate all documents
const [businessStudy, businessPlan, nameSuggestions, advice, formationChecklist] = await Promise.all([
  generateBusinessStudy(data),
  generateBusinessPlan(data),
  needsNameSuggestions ? generateNameSuggestions(data) : null,
  generateAdvice(data),
  isPro ? generateFormationChecklist(data) : null
]);

// Create Word docs
const studyDoc = await createWordDoc(businessStudy, 'Business Study', data);
const planDoc = await createWordDoc(businessPlan, 'Business Plan', data);

// Email everything to William
await emailToWilliam(data, {
  studyDoc, planDoc, nameSuggestions, advice, formationChecklist,
  isPro, isProDomain, needsNameSuggestions
});

res.status(200).json({ success: true });
```

} catch (error) {
console.error(‘Error:’, error);
res.status(500).json({ error: ‘Failed to process’ });
}
};

async function generateBusinessStudy(data) {
const resp = await anthropic.messages.create({
model: ‘claude-sonnet-4-20250514’,
max_tokens: 3000,
messages: [{
role: ‘user’,
content: `Create a professional Business Study for:

Business: ${data.business_name || ‘TBC’}
Description: ${data.business_description}
Target Customers: ${data.target_customers}
Location: ${data.location}
Competitors: ${data.competitors || ‘To research’}

Sections needed:

1. EXECUTIVE SUMMARY
1. MARKET OVERVIEW - size, trends in ${data.location}
1. TARGET AUDIENCE - demographics, needs, pain points
1. COMPETITOR ANALYSIS - strengths, weaknesses
1. SWOT ANALYSIS
1. PRICING STRATEGY
1. KEY OPPORTUNITIES (top 5)
1. RECOMMENDATIONS

British English. Specific and actionable.`
}]
});
return resp.content[0].text;
}

async function generateBusinessPlan(data) {
const resp = await anthropic.messages.create({
model: ‘claude-sonnet-4-20250514’,
max_tokens: 4000,
messages: [{
role: ‘user’,
content: `Create a professional Business Plan for banks/investors:

Business: ${data.business_name || ‘TBC’}
Description: ${data.business_description}
Target Customers: ${data.target_customers}
Location: ${data.location}
Year 1 Goals: ${data.year_one_goals || ‘Establish and grow’}
Competitors: ${data.competitors || ‘Various’}

Sections:

1. EXECUTIVE SUMMARY
1. BUSINESS DESCRIPTION
1. PRODUCTS/SERVICES
1. MARKET ANALYSIS
1. COMPETITIVE ANALYSIS
1. MARKETING & SALES STRATEGY
1. OPERATIONS PLAN
1. FINANCIAL PROJECTIONS (startup costs, monthly revenue, break-even)
1. MILESTONES (months 1, 3, 6, 12)

British English. Realistic for new UK business.`
}]
});
return resp.content[0].text;
}

async function generateNameSuggestions(data) {
const resp = await anthropic.messages.create({
model: ‘claude-sonnet-4-20250514’,
max_tokens: 1500,
messages: [{
role: ‘user’,
content: `Suggest 10 business names with .co.uk domains (domains should be simple, likely available, registrable for around £10):

Business: ${data.business_description}
Customers: ${data.target_customers}
Location: ${data.location}
Preferences: ${data.name_preferences || ‘No specific preference’}

For each:

1. Business name
1. Domain (e.g. smithplumbing.co.uk)
1. Why it works (one line)

Names should be memorable, easy to spell, professional but friendly.`
}]
});
return resp.content[0].text;
}

async function generateAdvice(data) {
const resp = await anthropic.messages.create({
model: ‘claude-sonnet-4-20250514’,
max_tokens: 2000,
messages: [{
role: ‘user’,
content: `Give friendly, practical startup advice for:

Business: ${data.business_name || ‘TBC’}
Description: ${data.business_description}
Customers: ${data.target_customers}
Location: ${data.location}
Goals: ${data.year_one_goals || ‘Get started’}
Additional info: ${data.additional_info || ‘None’}

Cover:

1. FIRST STEPS - what to do in week 1
1. QUICK WINS - easy things to get momentum
1. COMMON MISTAKES TO AVOID
1. MONEY TIPS - keeping costs low, pricing right
1. MARKETING IDEAS - free/cheap ways to get customers
1. USEFUL RESOURCES - websites, tools, organisations

Friendly tone, practical British advice. Like a helpful mate who’s been there.`
}]
});
return resp.content[0].text;
}

async function generateFormationChecklist(data) {
const resp = await anthropic.messages.create({
model: ‘claude-sonnet-4-20250514’,
max_tokens: 1500,
messages: [{
role: ‘user’,
content: `Create a company formation checklist/paperwork summary for:

Business Name: ${data.business_name || ‘TBC’}
Description: ${data.business_description}
Location: ${data.location}

Include:

1. COMPANY DETAILS NEEDED
- Proposed company name(s)
- SIC codes (suggest appropriate ones)
- Registered office address
1. DIRECTOR DETAILS NEEDED
- Full name, DOB, nationality
- Residential address
- Service address
1. SHAREHOLDER DETAILS
- Share structure recommendation
1. DOCUMENTS TO PREPARE
- Memorandum
- Articles of Association
1. POST-FORMATION TASKS
- Corporation tax registration
- Business bank account
- Any licenses needed for this business type

Format as a clear checklist William can use.`
}]
});
return resp.content[0].text;
}

async function createWordDoc(content, title, data) {
const paragraphs = [
new Paragraph({
children: [new TextRun({ text: title.toUpperCase(), bold: true, size: 48 })],
heading: HeadingLevel.TITLE,
alignment: AlignmentType.CENTER,
spacing: { after: 200 }
}),
new Paragraph({
children: [new TextRun({ text: data.business_name || ‘Business Name TBC’, size: 32 })],
alignment: AlignmentType.CENTER,
spacing: { after: 200 }
}),
new Paragraph({
children: [new TextRun({ text: `Prepared for ${data.customer_name}`, italics: true, size: 24 })],
alignment: AlignmentType.CENTER,
spacing: { after: 100 }
}),
new Paragraph({
children: [new TextRun({ text: `by StartRight UK - ${new Date().toLocaleDateString('en-GB')}`, size: 22 })],
alignment: AlignmentType.CENTER,
spacing: { after: 400 }
}),
];

content.split(’\n’).forEach(line => {
if (line.match(/^\d+.\s+[A-Z]/)) {
paragraphs.push(new Paragraph({
children: [new TextRun({ text: line, bold: true, size: 28 })],
heading: HeadingLevel.HEADING_1,
spacing: { before: 300, after: 150 }
}));
} else if (line.trim()) {
paragraphs.push(new Paragraph({
children: [new TextRun({ text: line, size: 24 })],
spacing: { after: 120 }
}));
}
});

const doc = new Document({ sections: [{ children: paragraphs }] });
return await Packer.toBuffer(doc);
}

async function emailToWilliam(data, docs) {
const productNames = {
‘premium’: ‘Premium (£29)’,
‘pro’: ‘Pro (£99)’,
‘pro-domain’: ‘Pro + Domain (£109)’,
‘business-plan’: ‘Business Plan (£29)’,
‘market-study’: ‘Market Study (£29)’
};

let html = `
<h2>🆕 New Order from Charlie Chatbot</h2>
<p><strong>Package:</strong> ${productNames[data.product] || data.product}</p>

```
<h3>Customer Details</h3>
<ul>
  <li><strong>Name:</strong> ${data.customer_name}</li>
  <li><strong>Email:</strong> <a href="mailto:${data.customer_email}">${data.customer_email}</a></li>
</ul>

<h3>Business Details</h3>
<ul>
  <li><strong>Business Name:</strong> ${data.business_name || 'Needs suggestions'}</li>
  <li><strong>Description:</strong> ${data.business_description}</li>
  <li><strong>Target Customers:</strong> ${data.target_customers}</li>
  <li><strong>Location:</strong> ${data.location}</li>
  <li><strong>Year 1 Goals:</strong> ${data.year_one_goals || 'Not specified'}</li>
  <li><strong>Competitors:</strong> ${data.competitors || 'Not specified'}</li>
  <li><strong>Additional Info:</strong> ${data.additional_info || 'None'}</li>
</ul>
```

`;

if (docs.needsNameSuggestions && docs.nameSuggestions) {
html += `<h3>📝 Name Suggestions (customer requested)</h3> <div style="background:#fef3c7;padding:16px;border-radius:8px;margin:16px 0;"> <pre style="white-space:pre-wrap;font-family:inherit;">${docs.nameSuggestions}</pre> </div>`;
}

html += `<h3>💡 Personalised Advice</h3> <div style="background:#f0fdf4;padding:16px;border-radius:8px;margin:16px 0;"> <pre style="white-space:pre-wrap;font-family:inherit;">${docs.advice}</pre> </div>`;

if (docs.isPro && docs.formationChecklist) {
html += `<h3>📋 Formation Checklist (Pro Package)</h3> <div style="background:#eff6ff;padding:16px;border-radius:8px;margin:16px 0;"> <pre style="white-space:pre-wrap;font-family:inherit;">${docs.formationChecklist}</pre> </div>`;
}

if (docs.isProDomain) {
html += `<div style="background:#fce7f3;padding:16px;border-radius:8px;margin:16px 0;"> <strong>⚠️ Pro + Domain Package:</strong> Remember to register domain and set up email for this customer! </div>`;
}

html += `<hr> <p><strong>📎 Attached Documents:</strong></p> <ul> <li>Business Study (Word doc)</li> <li>Business Plan (Word doc)</li> </ul> <p>Review, edit if needed, then send to customer at <a href="mailto:${data.customer_email}">${data.customer_email}</a></p>`;

const attachments = [
{
filename: `Business-Study-${data.customer_name.replace(/\s+/g, '-')}.docx`,
content: docs.studyDoc.toString(‘base64’)
},
{
filename: `Business-Plan-${data.customer_name.replace(/\s+/g, '-')}.docx`,
content: docs.planDoc.toString(‘base64’)
}
];

await resend.emails.send({
from: ‘StartRight Orders [orders@start-right.uk](mailto:orders@start-right.uk)’,
to: ‘info@start-right.uk’,
subject: `🆕 New ${productNames[data.product] || 'Order'} - ${data.customer_name}`,
html,
attachments
});
}

