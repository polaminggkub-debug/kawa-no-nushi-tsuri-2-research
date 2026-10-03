#!/usr/bin/env node
// Produce initial HTML with the same renderer used by the interactive catalogue.
// No browser or third-party packages are needed. Run after editing gallery data.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'catalogue/gallery-data.json'), 'utf8'));
const source = fs.readFileSync(path.join(root, 'catalogue/gallery.js'), 'utf8');
async function build(locale, filename) {
  const nodes = {};
  function node(id) {
    return nodes[id] ||= {innerHTML:'',textContent:'',value:id==='category-filter'?'all':id==='sort-filter'?'id':'',addEventListener(){}};
  }
  const document = {
    documentElement:{dataset:{locale}},
    querySelector(selector){return selector.startsWith('#') ? node(selector.slice(1)) : null;},
    querySelectorAll(){return [];},
    getElementById:node,
  };
  const context={document,console,fetch:async()=>({ok:true,json:async()=>data})};
  vm.runInNewContext(source.replace('  const esc =', '  globalThis.catalogueCopy = copy;\n  const esc ='), context);
  await new Promise(resolve=>setImmediate(resolve));
  const file=path.join(root,'catalogue',filename);
  let html=fs.readFileSync(file,'utf8');
  html=html.replace(/(<([a-z0-9]+)[^>]*data-t="([^"]+)"[^>]*>)[^<]*(<\/\2>)/g, (whole,open,tag,key,close)=>{const camel=key.replace(/-([a-z])/g,(_,c)=>c.toUpperCase());const value=context.catalogueCopy[key]??context.catalogueCopy[camel];return typeof value==='string'?open+value+close:whole;});
  for (const [id,n] of Object.entries(nodes)) {
    const value=n.innerHTML || n.textContent;
    if(!value)continue;
    const start=`<!-- prerender:${id} -->`,end=`<!-- /prerender:${id} -->`;
    if(html.includes(start)) {
      html=html.replace(new RegExp(start+'[\\s\\S]*?'+end),()=>start+value+end);
    } else {
      const re=new RegExp('(<(div|tbody|select|p|span)[^>]*id="'+id+'"[^>]*>)[\\s\\S]*?(</\\2>)');
      html=html.replace(re,(_,open,tag,close)=>open+start+value+end+close);
    }
  }
  fs.writeFileSync(file,html);
  console.log(`Rendered ${locale}: ${data.items.length} entries`);
}
(async()=>{await build('en','index.html');await build('ja','index.ja.html');if(fs.existsSync(path.join(root,'catalogue/index.th.html')))await build('th','index.th.html');})().catch(error=>{console.error(error);process.exitCode=1;});
