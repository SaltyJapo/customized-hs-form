# customized-hs-form
stylized drop down and radio button

Created to change how a traditional hubspot dropdown and radio button looks like.

Needs jQuery to work.


// HOW TO USE 

window.addEventListener('message', event => {

  if(event.data.type === 'hsFormCallback' 
  
     && event.data.eventName === 'onFormReady' 
     
     && event.data.id == '{{ module.form_field.form_id }}') {
     
    console.log("Form Loaded!");   
    
    $('.{{name}} form[data-form-id="{{ module.form_field.form_id }}"]').customizeForm();
    
  }
  
});

