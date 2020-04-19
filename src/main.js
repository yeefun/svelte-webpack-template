import App from './App.svelte'

const app = new App({
  target: document.body,
  props: {
    name: 'world',
  },
})

window.add = app

export default app
