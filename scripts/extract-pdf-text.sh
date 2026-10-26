#!/usr/bin/env bash
set -euo pipefail

usage() {
  printf 'Usage: %s <PDF path-or-URL> [page-number|all]\n' "$0" >&2
  exit 2
}

[[ $# -ge 1 && $# -le 2 ]] || usage

source_pdf=$1
page_spec=${2:-all}
task_tmp=$(mktemp -d "${TMPDIR:-/tmp}/hungarian-pdf.XXXXXX")

cleanup() {
  rm -rf -- "$task_tmp"
}
trap cleanup EXIT INT TERM

pdf_path=$task_tmp/source.pdf
if [[ $source_pdf == http://* || $source_pdf == https://* ]]; then
  curl -L --fail --silent --show-error "$source_pdf" -o "$pdf_path"
else
  [[ -f $source_pdf ]] || { printf 'PDF not found: %s\n' "$source_pdf" >&2; exit 1; }
  cp -- "$source_pdf" "$pdf_path"
fi

python_args=()
if ! python3 -c 'import pypdf' >/dev/null 2>&1; then
  deps_dir=$task_tmp/deps
  PIP_CACHE_DIR=$task_tmp/pip-cache python3 -m pip install --quiet --target "$deps_dir" 'pypdf>=6,<7'
  python_args=(env "PYTHONPATH=$deps_dir" PYTHONDONTWRITEBYTECODE=1)
fi

"${python_args[@]}" python3 - "$pdf_path" "$page_spec" <<'PY'
from pathlib import Path
import sys

from pypdf import PdfReader

pdf_path = Path(sys.argv[1])
page_spec = sys.argv[2]
reader = PdfReader(pdf_path)

if page_spec == "all":
    pages = range(len(reader.pages))
else:
    try:
        page_number = int(page_spec)
    except ValueError as error:
        raise SystemExit("Page must be a positive number or 'all'.") from error
    if page_number < 1 or page_number > len(reader.pages):
        raise SystemExit(f"Page {page_number} is outside 1-{len(reader.pages)}.")
    pages = [page_number - 1]

for index in pages:
    if page_spec == "all":
        print(f"\n--- Page {index + 1} of {len(reader.pages)} ---\n")
    print(reader.pages[index].extract_text() or "")
PY
