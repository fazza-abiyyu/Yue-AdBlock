# API Reference

## Base URL

```
https://yue-adblock.abiyyu.xyz/api
```

## Endpoints

### GET /health

Health check endpoint.

**Response:**
```json
{
  "@odata.context": "$metadata#EntitySet",
  "item": {
    "status": "healthy",
    "version": "1.0.0",
    "uptime": 120,
    "timestamp": "2026-08-27T12:00:00.000Z"
  },
  "code": 200,
  "message": "OK"
}
```

---

### GET /metadata

Returns full service metadata including rule hashes for intelligent client-side caching.

**Response:**
```json
{
  "item": {
    "latestPolicyVersion": 1,
    "minEngineVersion": 1,
    "lastUpdated": "2026-08-27T12:00:00Z",
    "rules": {
      "adDomains": { "version": 1, "hash": "e823e8117c28c921" },
      "abpindo": { "version": 1, "hash": "fa76a7681ff5573a" },
      "easylist": { "version": 1, "hash": "8659b2c83c0e2583" }
    },
    "availableProfiles": ["minimal", "balanced", "aggressive", "anti-judol"]
  },
  "code": 200,
  "message": "OK"
}
```

---

### GET /policy?profile={name}

Returns the full adblock policy for a specified profile.

**Query Parameters:**
- `profile` (string, default: `balanced`) — Policy profile name

**Response:** Returns a full `AdblockPolicy` JSON object containing network, navigation, cosmetic, YouTube, and risk scoring configurations.

---

### GET /profiles

Lists all available policy profiles.

**Response:**
```json
{
  "item": {
    "profiles": ["minimal", "aggressive", "anti-judol", "balanced"]
  },
  "code": 200
}
```

---

### GET /rules/{ruleName}

Downloads a filter rule file as plain text.

**Path Parameters:**
- `ruleName` (string) — Name of the rule file (e.g., `ad_domains.txt`, `easylist.txt`)

**Response:** Plain text file content with `Content-Type: text/plain`

---

## Error Responses

All errors follow OData v4 error format:

```json
{
  "status": "error",
  "code": "NOT_FOUND",
  "message": "Policy profile 'unknown' not found",
  "timestamp": "2026-08-27T12:00:00.000Z"
}
```

| HTTP Status | Code | Description |
|-------------|------|-------------|
| 400 | VALIDATION_ERROR | Invalid parameters |
| 404 | NOT_FOUND | Resource not found |
| 500 | INTERNAL_ERROR | Server error |
