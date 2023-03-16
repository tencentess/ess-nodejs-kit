<template>
  <div class="app-container">
    <div class="contract-search">
      <h1>从文件发起合同</h1>
    </div>


    <div>
      <el-form style="width: 600px">
        <el-form-item label="上传文件">
          <el-upload
            class="upload-demo"
            ref="upload"
            drag
            :limit="100"
            :file-list="fileList"
            action="#"
            :http-request="executeUpload"
            :auto-upload="false"
            :before-upload="beforeExcelUpload"
            :on-change="onUploadChange"
            :before-remove="onRemoveItem"
            accept=".pdf,.jpg,.png,.doc,.docx,.html,.jpeg"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">文件最大支持100M</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="个人签署方姓名">
          <el-input v-model="approverName" type="text" />
        </el-form-item>
        <el-form-item label="个人签署方手机号">
          <el-input v-model="approverMobile" type="text" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmitUpload">确定提交并发起</el-button>
      </span>
    </div>


  </div>
</template>

<script>
import { signContractByFile, createSchemaUrl } from '@/api/contract';
import { FLOW_STATUS_TEXT, FLOW_STATUS } from '@/consts/status';


export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger',
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      dialogVisibleFile: false,
      dialogVisibleSign: false,
      fileList: [],
      uploadList: [],
      approverName: '',
      approverMobile: '',
      FLOW_STATUS,
      FLOW_STATUS_TEXT,
      // 设置合同类型
    };
  },
  created() {
  },
  methods: {
    onRemoveItem(info) {
      this.uploadList = this.uploadList.filter(item => item.uid !== info.uid);
    },
    beforeExcelUpload() {},
    createSchemaUrl({ flowId }) {
      createSchemaUrl({ flowId }).then((res) => {
        console.log('🚀 ~ file: create.vue:77 ~ createSchemaUrl ~ res:', res);
        this.$alert(res.data.SchemeUrl, '提示', {
          confirmButtonText: '确定',
          type: 'info',
        });
      });
    },
    executeUpload(_params) {
      const promises = [];

      const toBase64Promise = item => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(item.raw);
        reader.onload = (e) => {
          resolve({
            FileBody: e.target.result.split(',')[1],
            FileName: item.name,
          });
        };
        reader.onerror = (err) => {
          console.log(err);
          reject();
        };
      });

      this.uploadList.map((item) => {
        promises.push(toBase64Promise(item));
      });

      Promise.all(promises).then((results) => {
        signContractByFile({
          BusinessType: 'TEMPLATE',
          FileInfos: results,
          approverName: this.approverName,
          approverMobile: this.approverMobile,
        })
          .then((res) => {
            console.log(res, 'res====x');
            if (res.data.FlowId) {
              this.$confirm('发起合同成功, 是否获取签署链接?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info',
              }).then(() => {
                this.createSchemaUrl({
                  flowId: res.data.FlowId,
                });
              });
            }
          })
          .catch(e => console.log(e));
      });
    },
    onUploadChange(file, fileList) {
      // 判断 > 1M
      // if (file.size > 1048576) {
      //   fileList.pop();
      //   let msg_size = `您上传的${file.name}，该文件大于1M，请您重新上传。`;
      //   this.notify_self(msg_size, "size");
      //   return false;
      // }
      // 判断重名文件
      const repeatJudge = this.fileList.find(item => item.name === file.name);
      if (repeatJudge) {
        fileList.pop();
        // let msgRepeat = `您上传的${file.name}，该文件有重名文件，请您重新上传。`;
        return false;
      }
      this.fileList = JSON.parse(JSON.stringify(fileList));
      this.uploadList.push(file);
      console.log(this.uploadList, 'this.uploadList===');
    },
    onSubmitUpload() {
      if (!this.uploadList.length) {
        this.$message('请选择一个文件');
        return;
      }
      this.$refs.upload.submit();
    },
    // 文件发起合同
    createByFile() {
      this.dialogVisibleFile = true;
    },
  },
};
</script>

<style lang="scss">
.contract-search {
  display: flex;
  justify-content: space-between;
  .contract-btns {
    position: relative;
    margin-bottom: 20px;
  }
}

.el-upload {
  width: 100%;
}

.el-upload-dragger {
  width: 100%;
}
</style>
