FROM node:22-bookworm-slim AS base

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

WORKDIR /app

RUN corepack enable

FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/ai/package.json packages/ai/package.json

RUN pnpm install --frozen-lockfile --filter @campus-copilot/api...

FROM base AS runtime

ENV NODE_ENV=production
ENV PORT=8787
ENV HOST=0.0.0.0

COPY --from=deps /app /app
COPY . .

EXPOSE 8787

HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=5 CMD node -e "fetch('http://127.0.0.1:8787/health').then((response)=>{if(!response.ok)process.exit(1)}).catch(()=>process.exit(1))"

# Runtime entry: pnpm --filter @campus-copilot/api start
CMD ["pnpm", "--filter", "@campus-copilot/api", "start"]
