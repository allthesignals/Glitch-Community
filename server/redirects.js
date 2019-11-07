module.exports = function(app) {
  redirectPath(app, '/featured*', '/culture/');
};

function redirectPath(app, route, target) {
  app.get(route, (req, res) => {
    return res.redirect(301, target + req.path.slice(route.length));
  });
}
