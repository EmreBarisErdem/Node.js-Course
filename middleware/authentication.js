module.exports = (req,res,next) => {
    if(!req.session.isAuthenticated){
        req.session.redirectTo = req.url;
        //kullanıcının gitmek istediği sayfayı sessiona kaydettik.
        return res.redirect('/login');
    }
    next();
}