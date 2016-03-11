var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("open Colenso");

//client.execute("xquery //movie[position() lt 10]",console.log);
router.get("/",function(req,res,next){
client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0'; "+
			"for $t in (//title) where $t= '24 August 1863: Hooker to Haast.' return db:path($t)",
			//function(err,res) { if(!err) console.log(res.result)},
	
function (err,body) {
	res.render('index', { title: 'ECS Video Rental', p: body.result});	//render jade file with index.jade
}
);
});
module.exports = router;