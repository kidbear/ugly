
/*
 * GET home page.
 */

exports.index = function(req, res){
	var models = require('../models'),
		User = models.User;
    // var user = new User({ 
    //     email : 'lnn_523@126.com', 
    //     name : 'linannan' 
    // }); 
   	// user.save(function(_err,_product){
   	// 	user.id = _product.id
    // });
    //console.log(user.id);
    User.find({name:'linannan'},function(_err,_product){
  		res.render('index', { title: 'Hello,GL!' ,user:_product[0]||{name:'guest'}});
    })
};