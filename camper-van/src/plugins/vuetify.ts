import Vue from 'vue'
import Vuetify from 'vuetify';
import colors from 'vuetify/lib/util/colors';
import '@mdi/font/css/materialdesignicons.css';
Vue.use(Vuetify)

const vuetify = new Vuetify({
    theme:{
        //dark:true,
        themes:{
            light:{
                primary: colors.purple,
                secondary: colors.grey.darken1,
                accent: colors.shades.black,
                error: colors.red.accent3,
            }
        }
    }
});

export default vuetify

