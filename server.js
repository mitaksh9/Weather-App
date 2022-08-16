const express = require('express');
const ejs = require('ejs');
const port = process.env.PORT || 4000;
const app = express();
const https = require('https');
const http = require('http');

app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));


var weatherT = [];
var resultArray = [];

app.get("/",(req,res)=>{
var keys = [];
var values = [];

for(i=0;i<resultArray.length;i++){
    	keys.push(Object.keys(resultArray[i]));
    
	values.push(Object.values(resultArray[i]));
}
res.render('home',{keys:keys,values:values});
})

app.post("/",(reqq, ress)=>{
var temp = reqq.body.citiesN;
var cities = JSON.stringify(temp.split(","));

const options = {
method:'POST',
headers:{
 'Content-Type': 'application/json'
}
}

var url = 'https://stark-reaches-91776.herokuapp.com/getWeather';

const request = https.request(url,options,(res)=>{
if(res.statusCode !== 201){
console.log('error occurred')
return
}

const contentType = res.headers["content-type"];
if(contentType !== 'application/json'){
console.log('cannot handle the data provided');
return
}

let data = '';
res.on('data',(chunk)=>{
data += chunk.toString('utf8')
try{
const json = JSON.parse(data);
console.log('json data is', json);
}catch{
console.log('content was not valid json');
}


})

res.on('end',()=>{
console.log('received data', data);
var wD = JSON.parse(data);
resultArray = wD.weather;
ress.redirect("/")
})

})

request.write(JSON.stringify(
{'cities':cities}
),()=>{
console.log('data has been written')
});

request.end();

})

app.listen(port,(req, res)=>{
console.log(`Server is running on port ${port}`);
})