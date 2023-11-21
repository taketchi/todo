#!/usr/bin/env sh

# Create mount directory for service
mkdir -p $MNT_DIR

echo "Mounting GCS Fuse."
gcsfuse --debug_gcs --debug_fuse $BUCKET $MNT_DIR
echo "Mounting completed."

# Start the application
node /app/.next/standalone/server.js &

# Exit immediately when one of the background processes terminate.
wait
# [END cloudrun_fuse_script]
