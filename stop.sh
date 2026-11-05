#!/usr/bin/env bash

pkill -f "dotnet.*Everbright" 2>/dev/null && echo "API stopped." || echo "API not running."
pkill -f "vite" 2>/dev/null && echo "Client stopped." || echo "Client not running."
