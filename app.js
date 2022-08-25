const express = require("express")
const bodyParser = require("body-parser")
const request = require("request")
const app = express()
const client = require("@mailchimp/mailchimp_marketing")

client.setConfig({
  apiKey: "b5348f4db56eae9e72a4187c91386ab0-us17",
  server: "us17",
});

app.use(bodyParser.urlencoded({extended:true}))

//specify static folder
app.use(express.static(__dirname + '/public'))

app.get("/", (req, res)=> {
  res.sendFile(__dirname + "/signup.html")
})

app.post("/", (req, res)=>{
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;
  const run = async () => {
    const response = await client.lists.batchListMembers("35653eda9c", {
      members: [
        {
          email_address: email,
          status: "subscribed",
          merge_fields: {
                FNAME: firstName,
                LNAME: lastName,
            },
        }
      ],
    });
    console.log(response);
    error = response.error_count
    if (error === 0) {
      res.sendFile(__dirname + "/success.html")
    } else {
      res.sendFile(__dirname + "/failure.html")
    }
  };
  run()
})


app.post("/failure", (req, res)=>{
  res.redirect("/")
})


app.listen(process.env.PORT || 3000, ()=>{
  console.log("Server is running on port 3000.")
})
