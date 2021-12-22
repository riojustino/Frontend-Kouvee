import Vue from 'vue';
import Vuetify from 'vuetify/lib';
// import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify)

const vuetify = new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#30475e',
        secondary: '#ecce6d',
        third:'#e37222',
        accent: '#82B1FF',
        anchor: '#8c9eff',
        warning:'#f94333',
        bg:'#222831'
      },
    },light:true
  },
})
export default vuetify;