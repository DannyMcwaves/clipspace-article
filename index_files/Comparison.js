/*

{

"comparison_name":"Default name",
"search_list":[
    {
        "name":"name",
        "filterDto":
        {
            "andWords":["Shane","Smith"],
            "orWords":["Konsolidierungswelle","Medienbranche"],
            "notWords":["Milliarden"],
            "categories":["Digitaler Medienwandel","Verlage","TV und Hörfunk"],
            "sources":["Frankfurter Rundschau D","Meedia","new business Online","newsroom.de"],
            "media":["Internet","Nachrichtenagentur","Print"],
            "orderBy":"relevance",
            "order":"desc",
            "today":"today",
            "fromDate":"2016-08-26",
            "toDate":"2016-08-26",
            "fromDays":1,
            "toDays":2,
            "showPinned":false,
            "showHidden":false,
            "tonalities":[1,2,0]
        }
    }
]
}

{
   "comparison_name" : "Social Media Comparison",
    "search_list" : [
   {
      "search_name" : "Good Services - Facebook Result",
      "filterDto": {
         "contains" : {
            "all": ["Good Services"],
            "one": [],
            "none": []
         },
         "show" : {
            "categories":["Accor Hotels"],
            "source": ["Facebook.com"],
            "media": ["Internet"],
            "tonality" : {
               "pinned_clippings": true,
               "hidden_clippings": false,
               "selection": ["Neutral","Positive"]
            }
         },
         "order" : {
            "by" : "Date",
            "type" : "ASC"
         },
         "date" : {
            "show_today" : true,
            "from" : "",
            "to" : ""
         }
      }
   }
]
}
*/
;var Comparison = {
        
        settings: {
            currentComparison : JSON.parse(localStorage.getItem("currentComparison")) || {},
            currentAnalysis : {id:null}
        },
        
        /*
        * TODO
        */
        setupSettings : function() {},
        
        /*
        * TODO
        */
        init: function() {
            //localStorage.setItem("currentComparison", {});
        },
        
        /*
        * TODO
        */
        bindUIActions: function() {},
        
        /*
        * TODO
        */
        delete: function(id) {},
        
        /*
        * TODO
        */
        list: function() {},

        searchIfExist: function(name) {
            if (this.settings.currentComparison.search_list && this.settings.currentComparison.search_list.length > 0 ){
                for (var i = this.settings.currentComparison.search_list.length - 1; i >= 0; i--) {
                    if (this.settings.currentComparison.search_list[i].name == name)
                        return i;
                }
            }
            return null;
        },

        setDefaultValues: function(search) {
            if (search.filterDto.andWords.length == 0)
                search.filterDto.andWords = null;
            
            if (search.filterDto.orWords.length == 0)
                search.filterDto.orWords = null;
            
            if (search.filterDto.notWords.length == 0)
                search.filterDto.notWords = null;

            if (search.filterDto.fromDate == "")
                search.filterDto.fromDate = null;
            
            if (search.filterDto.toDate == "")
                search.filterDto.toDate = null;

            if (search.filterDto.fromDays == "")
                search.filterDto.fromDays = null;
            
            if (search.filterDto.toDays == "")
                search.filterDto.toDays = null;

            return search;
        },

        collectFieldValues: function() {
            //init
            
            //comparison name
            this.settings.currentComparison.comparison_name = $('#comparison_name').val() || ' ';
            this.settings.currentComparison.search_list = this.settings.currentComparison.search_list || [];

            //var search = {};
            var index = Comparison.searchIfExist($("#search_name").val()) || -1;
            var search = (index !== -1) ?  this.settings.currentComparison.search_list[index] : {};
            
            //search name
            search.name = $("#search_name").val();
            
            //search settings
            search.filterDto = {};
            //contains
            
            search.filterDto.andWords = $("#and_word").slice(0).val().split(" ").filter(String);
            search.filterDto.orWords = $("#or_word").slice(0).val().split(" ").filter(String);
            search.filterDto.notWords = $("#not_word").slice(0).val().split(" ").filter(String);
            


            //show
			search.filterDto.categories = $('#filter-category').val();
            search.filterDto.sources = $('#filter-source').val();
            search.filterDto.media =  $('#filter-media').val();
            search.filterDto.tonalities =  $('#filter-tonality').val();
            
            search.filterDto.showPinned =  $('#filter-pinned').prop("checked");
            search.filterDto.showHidden = $('#filter-hidden').prop("checked");
            
            //order
            search.filterDto.orderBy = $('#filter-orderBy').val();
            search.filterDto.order = $('#filter-order').val();
            
            //date
            
            search.filterDto.today = $('#date-today').prop("checked");
            search.filterDto.fromDate = $('#filter-from').val();
            search.filterDto.toDate = $('#filter-to').val();
            
            //relative dates
            search.filterDto.fromDays = $('#from-days').val();
            search.filterDto.toDays = $('#to-days').val();

            search = this.setDefaultValues(search);

            if (index !== -1)
                this.settings.currentComparison.search_list[index] = search;
            else
                this.settings.currentComparison.search_list.push(search);
            
            return this.settings.currentComparison;
        },

        fillSearchData: function(element) {
            $("#search_name").slice(0).val((element.name) ? element.name : '');
            $("#and_word").slice(0).val((element.filterDto.andWords && element.filterDto.andWords.length > 0) ? element.filterDto.andWords.join(" ") : '');
            $("#or_word").slice(0).val((element.filterDto.orWords && element.filterDto.orWords.length > 0) ? element.filterDto.orWords.join(" ") : '');
            $("#not_word").slice(0).val((element.filterDto.notWords && element.filterDto.notWords.length > 0) ? element.filterDto.notWords.join(" ") : '');
            
            //fill categories
            $("#filter-category").multiselect('deselectAll', false);
            $("#filter-category").multiselect('select', (element.filterDto.categories && element.filterDto.categories.length > 0) ? element.filterDto.categories : []);
            

            $("#filter-source").multiselect('deselectAll', false);
            $("#filter-source").multiselect('select', (element.filterDto.sources && element.filterDto.sources.length > 0) ? element.filterDto.sources : []);

            $("#filter-media").multiselect('deselectAll', false);
            $("#filter-media").multiselect('select', (element.filterDto.media && element.filterDto.media.length > 0) ? element.filterDto.media : []);

            $("#filter-tonality").multiselect('deselectAll', false);
            $("#filter-tonality").multiselect('select', (element.filterDto.tonalities && element.filterDto.tonalities.length > 0) ? element.filterDto.tonalities : []);

            $("#filter-pinned").prop('checked', element.filterDto.showPinned);
            $("#filter-hidden").prop('checked', element.filterDto.showHidden);
            
            $("#filter-orderBy").val(element.filterDto.orderBy);
            $("#filter-orderBy").trigger('update.fs');
            
            $("#filter-order").val(element.filterDto.order);
            $("#filter-order").trigger('update.fs');

            $("#filter-from").val((element.filterDto.fromDate) ? element.filterDto.fromDate : '');
            $("#filter-to").val((element.filterDto.toDate) ? element.filterDto.toDate : '');
            $("#date-today").prop('checked', element.filterDto.today);

            $("#from-days").val((element.filterDto.fromDays) ? element.filterDto.fromDays : '');
            $("#to-days").val((element.filterDto.toDays) ? element.filterDto.toDays : '');
        },
        
        create: function() {
            Comparison.dialog();
        },
        
        compare: function(id) {
            Comparison.dialog(id);
        },

        sendComparison: function() {
            var comparison_name = $('#comparison_name').val();
            this.settings.currentComparison.comparison_name = comparison_name;
            
            
            $.ajax({
                'method': 'POST',
                'url' : base_url + "/api/analysis/",
                'data': JSON.stringify(this.settings.currentComparison),
                'contentType': "application/json",
                success : function(res) {
                    Comparison.settings.currentAnalysis.id = res;
                    localStorage.setItem("currentAnalysis",JSON.stringify(Comparison.settings.currentAnalysis));
                    window.location.replace(base_url+"/clippings/analysis/" + res + "/bar/reach.html");
                },
                error : function(err) {
                    console.log("Error: ",err);
                }
            })
            //window.location.replace(base_url+"/clippings/analysis/1/bar/reach.html");
            // window.location.replace(base_url+"/clippings/comparison.html/compare");
        },

        store: function() {
            Comparison.collectFieldValues();
            Comparison.updateCurrentComparison();
            
            window.location.replace(base_url+"/clippings/comparison.html");
        },

        empty: function() {
            this.settings.currentComparison.search_list = [];
            this.settings.currentAnalysis = {};
            Comparison.updateCurrentComparison();
        },
        
        clear: function() {
            Comparison.empty();
            window.location.replace(base_url);
        },
        
        updateCurrentComparison:function() {
            //LocalStorage Implementation since we will not store the partial searches.
            localStorage.setItem("currentComparison", JSON.stringify(this.settings.currentComparison));
            localStorage.setItem("currentAnalysis", JSON.stringify(this.settings.currentAnalysis));

            
        },
        
        editSearch: function(index) {
            var element = this.settings.currentComparison.search_list[index];
            console.log(element);
            if (element) {
                this.fillSearchData(element);
                $('header').addClass('advanced-search-open');
            }
        },

        editComparison: function() {
            window.location.replace(base_url+"/clippings/comparison.html");
        },
        
        removeSearch: function(index) {
            /*Modal.getConfirmDialog({
                text: "Are you sure?",
                callback: callback
            });
            */
            
            $("#searchAnalysisDeleteModal").modal('show');
            
            var self = this;
            function callback(){
                var element = self.settings.currentComparison.search_list[index];
                if (element) {
                    self.settings.currentComparison.search_list.splice(index, 1);
                    self.updateCurrentComparison();
                    location.reload();
                }
            }
            
            $(".btn-confirmDeleteAnalysisSearch").on('click',function(){
                callback();
            });

        },

        removeAnalysis: function(index) {
            Modal.getConfirmDialog({
                text: "Are you sure?",
                callback: callback
            });
            var self = this;
            function callback(){
                self.empty();
                $.ajax({
                    'method':'DELETE',
                    'url' : base_url + "/api/analysis/"+index,
                    'data': {},
                    success : function(res) {
                        console.log("Success: ",res);
                        window.location.replace(base_url);
                    },
                    error : function(err) {
                        console.log("Error: ",err);
                        alert("Error: ",err);
                    }
                });
            }
        },

        dialog:  function(id) {
            //cold be here the Dialog and the configuration
            if (id)
                $('#'+id).show();
            else
                $('#add_compare_box_modal').show();
    	},

        fillStorageData: function(){
            var currentComparison = this.settings.currentComparison;
            
            //reset content table
            $('#list_compare_search_content_tbody').html('');
            
            //fill rows
            if (currentComparison != null && currentComparison.search_list != null && currentComparison.search_list.length > 0){
                for (var i = currentComparison.search_list.length - 1; i >= 0; i--) {
                    $('#list_compare_search_content_tbody').append('<tr>');                
                        $('#list_compare_search_content_tbody').append('<td>'+ currentComparison.search_list[i].name +'</td>');
                        $('#list_compare_search_content_tbody').append('<td><div class="buttons_list_compare_search_table"><a class="btn advance-search-btn btn-icon-clean" onclick="Comparison.editSearch('+i+')" ><span class="icon icon-edit"></span></a><button class="btn btn-icon-clean" onclick="Comparison.removeSearch('+i+')"><span class="icon icon-trash"></span></button></div></td>');
                    $('#list_compare_search_content_tbody').append('</tr>');
                }
            } else {
                // no data to show
                window.location.replace(base_url+"/clippings/overview.html");
            }
        }
    };