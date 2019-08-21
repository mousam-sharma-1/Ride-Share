var mongodb = require('mongodb');
var mongo = require('mongodb').MongoClient;
var client = require('socket.io').listen(4000).sockets;
var url = "mongodb+srv://Mousam:mousam1399@ridesharecluster-28swm.mongodb.net/test?retryWrites=true&w=majority";
var db;
mongo.connect(url,{ useNewUrlParser: true },function(err,con){
    if (err)
    throw err;
    db=con.db('minor');
    console.log("mongo is good!");

    client.on('connection',function(socket){
        var chat= db.collection('chats');

sendStatus = function(s){
    socket.emit('status',s);
}

chat.find().limit(100).sort({_id:1}).toArray(function(err,res){
    if (err)
throw err;

socket.emit('output',res);
});

socket.on('input',function(data){
    var name=data.name;
    var message=data.message;
    var id=mongodb.ObjectId();

    if(name== '' || message== ''){
        sendStatus('Empty Feild');
    }
    else{
        //chat.insert({name:name,message:message},function(){
      chat.insert({name:name,chats:{id,message}},function(){
            client.emit('output',[data]);

            sendStatus({
                message:"message sent",
                clear:true
            })
        })
    }
})

socket.on('clear',function(data){
    chat.remove({},function(){
        socket.emit('cleared');
    })
})

});
})