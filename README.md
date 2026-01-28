# Moltbot Skills Library by Bankr & Community

Public repository of skills for [Moltbot](https://github.com/BankrBot/moltbot-skills) (formerly Clawdbot) — including first-party [Bankr](https://bankr.bot) skills and community-contributed skills from other providers.

## Structure

Each top-level directory is a provider. Each subdirectory within a provider is an installable skill containing a `SKILL.md` and other skill related files.

```
moltbot-skills/
├── bankr/                        # Bankr (first-party)
│   ├── SKILL.md
│   ├── references/
│   │   ├── token-trading.md
│   │   ├── leverage-trading.md
│   │   ├── polymarket.md
│   │   ├── automation.md
│   │   ├── token-deployment.md
│   │   └── ...
│   └── scripts/
│       └── bankr.sh
│
├── clawdia/                      # Clawdia (community)
│   └── x-engagement/
│       └── SKILL.md
│
├── base/                         # Base (placeholder)
│   └── SKILL.md
├── neynar/                       # Neynar (placeholder)
│   └── SKILL.md
└── zapper/                       # Zapper (placeholder)
    └── SKILL.md
```

## Available Skills

| Provider | Skill | Description |
|----------|-------|-------------|
| [bankr](https://bankr.bot) | [bankr](bankr/) | AI-powered crypto trading agent via natural language. Trade, manage portfolios, automate DeFi operations. |
| [clawdia](https://x.com/Clawdia_ETH) | [x-engagement](clawdia/x-engagement/) | Twitter/X engagement skill for AI agents. Algorithm optimization, automated account setup, engagement patterns. |
| base | — | Placeholder |
| neynar | — | Placeholder |
| zapper | — | Placeholder |

## Install Instructions

Give Moltbot the URL to this repo and it will let you choose which skill to install.

```
https://github.com/BankrBot/moltbot-skills
```
