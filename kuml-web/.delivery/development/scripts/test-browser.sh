#!/usr/bin/env bash
set -euo pipefail

mkdir -p /workspace /output
cp -a /source/. /workspace/
cd /workspace

chmod +x gradlew

(
  ./gradlew :kuml-web:run --no-daemon
) > /tmp/kuml-web.log 2>&1 &
server_pid=$!

cleanup() {
  kill "$server_pid" 2>/dev/null || true
  wait "$server_pid" 2>/dev/null || true
  cp /tmp/kuml-web.log /output/kuml-web.log
}
trap cleanup EXIT

for _ in $(seq 1 120); do
  if curl --fail --silent http://127.0.0.1:8080/api/health >/dev/null; then
    break
  fi

  if ! kill -0 "$server_pid" 2>/dev/null; then
    cat /tmp/kuml-web.log
    exit 1
  fi

  sleep 1
done

curl --fail --silent http://127.0.0.1:8080/api/health >/dev/null

cd /workspace/kuml-web
npm ci
npm run test:browser
