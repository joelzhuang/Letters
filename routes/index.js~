var cheerio = require('cheerio');
var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("open Colenso");
//client.execute("xquery //movie[position() lt 10]",console.log);
routes.get("/",function(req,res,next){
client.execute("xquery for $movie in //movie[position() lt 10] " +
"return <movie> {$movie/title} {$movie/id} </movie>",
function (body) {
var $ = cheerio.load(body);
var list = [];
$('movie').each(function(i,elem){
var title = $(elem).find('title').text();
var id = $(elem).find('id').text();
var url = 'images/' + id + '.jpg';
list.push({ p: title, image: url });
});
res.render('index', { title: 'ECS Video Rental', images: list });	//render jade file with index.jade
}
);
});