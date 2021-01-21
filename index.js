/**
 *  NPM PACKAGE : ion-api-token
 *  
 *  Author  : Giampaolo Spagoni
 *  Title   : Senior Solution Architect (Infor OS Service)
 *  Company : Infor (Koch)
 *  Date    : 31st October 2020
 * 
 *  DESCRIPTION:
 *  check if the 'ionapi' is a valid file downloaded from ION API Gateway
  * if all test are passed return status = OK
 *  if all test are NOT passed return status = KO
 * 
 *  Version 1.1.0
 *  Return the BaseURL
 * 
 */
const fs = require('fs')
const request = require('request')
const base64 = require('base-64');


var ionapi = "";
var retObj = {
    "status":"",
    "message":""
}

exports.InitializeApiFile = function(ionapiFile)
{

    try{
        this.ionapi = fs.readFileSync(ionapiFile, {encoding: 'utf8'})
        if(!this.ionapi.includes('ti') && !this.ionapi.includes('cn') && !this.ionapi.includes('ci') && !this.ionapi.includes('cs'))
        {
            msgText = "Wrong file type. Select a correct <file>.ionapi file..."
            retObj.status = "KO";
            retObj.message = msgText;
            return retObj;        
            }
        if(!this.ionapi.includes('saak') && !this.ionapi.includes('sask'))
        {
            msgText = "Wrong file type. Select a Backend Service <file>.ionapi file..."
            retObj.status = "KO";
            retObj.message = msgText;
            return retObj;        
            }
        // format the response in JSON
        this.ionapi = JSON.parse(this.ionapi)

    }catch(e){
        retObj.status = "KO";
        retObj.message = e;
        return retObj;        
    }

    // return an object with 2 properties 
    /**
     *  {
     *      "status":"OK",
     *      "message": "All check passed",
     *  }
     */
    retObj.status = "OK";
    retObj.message = "All checks passed";
    ionapi = this.ionapi;
    //return retObj;
}

exports.Status = function() {
    return retObj.status;
}

exports.Message = function() {
    return retObj.message;
}


exports.GetBaseURL = function() {
    return ionapi.iu
}

/**
 * 
 *  Function to get the TOKEN
 */
function requestPromise(options) {
    return new Promise(function promisifiedRequest(resolve, reject) {
        request(options, function readResponse(err, res, body) {
            //console.log(from + ":--->    " + body);
            if (err) {
                return reject(err);
            }
            if (res.statusCode === 200 || res.statusCode === 201) {
                    return resolve(body);
            }
            return reject(new Error(`IONAPI responded with status: ${res.statusCode}`));
        });
    });
 }
 
 
 async function getResponseFromAPI(options)
 {
   let result = "";
    
   try{
        const response = await requestPromise(options)
      if (!options.mess){
         const responseJson = await JSON.parse(response)
         result = responseJson		    			
      }else{
         result = response
      }
   } catch(e) {
      result = e
   }
   return result
 }
 
 //async function returnTokenObj(ionapi)
 exports.ReturnTokenObj = async function ()
 {
    const ci = ionapi.ci;
    const cs = ionapi.cs;
    const combine = ci + ":" + cs
    const cicsbase64 = base64.encode(`${combine}`);
    
    const saak = encodeURIComponent(ionapi.saak);
    const sask = encodeURIComponent(ionapi.sask);
 
    const options1 = {
       method: 'POST',
       url: ionapi.pu + ionapi.ot, //'https://mingle-sso.inforcloudsuite.com:443/MINGLETEST1_DEV/as/token.oauth2',
       headers: {
           'cache-control': 'no-cache',
           'authorization': `Basic ${cicsbase64}`,
           'content-type': 'application/x-www-form-urlencoded'
       },
       form: false,
       body: `grant_type=password&username=${saak}&password=${sask}`,
       rejectUnauthorized: false  
   };
 
 //  console.log("======================================================================")
 //  console.log("GETTING TOKEN...")
   let getToken = await getResponseFromAPI(options1)
 //  console.log("======================================================================")
 //  console.log(getToken)
 //  console.log("======================================================================")
 
   return getToken;
 }
 
 
 
