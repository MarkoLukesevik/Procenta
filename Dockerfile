# Stage 1: Build Angular app
FROM node:24.5.0 as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx ng build --configuration production

RUN ls /app/dist/procenta-web-client

# Stage 2: Serve with Nginx (Alpine)
FROM nginx:alpine

# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy Angular build output
COPY --from=build /app/dist/procenta-web-client/browser /usr/share/nginx/html

# Copy your custom nginx config (if you have one)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Fix permissions so nginx user can read files
RUN chown -R nginx:nginx /usr/share/nginx/html && chmod -R 755 /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

