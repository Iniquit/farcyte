# /bin/sh
until node farcyte.js; do
    echo "Bot stopped with exit code $?. Restarting..." >&2
    sleep 1
done