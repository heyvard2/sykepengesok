FROM nginx:alpine
RUN mkdir /usr/share/nginx/html/nysykepengesoknad
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY /build /usr/share/nginx/html/nysykepengesoknad


# Copy .env file and shell script to container
WORKDIR /usr/share/nginx/html/nysykepengesoknad
COPY ./env.sh .
COPY .env .

# Add bash
RUN apk add --no-cache bash

# Make our shell script executable
RUN chmod +x env.sh

EXPOSE 8080

CMD ["/bin/bash", "-c", "/usr/share/nginx/html/nysykepengesoknad/env.sh && nginx -g \"daemon off;\""]
