Docker usage for octoco-crypto

Build the production image:

```bash
cd octoco-crypto
docker build -t octoco-crypto:latest .
```

Run the container:

```bash
docker run --rm -p 5173:80 octoco-crypto:latest
```

Or use docker-compose to build and run both the production image and an optional dev container:

```bash
cd octoco-crypto
docker compose up --build
```

Notes:
- Production image serves the built `dist` using nginx on port 80 inside the container, mapped to host 5173 in the compose file.
- The `dev` service runs the vite dev server on port 5173 inside the container and is accessible on host port 5174 per compose configuration.
