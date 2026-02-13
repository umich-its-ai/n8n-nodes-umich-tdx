#!/bin/bash

# Exit on error
set -e

echo "Building n8n node..."
cd ~/umich-its-ai/n8n_custom_nodes/n8n-nodes-umich-tdx
npm run build

echo "Stopping Docker containers..."
cd ~/n8n
docker compose down

echo "Starting Docker containers with rebuild..."
docker compose up --build -d

