<template>
    <div>
        <el-button type="info" @click="logout">退出</el-button>
    </div>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$router.push('/');
      window.sessionStorage.clear();
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
