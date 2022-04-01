# customized-hs-form
stylized drop down and radio button

Created to change how a traditional hubspot dropdown and radio button looks like.

Needs jQuery to work.


// HOW TO USE 

```

<script type="text/javascript" src="/YOUR-DIRECTORY/js/jquery.1.7.1.js"></script>

{{ require_css(get_asset_url('/YOUR-DIRECTORY/css/customized-form.css')) }}
{{ require_js(get_asset_url('/YOUR-DIRECTORY/js/form/customized-form.js')) }}

{% require_js %}
<script>
window.addEventListener('message', event => {

  if(event.data.type === 'hsFormCallback'   
     && event.data.eventName === 'onFormReady' 
     && event.data.id == '{{ module.form_field.form_id }}') {
    console.log("Form Loaded!");   
    $('.{{name}} form[data-form-id="{{ module.form_field.form_id }}"]').customizeForm();
  }
  
});
</script>
{% end_require_js %}
```

