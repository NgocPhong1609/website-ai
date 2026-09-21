#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
backend_dir="$repo_dir/website-MindNova-AI"
frontend_dir="$repo_dir/mindnova-ai"

for required in "$backend_dir/vendor/autoload.php" "$backend_dir/.env" "$frontend_dir/.env.local" "$frontend_dir/.next/BUILD_ID"; do
    if [[ ! -f "$required" ]]; then
        printf 'Missing %s. Follow docs/local-setup.md first.\n' "$required" >&2
        exit 1
    fi
done

pids=()
cleanup() {
    trap - EXIT INT TERM
    for pid in "${pids[@]}"; do kill "$pid" 2>/dev/null || true; done
    wait || true
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

# All services stay on this machine. MariaDB must already be running.
php "$backend_dir/artisan" serve --host=127.0.0.1 --port=8000 &
pids+=("$!")
php "$backend_dir/artisan" queue:work --tries=1 --timeout=90 &
pids+=("$!")
(cd "$frontend_dir" && exec node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3000) &
pids+=("$!")

printf 'MindNova: http://localhost:3000 | API: http://127.0.0.1:8000\n'
wait -n "${pids[@]}"
