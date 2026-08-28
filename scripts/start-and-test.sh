#!/bin/bash
bun run src/index.ts &
SERVER_PID=$!
sleep 5
curl -sf http://localhost:3000/health/live > /dev/null 2>&1 || { echo "SERVER NOT READY"; kill $SERVER_PID 2>/dev/null; exit 1; }
bun run test:postman
EXIT=$?
kill $SERVER_PID 2>/dev/null || true
exit $EXIT
