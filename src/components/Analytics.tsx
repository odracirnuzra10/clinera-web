/* eslint-disable @next/next/no-sync-scripts */
/**
 * Server component. Uses raw <script dangerouslySetInnerHTML> so scripts
 * end up INLINE in the SSR HTML (not in the RSC flight payload), giving
 * parity with static HTML landings like /inicia — Meta Pixel Helper and
 * Tag Assistant detect events correctly.
 */

const GTM_SRC = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NXT8BGS9');`;

const META_PIXEL_SRC = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','1104567405156111');fbq('track','PageView');`;

const CLARITY_SRC = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)
})(window,document,"clarity","script","vrstfsb9xo");`;

const GA4_CUSTOM_SRC = `(function(){
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
setInterval(r,1E3)})();`;

const UTM_CAPTURE_SRC = `(function(){var b=new URLSearchParams(window.location.search),a=b.get("gclid");
a&&(document.cookie="gclid="+a+";max-age=7776000;path=/;SameSite=Lax");
["utm_source","utm_medium","utm_campaign","utm_term","utm_content"].forEach(function(c){
var d=b.get(c);d&&(document.cookie=c+"="+d+";max-age=7776000;path=/;SameSite=Lax")})})();`;

const STRIPE_TRACKING_SRC = `document.querySelectorAll('a[href*="buy.stripe.com"]').forEach(function(f){
f.addEventListener("click",function(){
var b="",c="",d="",e="",a=document.cookie.match(/(?:^|;\\s*)gclid=([^;]*)/);
a&&(b=a[1]);if(a=document.cookie.match(/(?:^|;\\s*)_ga=([^;]*)/))a=a[1].split("."),
a.length>=4&&(c=a.slice(2).join("."));
(a=document.cookie.match(/(?:^|;\\s*)_fbc=([^;]*)/))&&(d=a[1]);
if(a=document.cookie.match(/(?:^|;\\s*)_ga_GFB5YV66KKJ=([^;]*)/))a=a[1].split("."),
a.length>=3&&(e=a[2]);a=[b,c,d,e];a=a.join("::");
if(c||b||d||e)b=new URL(this.href),b.searchParams.set("client_reference_id",a),
this.href=b.toString()})});`;

const FBQ_FIX_SRC = `(function(){if(typeof fbq!=="undefined"){var b=fbq,c=function(){
var a=Array.prototype.slice.call(arguments);
a[0]==="track"&&a[1]==="ViewContent"&&(a[2]||(a[2]={}),
typeof a[2]==="object"&&(a[2].currency||(a[2].currency="USD"),
a[2].value||a[2].value===0||(a[2].value=0)));
return b.apply(this,a)},d;for(d in b)b.hasOwnProperty(d)&&(c[d]=b[d]);
c.callMethod=b.callMethod;c.queue=b.queue;c.loaded=b.loaded;
c.version=b.version;window.fbq=c;window._fbq=c}})();`;

const ENGAGEMENT_SRC = `(function(){
  var DL = function(){ window.dataLayer = window.dataLayer || []; return window.dataLayer; };
  var state = { viewContentFired:false, engaged60Fired:false, scrollHit:{}, engagedSec:0, engagedTimer:null, visible:!document.hidden, path:location.pathname };

  function resetState(){
    state.viewContentFired = false;
    state.engaged60Fired = false;
    state.engagedSec = 0;
    state.path = location.pathname;
  }

  (function(){
    var push = history.pushState, rep = history.replaceState;
    history.pushState = function(){ var r=push.apply(this,arguments); window.dispatchEvent(new Event('clinera:routechange')); return r; };
    history.replaceState = function(){ var r=rep.apply(this,arguments); window.dispatchEvent(new Event('clinera:routechange')); return r; };
  })();
  window.addEventListener('popstate', function(){ window.dispatchEvent(new Event('clinera:routechange')); });

  // Fallback: poll location in case SPA framework bypasses history API wrappers
  (function(){
    var lastPath = location.pathname + location.search;
    setInterval(function(){
      var cur = location.pathname + location.search;
      if (cur !== lastPath) {
        lastPath = cur;
        window.dispatchEvent(new Event('clinera:routechange'));
      }
    }, 400);
  })();
  window.addEventListener('clinera:routechange', function(){
    resetState();
    // SPA: Meta Pixel does not auto-detect route changes — fire manually
    if (typeof fbq === 'function') {
      fbq('track', 'PageView');
    }
    DL().push({ event: 'spa_page_view', page_path: location.pathname, page_title: document.title });
    // Fire ViewContent immediately on SPA navigation (user requested: "navega entre paginas")
    fireViewContent('navigation');
    setTimeout(attachVideoTrackers, 300);
    setTimeout(observeBottom, 300);
  });

  function fireViewContent(reason){
    if (state.viewContentFired) return;
    state.viewContentFired = true;
    var meta = { page_path: location.pathname, page_title: document.title, trigger_reason: reason, currency:'USD', value:0 };
    DL().push(Object.assign({ event:'view_content' }, meta));
    if (typeof fbq === 'function') {
      fbq('track', 'ViewContent', {
        content_name: document.title,
        content_category: 'page',
        content_type: 'product',
        currency: 'USD',
        value: 0,
        page_path: location.pathname,
        trigger_reason: reason
      });
    }
  }

  var bottomObserver = null;
  function observeBottom(){
    if (bottomObserver) { try { bottomObserver.disconnect(); } catch(e){} }
    if (!('IntersectionObserver' in window)) return;
    var target = document.querySelector('footer') || document.body;
    bottomObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting) { fireViewContent('bottom_reached'); bottomObserver.disconnect(); }
      });
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });
    bottomObserver.observe(target);
  }

  function init(){
    observeBottom();
    // Fire ViewContent on initial page visit (covers SPA nav + hard reload both)
    setTimeout(function(){ fireViewContent('page_load'); }, 800);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('scroll', function(){
    var h = document.documentElement.scrollHeight;
    if (h <= window.innerHeight) return;
    var reached = (window.innerHeight + window.scrollY) / h;
    if (reached >= 0.9) fireViewContent('scroll_90');
  }, { passive: true });

  document.addEventListener('visibilitychange', function(){ state.visible = !document.hidden; });
  function tickEngagement(){
    if (!state.visible) return;
    state.engagedSec++;
    if (state.engagedSec >= 60 && !state.engaged60Fired) {
      state.engaged60Fired = true;
      var meta = { page_path: location.pathname, page_title: document.title, engaged_seconds: 60 };
      DL().push(Object.assign({ event:'engaged_60s' }, meta));
      if (typeof fbq === 'function') {
        fbq('trackCustom', 'EngagedSession', {
          engaged_seconds: 60,
          page_path: location.pathname,
          content_name: document.title
        });
      }
    }
  }
  state.engagedTimer = setInterval(tickEngagement, 1000);

  function attachVideoTrackers(){
    if (typeof window.Vimeo === 'undefined' || !window.Vimeo.Player) return;
    document.querySelectorAll('iframe[src*="player.vimeo.com"]').forEach(function(iframe){
      if (iframe.dataset.clineraTracked === '1') return;
      iframe.dataset.clineraTracked = '1';
      try {
        var player = new window.Vimeo.Player(iframe);
        var title = iframe.getAttribute('title') || '';
        var src = iframe.getAttribute('src') || '';
        var m = src.match(/video\\/(\\d+)/);
        var videoId = m ? m[1] : '';
        var milestones = [25, 50, 75, 90, 100];
        var hit = {};
        player.on('timeupdate', function(data){
          if (!data || typeof data.percent !== 'number') return;
          var pct = Math.floor(data.percent * 100);
          milestones.forEach(function(ms){
            if (pct >= ms && !hit[ms]) {
              hit[ms] = true;
              DL().push({
                event: 'video_progress',
                video_percent: ms,
                video_title: title,
                video_id: videoId,
                video_provider: 'vimeo',
                page_path: location.pathname
              });
              if (typeof fbq === 'function') {
                fbq('trackCustom', 'VideoProgress', {
                  video_percent: ms,
                  video_title: title,
                  video_id: videoId,
                  page_path: location.pathname
                });
              }
            }
          });
        });
        player.on('ended', function(){
          if (hit[100]) return;
          hit[100] = true;
          DL().push({ event:'video_progress', video_percent:100, video_title:title, video_id:videoId, video_provider:'vimeo', page_path: location.pathname });
          if (typeof fbq === 'function') {
            fbq('trackCustom', 'VideoProgress', { video_percent:100, video_title:title, video_id:videoId, page_path: location.pathname });
          }
        });
      } catch(e){}
    });
  }
  [500, 1500, 3000, 6000].forEach(function(ms){ setTimeout(attachVideoTrackers, ms); });

  document.addEventListener('click', function(ev){
    var a = ev.target && ev.target.closest ? ev.target.closest('a') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var isRegister = href.indexOf('app.clinera.io/auth/register') !== -1;
    var isStripe = href.indexOf('buy.stripe.com') !== -1;
    if (!isRegister && !isStripe) return;

    var dataPlan = a.getAttribute('data-plan');
    var planFromHref = (href.match(/[?&]plan=([a-z0-9_-]+)/i) || [])[1] || null;
    var plan = dataPlan || planFromHref || null;
    var planName = a.getAttribute('data-plan-name');
    var planValue = parseFloat(a.getAttribute('data-plan-value') || '0');
    if (!planValue) {
      if (plan === 'growth')        { planValue = 89;  planName = planName || 'Growth signup'; }
      else if (plan === 'conect')   { planValue = 129; planName = planName || 'Conect signup'; }
      else if (plan === 'advanced') { planValue = 179; planName = planName || 'Advanced signup'; }
      else                          { planValue = 89;  planName = planName || 'plan_signup'; }
    }
    var text = (a.innerText || a.getAttribute('aria-label') || '').trim().replace(/\\s+/g,' ').slice(0,80);
    DL().push({
      event: 'initiate_checkout',
      lead_source: location.pathname,
      plan: plan,
      content_name: planName,
      value: planValue,
      currency: 'USD',
      page_path: location.pathname,
      cta_text: text,
      cta_href: href
    });
    if (typeof fbq === 'function') {
      fbq('track', 'InitiateCheckout', {
        content_name: planName,
        content_category: isStripe ? 'stripe_checkout' : 'landing_register',
        content_type: 'product',
        currency: 'USD',
        value: planValue
      });
    }
  }, { capture: true });
})();`;

export default function Analytics() {
  return (
    <>
      {/* Google Tag Manager */}
      <script id="gtm" dangerouslySetInnerHTML={{ __html: GTM_SRC }} />

      {/* Meta Pixel */}
      <script id="meta-pixel" dangerouslySetInnerHTML={{ __html: META_PIXEL_SRC }} />
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
      <script id="clarity" dangerouslySetInnerHTML={{ __html: CLARITY_SRC }} />

      {/* GA4 Custom Events (scroll depth + time on page) */}
      <script id="ga4-custom" dangerouslySetInnerHTML={{ __html: GA4_CUSTOM_SRC }} />

      {/* UTM & GCLID cookie capture */}
      <script id="utm-capture" dangerouslySetInnerHTML={{ __html: UTM_CAPTURE_SRC }} />

      {/* Stripe client_reference_id injection */}
      <script id="stripe-tracking" dangerouslySetInnerHTML={{ __html: STRIPE_TRACKING_SRC }} />

      {/* fbq ViewContent currency fix */}
      <script id="fbq-fix" dangerouslySetInnerHTML={{ __html: FBQ_FIX_SRC }} />

      {/* Vimeo Player SDK (for video progress tracking) */}
      <script id="vimeo-sdk" async src="https://player.vimeo.com/api/player.js" />

      {/* Global engagement tracking: ViewContent + engaged_60s + video progress + InitiateCheckout */}
      <script id="clinera-engagement" dangerouslySetInnerHTML={{ __html: ENGAGEMENT_SRC }} />
    </>
  );
}
