set -e

docker compose up -d db-test

jest --runInBand --config ./test/jest-e2e.json || docker compose down db-test

docker compose down db-test