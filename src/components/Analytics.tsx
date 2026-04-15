'use client';

import Script from 'next/script';

export default function Analytics() {
  return (
    <>
      {/* Google Tag Manager */}
      <Script id="gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-NXT8BGS9');`}
      </Script>

      {/* Meta Pixel */}
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
        n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
        document,'script','https://connect.facebook.net/en_US/fbevents.js');
        fbq('init','1104567405156111');fbq('track','PageView');`}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src="https://www.facebook.com/tr?id=1104567405156111&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>

      {/* Microsoft Clarity */}
      <Script id="clarity" strategy="afterInteractive">
        {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)
        })(window,document,"clarity","script","vrstfsb9xo");`}
      </Script>

      {/* GA4 Custom Events (scroll depth + time on page) */}
      <Script id="ga4-custom" strategy="afterInteractive">
        {`(function(){
        var q="G-FB5YV66KKJ";
        function e(b,a){
          var c=(c=document.cookie.match(/_ga=GA1\\.\\d\\.(\\d+\\.\\d+)/))?c[1]:
          Math.floor(Math.random()*2147483647)+"."+Math.floor(Date.now()/1E3);
          b="https://www.google-analytics.com/g/collect?v=2&tid="+q+"&cid="+c+"&en="+encodeURIComponent(b);
          for(var d in a)a.hasOwnProperty(d)&&(b+="&ep."+encodeURIComponent(d)+"="+encodeURIComponent(a[d]));
          try{navigator.sendBeacon(b)}catch(t){(new Image).src=b}
        }
        function f(){
          var b=Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);
          var a=window.innerHeight,c=window.scrollY||document.documentElement.scrollTop;
          b=b<=a?100:Math.round(c/(b-a)*100);
          for(a=0;a<g.length;a++)c=g[a],b>=c&&!h[c]&&(h[c]=!0,
          e("scroll_depth",{scroll_percent:String(c),page_path:location.pathname}),
          window.dataLayer=window.dataLayer||[],
          window.dataLayer.push({event:"scroll_depth",scroll_percent:c,page_path:location.pathname}))
        }
        function r(){if(k){l++;for(var b=0;b<m.length;b++){var a=m[b];
          l>=a&&!n[a]&&(n[a]=!0,e("time_on_page",{engaged_seconds:String(a),page_path:location.pathname}),
          window.dataLayer=window.dataLayer||[],
          window.dataLayer.push({event:"time_on_page",engaged_seconds:a,page_path:location.pathname}))}}}
        var g=[25,50,75,100],h={},p;
        window.addEventListener("scroll",function(){clearTimeout(p);p=setTimeout(f,150)},{passive:!0});
        f();var m=[15,30,60,120,300],n={},l=0,k=!document.hidden;
        document.addEventListener("visibilitychange",function(){k=!document.hidden});
        setInterval(r,1E3)})();`}
      </Script>

      {/* UTM & GCLID cookie capture */}
      <Script id="utm-capture" strategy="afterInteractive">
        {`(function(){var b=new URLSearchParams(window.location.search),a=b.get("gclid");
        a&&(document.cookie="gclid="+a+";max-age=7776000;path=/;SameSite=Lax");
        ["utm_source","utm_medium","utm_campaign","utm_term","utm_content"].forEach(function(c){
        var d=b.get(c);d&&(document.cookie=c+"="+d+";max-age=7776000;path=/;SameSite=Lax")})})();`}
      </Script>

      {/* Stripe client_reference_id injection */}
      <Script id="stripe-tracking" strategy="afterInteractive">
        {`document.querySelectorAll('a[href*="buy.stripe.com"]').forEach(function(f){
        f.addEventListener("click",function(){
        var b="",c="",d="",e="",a=document.cookie.match(/(?:^|;\\s*)gclid=([^;]*)/);
        a&&(b=a[1]);if(a=document.cookie.match(/(?:^|;\\s*)_ga=([^;]*)/))a=a[1].split("."),
        a.length>=4&&(c=a.slice(2).join("."));
        (a=document.cookie.match(/(?:^|;\\s*)_fbc=([^;]*)/))&&(d=a[1]);
        if(a=document.cookie.match(/(?:^|;\\s*)_ga_GFB5YV66KKJ=([^;]*)/))a=a[1].split("."),
        a.length>=3&&(e=a[2]);a=[b,c,d,e];a=a.join("::");
        if(c||b||d||e)b=new URL(this.href),b.searchParams.set("client_reference_id",a),
        this.href=b.toString()})});`}
      </Script>

      {/* fbq ViewContent currency fix */}
      <Script id="fbq-fix" strategy="afterInteractive">
        {`(function(){if(typeof fbq!=="undefined"){var b=fbq,c=function(){
        var a=Array.prototype.slice.call(arguments);
        a[0]==="track"&&a[1]==="ViewContent"&&(a[2]||(a[2]={}),
        typeof a[2]==="object"&&(a[2].currency||(a[2].currency="USD"),
        a[2].value||a[2].value===0||(a[2].value=0)));
        return b.apply(this,a)},d;for(d in b)b.hasOwnProperty(d)&&(c[d]=b[d]);
        c.callMethod=b.callMethod;c.queue=b.queue;c.loaded=b.loaded;
        c.version=b.version;window.fbq=c;window._fbq=c}})();`}
      </Script>
    </>
  );
}
