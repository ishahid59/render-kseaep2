(function ($) {



    "use strict";
    $(document).ready(function () {



      //****************************************************************************************
      // "multiple-checkboxes2" Project EditModal
      //****************************************************************************************

      // $('#multiple-checkboxes2').multiselect({
      //   includeSelectAllOption: true,
      //   // buttonWidth:'443px',
      //   maxHeight:358,
      // });




      // //https://stackoverflow.com/questions/19725203/how-to-populate-dropdownlist-with-json-data-as-ajax-response-in-jquery
      // $.ajax({
      //   type: "GET",
      //   url: "http://localhost:5000/api/procombo/cmbprosecprojecttypemultiselect/",
      //   // url: "http://localhost:5000/api/procombo/secprojecttypevalue/248",

      //   dataType: "json",
      //   success: function (data) {
      //     // $.each(data.aaData, function (i, data) {
      //     //   alert(data.value + ":" + data.text);
      //     //   var div_data = "<option value=" + data.value + ">" + data.text + "</option>";
      //     //   alert(div_data);
      //     //   $(div_data).appendTo('#ch_user1');
      //     // });
      //     console.log(data);
      //     $('#multiple-checkboxes2').multiselect('dataprovider', data);//select data
      //     // $('#multiple-checkboxes2').multiselect('select', ['1', '2', '4']);// then select the options

      //     var selectconfig = {
      //       enableFiltering: true,
      //       includeSelectAllOption: true,
      //       enableFiltering: false,
      //       buttonWidth: '422px',
      //       maxWidth: 100,
      //       //   buttonText:function(options, select) {
      //       //     var numberOfOptions = $(this).children('option').length;
      //       //     if (options.length === 0) {
      //       //         return this.nonSelectedText + '';
      //       //     } else {
      //       //         var selected = '';
      //       //         options.each(function() {
      //       //             var label = ($(this).attr('label') !== undefined) ?
      //       //                 $(this).attr('label') : $(this).html();
      //       //             selected += label + ', ';
      //       //         });
      //       //         return selected.substr(0, selected.length - 2) + '';

      //       //     }
      //       // }
      //       buttonText: function(options) {
      //         // // return "Search or select";
      //         // // you can show the number of selected options
      //         // return "(" + options.length + ") options selected";
      //         if (options.length==0) {
      //           return "None selected"
      //         } else {
      //            return  options.length + " selected";
      //         }


      //     },

      //         onChange: function (element, checked) {
      //           var brands = $('#multiple-checkboxes2 option:selected');
      //           var selected = [];
      //           $(brands).each(function (index, brand) {
      //             selected.push([$(this).val()]);
      //           });

      //           // alert(selected);
      //           $("#multiSelectedIds").val(selected);// store array in input control for multi secproject search
      //         }

      //     }; // end config


      //     $('#multiple-checkboxes2').multiselect('setOptions', selectconfig);
      //     $('#multiple-checkboxes2').multiselect('rebuild');
      //     // $('#multiple-checkboxes2').multiselect('select', ['1', '2', '4']);// then select the options
      //   }, // end success

      //   error: function(XMLHttpRequest, textStatus, errorThrown) { 
      //       alert("Status: " + textStatus); alert("Error: " + errorThrown); 
      //   } // end error

      // });// End ajax





      // Function for Proedit form Multiselect multiple-checkboxes2
      // ******************************************************************************
      //  https://stackoverflow.com/questions/66467512/best-way-to-chain-jquery-ajax-calls-which-pass-information
      async function run() {
        try {
          const data = await
            //https://stackoverflow.com/questions/19725203/how-to-populate-dropdownlist-with-json-data-as-ajax-response-in-jquery
            
            // 1st ajax call from chain for filling combos
            //*******************************************
            $.ajax({
              type: "GET",
              // url: "http://localhost:5000/api/procombo/cmbprosecprojecttypemultiselect/",
              // url: "http://localhost:5000/api/procombo/secprojecttypevalue/248",
              url: "http://localhost:5000/api/procombo/cmbprosecprojecttypemultiselect/",
              // url: 'https://aepnode2.onrender.com/api/procombo/cmbprosecprojecttypemultiselect/',

 
              dataType: "json",
              success: function (data) {
                // $.each(data.aaData, function (i, data) {
                //   alert(data.value + ":" + data.text);
                //   var div_data = "<option value=" + data.value + ">" + data.text + "</option>";
                //   alert(div_data);
                //   $(div_data).appendTo('#ch_user1');
                // });
                // console.log(data);
                $('#multiple-checkboxes2').multiselect('dataprovider', data);//select data
                // $('#multiple-checkboxes2').multiselect('select', ['1', '2', '4']);// then select the options

                var selectconfig = {
                  enableFiltering: true,
                  includeSelectAllOption: true,
                  enableFiltering: false,
                  buttonWidth: '422px',
                  buttonHeight:'42px',
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
                    var brands = $('#multiple-checkboxes2 option:selected');
                    var selected = [];
                    $(brands).each(function (index, brand) {
                      selected.push([$(this).val()]);
                    });
                    
                    // alert(selected);
                    // Array value is stored in a input control with id multiSelectedIdsEditModal
                   
                    $("#multiSelectedIdsEditModal").val(selected);// store array in input control for multi secproject search
                    $("#secondaryprojecttype").val(selected);// store array in input control for multi secproject search

                  }

                }; // end config


                $('#multiple-checkboxes2').multiselect('setOptions', selectconfig);
                $('#multiple-checkboxes2').multiselect('rebuild');
                // $('#multiple-checkboxes2').multiselect('select', ['1', '2', '4']);// then select the options
              }, // end success ist part

              error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Status: " + textStatus); alert("Error: " + errorThrown);
              } // end error ist part

            });// End ajax ist part

          // let projectid = $("#ddProjectId").val();
          var str = '' + window.location + '';
          var tmp = str.split("/");
          var proid = tmp.pop();//projectid;

          const secprodata = await

            // 2nd ajax call from chain for getting secproject ids
            //*******************************************
            $.ajax({
              type: 'GET',
              url: `http://localhost:5000/api/procombo/secprojecttypevalue/${proid}`,
              // url: `https://aepnode2.onrender.com/api/procombo/secprojecttypevalue/${proid}`,



              // data: JSON.stringify({
              //   "name": "Joe Dirt"
              // }),
              // headers: {
              //   Authorization: 'Bearer ' + token
              // },
              datatype: 'json',
              contentType: 'application/json; charset=utf-8',
            })
          let arr = (secprodata.SecondaryProjectType).split(",");
          // $('#multiple-checkboxes2').multiselect('select', ['1', '2', '4']); // WORKING
          $('#multiple-checkboxes2').multiselect('select', arr);
          // $('#multiple-checkboxes2').multiselect('select', secprodata);

        } catch (e) {
          alert("Error ajax call for proedit");
        }

      } // End async function for Proedit multiple-checkboxes2


      run();




      
      // For calling the ajax method from 'prodetail' to update the Multiselect when projectid is changed
      $("#proDetailEditBtn").click(function () {
        run(); //call ajax function run();
      });




      // for clearing selection if required
      $("#clearMultiSelect2").click(function () {
       
        $("#multiple-checkboxes2").multiselect("clearSelection");// WORKING clear Bootstrap multiselect

        // $('#multiple-checkboxes').multiselect('select', ['1', '2', '4']); // WORKING
        // $("#multiple-checkboxes").multiselect('refresh');// refresh Bootstrap multiselect
        // $("#multiple-checkboxes").multiselect("deselectAll", false);
        // $("#multiple-checkboxes option[value='"+21+"']").prop('selected', true);
        // $("#multiple-checkboxes option[value='"+21+"']").attr("selected", "selected");
      });






      //****************************************************************************************
      // "multiple-checkboxes" for pro search form
      //****************************************************************************************


      // hidden btn to clearMultiSelect. This btn clicked is called from angular "clearall()"
      $("#clearMultiSelect").click(function () {
        $("#multiple-checkboxes").multiselect("clearSelection");// WORKING clear Bootstrap multiselect

        // $('#multiple-checkboxes').multiselect('select', ['1', '2', '4']); // WORKING
        // $("#multiple-checkboxes").multiselect('refresh');// refresh Bootstrap multiselect
        // $("#multiple-checkboxes").multiselect("deselectAll", false);
        // $("#multiple-checkboxes option[value='"+21+"']").prop('selected', true);
        // $("#multiple-checkboxes option[value='"+21+"']").attr("selected", "selected");
      });

  $("#btntest").click(function(){
      alert("The paragraph was clicked.");
    });

    }); // end documentready


  })(jQuery); // (function ($) {