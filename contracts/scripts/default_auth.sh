#!/bin/bash
set -euo pipefail
pushd $(dirname "$0")/..

export RPC_URL="https://api.cartridge.gg/x/mancala/katana"

export WORLD_ADDRESS=$(cat ./manifests/dev/manifest.json | jq -r '.world.address')

export ACTIONS_ADDRESS=$(cat ./manifests/dev/manifest.json | jq -r '.contracts[] | select(.kind == "DojoContract" ).address')

echo "---------------------------------------------------------------------------"
echo world : $WORLD_ADDRESS 
echo " "
echo actions : $ACTIONS_ADDRESS
echo "---------------------------------------------------------------------------"

# List of the models.
MODELS=("Player" "GamePlayer" "GameId" "MancalaGame")

AUTH_MODELS=""
# Give permission to the action system to write on all the models.
for component in ${MODELS[@]}; do
    AUTH_MODELS+="$component,$ACTIONS_ADDRESS "
done

sozo auth grant writer $AUTH_MODELS

echo "Default authorizations have been successfully set."
