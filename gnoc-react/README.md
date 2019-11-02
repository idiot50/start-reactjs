
## Installation

``` bash
# clone the repo
$ git clone http://10.240.203.2:8180/spqtnv/gnoc/front-end-gnoc-developer.git gnoc-react
# go into app's directory
$ cd gnoc-react
# install app's dependencies
$ npm install
```

## Create React App
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app)

see also:
[User Guide](CRA.md)

### Basic usage

``` bash
# dev server  with hot reload at http://localhost:3000
$ npm start
```

Navigate to [http://localhost:3000](http://localhost:3000). The app will automatically reload if you change any of the source files.

### Build

Run `build` to build the project. The build artifacts will be stored in the `build/` directory.

```bash
# build for production with minification
$ npm run build
```

## What's included

Within the download you'll find the following directories and files, logically grouping common assets and providing both compiled and minified variations. You'll see something like this:

```
GNOC-OD#v1.0.0
├── public/          #static files
│   ├── assets/      #assets
│   └── index.html   #html temlpate
│
├── src/             #project root
│   ├── containers/  #container source
│   ├── scss/        #user scss/css source
│   ├── views/       #views source
│   ├── App.js
│   ├── App.test.js
│   ├── index.js
│   ├── _nav.js      #sidebar config
│   └── routes.js    #routes config
│
└── package.json
```

### Generate Source
node generateSource.js add module feature

### Dockerizing
* Docker Developer (port: 3000)

$ docker-compose up -d --build

* Docker Production (port: 8084)

$ docker-compose -f docker-compose-prod.yml up -d --build

* Stop Docker

$ docker-compose stop


### Config npm

npm config set registry http://10.60.129.132:8081/repository/npm/
npm config rm proxy
npm config rm https-proxy

npm config set registry https://registry.npmjs.com/