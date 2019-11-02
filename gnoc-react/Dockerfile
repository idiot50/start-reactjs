# base image
FROM 10.240.201.50:7890/node:10.15.1-stretch-slim-v1.1.0 as builder
# set working directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH


# install and cache app dependencies
COPY package.json /usr/src/app/package.json
COPY binding.node /usr/src/app/binding.node
#RUN npm set registry http://10.240.201.50:8081/repository/npm/
RUN npm set registry http://10.60.129.132:8081/repository/npm/
#RUN export SASS_BINARY_PATH = /usr/src/app/linux-x64-64_binding.node
RUN export NODE_OPTIONS=--max_old_space_size=8192
RUN npm install kleur@3 
RUN npm install cookie
RUN SASS_BINARY_PATH=/usr/src/app/binding.node  npm install node-sass@4.11.0 --save-dev npm-run-all
COPY binding.node /usr/src/app/node_modules/node-sass/vendor/linux-x64-64/binding.node
RUN npm install --save-dev @babel/preset-env@7.4.2
RUN npm install --silent
RUN npm install react-froala-wysiwyg@2.9.5-1
#RUN npm install react-scripts@3.0.1 -g
RUN ls /usr/src/app/node_modules/react-scripts
# start app
#EXPOSE 3000
COPY deploy/test/.env /usr/src/app/.env
COPY . /usr/src/app
RUN ls /usr/src/app/node_modules/froala-editor
COPY deploy/dev/froala_editor.pkgd.min/froala_editor.pkgd.min.js /usr/src/app/node_modules/froala-editor/js/froala_editor.pkgd.min.js
#RUN export NODE_OPTIONS=--max_old_space_size=4096
#RUN npm run fix-memory-limit
RUN npm run build
#CMD ["npm", "start"]

FROM 10.240.201.50:7890/nginx:stable-alpine
RUN rm -rf /etc/nginx/conf.d
COPY conf/conf.d /etc/nginx/conf.d
COPY conf/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
