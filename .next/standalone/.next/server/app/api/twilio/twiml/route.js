"use strict";(()=>{var e={};e.id=2471,e.ids=[2471],e.modules={30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},18403:(e,r,t)=>{t.r(r),t.d(r,{headerHooks:()=>w,originalPathname:()=>h,patchFetch:()=>y,requestAsyncStorage:()=>p,routeModule:()=>u,serverHooks:()=>d,staticGenerationAsyncStorage:()=>c,staticGenerationBailout:()=>m});var o={};t.r(o),t.d(o,{POST:()=>l});var i=t(95419),a=t(69108),n=t(99678),s=t(78070);async function l(e){try{let r=new URL(e.url).searchParams.get("To");if(!r)throw Error('No "To" number provided');let t=`
      <?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say>Hello, would you like to know more about this property? Please wait while we connect you with our agent.</Say>
        <Dial callerId="${process.env.TWILIO_PHONE_NUMBER}" record="record-from-answer">
          ${r}
        </Dial>
      </Response>
    `;return new s.Z(t,{headers:{"Content-Type":"text/xml"}})}catch(e){return console.error("TwiML error:",e),new s.Z(`<?xml version="1.0" encoding="UTF-8"?>
       <Response>
         <Say>An error occurred while processing your call.</Say>
       </Response>`,{headers:{"Content-Type":"text/xml"},status:500})}}let u=new i.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/twilio/twiml/route",pathname:"/api/twilio/twiml",filename:"route",bundlePath:"app/api/twilio/twiml/route"},resolvedPagePath:"/Users/chakrinaidu/Desktop/gethomerealty-verson-2/app/api/twilio/twiml/route.ts",nextConfigOutput:"standalone",userland:o}),{requestAsyncStorage:p,staticGenerationAsyncStorage:c,serverHooks:d,headerHooks:w,staticGenerationBailout:m}=u,h="/api/twilio/twiml/route";function y(){return(0,n.patchFetch)({serverHooks:d,staticGenerationAsyncStorage:c})}}};var r=require("../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),o=r.X(0,[1638,6206],()=>t(18403));module.exports=o})();