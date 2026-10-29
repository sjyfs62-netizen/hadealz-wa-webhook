FROM node:20-alpine
WORKDIR /app
COPY package.json app.js ./
RUN npm install --omit=dev
ENV PORT=3000
EXPOSE 3000
CMD ["node","app.js"]
