<template>
  <div>
    <svg :style="styleSvg" class="svg-icon" aria-hidden="true" v-on="$listeners">
      <use :xlink:href="iconName" />
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    iconClass: {
      type: String,
      required: true
    },
    styleSvg: {
      type: Object,
      default: null
    }
  },
  data() {
    return {}
  },
  computed: {
    iconName() {
      return `#icon-${this.iconClass}`
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
