const User = require('../models/user');
const bcrypt = require('bcrypt');
const sendMail = require('../Utility/emailService');
const getToken = require('../Utility/jwtToken');

exports.getLogin = (req, res, next) => {
    var errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;
    res.render('account/login',{
        path:'/login',
        title: 'Login',
        errorMessage: errorMessage
        //isAuthenticated: req.session.isAuthenticated,
        //csrfToken: req.csrfToken() // csurf middleware ile oluşturulan token
        //tek tek bütün metotlara csrf'i eklemek yerine routes'da tüm route'lara ekleyebiliriz.
    });
}

exports.postLogin = (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;

    //bu şekilde yapılan authentication işlemi çalışmaz çünkü middleware ile her requestte ben req'e yeni bir user atıyorum ve isAuthenticated alanı sıfırlanıyor.
    //#region cookie/session kullanımı...
    /*
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
    */
    //#endregion

    User.findOne({email: email})
        .then(user => {
            if(!user){
                req.session.errorMessage = "Kullanıcı bulunamadı.";
                req.session.save(function (err){
                    console.log(err);
                    return res.redirect('/login');
                });
            }
            bcrypt.compare(password, user.password)
                .then(isSucceded => {
                    if(isSucceded){
                        //login işlemleri
                        req.session.user = user;
                        req.session.isAuthenticated = true;
                        return req.session.save(() => {
                            var url = req.session.redirectTo || '/' //kullanıcının gitmek istediği sayfa'
                            delete req.session.redirectTo;
                            //kullanıcının gitmek istediği sayfayı sessiondan sildik.
                            res.redirect(url);
                        });
                    }
                    res.redirect('/login');
                    //kullanıcıya bilgi verilebilir.
              
                })
                .catch(err => {
                    console.log(err);
                });
            
        })
        .catch(err => console.log(err));
    
}

exports.getRegister = (req, res, next) => {
    var errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;
    res.render('account/register',{
        path:'/register',
        title: 'Register',
        errorMessage: errorMessage
    });
}

exports.postRegister = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email: email})
        .then(user => {
            if(user){
                req.session.errorMessage = "Bu Mail adresi ile daha önce kayıt olunmuştur.";
                req.session.save(function (err){
                    console.log(err);
                    return res.redirect('/register');
                    
                });
            }
            return bcrypt.hash(password, 10); // parolayı hashle, 10 => kaç kere hashleme yapılacağını belirtir.
        })
        .then(hashedPassword => {
            const newUser = new User({
                name: name,
                email: email,
                password: hashedPassword,
                cart: {
                    items: []
                }
            });
            return newUser.save();
        
        })
        .then(()=>{

            res.redirect('/login');

            sendMail(
                email,
                'Kayıt işlemi',
                '<h1>Kayıt işleminiz başarılı bir şekilde gerçekleşmiştir.</h1>'
            );

        })
        .catch(err => console.log(err));
}

exports.getReset = (req, res, next) => {
    var errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;
    res.render('account/reset',{
        path:'/reset-password',
        title: 'Reset Password',
        errorMessage: errorMessage
    });
}

exports.postReset = (req, res, next) => {
    const email = req.body.email;

    // Generating Token
    getToken(email)
        .then((token) => {
            res.redirect('/');
            // Sending Email
            sendMail(
                email,
                'Password Reset Token',
                '<p>Please click the link to reset your password: ' + `<a href="https://localhost:3600/reset-password/${token}">Reset Password</a>` + '</p>'
            );
        })
        .catch(err => {
            console.log(err);
            res.redirect('/reset-password');
        });
}

exports.getLogout = (req, res, next) => {

    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    })
}

exports.getNewPassword = (req, res, next) => {

    var errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;

    const token = req.params.token;

    User.findOne(
        {
            resetToken: token, 
            resetTokenExpiration: {$gt: Date.now()}
        }
    ).then(user => {
 
        res.render('account/new-password',{
            path:'/new-password',
            title: 'New Password',
            errorMessage: errorMessage,
            userId: user._id.toString(),
            passwordToken: token
        });

    }).catch(err => {
        console.log(err);
    });
        
    
}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const token = req.body.passwordToken;
    let _user;

    User.findOne(
        {
            resetToken: token, 
            resetTokenExpiration: {$gt: Date.now()},
            _id: userId
        }
    ).then(user => {

        _user = user;
        return bcrypt.hash(newPassword, 10);

    }).then((hashedPassword)=>{

        _user.password = hashedPassword;
        _user.resetToken = undefined;
        _user.resetTokenExpiration = undefined;
        return _user.save();

    }).then(()=>{
        res.redirect('/login');
    })
    .catch(err => {console.log(err);});



    
}