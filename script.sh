#!/bin/bash

echo "Starting backend..."
cd backend
npm install
npm run dev &

echo "Starting frontend..."
cd ../frontend
npm install
npm run dev
