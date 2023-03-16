<template>
<div>
    <i class="el-icon-loading big-loading" v-if="contentLoading"></i>
    <iframe v-else class="ifram-wrapper" :src="iframeSrc" width="100%" height="900px" > -->
   </iframe>
</div>
</template>

<script>
export default {
  data() {
    return {
      iframeSrc: '',
      contentLoading: true,
    };
  },
  created() {
  },
};
</script>

<style scoped>
.big-loading{
  display: block;
  width: 50px;
  height:50px;
  margin: 50px auto;
  font-size: 48px;
  color: rgb(64, 158, 255);
  }
.ifram-wrapper{
    position: absolute;
    top: -100px;
    border: none;
    height: 100%;
    left: 0;
}
</style>

