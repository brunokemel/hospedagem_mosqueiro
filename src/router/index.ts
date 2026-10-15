import { createRouter, createWebHistory } from 'vue-router'

// Componente vazio: o shell principal decide quais blocos renderizar pela rota ativa.
const PageRoute = { render: () => null }

// As rotas usam a mesma composição visual, mas exibem somente a jornada escolhida.
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: PageRoute },
    { path: '/hospedagens', name: 'stays', component: PageRoute },
    { path: '/onde-comer', name: 'food', component: PageRoute },
    { path: '/mosqueiro', name: 'mosqueiro', component: PageRoute },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router

