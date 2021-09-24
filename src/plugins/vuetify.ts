import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/lib/styles/main.sass';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/lib/components';
import * as directives from 'vuetify/lib/directives';

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
    // themes: {
    //   light: {
    //     primary: '#1976D2',
    //     secondary: '#0',
    //     accent: '#0',
    //     error: '#FF5252',
    //     info: '#2196F3',
    //     success: '#4CAF50',
    //     warning: '#FFC107',
    //   },
    //   dark: {
    //     primary: '#1976D2',
    //     secondary: '#424242',
    //     accent: '#82B1FF',
    //     error: '#FF5252',
    //     info: '#2196F3',
    //     success: '#4CAF50',
    //     warning: '#FFC107',
    //   }
    // }
  }
});
