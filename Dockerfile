FROM node:15.5

WORKDIR /app

COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
COPY ./packages/framework/package.json ./packages/framework/package.json
COPY ./packages/backend/package.json ./packages/backend/package.json
COPY ./packages/frontend/package.json ./packages/frontend/package.json
COPY ./packages/obsclient/package.json ./packages/obsclient/package.json

RUN yarn workspace @comlink/backend remove @h.schulz/socketio-auth-typescript
RUN yarn workspace @comlink/backend add --ignore-scripts @h.schulz/socketio-auth-typescript

COPY . .

RUN mkdir -p packages/backend/html/{client,obsclient}

RUN yarn workspace @comlink/framework run build
RUN yarn workspace @comlink/frontend run build --public-url /client --out-dir ../backend/html/client
RUN yarn workspace @comlink/obsclient run build --public-url /obsclient --out-dir ../backend/html/obsclient
RUN yarn workspace @comlink/backend run build

WORKDIR /app/packages/backend

EXPOSE 3000

ENTRYPOINT [ "node", "dist/main.js" ]
