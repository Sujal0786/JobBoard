module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.session.user) {
      return next();
    }
    req.flash('error_msg', 'Please login first');
    res.redirect('/auth/login');
  }
};
