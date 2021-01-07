import Vue from 'vue';
import postscribe from 'postscribe';

export default (context, inject) => {
  Vue.prototype.$postscribe = postscribe
}