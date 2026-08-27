# Policy Profiles

## Overview

Yue AdBlock supports multiple policy profiles to match different user needs and content sensitivities. Each profile is a JSON configuration file in `public/adblock/policies/`.

## Available Profiles

### Balanced (`balanced.json`)

The recommended default profile. Balances ad blocking effectiveness with site compatibility.

- Blocks known trackers and third-party ads
- Enables cookie banner detection
- Moderate cosmetic filtering
- Smart popup handling (allows user-initiated navigations)
- YouTube ad detection enabled

### Aggressive (`aggressive.json`)

Maximum ad blocking for users who want the strictest filtering.

- Broader tracker and ad domain blocking
- Expanded cosmetic selector matching
- Strict popup blocking
- Higher risk scoring threshold (block at lower scores)
- Enables all optional filtering layers

### Minimal (`minimal.json`)

Lightweight profile that only blocks confirmed malicious domains.

- Only blocks known-malicious and dangerous domains
- Disables cosmetic filtering
- Allows most cookies and popups
- Low resource usage

### Anti-Judol (`anti-judol.json`)

Specialized profile targeting gambling (judol) content.

- Aggressively blocks gambling-related domains
- Filters gambling advertisements
- Blocks gambling-related trackers and analytics
- Uses gambling-specific filter lists (`gambling_moderate.txt`, `gambling_strict.txt`)

## Switching Profiles

### Android Client

In the Yue Browser app:
1. Open Settings
2. Navigate to Privacy & Security → AdBlock
3. Select the desired profile
4. Sync happens automatically (or on next app open if within cooldown)

### API

```
GET /api/policy?profile=aggressive
GET /api/policy?profile=anti-judol
```

## Extending Profiles

To add a new profile:

1. Create `public/adblock/policies/{profile-name}.json`
2. Add to `availableProfiles` array in `public/adblock/metadata.json`
3. Restart the server

### Policy JSON Structure

```json
{
  "policyVersion": 1,
  "engineVersion": 1,
  "profile": "custom-profile",
  "network": {
    "mode": "BALANCED",
    "thirdParty": {
      "blockTrackers": true,
      "blockAds": true,
      "blockMalvertising": true
    },
    "firstParty": { "enabled": false },
    "unknown": { "action": "ALLOW" }
  },
  "navigation": {
    "popup": { "policy": "SMART" },
    "redirect": {
      "maxChain": 3,
      "thirdParty": "BLOCK",
      "sameSite": "ALLOW",
      "userGestureRequired": true,
      "allowOAuth": true
    }
  },
  "cosmetic": {
    "enabled": true,
    "strategy": "domain_aware",
    "generic": { "maxRules": 500 },
    "iframe": { "enabled": true }
  },
  "cookieBanner": { "enabled": true, "maxRules": 200 },
  "webSocket": { "blockTracking": true, "blockAnalytics": true },
  "scriptlet": { "enabled": true },
  "youtube": {
    "enabled": true,
    "strategy": "adaptive",
    "skipHosts": ["music.youtube.com"]
  },
  "antiAdblock": { "enabled": true },
  "riskScoring": {
    "blockThreshold": 80,
    "warnThreshold": 50,
    "signalScores": {
      "tracker": 30,
      "advertising": 40,
      "analytics": 20
    }
  }
}
```
