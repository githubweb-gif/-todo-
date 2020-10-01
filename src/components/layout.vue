<template>
  <div class="layout" @click="sidehide">
    <side />
    <main>
      <keep-alive>
        <router-view />
      </keep-alive>
    </main>
    <right-side v-if="$store.state.taskInfo !== null" />
  </div>
</template>

<script>
import side from './side'
import rightSide from './rightSide'
export default {
  components: {
    side,
    rightSide
  },
  data() {
    return {
    }
  },
  watch: {
    $route() {
      this.$store.commit('changehide')
      this.$store.commit('putFil')
    }
  },
  methods: {
    sidehide() {
      const cardInfo = {
        top: 0,
        left: 0,
        display: 'none'
      }
      this.$store.commit('putCard', cardInfo)
    }
  }
}
</script>

<style lang="less" scoped>
.layout {
  position: relative;
  height: 100%;
  display: flex;
}
.layout::after {
  content: "";
  display: block;
  clear: both;
  visibility: hidden;
  height: 0;
}
main {
    width: 100%;
    height: 100%;
    overflow: hidden;
    flex: 1;
}
</style>
