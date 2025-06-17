FROM node:20 AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

FROM node:20 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV CI=false
ENV GENERATE_SOURCEMAP=false
RUN npm run build

FROM node:20 AS runner
RUN npm install -g serve
WORKDIR /app
COPY --from=builder /app/build ./build
EXPOSE 80
CMD ["serve", "-s", "build", "-l", "80"]
