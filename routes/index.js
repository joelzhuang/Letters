
//for uploading
var multer = require('multer');
var upload = multer({dest: './uploads'});

//for renaming files
var fs = require('fs');

var express = require('express');
var router = express.Router();

var cheerio = require('cheerio');

var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");

var nestCount = 0;
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
	names.sort();
	var author, ftype, xmlFile; 
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
		var xml = req.params.xml;		//for search query, if you dont want to changes
		
		console.log(author);
		console.log(ftype);
		console.log(xml);
		
		var url = author + "/" + ftype + "/" + xml; 
		client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0'; " + 
		"doc('Colenso/" + author + "/" + ftype + "/" + xml + "')",
		function (err,xmlFile){
			if(err){
				console.log(err);
			}
			res.render('file',{ title: 'file', queryResult: xmlFile.result, downLink:url});
		  
		});
		
		//function for passing in the file that was returned from the query
		
		
});

router.get("/download/:author/:ftype/:xml",function(req,res,next){
		var author = req.params.author;
		var ftype = req.params.ftype;	
		var xml = req.params.xml;
		console.log("URL");
		client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0'; " + 
		"doc('Colenso/" + author + "/" + ftype + "/" + xml +"')",
		function (err,xmlFile){
			if(err){
				console.log(err);
			}
			res.send(xmlFile.result);
		  
		});
		
});

router.get("/edit/:author/:ftype/:xml",function(req,res,next){
		var author = req.params.author;
		var ftype = req.params.ftype;			//for params if you want to change the page
		var xml = req.params.xml;		//for search query, if you dont want to changes
		
		console.log(author);
		console.log(ftype);
		console.log(xml);
		
		var url = author + "/" + ftype + "/" + xml; 
		client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0'; " + 
		"doc('Colenso/" + author + "/" + ftype + "/" + xml + "')",
		function (err,xmlFile){
			if(err){
				console.log(err);
			}
			res.render('edit',{ title: 'Edit', queryResult: xmlFile.result, downLink:url});
		  
		});
		
});

router.post("/save/:author/:ftype/:xml",function(req,res,next){
		var author = req.params.author;
		var ftype = req.params.ftype;			//for params if you want to change the page
		var xml = req.params.xml;		//for search query, if you dont want to changes
		
		console.log(author);
		console.log(ftype);
		console.log(xml);

		var text = req.body.fileEdit;
		//var xml = cheerio.load(text,{xmlMode:true});
		//var xmlFile = cheerio.xml(xml);
		
		var url = author + "/" + ftype + "/" + xml; 

		//replacing
		client.execute("REPLACE " + url + " " + text,
		 function (err){
			if(err){
				console.log(err);
			}
			//res.render('file',{ title: 'file', queryResult: xmlFile.result, downLink:url});
		  
		});



		client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0'; " + 
		"doc('Colenso/" + url + "')",
		function (err,xmlFile){
			if(err){
				console.log(err);
			}
			res.render('file',{ title: 'file', queryResult: xmlFile.result, downLink:url});
		  
		});
		
});

router.get("/search",function(req,res,next){
	nestCount = 0;
	var title = req.query.title;
	var Bquery = req.query.Bquery;
	var text = req.query.text;
	var search = [];
	//REGEX???: (*[matches(., "Hooker")])
	//checks which variable is defined, and does the query that relates to the defined variable

	//using ftand
	//declare default element namespace 'http://www.tei-c.org/ns/1.0'; for $t in *[.//text() contains text 'Hooker' ftand 'Haast']return db:path($t)
	if(title){
		console.log(title);
		client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0'; for $t in (//title) where matches($t,'" + title + "','i') return db:path($t)",   
		function(err,body) {  
			search = body.result.match(/[^\r\n]+/g);
			console.log("result"+search);
			res.render('search',{title: 'Search Query', searchResult: search, titleInput:title});
		});
		
	} else if (Bquery){
		console.log(Bquery);
		client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" + Bquery + "return db:path($t)",   
		function(err,body) {  
			search = body.result.match(/[^\r\n]+/g);
			console.log("result"+search);
			res.render('search',{title: 'Search Query', searchResult: search, queryInput:Bquery});
		});
		
	} else if (text){
		console.log(text);
		client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0'; for $t in *[.//text() contains text " + text + "]return db:path($t)",
		function(err,body) {  
			search = body.result.match(/[^\r\n]+/g);
			res.render('search',{title: 'Search Query', searchResult: search, textInput: text});
		});
	} else {
		res.render('search',{title: 'Search Query'});
	}
  
});

// router.get("/nestedSearch",function(req,res,next){
// 	 res.render('nsearch',{title: 'Nested Search Query'});
  
// });

router.get("/nestedSearch",function(req,res,next){
	var title = req.query.title;
	var Bquery = req.query.Bquery;
	var text = req.query.text;
	var directory = process.env.PWD;
	var search = [];
	var searchText = [];
	console.log("NESTED SERACH");
	console.log(title);
	
	//REGEX???: (*[matches(., "Hooker")])
	//checks which variable is defined, and does the query that relates to the defined variable

	//using ftand
	//declare default element namespace 'http://www.tei-c.org/ns/1.0'; for $t in *[.//text() contains text 'Hooker' ftand 'Haast']return db:path($t)
	if(title){
		console.log("NESTED SERACH");
		console.log(title);
		client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0'; for $t in (//title) where matches($t,'" + title + "','i') return db:path($t)",   
		function(err,body) {  

			search = body.result.match(/[^\r\n]+/g);
			console.log("result"+search);
			console.log("search legnth: " + search.length);

			//creating raw text for every search
			for(i = 0; i<search.length;i++){

				console.log("SEARCH " + i + " : " + search[i]);
				client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0'; " + 
				"doc('Colenso/" + search[i] + "')",
				function (err,xmlFile){
					searchText[i] = xmlFile.result;		
					console.log("searchText[" + i + "]");
				});
				console.log("I: " + i);
			}
			console.log("search TEXT legnth: " + searchText.length);
			//creating new database
			client.execute("CREATE DB nest" + nestCount);
			for(i=0; i<searchText.length; i++){
				client.execute("ADD " + searchText[i], 
					function(err){
						console.log(err);
					}
				);
			}

			console.log("NEST COUNT: " + nestCount);

			client.execute("XQUERY db:list('nest" + nestCount + "')",
				function (err,body) {
					var names = body.result.match(/[^\r\n]+/g);
					//names.sort();
					var author, ftype, xmlFile; 					
					res.render('index', { title: 'ECS Video Rental', queryResult: names});	//render jade file with index.jade/
				}
			);
			
			//res.render('search',{title: 'Search Query', searchResult: search, titleInput:title});
		});
		
	} else if (Bquery){
		console.log(Bquery);
		client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" + Bquery + "return db:path($t)",   
		function(err,body) {  
			search = body.result.match(/[^\r\n]+/g);
			console.log("result"+search);
			res.render('search',{title: 'Search Query', searchResult: search, queryInput:Bquery});
		});
		
	} else if (text){
		console.log(text);
		client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0'; for $t in *[.//text() contains text " + text + "]return db:path($t)",
		function(err,body) {  
			search = body.result.match(/[^\r\n]+/g);
			res.render('search',{title: 'Search Query', searchResult: search, textInput: text});
		});
	} else {
		res.render('nsearch',{title: 'Nested Search'});
	}
  
});




router.get("/add",function(req,res,next){
	 res.render('add',{title: 'Add XML Document'});
  
});

router.post("/add", upload.single('fileUpload'),function(req,res,next){
	console.log(req.file);
	//getting current directory
	var directory = process.env.PWD;
	var origName = req.file.originalname;
	var hasError = false;

	//renaming the file to its original name
	fs.rename(req.file.path, 'uploads/' + origName, 
		function(err){
			//if(err){
			//	hasError = true;
				console.log("RENAMING ERROR")
				console.log(err);
			//	res.render('add',{title:'Failed to find the file.', error:err});
			//}
		}
	);

	//adding the file to the database
	client.execute("ADD " + directory + "/uploads/" + origName , 
		function(err){
			//if(err){
			//	hasError = true;
				console.log("ADDING FILE TO DATABASE ERROR")
				console.log(err);
			//	res.render('add',{title:'Failed to Upload XML File', error:err});
			//}
	});

	//if(hasError){
		res.render('add',{title:'Uploaded'});
	//}



		

});


module.exports = router;
