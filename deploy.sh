#!/bin/bash

set -eu

# build sorce
npm run build

# Login
aws configure set output text
ACCOUNT_ID=$(aws sts get-caller-identity --query 'Account')
aws ecr get-login-password |  docker login --username AWS --password-stdin https://${ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com

# Build image
REPO_NAME="miz"
IMAGE_NAME="${ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/${REPO_NAME}:latest"
docker build -t ${IMAGE_NAME} .
echo "Successfully Built: ${IMAGE_NAME}"

# Push to ECR
docker push ${IMAGE_NAME}