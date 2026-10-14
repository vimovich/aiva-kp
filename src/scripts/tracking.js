window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}
gtag('js',new Date());gtag('config','G-1YMGZEBJGH');
/* goals: clicks on contacts / CTAs (also forwarded to Yandex.Metrika when its counter is installed) */
(function(){
  var YM=window.__YM_ID||0;
  function track(n,p){p=p||{};try{gtag('event',n,p)}catch(e){}try{if(YM&&window.ym)ym(YM,'reachGoal',n,p)}catch(e){}}
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a,button');if(!a)return;
    var h=a.getAttribute('href')||'';
    if(h.indexOf('t.me/aivauz')>-1){track('generate_lead',{method:'telegram',place:a.classList.contains('fab')?'float_button':(a.closest('footer')?'footer':'contact')});track('click_telegram')}
    else if(h.indexOf('tel:')===0){track('generate_lead',{method:'phone'});track('click_phone')}
    else if(a.classList.contains('lt-chip')){track('service_click',{service:a.getAttribute('data-svc')||''})}
    else if(h==='#contact'){track('cta_contact',{label:(a.textContent||'').trim().slice(0,40)})}
    else if(h==='#calc'){track('cta_calc')}
    else if(a.closest('.lang')){track('lang_switch',{to:(a.textContent||'').trim()})}
    else if(h.indexOf('aivagroup.uz')>-1){track('click_site')}
    else if(a.classList.contains('lt-hint')){track('laptop_click')}
  },true);
  document.addEventListener('pointerup',function(e){var v=e.target.closest&&e.target.closest('.lt-view');if(v&&!e.target.closest('.lt-hint')&&!window.__ltk){window.__ltk=1;track('laptop_click')}},true);
})();
