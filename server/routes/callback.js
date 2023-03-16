module.exports = (app) => {
  app.post(`${process.env.VUE_APP_BASE_API}/common/callback`, (req, res) => {
    const { body } = req;
    console.log(body);
    res.status(200).json({
      message: 'ok',
    });
  });
};
