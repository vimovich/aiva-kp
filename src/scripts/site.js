const T=window.__T||{};
(function(){
  var $=function(s,c){return (c||document).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};

  // marquee
  var m=$('#marq'),h='',proj=JSON.parse(m.dataset.projects||'[]');for(var k=0;k<2;k++)proj.forEach(function(p){h+='<span>'+p+'</span>'});m.innerHTML=h;

  // progress
  var prog=$('#prog');
  function sc(){var d=document.documentElement;prog.style.width=(d.scrollTop/(d.scrollHeight-d.clientHeight)*100)+'%'}
  addEventListener('scroll',sc,{passive:true});sc();

  // reveal
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
  $$('.rv').forEach(function(el){io.observe(el)});

  // counters
  var co=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var el=e.target,n=+el.dataset.n,t0=null;
    function f(t){t0=t0||t;var p=Math.min((t-t0)/1400,1);el.textContent=Math.round(n*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)}
    requestAnimationFrame(f);co.unobserve(el)})},{threshold:.5});
  $$('[data-n]').forEach(function(el){co.observe(el)});

  // service modal
  var modal=$('#modal'),mb=$('#m-body');
  function openM(c){
    mb.innerHTML='<div class="ico">'+$('.ico',c).innerHTML+'</div><h3>'+$('h3',c).innerHTML+'</h3><div class="price-tag">'+$('.price-tag',c).innerHTML+'</div>'+$('.acc-in',c).innerHTML+'<a class="btn btn-p" href="#contact">'+T.modalCta+'</a>';
    modal.classList.add('on');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
    $('a.btn',mb).addEventListener('click',closeM);
  }
  function closeM(){modal.classList.remove('on');modal.setAttribute('aria-hidden','true');document.body.style.overflow=''}
  $$('.svc').forEach(function(c){
    $('.svc-h',c).addEventListener('click',function(){openM(c)});
    $('.more',c).addEventListener('click',function(){openM(c)});
    c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px')});
  });
  $('.m-x').addEventListener('click',closeM);
  modal.addEventListener('click',function(e){if(e.target===modal)closeM()});
  addEventListener('keydown',function(e){if(e.key==='Escape')closeM()});
  $$('.hc-item').forEach(function(a){a.addEventListener('click',function(e){var c=$(a.getAttribute('href'));if(c&&c.classList.contains('svc')){e.preventDefault();openM(c)}})});
  // faq
  $$('.faq').forEach(function(f){$('button',f).addEventListener('click',function(){var o=f.classList.toggle('open');this.setAttribute('aria-expanded',o)})});

  // tabs
  $$('.tab').forEach(function(b){b.addEventListener('click',function(){
    $$('.tab').forEach(function(x){x.classList.remove('on')});b.classList.add('on');
    $$('.panel').forEach(function(p){p.classList.remove('on')});$('#p-'+b.dataset.t).classList.add('on')})});

  // calculators
  var fmt=function(n){return Math.round(n).toLocaleString('ru-RU').replace(/ | /g,' ')};
  $$('.ctab').forEach(function(b){b.addEventListener('click',function(){
    $$('.ctab').forEach(function(x){x.classList.remove('on')});b.classList.add('on');
    $$('.calc').forEach(function(x){x.classList.remove('on')});$('#c-'+b.dataset.c).classList.add('on')})});
  function sel(r,g){return $('.opts[data-g="'+g+'"] .opt.on',r)}
  var SEO={1:3500000,3:10500000,6:19800000,12:39000000};
  var EMPTY='<li style="color:var(--mut)">'+T.empty+'</li>';
  function render(){
    var t=0,li='';
    $$('#box-once .crow.on').forEach(function(r){
      var n=$('b',r).textContent,a=0,tag='';
      if(r.dataset.k==='land'){a=+r.dataset.o}
      else{var tr=sel(r,'tier'),cb=sel(r,'cab');a=+tr.dataset.o*(+cb.dataset.mul);tag=' · '+tr.dataset.nm+' × '+cb.dataset.mul}
      t+=a;li+='<li>'+n+tag+'<span>'+fmt(a)+'</span></li>';
    });
    $('#once-t').textContent=fmt(t);$('#once-l').innerHTML=li||EMPTY;
    var m=+$('#months .opt.on').dataset.v,tm=0,sv=0,lm='';
    $$('#box-month .crow.on').forEach(function(r){
      var n=$('b',r).textContent,a=0,tag='',k=r.dataset.k;
      if(k==='seo'){a=SEO[m];sv=3500000*m-a}
      else if(k==='geo'){a=5000000*m}
      else if(k==='smm'){var tr=sel(r,'tier');a=+tr.dataset.m*m;tag=' · '+tr.dataset.nm}
      else if(k==='adsup'){var cb=sel(r,'cab');a=2000000*(+cb.dataset.mul)*m;tag=' · '+cb.dataset.mul+' '+T.cab}
      tm+=a;lm+='<li>'+n+tag+'<span>'+fmt(a)+'</span></li>';
    });
    $('#m-n').textContent=m;$('#m-t').textContent=fmt(tm);$('#m-avg').textContent=fmt(tm/m);
    $('#m-save').textContent=sv>0?T.savePrefix+fmt(sv)+T.saveSuffix:'';
    $('#m-l').innerHTML=lm||EMPTY;
  }
  $$('.crow').forEach(function(r){
    $('.chead',r).addEventListener('click',function(){r.classList.toggle('on');$('.sw',r).classList.toggle('on');render()});
    $$('.opt',r).forEach(function(o){o.addEventListener('click',function(){$$('.opt',o.parentNode).forEach(function(x){x.classList.remove('on')});o.classList.add('on');render()})});
  });
  $$('#months .opt').forEach(function(o){o.addEventListener('click',function(){$$('#months .opt').forEach(function(x){x.classList.remove('on')});o.classList.add('on');render()})});
  [['#box-once','land'],['#box-once','adset'],['#box-month','seo'],['#box-month','smm']].forEach(function(x){var r=$(x[0]+' [data-k="'+x[1]+'"]');r.classList.add('on');$('.sw',r).classList.add('on')});
  render();

  // nav active

  var secs=['services','pricing','calc','process','faq'].map(function(i){return document.getElementById(i)});
  var links=$$('#menu a');
  var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-45% 0px -50% 0px'});
  secs.forEach(function(s){so.observe(s)});
})();
