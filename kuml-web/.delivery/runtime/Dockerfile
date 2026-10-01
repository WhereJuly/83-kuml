# syntax=docker/dockerfile:1.7

FROM mcr.microsoft.com/playwright:v1.63.0-noble AS build

USER root

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl openjdk-21-jdk-headless \
    && npm install --global npm@12.2.0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace
COPY . .

RUN --mount=type=cache,id=kuml-gradle,target=/root/.gradle,sharing=locked \
    --mount=type=cache,id=kuml-project-gradle,target=/workspace/.gradle,sharing=locked \
    --mount=type=cache,id=kuml-npm,target=/root/.npm,sharing=locked \
    chmod +x gradlew \
    && ./gradlew :kuml-web:installDist --no-daemon

FROM eclipse-temurin:21-jre-noble

WORKDIR /opt/kuml-web
COPY --from=build /workspace/kuml-web/build/install/kuml-web/ ./

EXPOSE 8080

ENTRYPOINT ["/opt/kuml-web/bin/kuml-web"]
