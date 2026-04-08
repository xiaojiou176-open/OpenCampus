# Container Publication Prep

This is the repo-side publication packet for the Campus Copilot container path.

Use it when the question becomes:

> If the owner wants to publish a public image later, what exact metadata and tag strategy are already prepared inside the repo today?

## Truth Boundary

- The containerized surface is `apps/api`, the thin local BFF.
- It is **not** the stdio MCP transport.
- The local proof image tag stays `campus-copilot-api:local`.
- The recommended future public image reference is:
  - `ghcr.io/xiaojiou176-open/campus-copilot-api`
- That recommended public reference is still only a **repo-side recommendation** today.
- No image has been pushed to GHCR, Docker Hub, or another registry from this repo in this wave.

## Naming And Tag Strategy

Use the image naming scheme like a shipping label:
the box can have a local warehouse tag today and a public carrier label later, but the contents stay the same.

Recommended tags:

- local proof tag: `campus-copilot-api:local`
- recommended public semver tag: `ghcr.io/xiaojiou176-open/campus-copilot-api:0.1.0`
- recommended minor line tag: `ghcr.io/xiaojiou176-open/campus-copilot-api:0.1`
- recommended floating tag: `ghcr.io/xiaojiou176-open/campus-copilot-api:latest`
- optional immutable trace tag: `ghcr.io/xiaojiou176-open/campus-copilot-api:<git-sha>`

If the owner later mirrors the image to Docker Hub, keep the same tag scheme under the owner-controlled namespace instead of inventing a second versioning policy.

## OCI Metadata

The Dockerfile now carries the following OCI label set:

- `org.opencontainers.image.title`
- `org.opencontainers.image.description`
- `org.opencontainers.image.licenses`
- `org.opencontainers.image.url`
- `org.opencontainers.image.source`
- `org.opencontainers.image.documentation`
- `org.opencontainers.image.version`
- `org.opencontainers.image.revision`

## Repo-Side Proof

| Item | Current repo-side truth | Local proof |
| :-- | :-- | :-- |
| Docker build path | Dockerfile builds the thin local BFF image | `pnpm smoke:docker:api` |
| Compose path | `compose.yaml` runs the same API image with health checks | `pnpm smoke:docker:api` |
| publication metadata | OCI labels now describe the image surface and documentation route | `pnpm check:container-publication-surface` |
| boundary docs | container docs explain that this is not the stdio MCP transport | `pnpm check:container-publication-surface` |

## Owner-Only Later Steps

1. choose the real destination registry and create the repository if needed
2. build the image with real version and revision metadata, for example:

```bash
docker build \
  --build-arg CAMPUS_COPILOT_IMAGE_VERSION=0.1.0 \
  --build-arg CAMPUS_COPILOT_IMAGE_REVISION="$(git rev-parse HEAD)" \
  -t ghcr.io/xiaojiou176-open/campus-copilot-api:0.1.0 .
```

3. push the image under owner-controlled credentials
4. verify the live registry page after the push succeeds

## Current Verdict

- **Repo-side state**: `container publication prep ready`
- **Runtime truth**: thin local BFF only
- **Owner-only later**: registry creation, push credentials, and final publish actions
