import Vue from 'vue'
import svgIcon from '../components/svgIcon.vue'

Vue.component('svg-icon', svgIcon)

const req = require.context('./svg', false, /\.svg$/)
const requireAll = (requireContext) => {
  return requireContext.keys().map(requireContext)
}
requireAll(req)
