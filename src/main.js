import { createApp } from 'vue';
import { Quasar } from 'quasar';
import router from './router';
import App from './App.vue';

import 'quasar/src/css/index.sass';
import '@quasar/extras/roboto-font/roboto-font.css';
import '@quasar/extras/material-icons/material-icons.css';
import '@quasar/extras/mdi-v6/mdi-v6.css';

const app = createApp(App);

app.use(Quasar, {
  plugins: {},
});
app.use(router);
app.mount('#app');
