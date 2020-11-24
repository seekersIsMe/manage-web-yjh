import Vue from 'vue'
import VueI18n from 'vue-i18n'
import ch from './config/ch'
import en from './config/en'
Vue.use(VueI18n)
const i18n = new VueI18n({
    locale: localStorage.getItem('langType') || 'ch',
    messages: {
        ch,
        en
    }
}) 
export default i18n
