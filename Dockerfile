# syntax=docker/dockerfile:1
# --------- Builder Image ---------
FROM public.ecr.aws/lambda/nodejs:20 AS builder
WORKDIR /usr/app

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

RUN npm run build

# --------- Lambda Image ---------
FROM public.ecr.aws/lambda/nodejs:20 AS runtime
WORKDIR ${LAMBDA_TASK_ROOT}

COPY --from=builder /usr/app/dist/* ./

CMD ["lambda.handler"]
