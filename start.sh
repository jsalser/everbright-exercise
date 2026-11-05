#!/usr/bin/env bash
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Starting API on :5128..."
cd "$DIR/Everbright.Api" && dotnet run --launch-profile http &

echo "Starting client on :5173..."
cd "$DIR/client" && npm run dev &

wait
