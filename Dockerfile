FROM ipex/base-image:node-24.22.1 AS build
WORKDIR /app
COPY src/package*.json ./
ENV NODE_ENV=development
RUN npm ci --ignore-scripts

FROM ipex/base-image:node-24.22.1
COPY --from=build /app .
COPY src .
RUN npm run build
WORKDIR /app/api
ENV PORT=8080
CMD [ "npm", "start"]
