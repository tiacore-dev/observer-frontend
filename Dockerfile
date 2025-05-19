FROM node:20 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

ENV CI=false
ENV GENERATE_SOURCEMAP=false
RUN npm run build

FROM node:20
RUN npm install -g serve
WORKDIR /app
COPY --from=builder /app/build ./build
EXPOSE 80
CMD ["serve", "-s", "build", "-l", "80"]