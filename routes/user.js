
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};
exports.testgl = function(req,res){
	res.render('testgl', { title: 'testgl' });
}
exports.glbanner = function(req,res){
	res.render('glbanner',{title:'glbanner'});
}
exports.responsive = function(req,res){
	res.render('responsive',{title:'Responsive Test'});
}
exports.haha = function(req,res){
	res.render('haha',{title:'What?'});
}