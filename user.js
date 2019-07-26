var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var ejs=require('ejs');
//var jwt=require('jsonwebtoken');
var router=express.Router();
//var verifytoken=require("./helper/verifytoken");
app.set('view engine','ejs');

app.use(cookieParser());
app.use(bodyParser());
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));

// var session= require('express-session');

// app.use(require('express-flash')());
app.use(express.static('public_pro'));
//app.use(express.static('views'));
// app.use(session({
//   secret: "fd34s@!@dfa453f3DF#$D&W", 
//   resave: false, 
//   saveUninitialized: true, 
//   cookie: { secure: true }
// }));

var urlEncodedParser = bodyParser.urlencoded({extended:false});

var mongodb = require('mongodb');
var mongoClient = require('mongodb').MongoClient;
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
      apiKey: 'AIzaSyAIKBwIgz6GFw5m2NM4vE9Om84P2hUXnf8', // billing enabled key(Ankit sir Stoway)

      //apiKey: 'AIzaSyDu-O2F3kvwNiBjPQGuScZBpzhXyBk50S8', // billing enabled key(Akash sir ziasy)
      //apiKey: 'AIzaSyAnE8izq7BaeFr_HkCUyb3L99NCFM2rQRo', //Mousam
      formatter: null         // 'gpx', 'string', ...
    };

     
    var geocoder = NodeGeocoder(options);
    

    app.get("",function(req,res){
      res.redirect("/user");
    })

    app.get("/blog",function(req,res){
      res.render('content',{'name':'MOUSAM'}); 
    })

    app.get("/about",function(req,res){
      res.sendFile(__dirname+"/public_pro/about.html"); 
    })

    app.get("/contact",function(req,res){
      res.sendFile(__dirname+"/public_pro/contact.html"); 
    })





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
            res.send("<h1>Mobile Number Already Registered&nbsp<a href='/reg'>CLICK</a></h1>")
          }
          else{
        db.collection('t_user').insertOne({name:qdata.name,mobile_no:qdata.mobile_no,gender:qdata.gender,Dob:qdata.age,work:qdata.work,password:qdata.password}),function(err,Result){
        if(err)
        throw err;
        }
      res.redirect("/log");
    }
  })
});

    app.get("/log",function(req,res){
    //  var pagedata={message:req.flash('message')}
     // res.render(__dirname+"/public_pro/login.html",message);
    res.sendFile(__dirname+"/public_pro/login.html");
    })

    app.get("/checkLogin",function(req,res){
      
      var mob = req.query.mobile;
    var pass = req.query.password;
      console.log("Mob. no. entered:: "+mob);
      console.log("password entered:: "+pass);

        db.collection('t_user').find({mobile_no:mob,password:pass}).toArray(function(err,result){
          //var data={ };
        if(result.length>0){
////////////////////////////JSON WEB TOKEN//////////////////////////////////////////////////
          // jwt.sign({user:"abhi"},"suab",(err,token)=>{
          //   console.log("hello");
          //   if(err){
          //     console.log(err)
          //       res.status(400).json("err");
          //     }
          //   else{
          //     var token="Bearer"+" "+token;
          //     data.token=token;
          //     console.log(data.token);
              
          //       console.log("JWT++++++++++"+data)}
          //   });
          var data=result[0];
          // console.log(result[0]);

          req.session.fullname=data.name;

          req.session.is_user_logged_in=true;

          console.log("session="+req.session.fullname+"=="+req.session.is_user_logged_in);




                console.log(JSON.stringify(result)+"===="+result.length);
                
                var q=result[0]._id;
                console.log("SUCESSFULL SIGN IN")
                console.log("result _id ="+q);
                
                res.cookie('userData',mongodb.ObjectId(q), {maxAge:600000000, httpOnly: true});
                res.cookie('Rcode', null, {maxAge:600000000, httpOnly: true});
            
                // console.log(req.cookies);
               // res.clearCookie("newname");
               
                res.redirect("/user")
                  }
                  else{
                  // req.session('message','error');
                  // req.flash('message','error')
                  //res.redirect('/log');
                     res.send("<h1>NOT Registered<h1>FOR REGISTRATION<a href='/reg'>CLICK</a>")
                  }
                })
              })


              // app.get("/user", verifytoken.verifyToken,function(req,res){
              //   jwt.verify(req.token,'suab',(err,authdata)=>{
              //     if(authdata){
              //       res.sendFile(__dirname+"/public_pro/user_purana.html");
              //     }
              //     else{
              //       res.status(400).json("no kkk token given")
              //     }
              //   });
              
                
              // });


app.get("/history",backdoor,function(req,res){

  db.collection('travels').find({'travelId':req.cookies.userData,'sor_address' : { $ne: "" } }).toArray(function(err,result){
    if(err)
    throw err;
    console.log(req.cookies.userData);
    res.render('content',{'name':req.session.fullname,'data':result}); 
  })
})


app.get("/logout",function(req,res){

  req.session.destroy();

  res.redirect("/user");
})



function backdoor(req,res,next){
        
  if(!req.session.is_user_logged_in)
  {
    res.redirect("/log");
  }

  next();

}







 app.get("/user",backdoor,function(req,res){

 res.sendFile(__dirname+"/public_pro/user_purana.html"); 
 });


app.post("/doreg/rider",backdoor,urlEncodedParser, function(req,res){
  console.log("session2="+req.session.fullname+"=="+req.session.is_user_logged_in);

    console.log("rider");
    console.log(req.cookies.userData);
var rad="Ri_"+Math.random().toString(36).substring(2, 8);
console.log(rad);
res.cookie('Rcode', rad, {maxAge:600000000, httpOnly: true});


    // console.log(req.cookie.q);
    var q=req.body;
    console.log(q);
    db.collection('travels').insertOne({'type':"rider",code:rad,travelId:req.cookies.userData,'vehicle_type':req.body.vtype,'Date-time':req.body.date,'Seat':req.body.seat,'sor_address':'','des_address':'','Match_id':''}),
    // db.collection('travels').updateOne({'mobile_no':'2222444444'},{$push:{'Logs':{$each:[{'type':"rider",'vehicle type':req.body.vtype,'Date-time':req.body.date,'id_img':req.body.id,'sor_address':'','des_address':''}]}}}),
    function(err,res){
    if(err)
    throw err;
    console.log(res);
 
}
res.redirect("/map");
})   
app.post("/doreg/driver",backdoor,urlEncodedParser, function(req,res){
    console.log("driver");
    console.log(req.cookies.userData);
    var rad="Dr_"+Math.random().toString(36).substring(2, 8);
    console.log(rad);
    res.cookie('Rcode', rad, {maxAge:600000000, httpOnly: true });
    
    var q=req.body;
    console.log(q);
    
    db.collection('travels').insertOne({'type':"driver",code:rad,travelId:req.cookies.userData,'vehicle_type':req.body.vtype,'Date-time':req.body.date,'Seat':req.body.seat,'sor_address':'','des_address':'','Match_id':''}),
    function(err,res){
    if(err)
    throw err;
    console.log(res);
 
}
res.redirect("/map");
})
app.get("/map",backdoor,function(req,res){

    res.sendFile(__dirname+"/public_pro/map.html"); 

});
app.post('/getMapInput',backdoor,urlEncodedParser,(req,res)=>{
  var sorc; 
  var sorc_lat;
  var sorc_lng;
  var desc; 
  var desc_lat;
  var desc_lng;
  var source = req.body.sor;
    var destinition = req.body.des;
    console.log("randome code == "+req.cookies.Rcode);
  console.log("now:::"+req.cookies.userData);

    geocoder.geocode(source)
    .then(function(response) {
    
    sorc=response[0].formattedAddress;
  console.log('Source:: '+sorc);
    
     sorc_lat=response[0].latitude;
    console.log(sorc_lat);

   sorc_lng=response[0].longitude;
   console.log(sorc_lng);
  })
  .catch(function(err) {
    console.log(err);
  });

  geocoder.geocode(destinition)
  .then(function(response) {

    desc=response[0].formattedAddress;
  console.log('Destination:: '+desc);
  
  desc_lat=response[0].latitude;
    console.log(response[0].latitude);
  
  desc_lng=response[0].longitude;
    console.log(response[0].longitude);
  })
  .catch(function(err) {
    console.log(err);
  });
  function getValue() {
setTimeout(()=> {
console.log('source outside:: '+sorc);
console.log('Destination outside:: '+desc);
console.log("CODE=="+req.cookies.Rcode);
db.collection('travels').updateOne({'travelId':req.cookies.userData,'code':req.cookies.Rcode},{$set:{"sor_address":sorc,"sor_coordinates":[sorc_lat,sorc_lng],"des_address":desc,"des_coordinates":[desc_lat,desc_lng]}}),
function(err,Result){          //'lat':source.response[0].latitude,'lng':source.response[0].longitude,      //,'lat':destinition.response[0].latitude,'lng':destinition.response[0].longitude
if(err)
throw err;
}




},5000);
  }
  getValue();
  


   res.redirect('/map');
 

});   

app.listen(process.env.PORT || 3000,function(){
    console.log("Server :3000");
})
}).catch(function(error){
console.log("Error :"+error);
process.exit();
})
module.exports=router;