function initCustomizeForm(form){
  if (form && form.length > 0 && !form.hasClass('customized-hs-form')){
    form.customizeForm();
  }
}

$.fn.customizeForm = function() {
    if ($(this)[0].tagName != "FORM"){
      console.log("DOM MUST BE A FORM!");
      return;
    }
    
    // Store form dom
    var customizedForm = $(this);
    customizedForm.addClass('customized-hs-form');
    // init Actions
    var customizedForm__Actions = {
      toggleSelectionSelect: function(target,e){
        var container = customizedForm.find('.select-inner');
        var trigger = customizedForm.find('.styled-select-label');

        if (target.hasClass('styled-select-label')) 
        {
          trigger.not(target).removeClass('open');
          container.not(target.next()).slideUp('fast');
          return;
        }
        // if the target of the click isn't the container nor a descendant of the container
        if (!container.is(e.target) && container.has(e.target).length === 0) 
        {
          container.prev().removeClass('open');
          container.slideUp('fast');
        }
      },
      toggleSelectionRadio: function(target,e){
        var container = customizedForm.find('.radio-select-inner');
        var trigger = customizedForm.find('.styled-radio-label');

        if (target.hasClass('styled-radio-label')) 
        {
          trigger.not(target).removeClass('open');
          container.not(target.next().find('.radio-select-inner')).slideUp('fast');
          return;
        }
        // if the target of the click isn't the container nor a descendant of the container
        if (!container.is(e.target) && container.has(e.target).length === 0) 
        {
          container.closest('.radio-inner').prev().removeClass('open');
          container.slideUp('fast');
        }
      },
      InitActions: function(){
        customizedForm.find('.styled-radio-item').click(function(){
          var inputTarget = $('#'+$(this).attr('data-id'));
          inputTarget.prop("checked", true).change();
          var parent = $(this).closest('.radio-inner');

          parent.find('.styled-radio-item').removeClass('active');
          parent.find('.styled-radio-item[data-id="'+$(this).attr('data-id')+'"]').addClass('active');
          //$(this).addClass('active');

          var MainParent = $(this).closest('.radio-inner').parent();
          MainParent.find('.styled-radio-label').text(inputTarget.next().text());

          if ($(this).closest('.radio-select-inner') && $(this).closest('.radio-select-inner').length > 0){
            MainParent.find('.styled-radio-label').removeClass('open');
            MainParent.find('.radio-select-inner').slideUp('fast');
          }

        });
        customizedForm.find('.styled-select-item').click(function(){
          var parent = $(this).parent();
          var inputTarget = $('#'+$(this).attr('data-id'));
          var optionValue= $(this);

          parent.find('.styled-select-item').removeClass('active');
          $(this).addClass('active');

          inputTarget.parent().find('.styled-select-label').text(optionValue.text());
          inputTarget.val(optionValue.attr('data-value')).change();

          inputTarget.closest('.input').find('.styled-select-label').removeClass('open');
          inputTarget.closest('.input').find('.select-inner').slideUp('fast');

        });

        customizedForm.find('.styled-select-label').click(function(e){
          e.stopPropagation();
          $(this).toggleClass('open');
          $(this).next().slideToggle('fast');
        });

        customizedForm.find('.styled-radio-label').click(function(e){
          e.stopPropagation();
          $(this).toggleClass('open');
          $(this).next().find('.radio-select-inner').slideToggle('fast');
        });

        $(document).on("mouseup touchend", function(e){
          var target = $(e.target);
          customizedForm__Actions.toggleSelectionSelect(target,e);
          customizedForm__Actions.toggleSelectionRadio(target,e);
        });
      },
      constructRadioInputs: function(inputList){

        var htmlDomContainer = $('<div>').attr({class:'radio-inner'});

        var htmlDomSelect = $('<div>').attr({class:'radio-select-inner'});
        var htmlDomScrolling = $('<div>').attr({class:'select-inner-scrolling'});

        var htmlDomRadio = $('<div>').attr({class:'radio-radio-inner'});



        if (inputList.find('li') && inputList.find('li').length > 0){
          inputList.find('li').each(function(){
            htmlDomRadio.append(
              $('<span>').attr({
                'class': 'styled-radio-item',
                'data-id': $(this).find('input').attr('id')
              }).text($(this).text())
            );
          });
          inputList.find('li').each(function(){
            htmlDomSelect.append(
              $('<div>').attr({
                'class': 'styled-radio-item',
                'data-id': $(this).find('input').attr('id')
              }).text($(this).text())
            );
          });
        }
        htmlDomScrolling.append(htmlDomSelect);
        htmlDomContainer.append(
          htmlDomRadio,
          htmlDomScrolling
        );
        return htmlDomContainer;
      },
      constructSelectInputs: function(inputSelect){
        var htmlDom = $('<div>').attr({class:'select-inner'});
        var htmlDomInner = $('<div>').attr({class:'select-inner-scrolling'});
        if (inputSelect.find('option') && inputSelect.find('option').length > 0){
          var indexOptions = 0;
          inputSelect.find('option').each(function(){
            if (indexOptions == 0 && $(this).attr('value') == ''){
            }else {
              htmlDomInner.append(
                $('<div>').attr({
                  'class': 'styled-select-item',
                  'data-id': inputSelect.attr('id'),
                  'data-value': $(this).attr('value')
                }).text($(this).text())
              );
            }
            indexOptions++;
          });
        }
        htmlDom.append(htmlDomInner);
        return htmlDom;
      }
    };

    // Start function
    var selectFields = customizedForm.find('.hs-fieldtype-select .input select');
    selectFields.each(function(){
      var me = $(this);

      // INITIAL VALUE
      var valueofSelect = (me.val() == '' ? 'Please Select' : me.find('option[value="'+me.val()+'"]').text());

      me.hide().parent().append(
        $('<div>').attr({
          class: "select-styled-container"
        }).append(
          $('<div>').attr({class:'styled-select-label'}).text(valueofSelect),
          customizedForm__Actions.constructSelectInputs(me)
        )
      );
    });

    var radioFields = customizedForm.find('.hs-fieldtype-radio .input ul[role="checkbox"]')
    radioFields.each(function(){
      var me = $(this);

      // INITIAL VALUE
      var valueText = 'Please Select';
      me.find('input').each(function(){
        if ($(this).is(':checked')){
          valueText = $(this).next().text();
        }
      });

      me.hide()
        .parent().append(
        $('<div>').attr({
          class: "radio-styled-container"
        }).append(
          $('<div>').attr({class:'styled-radio-label'}).text(valueText),
          customizedForm__Actions.constructRadioInputs(me)
        )
      );

      // INITIAL VALUE for DROP DOWN
      me.find('input').each(function(){
        if ($(this).is(':checked')){
          $(this)
            .closest('.input')
            .find('span.styled-radio-item[data-id="'+$(this).attr('id')+'"]')
            .addClass('active');
        }
      });
    });
    customizedForm__Actions.InitActions();
  };





// HOW TO USE 
 
// {{ require_css(get_asset_url('/impel2020/css/customized-form.css')) }}
// {{ require_js(get_asset_url('/impel2020/js/form/customized-form-v2.js')) }}
// {% require_js %}
// <script>
//   window.addEventListener('message', event => {
//     if(event.data.type === 'hsFormCallback' 
//        && event.data.eventName === 'onFormReady' 
//        && event.data.id == '{{ module.form_field.form_id }}') {
//       console.log("Form Loaded!");
      
//       initCustomizeForm($('.{{name}} form[data-form-id="{{ module.form_field.form_id }}"]'));
    
//     }
//   });
// </script>
// {% end_require_js %}
