FROM node:20 AS build
WORKDIR /app

ARG VITE_API_URL
ARG VITE_TOMTOM_API_KEY

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_TOMTOM_API_KEY=$VITE_TOMTOM_API_KEY

COPY . .
RUN npm install
RUN npm run build

FROM node:20
WORKDIR /app
COPY --from=build /app/dist /app/build
RUN npm install -g serve
EXPOSE 80
CMD ["serve", "-s", "build", "-l", "80"]
