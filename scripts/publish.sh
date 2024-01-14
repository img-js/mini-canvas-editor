#!/bin/bash

cd "$(dirname "${BASH_SOURCE[0]}")"

cd ../core
pnpm build
npm publish

cd ../editor
pnpm build
npm publish
