exports.getLogin = (req, res, next) => {
    res.render('account/login',{
        path:'/login',
        title: 'Login'
    });
}

exports.postLogin = (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;

    //bu şekilde yapılan authentication işlemi çalışmaz çünkü middleware ile her requestte ben req'e yeni bir user atıyorum ve isAuthenticated alanı sıfırlanıyor.
    if((email === 'email@gmail.com') && (password === '1234')){
        req.isAuthenticated = true;
        //#region cookie kullanımı...
        //npm install --save cookie-parser
        //res.cookie('isAuthenticated', true);
        //#endregion

        
        //#region session kullanımı...

        //npm install --save express-session
        req.session.isAuthenticated = true;
        //#endregion

        //#region session bilgilerinin mongoDB'de saklanması

        //npm install --save connect-mongodb-session

        //#endregion
        res.redirect('/');
    
    }
    else{
        req.isAuthenticated = false;
        res.cookie('isAuthenticated', false);
        res.redirect('/login');
    }


    
}

exports.getRegister = (req, res, next) => {
    res.render('account/register',{
        path:'/register',
        title: 'Register'
    });
}

exports.postRegister = (req, res, next) => {
    res.redirect('/');
}

exports.getReset = (req, res, next) => {
    res.render('account/reset',{
        path:'/reset',
        title: 'Reset'
    });
}

exports.postReset = (req, res, next) => {
    res.redirect('/');
}