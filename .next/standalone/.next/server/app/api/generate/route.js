"use strict";(()=>{var e={};e.id=290,e.ids=[290],e.modules={517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},4539:(e,a,o)=>{o.r(a),o.d(a,{headerHooks:()=>p,originalPathname:()=>m,requestAsyncStorage:()=>u,routeModule:()=>i,serverHooks:()=>d,staticGenerationAsyncStorage:()=>c,staticGenerationBailout:()=>l});var r={};o.r(r),o.d(r,{POST:()=>POST});var t=o(884),n=o(6132),s=o(5798);async function POST(e){try{let{prompt:a,style:o,duration:r}=await e.json(),t=`
# GUION GENERADO PARA: "${a}"

**Estilo:** ${o}
**Duraci\xf3n:** ${r} segundos

## ESCENA 1 (0-10s)
- [VISUAL] Introducci\xf3n con logo/marca
- [AUDIO] M\xfasica de fondo
- [TEXTO] "Transformando ideas en realidad"

## ESCENA 2 (10-20s)  
- [VISUAL] Demostraci\xf3n del producto/servicio
- [AUDIO] Voz en off explicando beneficios
- [TEXTO] "Resultados comprobados"

## ESCENA 3 (20-${r}s)
- [VISUAL] Llamado a acci\xf3n claro
- [AUDIO] Contacto y oferta especial
- [TEXTO] "\xa1Cont\xe1ctanos ahora!"

---

*Guion generado por AdGenius AI*
    `.trim();return s.Z.json({success:!0,script:t,videoUrl:"/api/sample-video",thumbnail:"/api/sample-thumbnail",timestamp:new Date().toISOString()})}catch(e){return s.Z.json({success:!1,error:"Error generando guion"},{status:500})}}let i=new t.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/generate/route",pathname:"/api/generate",filename:"route",bundlePath:"app/api/generate/route"},resolvedPagePath:"C:\\Users\\VK 690\\Documents\\01.PROYECTO SO IN\\ADGENIUS\\app\\api\\generate\\route.ts",nextConfigOutput:"standalone",userland:r}),{requestAsyncStorage:u,staticGenerationAsyncStorage:c,serverHooks:d,headerHooks:p,staticGenerationBailout:l}=i,m="/api/generate/route"}};var a=require("../../../webpack-runtime.js");a.C(e);var __webpack_exec__=e=>a(a.s=e),o=a.X(0,[997],()=>__webpack_exec__(4539));module.exports=o})();