// for pro search cmb

// function test() {
//   alert("from test2");
// }

// function run2(){
(function ($) {
  // function run2(){

  "use strict";

  $(document).ready(function () {


    // $('#multiple-checkboxes2').multiselect({
    //   includeSelectAllOption: true,
    //   // buttonWidth:'443px',
    //   maxHeight:358,
    // });

    // $('#multiple-checkboxes').multiselect({
    //   includeSelectAllOption: true,
    //   buttonWidth:'222px',
    //   maxHeight:358,
    // });



    // var options = [
    //   {label: 'Option 1', title: 'Option 1', value: '1'},
    //   {label: 'Option 2', title: 'Option 2', value: '2'},
    //   {label: 'Option 3', title: 'Option 3', value: '3'},
    //   {label: 'Option 4', title: 'Option 4', value: '4'},
    //   {label: 'Option 5', title: 'Option 5', value: '5'},
    //   {label: 'Option 6', title: 'Option 6', value: '6'}
    //   ];

    //   $('#multiple-checkboxes').multiselect('dataprovider', options);
    //   var selectconfig = {
    //   enableFiltering: true,
    //   includeSelectAllOption: true,
    //     buttonWidth:'123px',
    //     maxHeight:358,
    //     minHeight:358,
    //   };
    //   $('#multiple-checkboxes2').multiselect('setOptions', selectconfig);
    //   $('#multiple-checkboxes2').multiselect('rebuild');


// function run2(){
  //https://stackoverflow.com/questions/19725203/how-to-populate-dropdownlist-with-json-data-as-ajax-response-in-jquery
  $.ajax({
    type: "GET",
    url: "https://aepnode2.onrender.com/api/procombo/cmbprosecprojecttypemultiselect/",
    // url: "http://localhost:5000/api/procombo/cmbprosecprojecttypemultiselect/",

    dataType: "json",
    success: function (data) {
      // $.each(data.aaData, function (i, data) {
      //   alert(data.value + ":" + data.text);
      //   var div_data = "<option value=" + data.value + ">" + data.text + "</option>";
      //   alert(div_data);
      //   $(div_data).appendTo('#ch_user1');
      // });
      // console.log(data);
      $('#multiple-checkboxes').multiselect('dataprovider', data);//select data
      // $('#multiple-checkboxes').multiselect('select', ['1', '2', '4']);// then select the options

      var selectconfig = {
        enableFiltering: true,
        includeSelectAllOption: true,
        enableFiltering: false,
        // buttonWidth: '232px',
        maxWidth: 100,
        //   buttonText:function(options, select) {
        //     var numberOfOptions = $(this).children('option').length;
        //     if (options.length === 0) {
        //         return this.nonSelectedText + '';
        //     } else {
        //         var selected = '';
        //         options.each(function() {
        //             var label = ($(this).attr('label') !== undefined) ?
        //                 $(this).attr('label') : $(this).html();
        //             selected += label + ', ';
        //         });
        //         return selected.substr(0, selected.length - 2) + '';

        //     }
        // }
        buttonText: function (options) {
          // // return "Search or select";
          // // you can show the number of selected options
          // return "(" + options.length + ") options selected";
          if (options.length == 0) {
            return "None selected"
          } else {
            return options.length + " selected";
          }


        },

        onChange: function (element, checked) {
          var brands = $('#multiple-checkboxes option:selected');
          var selected = [];
          $(brands).each(function (index, brand) {
            selected.push([$(this).val()]);
          });

          // alert(selected);
          // Array value is stored in a input control with id multiSelectedIds
          $("#multiSelectedIds").val(selected);// store array in input control for multi secproject search
        }

      }; // end config


      $('#multiple-checkboxes').multiselect('setOptions', selectconfig);
      $('#multiple-checkboxes').multiselect('rebuild');

    }, // end success

    error: function (XMLHttpRequest, textStatus, errorThrown) {
      alert("Status: " + textStatus); alert("Error: " + errorThrown);
    } // end error

  });// End ajax



    $("#multiple-checkboxes").multiselect('deselectAll', false);
    $("#multiple-checkboxes").multiselect('refresh');
    //   let items=[21,27,25];//this.secprojecttype;
    //   for (let index = 0; index < items.length; index++) {
    //     alert(items.length)
    //     // $("#multiple-checkboxes option[value='"+val+"']").attr("selected", "selected");
    //     $("#multiple-checkboxes option[value='"+val+"']").prop('selected', true); // use prop for latest jquery
    // }
    // $("#multiple-checkboxes").multiselect('rebuild');


    // let items='21,27,25,10';//this.secprojecttype;
    // $.each(items.split(','), function(idx, val) {
    //   // alert(val)
    //     //$("#multiple-checkboxes option[value='"+val+"']").attr("selected", "selected");
    //      $("#multiple-checkboxes option[value='"+21+"']").prop('selected', true); // use prop for latest jquery
    // }); 
    // $("#multiple-checkboxes").multiselect('rebuild');

    $('#multiple-checkboxes').multiselect('select', ['1', '2', '4']); // WORKING

    // $('#multiple-checkboxes').multiselect('select', ['1', '2', '4']);




    // $("#clearMultiSelect").click(function () {
    //   // alert();
    
    // });





  });// end documenready

// }// end normal function
})(jQuery);


