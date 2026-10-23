// Leakcade: small progressive enhancement, no framework.
(()=>{
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  $$('.rp-item>button').forEach(b=>b.addEventListener('click',()=>{
    const open=b.getAttribute('aria-expanded')==='true';
    b.setAttribute('aria-expanded',String(!open)); $('#'+b.getAttribute('aria-controls')).hidden=open;
  }));
  $$('[data-copy]').forEach(b=>b.addEventListener('click',async()=>{
    const txt=b.closest('.prompt').querySelector('.pt').textContent;
    try{await navigator.clipboard.writeText(txt);b.textContent='COPIED';}catch{b.textContent='SELECT TEXT';}
    setTimeout(()=>b.textContent='COPY',1800);
  }));
  // Guides: Copy button on prompt boxes. Added here, so without JS the prompt is just selectable text.
  $$('.pbox').forEach(box=>{
    const pre=$('pre',box), bar=$('.pbox-h',box); if(!pre||!bar) return;
    const b=document.createElement('button'), live=document.createElement('span'); let t;
    b.type='button'; b.className='pcopy'; b.textContent='Copy'; b.setAttribute('aria-label','Copy prompt');
    live.className='sr'; live.setAttribute('role','status'); live.setAttribute('aria-live','polite');
    bar.append(b); box.append(live);
    const show=(label,msg)=>{b.textContent=label; b.classList.toggle('is-copied',label==='Copied!'); live.textContent=msg; clearTimeout(t);
      t=setTimeout(()=>{b.textContent='Copy'; b.classList.remove('is-copied'); live.textContent='';},2000);};
    const legacy=txt=>{ // old browsers and plain http: hidden textarea + execCommand
      const ta=document.createElement('textarea'); let ok=false;
      ta.value=txt; ta.setAttribute('readonly',''); ta.style.cssText='position:fixed;top:0;left:0;opacity:0';
      document.body.append(ta); ta.select(); ta.setSelectionRange(0,txt.length);
      try{ok=document.execCommand('copy');}catch(e){}
      ta.remove(); b.focus(); return ok;};
    b.addEventListener('click',async()=>{
      const txt=pre.textContent; let ok=false;
      if(navigator.clipboard&&window.isSecureContext){try{await navigator.clipboard.writeText(txt); ok=true;}catch(e){}}
      if(!ok) ok=legacy(txt);
      if(ok) return show('Copied!','Prompt copied to the clipboard.');
      const r=document.createRange(); r.selectNodeContents(pre); const s=getSelection(); s.removeAllRanges(); s.addRange(r);
      show('Selected','Copy failed. The prompt is selected, press Ctrl+C or Cmd+C.');
    });
  });
  const f=$('#start-form');
  if(f){
    const btn=$('.btn-label',f), modes=$$('input[name=mode]',f);
    const sync=()=>{const paid=f.mode.value==='full'; btn.textContent=paid?'Check for $19':'Free scan'; f.action=paid?(f.dataset.stripe||f.action):(f.dataset.teaser||f.action);};
    f.dataset.teaser=f.getAttribute('action'); 
    modes.forEach(m=>m.addEventListener('change',sync)); sync();
    f.addEventListener('submit',e=>{
      const v=$('#repo').value.trim(), email=$('#email').value.trim(), err=$('#repo-err'), own=$('#own'), paid=f.mode.value==='full';
      if(!/^https:\/\/github\.com\/[A-Za-z0-9][A-Za-z0-9-]{0,38}\/[A-Za-z0-9._-]{1,100}\/?$/.test(v)){
        e.preventDefault(); err.textContent='Paste a public repo link like https://github.com/you/your-app'; $('#repo').focus(); return;
      }
      if(!/^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/.test(email)){
        e.preventDefault(); err.textContent='Enter a valid email so we can send the result.'; $('#email').focus(); return;
      }
      if(own && !own.checked){e.preventDefault(); err.textContent='Tick the box to confirm you own the repo or have permission.'; own.focus(); return;}
      err.textContent='';
      if(f.getAttribute('action').startsWith('#TODO')){e.preventDefault(); err.textContent=paid?'Checkout isn\u2019t live yet.':'The free scan isn\u2019t live yet.'; return;}
      if(!paid) f.classList.add('busy');
    });
  }
})();
