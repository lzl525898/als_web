# als_classroom

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# element-ui/packages/upload/src/index.vue 
Authorization: window.localStorage.getItem('als_token') + "_" + (JSON.parse(window.localStorage.getItem('teacher_info'))).id
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
