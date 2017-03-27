/**
 * Created by aajahid on 8/28/15.
 *
 * Search field and advanced search form related functions
 */

//Search keyword parsing
infobarApp.search = infobarApp.search || {

        init: function () {
            this.init_searchForm();
        },
    
        init_searchForm: function() {

            // Advanced search date selector behaviour
            // on today check
            $("#date-today").change(function(){

                if( $(this).is(":checked") ) {
                    $("#filter-from").val('');
                    $("#filter-to").val('');
                }

                infobarApp.search.formToSearchString();

            })

            //on Datepicker change
            $("#filter-from, #filter-to").change(function(){
                if( $(this).val() != '' ) {
                    $("#date-today").prop('checked', false);
                }
            })


            var sourceOptions = new Array();
            var sel = new Array();
			$.each($("#filter-source option"), function() {
                sourceOptions[sourceOptions.length] = this.value.toUpperCase();
				$(this).attr("uppered",this.value.toUpperCase());
             });
             var newOptions = "";
             sourceOptions.sort();
                    
             $.each(sourceOptions, function(index) {
                var oldText = $('#filter-source').find('option[uppered="' + this + '"]').val();
				var ss = ($('#filter-source').find('option[uppered="' + this + '"]')[0].selected) ? "selected" : "";
                newOptions += '<option ' + ss + ' value="' + oldText + '">' + oldText + '</option>';
             });
            $( "#filter-source").html(newOptions);
            setTimeout(function() {
                $('#filter-category, #filter-source, #filter-media, #filter-tonality').multiselect({
                    nonSelectedText: infobarApp.lang.nonselected,
                    nSelectedText: infobarApp.lang.nSelected,
                    allSelectedText: infobarApp.lang.allSelected,
                    buttonWidth: '100%',
                    maxHeight: 400,
                    numberDisplayed: 5,
                    onChange: function(element, checked) {
                        infobarApp.search.formToSearchString();
                    }
                });
            },500);


            $(".search").keyup(this.searchStringToForm).change(this.searchStringToForm);

            $("#and_word, #or_word, #not_word").keyup(infobarApp.search.formToSearchString);

            $("#and_word, #or_word, #not_word, #filter-pinned, #filter-hidden, #filter-order, #filter-orderBy").change(function(){
                infobarApp.search.formToSearchString();
            });
            
            $("#filter-from, #filter-to, #from-days, #to-days").change(function(event){

                var changed = $(this);
                infobarApp.search.validate(changed);
                infobarApp.search.formToSearchString();
            });


            infobarApp.search.formToSearchString();


        },

        /**
         * Parse data from search query string and fill advanced search form
         *
         */
        searchStringToForm: function() {

            var keywords = $(this).val();
            //var keyword_array = keywords.match(/[\S]+|"[^"]+"/g);//split(/\s+|^"[^"]\S+"/g);
            var keyword_array = [].concat.apply([], keywords.split('"').map(function(v,i){
                return i%2 ? '"'+v+'"' : v.split(' ')
            })).filter(Boolean);
            
            var andWords = keyword_array.slice(0);
            var orWords = [];
            var notWords = [];
            var categoryWords = [];
            var sourceWords = [];
            var mediaWords = [];
            var tonality = [];
            var pinned = false;
            var hidden = false;
            var today = false;
            var minDate = '';
            var maxDate = '';
            var orderBy = 'desc';

            var dateRange = false; // To check if datemax/datemin is already exist
            var dateDays = false; // To check if datemax/datemin is already exist

            var minDays='';
            var maxDays='';



            var total_words = keyword_array.length;

            for( var i = 0; i < total_words; i++ ) {
                

                switch( true)
                {
                    case andWords[i] == 'OR':
                        typeof(andWords[i-1]) != 'undefined' ? orWords.push(andWords[i-1]) : ''; // Take the previous word of 'OR'
                        typeof(andWords[i+1]) != 'undefined' ? orWords.push(andWords[i+1]) : ''; // Take the next word of 'OR'
                        //andWords.splice(i-1, 3);
                        delete andWords[i-1];
                        delete andWords[i];
                        delete andWords[i+1];
                        //i = i-2; // amend for array splice
                        break;

                    case andWords[i] == 'NOT':
                        typeof(andWords[i+1]) != 'undefined' ? notWords.push(andWords[i+1]) : '';

                        //andWords.splice(i, 2);
                        delete andWords[i];
                        delete andWords[i+1];
                        //i--; // amend for array splice
                        break;

                    case andWords[i] == 'CATEGORY':
                        typeof(andWords[i+1]) != 'undefined' ? categoryWords.push(andWords[i+1].replace(/"/g, '')) : '';

                        //andWords.splice(i, 2);
                        delete andWords[i];
                        delete andWords[i+1];
                        //i--;
                        break;

                    case andWords[i] == 'SOURCE':
                        typeof(andWords[i+1]) != 'undefined' ? sourceWords.push(andWords[i+1].replace(/"/g, '')) : '';

                        //andWords.splice(i, 2);
                        delete andWords[i];
                        delete andWords[i+1];
                        //i--;
                        break;


                    case andWords[i] == 'MEDIA':
                        typeof(andWords[i+1]) != 'undefined' ? mediaWords.push(andWords[i+1].replace(/"/g, '')) : '';

                        //andWords.splice(i, 2);
                        delete andWords[i];
                        delete andWords[i+1];
                        //i--;
                        break;


                    // Tonality
                    case andWords[i] == 'POSITIVE':
                        tonality.push('2');
                        delete andWords[i];
                        break;
                    case andWords[i] == 'NEGATIVE':
                        tonality.push('0');
                        delete andWords[i];
                        break;
                    case andWords[i] == 'NEUTRAL':
                        tonality.push('1');
                        delete andWords[i];
                        break;


                    // Pinned
                    case andWords[i] == 'PINNED':
                        pinned = true;
                        delete andWords[i];
                        break;

                    case andWords[i] == 'HIDDEN':
                        hidden = true;
                        delete andWords[i];
                        break;

                    case andWords[i] == 'DATEMIN':
                        if (typeof(andWords[i+1]) != 'undefined'){
                            if (andWords[i+1].indexOf('TODAY') !== -1) {
                                minDate = ''
                                minDays = andWords[i+1];
                                var numberDays = minDays.split("TODAY-")[1];
                                dateDays = true;
                                $("#from-days").val(numberDays);

                                infobarApp.search.validate($("#from-days"));
                            } else {
                                minDate = andWords[i+1];
                                dateRange = true;
                                $("#filter-from").val(andWords[i+1]);
                                infobarApp.search.validate($("#filter-from"));
                            }
                        }

                        delete andWords[i];
                        delete andWords[i+1];

                        break;

                    case andWords[i] == 'DATEMAX':
                        if (typeof(andWords[i+1]) != 'undefined'){
                            if (andWords[i+1].indexOf('TODAY') !== -1) {
                                maxDate = '';
                                maxDays = andWords[i+1];
                                dateDays = true;
                                var numberDays = maxDays.split("TODAY-")[1];
                                $("#to-days").val(numberDays);
                                
                                infobarApp.search.validate($("#to-days"));
                            } else {
                                dateRange = true;
                                maxDate = andWords[i+1];
                                $("#filter-to").val(andWords[i+1]);
                                infobarApp.search.validate($("#filter-to"));
                            }
                        }

                        delete andWords[i];
                        delete andWords[i+1];

                        break;

                    case andWords[i] == 'TODAY':
                        today = true;
                        delete andWords[i];
                        break;

                    case andWords[i] == 'ORDERBYRELEVANCE':
                    case andWords[i] == 'ORDERBYDATE':
                    case andWords[i] == 'ORDERBYRANGE':
                    case andWords[i] == 'ORDERBYCATEGORY':
                    case andWords[i] == 'ORDERBYSCORE':
                    case andWords[i] == 'ORDERBYSOURCE':
                    case andWords[i] == 'ORDERBYMEDIA':
                        orderBy = andWords[i].replace('ORDERBY','').toLowerCase();

                        if( typeof(andWords[i+1]) != 'undefined' && andWords[i+1] == 'ASC' ) {
                            $("#filter-order").val('asc');
                            $("#filter-order").trigger('update.fs');
                            delete andWords[i+1];
                        }
                        else if( typeof(andWords[i+1]) != 'undefined' && andWords[i+1] == 'DESC' ) {
                            $("#filter-order").val('desc');
                            $("#filter-order").trigger('update.fs');
                            delete andWords[i+1];
                        }
                        else {
                            $("#filter-order").val('desc');
                            $("#filter-order").trigger('update.fs');
                        }

                        delete andWords[i];
                        break;
                }
            }

            $("#and_word").val(andWords.join(' ').replace(/ +(?= )/g,''));
            $("#or_word").val(orWords.join(' '));
            $("#not_word").val(notWords.join(' '));

            $("#filter-category").multiselect('deselectAll', false);
            $("#filter-category").multiselect('select', categoryWords);

            $("#filter-source").multiselect('deselectAll', false);
            $("#filter-source").multiselect('select', sourceWords);

            $("#filter-media").multiselect('deselectAll', false);
            $("#filter-media").multiselect('select', mediaWords);

            $("#filter-tonality").multiselect('deselectAll', false);
            $("#filter-tonality").multiselect('select', tonality);

            $("#filter-pinned").prop('checked', pinned);
            $("#filter-hidden").prop('checked', hidden);

            $("#filter-orderBy").val(orderBy);
            $("#filter-orderBy, #filter-tonality").trigger('update.fs');

            if( !dateRange ) {
                $("#filter-from").val('');
                $("#filter-to").val('');
                $("#date-today").prop('checked', today);
            }
            
            if( !dateDays ) {
                $("#from-days").val('');
                $("#to-days").val('');
                $('#todayLabelTo').hide();
                $('#todayLabelFrom').hide();
            }

        },

        /*
        Validation process:

        Description:
            - We have two FROM inputs and two TO inputs (one for an absolute date and another for a relative Date).
            - We removed SHOW TODAY checkbox.
        Implementation:
            - First validation:
                We only can to select ONE 'from' and ONE 'to':
                    So, if you select a FROM, the other will be disabled. You should to clear the selected to put both of them availables. Same logic for TO fields.
            - Second validation:
                We start from TO fields:
                    if FROM is selected and it is lower than TO, automatically the FROM value will be replaced for TO value.
            - Third validation:
                At the end (once you selected one from and one to), NO ONE input will be greater than TODAY (if any value was greater, will be replaced by TODAY).
        */

        validate: function(changed) {
            //TODO: Modularize in a Service.
            
            function formatDate(date) {
                var d = new Date(date),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();

                if (month.length < 2) month = '0' + month;
                if (day.length < 2) day = '0' + day;

                return [year, month, day].join('-');
            }
            
            var filterFrom = $("#filter-from");
            var fromDays = $("#from-days");

            var toDays = $("#to-days");
            var filterTo = $("#filter-to");

            if (changed.attr("id") == 'filter-from') {
                if (changed.val() != ""){
                    fromDays.prop('disabled', true);
                    fromDays.val("");
                    filterFrom.prop('disabled', false);
                }
                else{
                    fromDays.prop('disabled', false);
                    filterFrom.prop('disabled',false);
                }
            }
            
            if (changed.attr("id") == 'from-days') {
                if (changed.val() != ""){
                    filterFrom.prop('disabled', true);
                    filterFrom.val("");
                    fromDays.prop('disabled', false);
                }
                else{
                    filterFrom.prop('disabled', false);
                    fromDays.prop('disabled', false);
                }
            }
            
            if (changed.attr("id") == 'to-days') {
                if (changed.val() != ""){
                    filterTo.prop('disabled', true);
                    filterTo.val("");
                    toDays.prop('disabled', false);
                }
                else{
                    filterTo.prop('disabled', false);
                    toDays.prop('disabled', false);
                }
            }
            
            if (changed.attr("id") == 'filter-to') {
                if (changed.val() != ""){
                    toDays.prop('disabled', true);
                    toDays.val("");
                    filterTo.prop('disabled', false);
                }
                else{
                    toDays.prop('disabled', false);
                    filterTo.prop('disabled', false);
                }
            }

            //
            if (filterTo.val() != ""){
                var dateFilterTo = new Date(Date.parse(filterTo.val()));
                var now = new Date();
                var diffDays = Math.round((dateFilterTo-now)/(1000*60*60*24)) + 1; //diff between now and filterTo
                
                if (diffDays > 0){ //TO is bigger than NOW that is not possible
                    filterTo.val(formatDate(now));
                }

                if (filterFrom.val() != "") {
                    var dateFilterFrom = Date.parse(filterFrom.val());
                    if (dateFilterFrom > dateFilterTo) {
                        filterFrom.val(filterTo.val());
                    }
                }
                
                if (fromDays.val() != "") {
                    var dateFromDays = new Date();
                    dateFromDays.setDate(dateFromDays.getDate() - fromDays.val()); // minus the date
                    var dFrom = new Date(formatDate(dateFromDays))
                    if (dFrom > dateFilterTo) {
                        fromDays.val(diffDays*-1);
                    }
                }
            }

            if (toDays.val() != ""){
                $('#todayLabelTo').show();
                var dateToDays = new Date();
                var now = new Date();
                dateToDays.setDate(dateToDays.getDate() - toDays.val()); // minus the date

                var diffDays = Math.round((dateToDays-now)/(1000*60*60*24)); //diff between now and filterTo
                if (diffDays > 0){ //TO is bigger than NOW that is not possible
                    toDays.val(0);
                }

                if (filterFrom.val() != "") {
                    var dateFilterFrom = Date.parse(filterFrom.val());
                    if (dateFilterFrom > new Date(formatDate(dateToDays))) {
                        filterFrom.val(formatDate(dateToDays));
                    }
                }

                if (fromDays.val() != "") {
                    var dateFromDays = new Date();
                    dateFromDays.setDate(dateFromDays.getDate() - fromDays.val()); // minus the date
                    var dFrom = new Date(formatDate(dateFromDays))
                    if (dFrom > new Date(formatDate(dateToDays))) {
                        fromDays.val(diffDays*-1);
                    }
                }

            } else {
                $('#todayLabelTo').hide();
            }

            if (fromDays.val() != "") {
                $('#todayLabelFrom').show();
            } else {
                $('#todayLabelFrom').hide();
            }

        },

        /**
         * Form to search query string generator
         */
        formToSearchString: function() {

            var searchString = "";

            // And
            var andWords = $("#and_word").val();


            // Or
            var orWords = [].concat.apply([], $("#or_word").val().split('"').map(function(v,i){
                return i%2 ? '"'+v+'"' : v.split(' ')
            })).filter(Boolean).join(" OR ");


            // NOT
            var notWords = [].concat.apply([], $("#not_word").val().split('"').map(function(v,i){
                return i%2 ? 'NOT "'+v+'"' : v.split(' ').map(function(v){return v!='' ? "NOT "+v : v});
            })).filter(Boolean).join(' ');


            // Category
            var catArray = $("#filter-category").val();
            var categoryWords = "";
            if( $.isArray(catArray) ) {
                categoryWords = catArray.map(function(v){
                    return 'CATEGORY "'+v+'"';
                }).join(' ');
            }



            // SOURCE
            var sourceArray = $("#filter-source").val()
            var sourceWords = "";
            if( $.isArray(sourceArray) ) {
                sourceWords = sourceArray.map(function(v){
                    return 'SOURCE "'+v+'"';
                }).join(' ');
            }


            // MEDIA
            var sourceArray = $("#filter-media").val()
            var mediaWords = '';
            if( $.isArray(sourceArray) ) {
                mediaWords = sourceArray.map(function (v) {
                    return 'MEDIA "' + v + '"';
                }).join(' ');
            }



            //  TONALITY
            var tonality = $("#filter-tonality").val();
            var tonalityWord = '';
            if( $.isArray(tonality) ) {
                tonalityWord = tonality.map(function(v) {
                    switch( v ) {
                        case '0':
                            return "NEGATIVE";
                            break;
                        case '1':
                            return "NEUTRAL";
                            break;
                        case '2':
                            return "POSITIVE";
                            break;
                    }
                }).join(' ');
            }



            // PINNED
            var pinned = $("#filter-pinned").is(":checked");
            var pinnedWord = '';
            if( pinned ) {
                pinnedWord = "PINNED";
            }


            // HIDDEN
            var hidden = $("#filter-hidden").is(":checked");
            var hiddenWord = '';
            if( hidden ) {
                hiddenWord = "HIDDEN";
            }



            // ORDERBY
            var orderBy = $("#filter-orderBy").val();
            var order   = $("#filter-order").val();

            var orderWord = '';
            if( orderBy != 'relevance' || order != 'desc' ) {
                orderWord = " ORDERBY"+orderBy.toUpperCase();
            }

            if( order == 'asc' ) {
                orderWord = " ORDERBY"+orderBy.toUpperCase()+" "+order.toUpperCase();
            }



            // Date
            dateArray = [];
            var today = $("#date-today").is(":checked");
            var fromDate = $("#filter-from").val();
            var toDate   = $("#filter-to").val();

            if( fromDate == '' && toDate == '' ) {
                if(today == true) dateArray.push('TODAY');
            } else {

                if( fromDate != '' ) {
                    dateArray.push('DATEMIN '+fromDate);
                }
                if( toDate != '' ) {
                    dateArray.push('DATEMAX '+toDate);
                }

            }

            dateWords = dateArray.join(' ');

            // Relative Dates
            relateveDateArray = [];
            var fromDays = $("#from-days").val() || '';
            var toDays = $("#to-days").val() || '';

            if (fromDays != '') {
                relateveDateArray.push('DATEMIN TODAY-'+fromDays);
            }
            
            if (toDays != '') {
                relateveDateArray.push('DATEMAX TODAY-'+toDays);
            }

            var relativeDateWords = relateveDateArray.join(' ');

            var searchString = new Array( andWords, orWords, notWords, categoryWords, sourceWords, mediaWords, tonalityWord, pinnedWord, hiddenWord, orderWord, dateWords,relativeDateWords).join(" ").replace(/ +(?= )/g,'');
            searchString = $.trim(searchString);

            $(".search").val(searchString);

        }

    }



