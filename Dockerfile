FROM node:12-alpine as builder

# ARG API_BASE_HOST
# ARG API_BASE_PORT

WORKDIR /var/src

COPY package.json .

# RUN npm install -g npm@8.7.0

RUN npm install --silent

COPY . .

# RUN .change_api.sh
# && \
RUN npm run build



FROM nginx:alpine
# COPY --from=builder /var/src/src /user/share/nginx/html

COPY --from=builder /var/src/dist/results-management-ui /user/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 9060