const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.getLogin = (req, res, next) => {
    res.render('account/login',{
        path:'/login',
        title: 'Login',
        isAuthenticated: req.session.isAuthenticated
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
                return res.redirect('/login');
            }
            bcrypt.compare(password, user.password)
                .then(isSucceded => {
                    if(isSucceded){
                        //login işlemleri
                        req.session.user = user;
                        req.session.isAuthenticated = true;
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/');
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
    res.render('account/register',{
        path:'/register',
        title: 'Register',
        isAuthenticated: req.session.isAuthenticated
    });
}

exports.postRegister = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email: email})
        .then(user => {
            if(user){
                return res.redirect('/register');
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
        })
        .catch(err => console.log(err));
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