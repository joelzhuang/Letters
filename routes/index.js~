var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("open Colenso");

//client.execute("xquery //movie[position() lt 10]",console.log);
router.get("/",function(req,res,next){
/**
client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0'; "+
			"for $t in (//title) where $t= '24 August 1863: Hooker to Haast.' return db:path($t)",
			//function(err,res) { if(!err) console.log(res.result)},
**/

//client.execute("XQUERY doc('Colenso/McLean/private_letters/PrLMcL-0024.xml')",
//client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0'; distinct-values(//name)",
client.execute("XQUERY db:list('Colenso')",
//function(err,res) { if(!err) console.log(res.result)}
//client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0'; " +
//"//name[@type = 'place' and position() = 1 and . = 'Manawarakau']",
function (err,body) {
	//var names= [];
	var names = body.result.match(/[^\r\n]+/g);
	//names.shift();
	/**
	var xmlFiles =[];
	
	for(var i=0;i<names.length;i++){
		if(names[i].indexOf(".xml") > -1){
			xmlFiles.push(names[i]);
		}
	} **/
	
	res.render('index', { title: 'ECS Video Rental', queryResult: names});	//render jade file with index.jade/
}
);
});

router.get("/:author/:ftype/:xml", function(req, res, next){
		var author = req.params.author;
		var ftype = req.params.ftype;			//for params if you want to change the page
		var author = req.query.author;		//for search query, if you dont want to changes
		
		//need to check if this method works
		//as this brackets above are not formatted correctly
		console.log(author);
		console.log(ftype);
});




module.exports = router;
