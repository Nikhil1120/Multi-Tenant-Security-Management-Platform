#!/usr/bin/env bash
set -euo pipefail

echo "=== Render build ==="
echo "PYTHON_VERSION env: ${PYTHON_VERSION:-not set}"
python --version

minor="$(python -c 'import sys; print(sys.version_info.minor)')"
if [ "$(python -c 'import sys; print(sys.version_info.major)')" = "3" ] && [ "$minor" -ge 14 ]; then
  echo ""
  echo "ERROR: This project requires Python 3.12 (Render defaulted to 3.14)."
  echo "Fix: Render Dashboard → your service → Environment → add:"
  echo "  PYTHON_VERSION = 3.12.8"
  echo "Then clear build cache and redeploy."
  exit 1
fi

python -m pip install --upgrade pip
python -m pip install -r requirements.txt
