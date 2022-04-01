function initCustomizeForm(form, formOptions){
  var defaultOptions = {
    selecFields:true,
    radioButtons:true,
    searchableSelect:false
  };
  if (!formOptions){
    formOptions = {};
  }
  let options = {
    ...defaultOptions,
    ...formOptions
  }
  if (form && form.length > 0 && !form.hasClass('customized-hs-form')){
    form.customizeForm(options);
  }
}

$.fn.customizeForm = function(options) {
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
        var inputTarget = customizedForm.find('[id="'+$(this).attr('data-id')+'"]');
        inputTarget.prop("checked", true).change();
        var parent = $(this).closest('.radio-inner');

        parent.find('.styled-radio-item').removeClass('active');
        parent.find('.styled-radio-item[data-id="'+$(this).attr('data-id')+'"]').addClass('active');
        //$(this).addClass('active');

        var MainParent = $(this).closest('.radio-inner').parent();
        MainParent.find('.styled-radio-label').text(inputTarget.next().text());

        var radioSelectContainer = $(this).closest('.radio-select-inner');
        if (radioSelectContainer && radioSelectContainer.length > 0){
          MainParent.find('.styled-radio-label').removeClass('open');
          MainParent.find('.radio-select-inner').slideUp('fast');
        }

      });
      customizedForm.find('.styled-select-item').click(function(){
        var parent = $(this).parent();
        var inputTarget = customizedForm.find('[id="'+$(this).attr('data-id')+'"]');
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
      
      customizedForm.find('.select-input-search input').on("change keyup", function(){
        var mySearch = $(this);
        var selectionInputs = mySearch.closest('.input').find('.styled-select-item');
        selectionInputs.hide();
        selectionInputs.each(function(){
          var selectionInputItem = $(this);
          var itemText = selectionInputItem.text().toLowerCase();
          if (itemText.indexOf(mySearch.val().toLowerCase()) > -1){
            selectionInputItem.show();
          }
        });
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


      var inputListItems = inputList.find('li');
      if (inputListItems && inputListItems.length > 0){
        inputListItems.each(function(){
          htmlDomRadio.append(
            $('<span>').attr({
              'class': 'styled-radio-item',
              'data-id': $(this).find('input').attr('id')
            }).text($(this).text())
          );
        });
        inputListItems.each(function(){
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
      var htmlDomInner = $('<div>').attr({class:'select-inner-scrolling ' + (options.searchableSelect ? 'searchable' : '')});
      var inputSelectOptions = inputSelect.find('option');
      if (inputSelectOptions && inputSelectOptions.length > 0){
        var indexOptions = 0;
        inputSelectOptions.each(function(){
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
      if (options.searchableSelect){
        htmlDomInner.prepend(
          $('<div>').attr({class: "select-input-search"}).append(
            $('<input>').attr({
              placeholder: 'Search here',
              type:'text'
            })
          )
        );
      }
      htmlDom.append(htmlDomInner);
      return htmlDom;
    }
  };

  // Start function

  //   options.selecFields
  //   options.radioButtons
  //   options.searchableSelect
  
  if (options.selecFields){
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
  }

  if (options.radioButtons){
    var radioFields = customizedForm.find('.hs-fieldtype-radio .input ul[role="checkbox"]')
    radioFields.each(function(){
      var me = $(this);
      me.addClass('stylize-radio');
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
  }
  customizedForm__Actions.InitActions();
};
