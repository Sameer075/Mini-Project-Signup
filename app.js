const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");
const mailchimp=require("@mailchimp/mailchimp_marketing");

const app=express();


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mailchimp.setConfig({
  apiKey:"58ca173a0004fc1e5537c5f0278ee0de-us9",
  server:"us9",
});

async function run() {
  const response = await mailchimp.ping.get("data");
  console.log(response);
}

run();

app.get("/", function(req, res){
  res.sendFile(__dirname+"/signup.html");
});

app.post("/", function(req, res){
  const firstName=req.body.fname;
  const lastName=req.body.lname;
  const email=req.body.email;
  const data={
    members:[
      {
        email_address:email,
        status: "subscribed",
        merge_fields:{
          FNAME:firstName,
          LNAME:lastName,
        }
      }
    ]
  };

  const jsonData=JSON.stringify(data);

  const url="https://us9.api.mailchimp.com/3.0/lists/1beb0f301d";

  const options={
    method: "POST",
    auth:"Kumar_Sameer:58ca173a0004fc1e5537c5f0278ee0de-us9",
  };

  const request=https.request(url, options, function(response){
if(response.statusCode===200){

    res.sendFile(__dirname+"/success.html");

}
else{

    res.sendFile(__dirname+"/failure.html");
}
    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  });
request.write(jsonData);
request.end();
});

app.post("/failure", function(req, res){
  res.redirect("/");
});





app.listen(process.env.PORT || 3000, function(){
  console.log("Server is Running on Port 3000.");
});

//api Key: 58ca173a0004fc1e5537c5f0278ee0de-us9
//id: 1beb0f301d
