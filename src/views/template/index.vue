<template>
  <div class="template-wrapper">
    <div class="template-search">
      <el-input
        clearable
        placeholder="请输入模版名称"
        v-model="keyword"
        @change="onChange">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <!-- <el-table-column
        type="selection"
        width="55"
        align="center"
      /> -->
      <el-table-column label="模板ID" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.TemplateId }}
        </template>
      </el-table-column>
      <el-table-column label="模板名称" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.TemplateName }}
        </template>
      </el-table-column>
      <el-table-column label="创建人">
        <template slot-scope="scope">
          <span>{{ scope.row.Creator }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="模板类型">
        <template slot-scope="scope">
          <span>{{ scope.row.TemplateType | templateTypeFilter }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column class-name="status-col" label="模板状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status || '' }}</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column prop="CreatedOn" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" style="marginRight: 4px" />
          <span>{{ scope.row.CreatedOn | dateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="160"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleClickInfo(scope.row)">预览</el-button>
          <el-button type="text" size="small" @click="handleClickMod(scope.row)">编辑</el-button>
          <!-- <el-button type="text" size="small" @click="handleClickDelete(scope.row)">删除</el-button> -->
          <!--  v-if="fromPath==='contract'" -->
          <el-button type="text" size="small" @click="handleClickCreate(scope.row)">发起合同</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="template-page">
      <el-pagination
        small
        layout="prev, pager, next, total, sizes, jumper"
        :page-size="pageSize"
        :page-sizes="[5, 10, 20, 50, 100]"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { getTemplateList } from '@/api/template';
// import { getExternalLink } from '@/api/staff';
// import UserDialog from '../components/UserDialog';

export default {
  name: 'template',
  components: {
    // UserDialog,
  },
  data() {
    return {
      list: null,
      listLoading: false,
      total: 0,
      currentPage: 1,
      pageSize: 10,
      keyword: '',
      selectedData: [],
      fromPath: '',
      dialogVisible: false,
      recipients: [],
    };
  },
  watch: {
    selectedData: {
      handler(newData) {
        this.recipients = newData?.length ? newData?.[0]?.Recipients : [];
      },
      immediate: true,
      deep: true,
    },
  },
  filters: {
    dateFilter(time) {
      return time ? moment(time * 1000).format('YYYY-MM-DD hh:mm:ss') : '';
    },
    templateTypeFilter(type) {
      const typeMap = {
        1: '静默签',
        3: '普通模板',
      };
      return typeMap[type];
    },
    // statusFilter(status) {
    //   const statusMap = {
    //     published: 'success',
    //     draft: 'gray',
    //     deleted: 'danger'
    //   }
    //   return statusMap[status]
    // }
  },

  created() {
    this.fromPath = this.$route.query?.from;
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      const params = {
        Limit: this.pageSize,
        Offset: (this.currentPage - 1) * this.pageSize,
      };
      getTemplateList(params).then((response) => {
        // console.log('getTemplateList====', response);
        if (response?.data?.Templates?.length) {
          this.list = response?.data?.Templates;
        } else {
          this.list = [];
        }
        this.total = response?.data?.TotalCount || 0;
        this.listLoading = false;
      });
    },

    onChange(value) {
      this.keyword = value;
      this.fetchData();
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },

    // 新增模版
    addTemplate() {
      const id = this.list?.[0]?.TemplateId;
      if (id) {
        this.$router.push({
          path: '/template/detail',
          query: { templateId: id, type: 'add' },
        });
      }
    },

    // 预览
    handleClickInfo(data) {
      if (data?.TemplateId) {
        this.$router.push({
          path: '/template/detail',
          query: { templateId: data?.TemplateId, type: 'info' },
        });
      }
    },

    // 编辑
    handleClickMod(data) {
      if (data?.TemplateId) {
        this.$router.push({
          path: '/template/detail',
          query: { templateId: data?.TemplateId, type: 'mod' },
        });
      }
    },

    // handleSelectionChange(value) {
    //   console.log('handleSelectionChange====', value);
    //   this.selectedData = [...value];
    // },

    // 发起合同按钮点击
    handleClickCreate(data) {
      this.selectedData = [data];
      console.log('template====', this.selectedData);
      this.dialogVisible = true;
    },

    // 处理参数
    handleFlowInfos(data) {
      const curTemplate = this.selectedData?.[0] || {};
      const flowInfos = [];
      let flowApprovers = [];
      // 场景1: BtoC场景 1个C 和 多个C
      const organArr = curTemplate?.Recipients?.filter(f => f.RecipientType === 'ENTERPRISE');
      const organApprover = {
        ApproverType: 'ORGANIZATION',
        OrganizationName: organArr[0]?.RoleName,
        RecipientId: organArr[0]?.RecipientId,
      };
      const personArr = curTemplate?.Recipients?.filter(f => f.RecipientType === 'INDIVIDUAL');
      if (data?.persons?.length === 1) {
        const usersApprover = {
          ApproverType: 'PERSON',
          RecipientId: personArr[0]?.RecipientId,
          Name: data?.persons?.[0]?.name,
          Mobile: data?.persons?.[0]?.mobile,
        };
        flowApprovers = [organApprover, usersApprover];
        flowInfos.push({
          FlowName: data?.persons?.[0]?.contractName,
          Deadline: this.getAfterOneYearTime(), // 默认是1年有效期 // item?.CreatedOn + (60 * 60 * 24 * 356),
          TemplateId: curTemplate?.TemplateId,
          FlowApprovers: flowApprovers,
        });
      } else if (data?.persons?.length > 1) {
        data?.persons?.forEach((item) => {
          const usersApprover = {
            ApproverType: 'PERSON',
            RecipientId: personArr[0]?.RecipientId,
            Name: item?.name,
            Mobile: item?.mobile,
          };
          flowApprovers = [organApprover, usersApprover];
          flowInfos.push({
            FlowName: item?.contractName,
            Deadline: this.getAfterOneYearTime(), // 默认是1年有效期 // item?.CreatedOn + (60 * 60 * 24 * 356),
            TemplateId: curTemplate?.TemplateId,
            FlowApprovers: flowApprovers,
          });
        });
      }

      return flowInfos;
    },

    getAfterOneYearTime() {
      return Math.floor((moment().add(1, 'y'))
        .utc()
        .valueOf() / 1000);
    },

    // 删除
    // handleClickDelete(data) {
    //   console.log('delete===', data);
    //   if (data?.TemplateId) {
    //     const params = {
    //       OperateType: 'DELETE', // 	操作类型，查询:"SELECT"，删除:"DELETE"，更新:"UPDATE"
    //       TemplateId: data?.TemplateId,
    //     };
    //     operateChannelTemplate(params).then((response) => {
    //       console.log('operateChannelTemplate====', response);
    //     });
    //   }
    // },
  },
};
</script>

<style lang="scss" scoped>
.template-wrapper {
  padding: 20px;
  .template-search {
    text-align: right;
    margin-bottom: 20px;
    .el-button {
      float: left;
    }
    .el-input {
      width: 400px;
    }
  }
  .template-page {
    position: relative;
    text-align: right;
    margin: 20px 0;
    .el-pagination {
      display: inline-block;
    }
  }
}
</style>
