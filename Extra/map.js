var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var urlEncodedParser = bodyParser.urlencoded({extended:false});

app.use(express.static('public'));

var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
 
  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: 'AIzaSyB4BwjFDbXchO3M2xQM50RlLtpPz2oLx-o', // for Mapquest, OpenCage, Google Premier
  //apiKey: 'AIzaSyAnE8izq7BaeFr_HkCUyb3L99NCFM2rQRo', //Mousam
  formatter: null         // 'gpx', 'string', ...
};
 
var geocoder = NodeGeocoder(options);



// app.get('/map',(req,res)=>{
//     res.sendFile(__dirname+"/map.html");
// })
// app.post('/locmap',urlEncodedParser,(req,res)=>{
//     var name = req.body.asdf;
//     console.log('Hello I am in app.post')
//     console.log(name);
// });
// app.get('/locmap',(req,res)=>{
//     var l = req.query.Source;
//     var ln = req.query.Destinition;
//     console.log(l);
//     console.log(ln);
//     res.redirect('/Map');
// });

app.get('/map',(req,res)=>{
    res.sendFile(__dirname+"/map.html");
});

app.post('/getMapInput',urlEncodedParser,(req,res)=>{
    var source = req.body.sor;
    var destinition = req.body.des;

    geocoder.geocode(source)
  .then(function(response) {
    console.log(response[0].formattedAddress);
    console.log(response[0].latitude);
   console.log(response[0].longitude);
  })
  .catch(function(err) {
    console.log(err);
  });

  geocoder.geocode(destinition)
  .then(function(response) {
    console.log(response[0].formattedAddress);
    console.log(response[0].latitude);
    console.log(response[0].longitude);
  })
  .catch(function(err) {
    console.log(err);
  });
    
    res.redirect('/map');
});



var server = app.listen(3000,()=>{
    console.log('Server is running at '+server.address().port);
});





// var express=require('express')


// var body_parser=require('body-parser');
// var urlEncodedParser=body_parser.urlencoded({extended:false});

// var app= express();
// app.listen(3000,function(){
//     console.log("Server :3000");
// })
// app.get("/map",function(req,res){

//     res.sendFile(__dirname+"/map.html"); 
// });
// app.get("/doloc",urlEncodedParser, function(req,res){
//      res.redirect('/map');
//     });




//https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=


// function addmarker(lat,lng){
//     alert('h1'+lat);
// this._createMarker(lat,lng)
// }

// function _createMarker(lat,lng){
    
//     var opts={
//         position: {
//             lat:'',
//             lng:''
//         },
//         map:map
//     };
//         return new google.map.marker(opts);
//     };