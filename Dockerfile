FROM ceramicnetwork/composedb:develop

WORKDIR /app
ADD ./package.json /app/package.json
ADD ./package-lock.json /app/package-lock.json
RUN npm install
ADD ./scripts /app/scripts
ADD ./composites /app/composites