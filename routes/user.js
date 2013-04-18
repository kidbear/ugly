
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};
exports.testgl = function(req,res){
	res.render('testgl', { title: 'testgl' });
}