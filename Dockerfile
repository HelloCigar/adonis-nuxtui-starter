# Production image, deployed to Railway by scripts/railway_setup.sh

FROM node:24-slim AS base
WORKDIR /app

# @adonisplus/flow is installed from the private AdonisJS Plus registry, so
# installs need its token. It is passed as a build argument (on Railway, any
# service variable with the same name) and only written to the .npmrc of the
# install stages, which are not part of the final image.

# All dependencies, to build the app
FROM base AS deps
ARG ADONISPLUS_NPM_TOKEN
COPY package.json package-lock.json .npmrc ./
RUN echo "//plus.adonisjs.com/registry/:_authToken=${ADONISPLUS_NPM_TOKEN}" >> .npmrc \
  && npm ci

# Production dependencies only, to run the app
FROM base AS production-deps
ARG ADONISPLUS_NPM_TOKEN
COPY package.json package-lock.json .npmrc ./
RUN echo "//plus.adonisjs.com/registry/:_authToken=${ADONISPLUS_NPM_TOKEN}" >> .npmrc \
  && npm ci --omit=dev

# Compile the backend and bundle the frontend into build/
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN node ace build

FROM base
ENV NODE_ENV=production
COPY --from=production-deps /app/node_modules ./node_modules
COPY --from=build /app/build ./
CMD ["node", "bin/server.js"]
