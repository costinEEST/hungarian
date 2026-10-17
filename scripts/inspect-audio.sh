#!/bin/sh

set -eu

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <audio-url>" >&2
  exit 2
fi

audio_url=$1
temporary_file=$(mktemp "${TMPDIR:-/tmp}/hungarian-audio.XXXXXX")
trap 'rm -f "$temporary_file"' EXIT HUP INT TERM

curl -L --fail --silent --show-error --output "$temporary_file" "$audio_url"

echo "File type:"
file "$temporary_file"

if command -v ffprobe >/dev/null 2>&1; then
  echo "Audio metadata:"
  ffprobe \
    -v error \
    -show_entries format=format_name,duration,size,bit_rate \
    -show_entries stream=codec_name,sample_rate,channels \
    -of default=noprint_wrappers=1 \
    "$temporary_file"
else
  echo "Install ffmpeg to show codec, duration, sample rate, and bitrate." >&2
fi
