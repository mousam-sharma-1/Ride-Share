var express = require('express')
var app = express();
var body_parser = require('body-parser');

app.use(express.static('public_pro'));

var urlEncodedParser = body_parser.urlencoded({extended:false});

var mongodb = require('mongodb');
var mongoClient = require('mongodb').MongoClient
var url = "mongodb+srv://Mousam:mousam1399@ridesharecluster-28swm.mongodb.net/test?retryWrites=true&w=majority";



var db;
var dbCon;
mongoClient.connect(url,{ useNewUrlParser: true }).then(function(con){
    dbCon=con;
    db=con.db('minor');    

    var NodeGeocoder = require('node-geocoder');
 
    var options = {
      provider: 'google',
     
      // Optional depending on the providers
      httpAdapter: 'https', // Default
      apiKey: 'AIzaSyAY2WSt2Tjw5FYiIADZvtRmzvjWjC1T2IY', // billing enabled key
      //apiKey: 'AIzaSyAnE8izq7BaeFr_HkCUyb3L99NCFM2rQRo', //Mousam
      formatter: null         // 'gpx', 'string', ...
    };

     
    var geocoder = NodeGeocoder(options);
    

    



    app.get('/user.css',function(req,res){
        res.sendFile(__dirname+"/public_pro/user.css")
        });

app.get("/reg",function(req,res){
        res.sendFile(__dirname+"/public_pro/signup.html");
    });
app.post("/doregister",urlEncodedParser,function(req,res){ 
        var qdata=req.body;                          
        
        // var qdata=q.query; 
      
    console.log(qdata.mobile_no);
        console.log("password =>"+qdata.password);
        db.collection('t_user').find({'mobile_no':qdata.mobile_no}).toArray(function(err,result){
          if(err)
          throw err;
          if(result.length>0){
            console.log("USER ALREADY EXIST!!")
            res.redirect("/reg");
          }
          else{
        db.collection('t_user').insertOne({'name':qdata.name,'mobile_no':qdata.mobile_no,'gender':qdata.gender,'age':qdata.age,'work':qdata.work,'password':qdata.password}),function(err,Result){
        if(err)
        throw err;
       
    }
    res.redirect("/log");
  }
})
       
    });
    app.get("/log",function(req,res){
      res.sendFile(__dirname+"/public_pro/login.html");
    })
    app.get("/checkLogin",function(req,res){
      
      var mob = req.query.mobile;
    var pass = req.query.password;
      console.log("Mob. no. entered:: "+mob);
      console.log("password entered:: "+pass);

        db.collection('t_user').find({'mobile_no':mob,'password':pass}).toArray(function(err,result){
         
        if(err)
        throw err;
        if(result.length>0){
                console.log(result+"===="+result.length);
                // console.log(typeof(result))
                console.log("SUCESSFULL SIGN IN")
                res.redirect("/home");
                  }
                  else{
                    res.send("<h1>NOT Registered<h1>FOR REGISTRATION<a href='http://localhost:3000/reg'>CLICK</a>")
                  }
                }

                  
    )})
app.get("/home",function(req,res){
res.sendFile(__dirname+"/public_pro/user_purana.html"); 
});
app.post("/doreg/rider",urlEncodedParser, function(req,res){
    var vt="rider";
    console.log("rider");
    var q=req.body;
    console.log(q.mobile_no);
    db.collection('t_user').updateOne({'mobile_no':'2222444444'},{$push:{'Logs':{$each:[{'type':vt,'Date-time':req.body.date,'id_proof':req.body.idp,'id_img':req.body.id,'sor_address':'','des_address':''}]}}}),
    function(err,Result){
    if(err)
    throw err;
    console.log('Result::'+Result);
 
}
res.redirect("/map");
})   
app.post("/doreg/driver",urlEncodedParser, function(req,res){
    var vt="driver";
    console.log("driver");
    var q=req.body;
    console.log(q);
    db.collection('t_user').insertOne({'type':vt,'name':req.body.name_d,'mobile_no':req.body.mob,
    'vehicle_no':req.body.vno,'vehicle_type':req.body.vtype,'vehicle_model':req.body.veh_m,
    'licence':req.body.lic,'id_img':req.body.id}),
    function(err,Result){
    if(err)
    throw err;
    console.log('Result::'+Result);
 
}
res.redirect("/map");
})
app.get("/map",function(req,res){

    res.sendFile(__dirname+"/public_pro/map.html"); 

});
app.post('/getMapInput',urlEncodedParser,(req,res)=>{
    var source = req.body.sor;
    var destinition = req.body.des;

    geocoder.geocode(source)
  .then(function(response) {
    
    var sorc=response[0].formattedAddress;
    console.log('Source:: '+sorc);
    
    var sorc_lat=response[0].latitude;
    console.log(sorc_lat);

   var sorc_lng=response[0].longitude;
   console.log(sorc_lng);
  })
  .catch(function(err) {
    console.log(err);
  });

  geocoder.geocode(destinition)
  .then(function(response) {
    console.log('Destination:: '+response[0].formattedAddress);
    console.log(response[0].latitude);
    console.log(response[0].longitude);
  })
  .catch(function(err) {
    console.log(err);
  });
  db.collection('t_user').updateOne({"mobile_no":'2222444446',"Logs.type":'rider'},{$set:{"Logs.$.sor_address":source,"Logs.$.des_address":destinition}}),
  function(err,Result){          //'lat':source.response[0].latitude,'lng':source.response[0].longitude,      //,'lat':destinition.response[0].latitude,'lng':destinition.response[0].longitude
  if(err)
  throw err;
  console.log('Result::'+Result);
  }
    res.redirect('/map');
});   

app.listen(process.env.PORT || 3000,function(){
    console.log("Server :3000");
})
}).catch(function(error){
console.log("Error :"+error);
process.exit();
})