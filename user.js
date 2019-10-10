var express = require('express');
var app = express();
var multer= require('multer');
var path= require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var map = require("google_directions")
//var client = require('socket.io').listen(4000).sockets;
const Nexmo = require('nexmo');
var ejs=require('ejs');
//var jwt=require('jsonwebtoken');
var router=express.Router();
//var chats=require("./helper/chat");
app.set('view engine','ejs');

app.use(cookieParser());
app.use(bodyParser());
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));


// multer storage
var storage= multer.diskStorage({
  destination:'./public_pro/uploads',
  filename:function(req,file,cb){
    cb(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname));
  }
})

// upload
var upload= multer({
  storage:storage,
  limits:{fileSize: 1000000}
}).single('aadh');

var storage2= multer.diskStorage({
  destination:'./public_pro/avatars',
  filename:function(req,file,cb){
    cb(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname));
  }
})

var upload2= multer({
  storage:storage2,
  limits:{fileSize: 1000000}
}).single('ava');


//const from = '18482713356';

const nexmo = new Nexmo({
  apiKey: '80830d1b',
  apiSecret: 'ZgtbVYpk1EML5pom',
  // apiKey: '8630972e',
  //apiSecret: 'jieBARyFP3DhHNwL',
  //apiKey: 'be76a80b',
  //apiSecret: 'k7NeXeb3ExKvsmAR',
});



// app.use(require('express-flash')());
app.use(express.static('public_pro'));
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
      //apiKey: 'AIzaSyAIKBwIgz6GFw5m2NM4vE9Om84P2hUXnf8', // billing enabled key(Ankit sir Stoway)
      apiKey: 'AIzaSyCQ2l2mGOB24ZWMaxOt3fasayoNXM8NdAo', // billing enable(Akash)
      //apiKey: 'AIzaSyAnE8izq7BaeFr_HkCUyb3L99NCFM2rQRo', //Mousam
      formatter: null         // 'gpx', 'string', ...
    };

     
    var geocoder = NodeGeocoder(options);
    

    app.get("",function(req,res){
      var main=new Date();
      var xx=main.toISOString();
      var ff=xx.split(":");
      var hat=ff[0]+":"+ff[1];
      console.log("hat:: "+hat);
      db.collection('travels').deleteMany({'DateTime':{$lte:hat}},function(err,result){
        if(err)
            console.log("Removed TIME OUT data.");       
    });
    res.redirect("/user");  
    })

    app.get("/blog",function(req,res){
      res.sendFile(__dirname+"/public_pro/blog.html")
    })

    app.get("/about",function(req,res){
      res.sendFile(__dirname+"/public_pro/about.html"); 
    })

    app.get("/contact",function(req,res){
      res.sendFile(__dirname+"/public_pro/contact.html"); 
    })

    app.get("/sent",backdoor,function(req,res){
      res.sendFile(__dirname+"/public_pro/sent.html")
    })


app.get('/otp',function(req,res){
  console.log("/otp : "+req.session.mob);
  res.render("otp",{"message":null});
})


    app.get('/user.css',function(req,res){
        res.sendFile(__dirname+"/public_pro/user.css")
        });


        app.get('/min_pro_clg/manifest.json',function(req,res){
          res.sendFile(__dirname+"/manifest.json")
          });

app.get("/reg",function(req,res){
        res.render("signup",{"message":null});
    });


app.post('/upload',(req,res)=>{
  console.log("aad::"+req.session.mob);

  upload(req,res,(err)=>{
    if(err){
      res.render('load',{"message":"Try Again! "+err});
    } else{
      db.collection('t_user').updateOne({mobile_no:req.session.mob},{$set:{'AADHAR':"/uploads/"+req.file.filename}},function(err,Result){ 
        if (err)
        throw err;

         console.log("file:: /uploads/"+req.file.filename);
       res.redirect("/24");
    })
  }
  })
})

app.get("/24",function(req,res){
  console.log("IN @24")
  db.collection('t_user').find({mobile_no:req.session.mob,"profile":{$ne:""}}).toArray(function(err,resul){
    if(err)
    throw err;
    console.log(":::res:::"+resul.length) 
    if(resul.length>0){
     console.log(":::res:::"+resul[0].profile)
     res.render('24',{"data":resul});
    }
    else{
     res.render('24',{"data":null});
    }
 })
  
})

app.post('/avatar',(req,res)=>{
  upload2(req,res,(err)=>{
    if(err){
      console.log(err);
      res.render('load',{"message":"Try Again! "+err});
    } else{
      console.log("profile:: /uploads/"+req.file.filename);
      console.log("p::"+req.session.mob);

      db.collection('t_user').updateOne({mobile_no:req.session.mob},{$set:{'profile':"/avatars/"+req.file.filename}},function(err,Result){ 
        if (err)
        throw err;
      })
     // res.redirect("/24");
    }
  })
})


app.post("/doregister",urlEncodedParser,function(req,res){
        var qdata=req.body;                          
        var mobilenumber="91"+qdata.mobile_no;
        var random=Math.floor(Math.random() *9000)+1000;
        var otp=random.toString();
        console.log(otp);
        console.log(random);
        const from = '18482713356';    // const from = 'Nexmo';
        const to = '15625928787';    //917000944479
        const text = qdata.mobile_no+" - OTP : "+random;

        req.session.mob=mobilenumber;
        req.session.fullname=qdata.name;
        
    console.log("mobilenumber "+req.session.mob);
        console.log("password =>"+qdata.password);
        db.collection('t_user').find({'mobile_no':mobilenumber,"Account":"verified"}).toArray(function(err,result){
          if(err)
          throw err;

          if(result.length>0){
            console.log("USER ALREADY EXIST!!");
           res.render("signup",{"message":"Mobile Number Already Registered!"});
          }
          else{
              nexmo.message.sendSms(from, to, text,(err, responseData) => {
              if (err) {
               console.log("hello err");
             } else {
       console.log(responseData);
       console.log(otp);
        db.collection('t_user').insertOne({'profile':'',name:qdata.name,mobile_no:mobilenumber,otp:otp,gender:qdata.gender,Dob:qdata.age,work:qdata.work,password:qdata.password,"AADHAR":'',"Account":''}),function(err,Result){
        if(err)
        throw err;        
      }
console.log("aage...")
      }
      })
      res.redirect("/otp");
//      res.redirect("/khali");
      //res.redirect(307,"/upload");
    }
  })
});
app.get("/khali",function(req,res){
  res.render('load',{"message":null});
})

app.get('/checkOtp',function(req,res){
console.log("entered..."+req.session.mob);
console.log(req.query.otp);
  db.collection('t_user').find({mobile_no:req.session.mob,otp:req.query.otp}).toArray(function(err,result){
    if(result.length==1){
    var q=result[0]._id;
    var data=result[0];
    console.log(JSON.stringify(result[0]));
    console.log("result.otp"+data.otp);
      // console.log(result)
      
        console.log("result _id ="+q);
        res.cookie('userData',mongodb.ObjectId(q), {maxAge:600000000, httpOnly: true});
        res.cookie('Rcode', null, {maxAge:600000000, httpOnly: true});

        db.collection('t_user').updateOne({mobile_no:req.session.mob},{$set:{'otp':"success"}},function(err,Result){     
      
          // if(err)
        // throw err;
       // req.session.is_user_logged_in=true;
            console.log("otpsuccess");
            res.redirect("/khali");
      })
      
    }
    
    else{
     	   console.log("otp not match");
     	  res.render("otp",{"message":"Wrong OTP!"});
       }

  })

})


    app.get("/log",function(req,res){
    //  var pagedata={message:req.flash('message')}
    res.render("login",{'message':null});
    })

    app.get("/checkLogin",function(req,res){
      
      var mob = "91"+req.query.mobile;
    var pass = req.query.password;
      console.log("Mob. no. entered:: "+mob);
      console.log("password entered:: "+pass);

        db.collection('t_user').find({mobile_no:mob,password:pass,otp:"success","Account":'verified'}).toArray(function(err,result){
          //var data={ };
        if(result.length>0){

          var data=result[0];
          // console.log(result[0]);
          req.session.mob=data.mobile_no;
          req.session.fullname=data.name;
          req.session.myID=data._id;
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
                  // alert("User NOT Registered!")
                  // document.write("alert('Mobile Number Already Registered!')");
                  // res.redirect("/log");
                  res.render("login",{'message':'User NOT Registered!'});
                  //res.send("<h1>NOT Registered<h1>FOR REGISTRATION<a href='/reg'>CLICK</a>");
                  }
                })
              })
      

              app.get("/remove/:id",backdoor,function(req,res){
                var id=req.params.id;
                console.log("Removing id : "+id);
                db.collection('travels').deleteOne({_id: new mongodb.ObjectID(id)},function(err,result){
                    if(err)
                        console.log("Remove Error :"+err);         
            
                    res.redirect("/history");
                });
            })

            app.get("/removeReq/:id",backdoor,function(req,res){
              var id=req.params.id;
              console.log("Removing Request id : "+id);
              db.collection('travels').updateOne({_id:new mongodb.ObjectID(id)},{$pull:{"Match_id":req.session.myID}}),function(err,result){
                  if(err)
                  throw err;    
              }
              res.redirect("/request");
          })

            app.get("/accept/:travelId/:id",backdoor,function(req,res){
              var tid=req.params.travelId;
              var id1=req.params.id;
              console.log(tid);
              db.collection('t_user').find({_id:new mongodb.ObjectID(tid)}).toArray(function(err,res){
                console.log(res.length);
                console.log(res[0].name);
                console.log(res[0].mobile_no);
                console.log(req.session.mob);
             if(res.length>0){
              const from = '18482713356';   //  const from = 'Nexmo';
              const to = '15625928787';    //const to = req.session.mob;
              const text ="Sucessfull Connection !! contact "+res[0].name+" - "+res[0].mobile_no+" For your Ride ,Thanks For Use.";
              nexmo.message.sendSms(from, to, text,(err, responseData) => {
                if (err) 
                throw err;
            console.log(responseData);
            })
            another();
           function another(){
            const from = '18482713356';     //const from = 'Nexmo';
            const to = '15625928787';    //const to = res[0].mobile_no;
            const text ="Sucessfull Connection !! contact "+req.session.fullname+" - "+req.session.mob+" For your Ride ,Thanks For Use.";
            nexmo.message.sendSms(from, to, text,(err, responseData) => {
              if (err) 
              throw err;
          console.log(responseData);
          }) 
           }
          }
          })
          console.log("nnnnn--"+id1);
          db.collection('travels').updateMany({_id:new mongodb.ObjectID(id1)},{$set:{"status":"COMPLETE"}}),function(err,res){
            if(err)
            throw err;
          }
          console.log("mmm--"+req.cookies.upID);
          db.collection('travels').updateOne({_id:new mongodb.ObjectID(req.cookies.upID)},{$set:{"status":"COMPLETE"}}),function(err,res){
            if(err)
            throw err;
          }
res.redirect("/sent");
            })


app.get("/history",backdoor,function(req,res){

  db.collection('travels').find({'travelId':req.cookies.userData,'sor_address' : { $ne: "" },"status":"INCOMPLETE" }).toArray(function(err,result){
    if(err)
    throw err;
    console.log(req.cookies.userData);
    if(result.length>0)
    res.render('content',{'name':req.session.fullname,"message":null,'data':result});
    else
    res.render('content',{'name':req.session.fullname,"message":"No Rides Made",'data':result});
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
else{
  next();
}
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
console.log("seat::"+req.body.seat[0])
res.cookie('seat', req.body.seat[0], {maxAge:600000000, httpOnly: true });

    // console.log(req.cookie.q);
    var q=req.body;
    console.log(q);
    db.collection('travels').insertOne({'type':"Rider",'name':req.session.fullname,code:rad,travelId:req.cookies.userData,'vehicle_type':req.body.vtype,'DateTime':req.body.date,'Seat':req.body.seat[0],'sor_address':'','des_address':'','Match_id':[""],"status":"INCOMPLETE"}),
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
    console.log("seat::"+req.body.seat[0])
    res.cookie('seat', req.body.seat[0], {maxAge:600000000, httpOnly: true });
    var q=req.body;
    console.log(q);
    
    db.collection('travels').insertOne({'type':"Driver",'name':req.session.fullname,code:rad,travelId:req.cookies.userData,'vehicle_type':req.body.vtype,'DateTime':req.body.date,'Seat':req.body.seat[0],'sor_address':'','des_address':'','Match_id':[""],"status":"INCOMPLETE"}),
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
  var sorNearby0;
  var sorNearby1;
  var desNearby0;
  var desNearby1;
  var source = req.body.sor;
  var destinition = req.body.des;

console.log(source);
  var params = {
    origin: source,
    destination: destinition,
    key: "AIzaSyCQ2l2mGOB24ZWMaxOt3fasayoNXM8NdAo",
    }
    map.getDirections(params, function (err, data) {
        if (err) {
            console.log(err);
            return 1;
        }
        console.log("steps : "+data.routes[0].legs[0].steps[0].end_location.lat);
        console.log("steps roundoff : "+Math.floor(data.routes[0].legs[0].steps[0].end_location.lat * 100) / 100);
        console.log("steps roundoff : "+Math.floor(data.routes[0].legs[0].steps[0].end_location.lng * 100) / 100);
        console.log("steps len : "+data.routes[0].legs[0].steps.length);
    });


    console.log("randome code == "+req.cookies.Rcode);
  console.log("now:::"+req.cookies.userData);

    geocoder.geocode(source)
    .then(function(response) {
    
    sorc=response[0].formattedAddress;
  console.log('Source:: '+sorc);
    
     sorc_lat=response[0].latitude;
    console.log(sorc_lat);
sorNearby0=Math.floor(sorc_lat * 100) / 100;

   sorc_lng=response[0].longitude;
   console.log(sorc_lng);
   sorNearby1=Math.floor(sorc_lng * 100) / 100;
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
  desNearby0=Math.floor(desc_lat * 100) / 100;

  desc_lng=response[0].longitude;
    console.log(response[0].longitude);
    desNearby1=Math.floor(desc_lng * 100) / 100;
  })
  .catch(function(err) {
    console.log(err);
  });
  function getValue() {
setTimeout(()=> {
console.log('source outside:: '+sorc);
console.log('Destination outside:: '+desc);
console.log("CODE=="+req.cookies.Rcode);
db.collection('travels').updateOne({'travelId':req.cookies.userData,'code':req.cookies.Rcode},{$set:{"sor_address":sorc,"sor_coordinates":[sorc_lat,sorc_lng],"des_address":desc,"des_coordinates":[desc_lat,desc_lng],"sorNearby":[sorNearby0,sorNearby1],"desNearby":[desNearby0,desNearby1]}}),
function(err,Result){          //'lat':source.response[0].latitude,'lng':source.response[0].longitude,      //,'lat':destinition.response[0].latitude,'lng':destinition.response[0].longitude
if(err)
throw err;
}



var Utype= req.cookies.Rcode.split("_");
console.log(Utype[0]);
if(Utype[0]=="Ri")
{
  db.collection('travels').find({'travelId': { $ne: req.cookies.userData },"type":"Driver","sorNearby":[sorNearby0,sorNearby1],"desNearby":[desNearby0,desNearby1],"Seat":{$gte:req.cookies.seat},"status":"INCOMPLETE"}).toArray(function(err,result){
    if(err)
    throw err;
  console.log("RES::"+result.length);
  if(result.length>0)
    res.render('result',{'message':null,'data':result}); 
  else
  res.render('result',{'message':"No Match Found",'data':result});
  })
}
else{
  db.collection('travels').find({'travelId': { $ne: req.cookies.userData },"type":"Rider","sorNearby":[sorNearby0,sorNearby1],"desNearby":[desNearby0,desNearby1],"Seat":{$gte:req.cookies.seat},"status":"INCOMPLETE"}).toArray(function(err,result){
    if(err)
    throw err;
  console.log("RES::"+result.length);
  if(result.length>0)
  res.render('result',{'message':null,'data':result}); 
else
res.render('result',{'message':"No Match Found",'data':result});
  })
}
},2000);
}
  getValue();
})



app.post("/view/:id",backdoor,function(req,res){



  var idv=req.params.id;
  console.log("VIEW ID "+idv+" TYPE OF =="+typeof idv);
  
  db.collection('travels').findOne({_id:new mongodb.ObjectID(idv)},function(err,data){
    if(err)
    throw err;
    console.log(data);
  console.log("req.cookies.userData "+data.travelId);
  
  console.log("sorc "+data.sor_address);

  console.log("desc"+data.des_address)

  console.log("req.cookies.seat "+data.Seat);

  console.log("req.cookies.Rcode-code "+data.code);
  res.cookie('Rcode', data.code, {maxAge:600000000, httpOnly: true});

  var Utype= data.code.split("_");
console.log(Utype[0]);
if(Utype[0]=="Ri")
{
  db.collection('travels').find({'travelId': { $ne:data.travelId },"type":"Driver","sor_address":data.sor_address,"des_address":data.des_address,"Seat":{$gte:data.Seat},"status":"INCOMPLETE"}).toArray(function(err,result){
    if(err)
    throw err;
  console.log("RES::"+result.length);
  if(result.length>0)
  res.render('result',{'message':null,'data':result});
  else
  res.render('result',{'message':"No Match Found",'data':result});
  })
}
else{
  db.collection('travels').find({'travelId': { $ne:data.travelId },"type":"Rider","sor_address":data.sor_address,"des_address":data.des_address,"Seat":{$gte:data.Seat},"status":"INCOMPLETE"}).toArray(function(err,result){
    if(err)
    throw err;
  console.log("RES::"+result.length);
  if(result.length>0)
  res.render('result',{'message':null,'data':result});
else
res.render('result',{'message':"No Match Found",'data':result});
  })
}
})
})



// app.get('/rest',function(req,res){
//   res.render('result',{'message':null,'data':result});
// })
// app.get('/rest2',function(req,res){
//   res.render('result',{'message':"No Match Found",'data':result});
// })



app.get("/chat/:travelId/:id",backdoor,function(req,res){
  var tid=req.params.travelId;
  var id=req.params.id;
  db.collection('travels').find({"code":req.cookies.Rcode,"Match_id":tid}).toArray(function(err,result){
    console.log("bhaiiii=="+result.length);
    if(result.length==0){
  console.log("/chat/:travelId-tid "+tid);
  console.log("/chat/:id-upID "+id);
  res.cookie('upID', id, {maxAge:600000000, httpOnly: true });   
  console.log("in chats:"+id)
  console.log("name id:"+new mongodb.ObjectID(tid));
  db.collection('t_user').find({_id:new mongodb.ObjectID(tid)}).toArray(function(err,res){
    if (err)
    throw err;
    console.log(res.length);
    console.log(req.session.fullname);
    console.log(res[0].name);
    console.log(res[0].mobile_no);
    const from = '18482713356';    //const from = 'Nexmo';
    const to = '15625928787';    // const to = res[0].mobile_no;
    const text ="Request From "+req.session.fullname+" To You "+res[0].name+"("+res[0].mobile_no+") For Ride Share";
    nexmo.message.sendSms(from, to, text,(err, responseData) => {
      if (err) 
      throw err;
  console.log(responseData);
  })
  })

  //db.collection('requests').updateOne({from:req.session.myID,to:tid,for:id,forShow:req.cookies.Rcode}),function(err,Result){
  console.log("req.cookies.Rcode "+req.cookies.Rcode)
  db.collection('travels').updateOne({code:req.cookies.Rcode},{$push:{"Match_id":tid}}),function(err,Result){
    if(err)
    throw err;        
    console.log("aage...insert");
  }

  res.redirect("/sent");
}
else{
 res.send("already sent!"); 
}
})
})



app.get("/request",backdoor,function(req,res){
  console.log("req.session.myID ye-- "+req.session.myID)
db.collection('travels').find({"Match_id":req.session.myID,"status":"INCOMPLETE"}).toArray(function(err,result){
  if (err)
  throw err;
  console.log(result.length);
  console.log(result);
  if(result.length>0){
    res.render('request',{'message':null,'data':result});
  }
  else{
    res.render('request',{'message':"NO REQUEST",'data':result});
  }
})
})



app.listen(process.env.PORT || 3000,function(){
    console.log("Server :3000");
})
}).catch(function(error){
console.log("Error :"+error);
process.exit();
})
module.exports=router;