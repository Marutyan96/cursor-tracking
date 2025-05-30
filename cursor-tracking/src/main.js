import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import { createPinia } from 'pinia'

// Стили PrimeVue
import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

const app = createApp(App)
app.use(PrimeVue)
app.use(createPinia())
app.mount('#app')