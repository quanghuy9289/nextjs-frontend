# stage: 1
FROM node:14.8
WORKDIR /usr/src/app
# COPY package.json yarn.lock ./

COPY package*.json yarn.lock ./
RUN yarn install

# Copying source files
COPY . ./

# RUN build
RUN yarn run next_build

# Start
CMD [ "yarn", "next_start" ]

# # stage: 2 — the production environment
# FROM nginx:alpine
# COPY --from=react-build /usr/src/app/build /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
