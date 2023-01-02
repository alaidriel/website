import { createApp } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faGithub, faMastodon } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import './style.css'
import App from './App.vue'

library.add(faGithub, faMastodon);

const app = createApp(App)
app.component('FontAwesomeIcon', FontAwesomeIcon)
app.mount('#app')
