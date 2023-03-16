<template>
  <div class="app-container" >
    <p v-if="totalCount===0 && !listLoading" ><span  class="empty-text">当前印章为空 </span></p>

    <el-row :gutter="20" v-if="totalCount>0" >
      <el-col :span="6" v-for="item in list" :key="item.SealId" >
      <el-card :body-style="{ padding: '0px'}" shadow="hover">
        <div class="seal-item"  @click="handleDetail(item.SealId)">
          <div :class="'seal-item-body '+ item.SealStatus">
            <div :class="'seal-status ' + item.SealStatus">{{ item.SealStatus|statusTextFilter  }}</div>
              <img :src="item.Url" class="image">
            </div>
          </div>
        <div class="seal-item-footer">
          <span>{{item.SealName}}</span>
        </div>
      </el-card>
    </el-col>
    </el-row>
  <el-pagination
      v-if="showPager"
      small
      layout="prev, pager, next"
      :page-size="limit"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :total="totalCount">
    </el-pagination>
  </div>
</template>

<script>
import { getList } from '@/api/seal';
import { SEAL_STATUS } from '@/consts/seal';

export default {
  filters: {
    statusTextFilter(status) {
      const curStatus = SEAL_STATUS.find(v => v.value === status);
      return curStatus.label;
    },

  },
  data() {
    return {
      list: [],
      status: 'ALL',
      listLoading: true,
      limit: 2,
      Offset: 0,
      showPager: false,
      totalCount: 0,
      currentPage: 1,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getList({
        Limit: this.limit,
        Offset: 0,
      }).then((response) => {
        this.list = response.data.Seals;
        this.totalCount = response.data.TotalCount;
        // this.showPager = response.data.TotalCount >= this.limit;// 无需分页
        this.listLoading = false;
      })
        .catch(() => {
          this.listLoading = false;
          this.totalCount = 0;
          this.list = [];
        });
    },
    handleCurrentChange(data) {
      this.listLoading = true;
      this.offset = (data - 1) * this.limit;
      this.currentPage = data;
      getList({
        Offset: this.offset,
        Limit: this.limit,
      }).then((response) => {
        this.list = response.data.Seals;
        this.listLoading = false;
      })
        .catch(() => {
          this.listLoading = false;
        });
    },
    handleDetail(sealId) {
      this.$router.push({ path: '/seal-manager/detail', query: { sealId } });
    },
    handleAdd() {
      this.$router.push({ path: '/seal-manager/add' });
    },
  },
};
</script>
<style lang="scss" scoped>
.seal-add-btn{
  margin-bottom: 20px;
}
.status-select{
  margin-bottom: 16px;
}
.el-card{
  margin-bottom: 10px;
}
.seal-item{
  position: relative;
  flex: 1 1;
  display: flex;
  align-items: center;
  justify-content: center;

}
.seal-status{
  position: absolute;
  right: 0;
  top: 0;
  padding: 0 10px;
  height: 24px;
  line-height: 24px;
  color: #fff;
  font-size: 12px;
  &.SUCCESS{
    background-color: rgb(8, 168, 156);
  }
  &.FAIL{
    background: #000;
  }
  &.CHECKING,&.CHECKING-SADM{
    background: rgb(250, 140, 22);
  }
  &.REJECTED{
    background: red;
  }
  &.DISABLE{
    background:#666 ;
  }
}
.seal-item-body{
  position: relative;
  flex: 1 1;
  display: flex;
  align-items: center;
  justify-content: center;
  &.DISABLE{
    filter: grayscale(1);
  }
}
.seal-item-footer{
  height: 35px;
  border-top: 1px solid #d1d2d3;
  line-height: 35px;
  padding: 0 10px;
  font-size: 12px;
}

  .image {
    width: 100px;
    height: 100px;
    display: block;
  }
  p{
    text-align: center;
  }
  .empty-text{
    font-size: 14px;
    color:rgba(0,0,0,.4);
  }
</style>
