#!/usr/bin/env bash
set -e

echo "=== Setting up .NET SDK on Netlify ==="
curl -sSL https://dot.net/v1/dotnet-install.sh | bash -s -- --channel 10.0 || curl -sSL https://dot.net/v1/dotnet-install.sh | bash -s -- --channel 9.0

export DOTNET_ROOT="$HOME/.dotnet"
export PATH="$DOTNET_ROOT:$PATH"

echo "Using dotnet version:"
dotnet --version

echo "=== Publishing Blazor WebAssembly Application ==="
dotnet publish -c Release -o output

echo "=== Ensuring SPA Redirects and 404 Fallback ==="
cp output/wwwroot/index.html output/wwwroot/404.html || true
touch output/wwwroot/.nojekyll

echo "=== Build Completed Successfully ==="
