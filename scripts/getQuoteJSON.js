/*
   function doesnt work in browser, althou when you invoke it, using WireShark you can see
   that actually server responds normaly(with data requested), but browser blocks it becouse of missing 
   "Access-Control-Allow-Origin" in response.
*/   
function getQuoteJSON(){
          var xhr = new XMLHttpRequest();
          var url = "http://api.forismatic.com/api/1.0/";
          var expired = false;
          var timer = setTimeout(function(){ expired = true;
            xhr.abort()
              console.log("EXPIRED")
          }, 200);

          xhr.open("POST", url);
          xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
          xhr.setRequestHeader("Origin","*")
          xhr.setRequestHeader("Accept","text/plain");

          xhr.onreadystatechange = function (){  console.log("onredy state change: "+xhr.readyState+" \n status:"+xhr.status);
                  if(xhr.readyState == 4 && xhr.status == 200 && !expired){ 
                       clearTimeout(timer); console.log("RESPONCE text:"+xhr.responseText, " statusTEXT"+xhr.statusText)
                       textContent(paragraph, JSON.parse(xhr.responseText));
                       console.log("response: "+xhr.responseText);
                  
                  }
                  else{
                       console.log("Status: "+xhr.status, " statusText: "+xhr.statusText);
                       console.log(formEncode(dataObj));
                  }
                       console.log("Responce Content-Type: "+xhr.getResponseHeader("Content-Type"),
                                         "responceXML: "+xhr.responseXML);
          }
 
          xhr.send(formEncode(dataObj));
           
          
           
    }
      

