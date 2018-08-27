import { configure } from '@storybook/vue';


import Vue from 'vue';
import VueStickTransition from '../source/VueStickTransition';

Vue.component('stick-transition', VueStickTransition);



// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /.stories.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
