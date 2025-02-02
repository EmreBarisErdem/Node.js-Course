
exports.get404Page = (req,res)=>{
    // res.status(404).sendFile(path.join(__dirname,'views','404.html'));
    res.status(404).render('error/404',{title:'PAGE NOT FOUND'}); //it renders the 404.pug // title main-layout ta ki title oluyor.
}

exports.get500Page = (req,res)=>{
    res.status(500).render('error/500',{title:'Server Error'}); 
}