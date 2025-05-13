FROM ipex/base-image:node-16.3.0-alpine-3.11-builder AS build
WORKDIR /app
COPY src/package*.json ./
RUN apk add --no-cache bash
ENV NODE_ENV=development
RUN npm install --ignore-scripts

FROM ipex/base-image:node-16.3.0-alpine-3.11-builder
COPY --from=build /app .
COPY src .
RUN npm run build
WORKDIR /app/api
ENV PORT 8080
CMD [ "npm", "start"]