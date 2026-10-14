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
