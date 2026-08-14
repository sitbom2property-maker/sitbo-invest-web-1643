const INDEX =
  "https://pro-api.flat.show/api/complex/website/index_html";

const CLIENT_EN = "https://www.visarteam.tech/interactive-tools/piazza";
const CLIENT_RU = "https://centralmg.ge/ru/piazza/apartments";

/** Runs inside the proxied Flat.show document (same origin as Sitbo). */
const INTERCEPT = `(function(){
  var CTA=/find out more|узнать больше|order a call|request a call|заказать звонок|book now|заброн|связаться с менеджером|contact with manager|request this|запросить/i;
  function topic(){
    var t=document.body?document.body.innerText:"";
    var n=t.match(/#\\s*([0-9]{3,5}[A-Ba-b]?)/);
    var f=t.match(/(?:floor|этаж)\\s*([0-9]{1,2})/i);
    var a=t.match(/(\\d+(?:[.,]\\d+)?)\\s*m²/i);
    var p=["Piazza Residence"];
    if(n)p.push("#"+n[1]);
    if(f)p.push("floor "+f[1]);
    if(a)p.push(a[1]+" m²");
    return p.join(" — ");
  }
  function openOurs(){
    try{window.parent.postMessage({source:"sitbo-piazza",event:"request",topic:topic()},"*");}catch(e){}
  }
  var ofetch=window.fetch;
  window.fetch=function(input,init){
    try{
      var url=typeof input==="string"?input:(input&&input.url)||"";
      var method=((init&&init.method)||(input&&input.method)||"GET")+"";
      var body=(init&&init.body)?String(init.body):"";
      if(/pro-api\\.flat\\.show/i.test(url)&&/POST|PUT/i.test(method)&&(/request/i.test(url)||/FLAT\\.SHOW|placementAllocation|phoneNumber/i.test(body))){
        openOurs();
        return Promise.resolve(new Response(JSON.stringify({data:{}}),{status:200,headers:{"Content-Type":"application/json"}}));
      }
    }catch(err){}
    return ofetch.apply(this,arguments);
  };
  function isCta(el){
    if(!el||el.nodeType!==1)return false;
    var label=((el.innerText||el.textContent||el.getAttribute("aria-label")||"")+"").replace(/\\s+/g," ").trim();
    return label.length>1 && (CTA.test(label) || (/^(send|отправить|ok|ок)$/i.test(label) && el.closest("[role='dialog'],.MuiDialog-root,.MuiModal-root")));
  }
  function onClick(e){
    var el=e.target&&e.target.closest&&e.target.closest("button,a,[role='button'],input[type='submit']");
    if(!isCta(el))return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    openOurs();
  }
  document.addEventListener("click",onClick,true);
  document.addEventListener("submit",function(e){
    var form=e.target;
    if(!form||!form.closest)return;
    var dlg=form.closest("[role='dialog'],.MuiDialog-root,.MuiModal-root");
    if(!dlg)return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    openOurs();
  },true);
  var mo=new MutationObserver(function(){
    document.querySelectorAll("button,a,[role='button']").forEach(function(btn){
      if(btn.getAttribute("data-sitbo")==="1"||!isCta(btn))return;
      btn.setAttribute("data-sitbo","1");
    });
  });
  mo.observe(document.documentElement,{subtree:true,childList:true});
})();`;

function inject(html: string) {
  const tagged = html
    .replace(/window\.realClientPageUrl="[^"]*"/g, 'window.realClientPageUrl="*"')
    .replace("</body>", `<script>${INTERCEPT}</script></body>`);
  return tagged.includes(INTERCEPT) ? tagged : `${html}<script>${INTERCEPT}</script>`;
}

export async function fetchPiazzaViewerHtml(lang: string) {
  const ru = lang.toLowerCase().startsWith("ru");
  const clientPageUrl = ru ? CLIENT_RU : CLIENT_EN;
  const url = `${INDEX}?clientPageUrl=${encodeURIComponent(clientPageUrl)}`;
  const res = await fetch(url, {
    headers: { Accept: "text/html,application/json" },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Flat.show viewer ${res.status}: ${body.slice(0, 200)}`);
  }
  return inject(await res.text());
}
