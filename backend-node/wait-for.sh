#!/bin/sh
# Bekleme scripti

host="$1"
shift
cmd="$@"

until mysql -h "$host" -u root -p123456 -e "select 1" > /dev/null 2>&1; do
  >&2 echo "MySQL bekleniyor..."
  sleep 2
done

>&2 echo "MySQL hazır, başlatılıyor..."
exec $cmd
