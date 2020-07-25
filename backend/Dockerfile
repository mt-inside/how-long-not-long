FROM hayd/alpine-deno:1.2.0

WORKDIR /app

USER deno

COPY . .
RUN deno cache index.ts

CMD ["run", "--allow-net", "--allow-env", "--allow-read", "index.ts"]
EXPOSE 4000
