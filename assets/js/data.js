/* Site content. Edit this file to add categories, posts and KQL queries.
   The post entries are sample placeholders: swap them for real articles. */

window.MW = window.MW || {};

MW.icons = {
  shield: '<path d="M12 3 4 6v6c0 4.5 3.4 8.4 8 9 4.6-.6 8-4.5 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/>',
  radar: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 12 18 6"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/>',
  id: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2.2"/><path d="M5.8 16c.6-1.6 1.8-2.4 3.2-2.4s2.6.8 3.2 2.4M14 10h4M14 13.5h3"/>',
  device: '<rect x="3" y="4" width="13" height="10" rx="1.5"/><path d="M7 18h5M9.5 14v4"/><rect x="17" y="8" width="4" height="12" rx="1"/>',
  data: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>',
  cloud: '<path d="M7 18a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 18 9.5a4.3 4.3 0 0 1-.5 8.5H7Z"/><path d="m10 13.5 1.6 1.6 3.4-3.4"/>',
  graph: '<circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><circle cx="12" cy="10" r="2"/><path d="M6.7 7.1 10.3 9M17.3 7.1 13.7 9M12 12v4"/>',
  user: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c1.2-3.5 3.8-5 7-5s5.8 1.5 7 5"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 8-8M16 7l2 2M14 9l2 2"/>',
  server: '<rect x="4" y="4" width="16" height="7" rx="1.5"/><rect x="4" y="13" width="16" height="7" rx="1.5"/><path d="M8 7.5h.01M8 16.5h.01"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.7 5.6 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3Z"/>',
  bucket: '<path d="M4 7h16l-1.6 12.2a2 2 0 0 1-2 1.8H7.6a2 2 0 0 1-2-1.8L4 7Z"/><ellipse cx="12" cy="7" rx="8" ry="2.5"/>',
  bug: '<rect x="7" y="8" width="10" height="12" rx="5"/><path d="M12 8V5M9 5l1 2M15 5l-1 2M3 13h4M17 13h4M4 18l3-2M20 18l-3-2M4 8l3 2M20 8l-3 2"/>'
};

MW.categories = [
  { id: 'defender', name: 'Defender XDR', short: 'Defender', icon: 'shield', accent: '#3b82f6',
    blurb: 'Endpoint, identity, email and app signals stitched into a single incident queue.' },
  { id: 'sentinel', name: 'Microsoft Sentinel', short: 'Sentinel', icon: 'radar', accent: '#22d3ee',
    blurb: 'Cloud-native SIEM: analytics rules, KQL hunting, playbooks and data connectors.' },
  { id: 'entra', name: 'Entra ID', short: 'Entra', icon: 'id', accent: '#8b5cf6',
    blurb: 'Conditional Access, PIM, workload identities and identity threat detection.' },
  { id: 'intune', name: 'Intune', short: 'Intune', icon: 'device', accent: '#34d399',
    blurb: 'Device compliance, attack surface reduction and baselines that actually stick.' },
  { id: 'purview', name: 'Purview', short: 'Purview', icon: 'data', accent: '#ec4899',
    blurb: 'Sensitivity labels, DLP and insider risk, from the data outwards.' },
  { id: 'mdc', name: 'Defender for Cloud', short: 'MDC', icon: 'cloud', accent: '#fbbf24',
    blurb: 'CSPM, workload protection and multicloud posture across Azure, AWS and GCP.' },
  { id: 'wiz', name: 'Wiz.io', short: 'Wiz.io', icon: 'graph', accent: '#818cf8', wide: true,
    blurb: 'Agentless cloud security: the security graph, toxic combinations, attack paths, and how Wiz.io plays alongside the Microsoft stack.' }
];

MW.posts = [
  { slug: 'wiz-to-sentinel-toxic-combinations', cat: 'wiz', featured: true, level: 3, read: 14, date: '2026-11-04',
    title: 'Piping Wiz.io toxic combinations into Sentinel incidents',
    excerpt: 'Correlate Wiz.io issues with Defender XDR alerts so your SOC sees the attack path, not just the alert. Data connector, KQL enrichment and an automation rule, end to end.' },
  { slug: 'conditional-access-baseline-2026', cat: 'entra', level: 2, read: 11, date: '2026-10-28',
    title: 'A Conditional Access baseline for 2026',
    excerpt: 'Twelve policies, named locations and a break-glass design that survives a token theft attempt.' },
  { slug: 'hunting-aitm-phishing-xdr', cat: 'defender', level: 3, read: 9, date: '2026-10-21',
    title: 'Hunting AiTM phishing with Defender XDR advanced hunting',
    excerpt: 'Spot session cookie replay by joining sign-in, email and cloud app events, with queries you can paste straight in.' },
  { slug: 'sentinel-cost-tuning', cat: 'sentinel', level: 2, read: 8, date: '2026-10-14',
    title: 'Cutting Sentinel ingest costs without going blind',
    excerpt: 'Basic and Auxiliary logs, transformation rules and the tables you should never filter.' },
  { slug: 'wiz-security-graph-primer', cat: 'wiz', level: 1, read: 7, date: '2026-10-07',
    title: 'The Wiz.io security graph, explained for Azure admins',
    excerpt: 'How Wiz.io models identities, network exposure and secrets, and what that means for your landing zone.' },
  { slug: 'intune-asr-rollout', cat: 'intune', level: 2, read: 10, date: '2026-09-30',
    title: 'Rolling out ASR rules with Intune, without breaking finance',
    excerpt: 'Audit mode, exclusions that are actually safe and a phased ring deployment that keeps users happy.' },
  { slug: 'purview-dlp-copilot', cat: 'purview', level: 2, read: 9, date: '2026-09-23',
    title: 'Purview DLP guardrails for Copilot and AI apps',
    excerpt: 'Labels, DLP for AI interactions and DSPM for AI: keep sensitive data out of prompts and responses.' },
  { slug: 'mdc-vs-wiz-cspm', cat: 'mdc', level: 2, read: 12, date: '2026-09-16',
    title: 'Defender for Cloud CSPM and Wiz.io: overlap, gaps and running both',
    excerpt: 'A practitioner\'s comparison of attack path analysis, agentless scanning and where each tool earns its keep.' },
  { slug: 'workload-identity-hardening', cat: 'entra', level: 3, read: 13, date: '2026-09-09',
    title: 'Hardening workload identities: service principals are the new admins',
    excerpt: 'Find over-privileged apps, enforce credential hygiene and alert on new secrets before attackers use them.' },
  { slug: 'sentinel-playbook-isolate', cat: 'sentinel', level: 2, read: 8, date: '2026-09-02',
    title: 'A Sentinel playbook that isolates devices, with an approval step',
    excerpt: 'Logic Apps, Teams adaptive cards and the Defender API: containment with a human in the loop.' },
  { slug: 'xdr-attack-disruption', cat: 'defender', level: 1, read: 6, date: '2026-08-26',
    title: 'Automatic attack disruption: what it does and what it won\'t',
    excerpt: 'Which scenarios trigger it, how to prepare your tenant and how to read the action centre afterwards.' },
  { slug: 'wiz-code-to-cloud', cat: 'wiz', level: 2, read: 10, date: '2026-08-19',
    title: 'Code-to-cloud with Wiz.io and Azure DevOps pipelines',
    excerpt: 'Scan IaC and container images in the pipeline and trace a cloud risk back to the commit that introduced it.' }
];

MW.kql = [
  { id: 'aitm', title: 'Session cookie replay', table: 'AADSignInEventsBeta', cat: 'defender',
    desc: 'Flags sessions where the same <code>SessionId</code> appears from more than one country within an hour, a common sign of AiTM token theft.',
    code:
`// Same session, different countries, short window
AADSignInEventsBeta
| where Timestamp > ago(1d)
| where ErrorCode == 0 and isnotempty(SessionId)
| summarize Countries = make_set(Country),
            IPs = make_set(IPAddress),
            First = min(Timestamp), Last = max(Timestamp)
    by SessionId, AccountUpn
| where array_length(Countries) > 1
| where datetime_diff('minute', Last, First) < 60
| order by Last desc` },
  { id: 'spcred', title: 'New SP credential', table: 'AuditLogs', cat: 'entra',
    desc: 'Alerts when a secret or certificate is added to a service principal or app registration. Pair with a watchlist of approved automation accounts.',
    code:
`AuditLogs
| where TimeGenerated > ago(7d)
| where OperationName has_any ("Add service principal credentials",
                               "Update application – Certificates and secrets management")
| extend Actor = coalesce(tostring(InitiatedBy.user.userPrincipalName),
                          tostring(InitiatedBy.app.displayName))
| extend Target = tostring(TargetResources[0].displayName)
| project TimeGenerated, OperationName, Actor, Target, Result
| order by TimeGenerated desc` },
  { id: 'encps', title: 'Encoded PowerShell', table: 'DeviceProcessEvents', cat: 'defender',
    desc: 'Finds base64-encoded PowerShell launched by Office apps or script hosts, then decodes the payload so you can read it in the results.',
    code:
`DeviceProcessEvents
| where Timestamp > ago(3d)
| where FileName in~ ("powershell.exe", "pwsh.exe")
| where ProcessCommandLine matches regex @"(?i)-e(nc|ncodedcommand)?\\s+[A-Za-z0-9+/=]{40,}"
| where InitiatingProcessFileName in~ ("winword.exe", "excel.exe", "wscript.exe", "mshta.exe")
| extend Encoded = extract(@"([A-Za-z0-9+/=]{40,})", 1, ProcessCommandLine)
| extend Decoded = base64_decode_tostring(Encoded)
| project Timestamp, DeviceName, AccountName, InitiatingProcessFileName, Decoded` },
  { id: 'wizcrit', title: 'Wiz.io criticals + XDR alerts', table: 'WizIssues_CL', cat: 'wiz',
    desc: 'Joins critical Wiz.io issues with Defender for Cloud alerts on the same resource. Assumes Wiz.io issues are ingested into a custom table called <code>WizIssues_CL</code>: rename the table and columns to match your connector.',
    code:
`let wiz = WizIssues_CL
    | where TimeGenerated > ago(1d)
    | where Severity == "CRITICAL" and Status == "OPEN"
    | project ResourceId = tolower(ResourceId), WizIssue = Title, WizUrl;
SecurityAlert
| where TimeGenerated > ago(1d)
| where ProviderName == "Azure Security Center"
| mv-expand Entity = todynamic(Entities)
| extend ResourceId = tolower(tostring(Entity.ResourceId))
| join kind=inner wiz on ResourceId
| project TimeGenerated, AlertName, AlertSeverity, ResourceId, WizIssue, WizUrl` }
];

MW.consoleSnippets = {
  sentinel: {
    file: 'hunt/impossible-travel.kql',
    rows: '3 rows · 0.41s',
    code:
`// Sign-ins from risky IPs after MFA fatigue
SigninLogs
| where TimeGenerated > ago(24h)
| where ResultType == 0
| where RiskLevelDuringSignIn in ("high", "medium")
| summarize Attempts = count(),
            Apps = make_set(AppDisplayName)
    by UserPrincipalName, IPAddress
| where Attempts > 5
| order by Attempts desc`
  },
  defender: {
    file: 'xdr/lsass-access.kql',
    rows: '1 row · 0.27s',
    code:
`// Credential dumping via LSASS access
DeviceEvents
| where Timestamp > ago(7d)
| where ActionType == "OpenProcessApiCall"
| where FileName =~ "lsass.exe"
| where InitiatingProcessFileName !in~ ("MsMpEng.exe", "svchost.exe")
| project Timestamp, DeviceName,
          InitiatingProcessFileName,
          InitiatingProcessAccountName
| take 50`
  },
  wiz: {
    file: 'wiz/critical-exposed.graphql',
    rows: '7 issues · 0.63s',
    code:
`# Critical, internet-exposed, open issues
query CriticalExposure {
  issuesV2(
    first: 50
    filterBy: {
      severity: [CRITICAL]
      status: [OPEN]
    }
  ) {
    nodes { id  sourceRule { name }  entitySnapshot { name type } }
  }
}`
  }
};
