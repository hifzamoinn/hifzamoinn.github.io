/* Contact form: documented FormSubmit AJAX endpoint, non-blocking status UI. */
(()=>{const form=document.getElementById('contact-message-form');if(!form)return;
const button=form.querySelector('button[type="submit"]');const status=document.getElementById('contact-submit-status');
form.addEventListener('submit',async event=>{
 event.preventDefault();if(button.disabled||!form.reportValidity())return;
 button.disabled=true;button.textContent='Sending message…';
 status.textContent='Submitting your message securely…';status.dataset.state='sending';
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),20000);
 try{
  const fields=Object.fromEntries(new FormData(form).entries());
  delete fields._next;
  const response=await fetch('https://formsubmit.co/ajax/hifzamoinn@hotmail.com',{
   method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},
   body:JSON.stringify(fields),signal:controller.signal
  });
  if(!response.ok)throw new Error('The message service returned an error. Please try again or use email.');
  const data=await response.json();
  if(String(data.success).toLowerCase()!=='true'){
   throw new Error(data.message||'The message was not accepted. Please check form activation or try email.');
  }
  status.dataset.state='success';status.textContent='Message accepted. Opening confirmation…';
  window.location.assign('/contact-success.html');
 }catch(err){
  status.dataset.state='error';
  if(err.name==='AbortError'){
   status.textContent='The message service is taking too long. Delivery is unconfirmed. Please check before resending, or contact Hifza by email.';
  }else{
   status.textContent=err.message||'Unable to confirm delivery. Please use email or WhatsApp.';
  }
 }finally{
  clearTimeout(timeout);button.disabled=false;button.innerHTML='Send message <span aria-hidden="true">↗</span>';
 }
});
})();