# Use the official Node 24 Alpine image as the base
FROM node:24-alpine AS base
WORKDIR /home/node/app

# Set up the pnpm home directory and update PATH
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Enable corepack to activate the pre-bundled pnpm package manager
RUN corepack enable

# Copy dependency configurations
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./

# Install dependencies production-ready or frozen
RUN pnpm install --frozen-lockfile

# Copy the rest of your application code
COPY . .

# Give owner rights to the current user
USER node
