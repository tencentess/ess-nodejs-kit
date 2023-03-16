const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const init = async () => {
  const sessionRes = await fetch('https://appgw.test.ess.tencent.cn/consoleapp/?X-Action=CreateSession', {
    method: 'POST',
    headers: {
      'x-dev': 'saturn',
      'x-action': 'CreateSession',
      'Content-Type': 'application/json',
      referer: 'https://test.qian.tencent.cn/developers',
    },
    body: JSON.stringify({
      Action: 'CreateSession',
      Code: '',
      CodeType: 'NONE',
    }),
  });
  const session = await sessionRes.json();
  console.log('🚀 ~ file: init.js:18 ~ init ~ session:', session);
  if (session.Response?.SessionId) {
    const sessionId = session.Response.SessionId;
    const res = await fetch('https://appgw.test.ess.tencent.cn/consoleapp/?X-Action=CreateDevelopmentApplication', {
      method: 'POST',
      headers: {
        authorization: `SessionId=${sessionId}`,
        'x-dev': 'saturn',
        'x-action': 'CreateDevelopmentApplication',
        'Content-Type': 'application/json',
        referer: 'https://test.qian.tencent.cn/developers',
      },
      body: JSON.stringify({
        Type: 0,
        CallbackUrl: 'https://channel-demo.test.ess.tencent.cn/callback',
      }),
    });
    const data = await res.json();
    console.log('🚀 ~ file: init.js:35 ~ init ~ data:', data);
    const map = data.Response;
    const envFileContent = Object.entries(map).map(([key, val]) => `X_ESS_${key.toUpperCase()}='${val}'`)
      .join('/n');

    fs.writeFileSync(path.resolve(process.cwd(), '.env.ess'), envFileContent, 'utf-8');

    dotenv.config({
      path: path.resolve(process.cwd(), '.env.ess'),
      override: true,
    });
  }
};

init();
