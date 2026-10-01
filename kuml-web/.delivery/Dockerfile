# syntax=docker/dockerfile:1.7

FROM mcr.microsoft.com/playwright:v1.63.0-noble AS build

USER root

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl openjdk-21-jdk-headless \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace
COPY . .

RUN --mount=type=cache,id=kuml-gradle,target=/root/.gradle,sharing=locked \
    --mount=type=cache,id=kuml-project-gradle,target=/workspace/.gradle,sharing=locked \
    --mount=type=cache,id=kuml-npm,target=/root/.npm,sharing=locked \
    chmod +x gradlew kuml-web/.delivery/development/scripts/test-browser.sh \
    && ./gradlew :kuml-cli:installDist :kuml-web:installDist --no-daemon

FROM build AS browser-test

ENTRYPOINT ["/workspace/kuml-web/.delivery/development/scripts/test-browser.sh"]

FROM eclipse-temurin:21-jre-noble AS runtime

WORKDIR /opt/kuml
COPY --from=build /workspace/kuml-cli/build/install/kuml/ ./

EXPOSE 8080

ENTRYPOINT ["/opt/kuml/bin/kuml", "serve", "--host", "0.0.0.0", "--port", "8080"]
