const clientConfig = {
  credential: {
    secretId: process.env.X_ESS_SECRETID,
    secretKey: process.env.X_ESS_SECRETKEY,
  },
  region: '',
  profile: {
    httpProfile: {
      endpoint: 'ess.test.ess.tencent.cn',
    },
  },
};

const uploadClientConfig = {
  credential: {
    secretId: process.env.X_ESS_SECRETID,
    secretKey: process.env.X_ESS_SECRETKEY,
  },
  region: '',
  profile: {
    httpProfile: {
      endpoint: 'file.test.ess.tencent.cn',
    },
  },
};


function sendErrorLog(params) {
  console.log(params);
}

module.exports = {
  clientConfig,
  uploadClientConfig,
  sendErrorLog,
};
