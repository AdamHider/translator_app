import AppInfiniteList from '../components/AppInfiniteList.vue'

// we globally register our component with Vue
export default ({ app }) => {
  app.component('q-infinite-list', AppInfiniteList)
}
