const tencentcloud = require('tencentcloud-sdk-nodejs');
const { clientConfig, uploadClientConfig } = require('../utils');


const EssClient = tencentcloud.ess.v20201111.Client;

// 实例化一个认证对象，入参需要传入腾讯云账户secretId，secretKey,此处还需注意密钥对的保密
// 实例化要请求产品的client对象,clientProfile是可选的
const client = new EssClient(clientConfig);


module.exports = (app) => {
  // 印章列表
  app.post(`${process.env.VUE_APP_BASE_API}/seal/list`, async (req, res) => {
    const { body } = req;
    const params = {
      Operator: {
        UserId: process.env.X_ESS_ADMINUSERID,
      },
      ...body,
    };
    client.DescribeOrganizationSeals(params).then(
      (data) => {
        res.json({
          code: 20000,
          data,
        });
      },
      (err) => {
        console.error(err);
      },
    );
  });


  // 模版列表
  app.post(`${process.env.VUE_APP_BASE_API}/template/list`, async (req, res) => {
    const { body } = req;
    const params = {
      Operator: {
        UserId: process.env.X_ESS_ADMINUSERID,
      },
      ...body,
    };
    client
      .DescribeFlowTemplates(params)
      .then(
        (data) => {
          res.json({
            code: 20000,
            data,
          });
        },
        (err) => {
          // console.log('err====', err);
          if (err.code === 'ResourceNotFound.Template') {
            // 处理没有模版报错情况
            res.json({
              code: 20000,
              data: { Templates: [] },
            });
          } else {
            res.json({ ...err, message: err.message, stack: err.stack });
          }
        },
      )
      .catch((error) => {
        console.log('error====', error);
      });
  });

  // 上传文件
  app.post(`${process.env.VUE_APP_BASE_API}/signContractByFile`, async (req, res) => {
    const { body } = req;


    const clientUpload = new EssClient(uploadClientConfig);

    /**
       * uploadRes @results
       * FileIds	Array of String	文件id数组，有效期一个小时；有效期内此文件id可以反复使用
       * TotalCount	Integer	上传成功文件数量
       * FileUrls	Array of String	文件Url
       * RequestId	String	唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
       * */
    try {
      const uploadRes = await clientUpload.UploadFiles({ ...body });
      console.log('🚀 ~ file: cloudapi.js:88 ~ app.post ~ uploadRes:', uploadRes);
      if (!uploadRes.code) {
        const { FileInfos, approverName, approverMobile } = body;
        // 创建发起合同流程
        const flowRes = await client.CreateFlowByFiles({
          FlowName: (FileInfos[0] && FileInfos[0].FileName) || `Test-${Math.round(Math.random() * 1000)}`,
          Operator: {
            UserId: process.env.X_ESS_ADMINUSERID,
          },
          Approvers: [
            {
              SignComponents: [
                {
                  ComponentWidth: 50,
                  FileIndex: 0,
                  ComponentName: '签名',
                  OffsetX: 11,
                  OffsetY: 11,
                  ComponentType: 'SIGN_SIGNATURE',
                  ComponentPage: 1,
                  ComponentPosX: 50,
                  ComponentPosY: 50,
                  ComponentId: 'sign',
                  ComponentHeight: 50,
                },
              ],
              ApproverName: approverName,
              ApproverMobile: approverMobile,
              ApproverType: 1,
              NotifyType: 'NONE',
            },
          ],
          FileIds: uploadRes.FileIds,
        });
        return res.json({ code: 20000, data: flowRes });
      }
    } catch (e) {
      console.log(e);
      res.json({ code: 5000, message: e.message, stack: e.stack });
    }
  });


  // 上传文件
  app.post(`${process.env.VUE_APP_BASE_API}/createSchemaUrl`, async (req, res) => {
    const { body } = req;

    try {
      // 创建发起合同流程
      const flowRes = await client.CreateSchemeUrl({
        Operator: {
          UserId: process.env.X_ESS_ADMINUSERID,
        },
        FlowId: body.flowId,
        PathType: 1,
        EndPoint: 'HTTP',
        AutoJumpBack: false,
      });
      return res.json({ code: 20000, data: flowRes });
    } catch (e) {
      console.log(e);
      res.json({ code: 5000, message: e.message, stack: e.stack });
    }
  });
};


