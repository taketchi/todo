#!/usr/bin/env sh

set -e

if [ ! -f /app/db ]; then
	litestream restore -if-replica-exists -o /app/prisma/sqlite/todo.db "${BACKUP_URL}"
fi

# shellcheck disable=SC2093
exec litestream replicate -exec "node ./server.js"

# Start the application
node ./server.js &

# Exit immediately when one of the background processes terminate.
wait
# [END run]
