# ion-api-token

this package is meant to handle ionapi file of type backend service

# Installation

` npm install ion-api-token`

it is composed by 5 functions

- InitializeApiFile(filename)
- Status()
- Message()
- RetunrTokenObj()
- GetBaseURL()

<hr>

## InitializeApiFile(filename)
this function analyzes the filename checking if it is of type ionapi and 
if it is of type backend service
if all checks are passed, set the Status to 'OK' and the Message with the text
'All checks passed', on the contrary if there are errors, it set the Status
to 'KO' and the Message to the error message

<pre>
const infor = require('inforapipackage');
......
app.listen(3000, () => {
    <b>infor.InitializeApiFile('./filename.ionapi');</b>
    if(infor.Status() == 'KO'){
        console.log(infor.Message())
        exit(1)
    }else{
        console.log('Server running at http://localhost:3000')
    }
})
</pre>

## Status()
this function return the status setted by the InitializeApiFile function

values:
- OK : all checks passed
- KO : errors

<pre>
    if(<b>infor.Status()</b> == 'KO'){
        console.log(infor.Message())
        exit(1)
    }else{
        console.log('Server running at http://localhost:3000')
    }
</pre>

## Message()
this function print the message setted by the InitializeApiFile function
if the check of the file fail, then the Message function print the error message
if the check of the file pass, then the Message function print the text 'All checks passed'

<pre>
    console.log(<b>infor.Message()</b>)
</pre>

## ReturnTokenObj()
this function return an object that contains the token
you can use in an async function or as a promise

<pre>
<b>async</b>

app.get('/', async (req,res) =>{
    const RTO = await <b>infor.ReturnTokenObj()</b>;
    const token = RTO.access_token
    makeApiCall(token...)
})

<b>promise</b>

    <b>infor.ReturnTokenObj()</b>
    .then(rto => console.log(rto.access_token))
    .catch(e => console.error(e))
</pre>

![image](https://user-images.githubusercontent.com/22134155/97788174-39f11c80-1bb7-11eb-8fd7-725c48b5b87d.png)


## GetBaseURL()
this function return the baseurl used for invoking infor ion api
in the ionapi file it is the property (iu)
![image](https://user-images.githubusercontent.com/22134155/97805611-7411fb00-1c57-11eb-84b9-a447fbb61c86.png)

<pre>
app.get('/user', (req,res)=>{
    // BaseURL
    const baseurl = <b>infor.GetBaseURL()</b>
    // Path for user detail for Mingle suite
    const pathurl = '/<TENANT>/Mingle/SocialService.Svc/User/Detail';
    const url = baseurl + pathurl;
    const token = RTO.access_token;
    const config = {
        headers: { 'Content-Type': 'application/json', 'Authorization' : `Bearer ${token}` }
    }
    axios.get(url,config)
    .then(ret => {
        res.json(ret.data)
    })
    .catch(e => res.send(e))
})

</pre>

<hr>
Copyright &copy; 2020 Giampaolo Spagoni
<giampaolo.spagoni@infor.com>