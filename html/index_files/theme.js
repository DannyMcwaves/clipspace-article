window.viewport = "";
$(document).ready(function() {
	
	setViewport();
});
$(window).resize(function() {
	
	setViewport();
});
function setViewport() {
	if ($(window).width() < 768) {
		viewport = 0;
	}
	else if ($(window).width() >= 768 &&  $(window).width() <= 992) {
		viewport = 1;
	}
	else if ($(window).width() > 992 &&  $(window).width() <= 1200) {
	   viewport = 2;
	}
	else  {
	   viewport = 3;
	}
	// todo if viewport changed (resize screen)
	if (viewport > 1) {
		 $("#feedContainer").show();
	}
	if (viewport < 2) {
		$(".article-content").removeClass("visible");
	}
}



//datepicker disable enable function //
function datepicker_handle(valz) {

    var settings_value = $("#date_settings :selected").val();
    if (settings_value == "today") {
        $(".filter-date-picker").addClass('disabled');

        $("#filter-to").attr('disabled', 'disabled');
        $("#filter-from").attr('disabled', 'disabled');
    }
    else if (settings_value == "custom") {
        $(".filter-date-picker").removeClass('disabled');

        $("#filter-from").removeAttr('disabled');
        $("#filter-to").removeAttr('disabled');
    }

}


/**
 * set height for advanced search on smaller screen height
 */
function setAdvancedSearchHeight() {
    var windowHeight = $(window).height();
    if( windowHeight < 830 ) {
        $(".form-content").css({'overflow-y':'auto','height': (windowHeight-250)})
    } else {
        $(".form-content").css({'overflow-y':'','height': ''});
    }
}


$(function () {

    var search_keyword = '';
    var filter_json = {};


    // Enable tooltip
    $('[data-toggle="tooltip"]').tooltip({container: 'body',trigger : 'hover'});


    setAdvancedSearchHeight();


    // Enable media lightbox
    $("body").on( 'click', '.open-print', function(e){
        e.preventDefault();
        var postId = $(this).data('postid');
        $(".gallery-"+postId+" .print-item").colorbox({
        	rel:'gallery-'+postId,
        	open: true,
        	//photo: true,
        	width: '95%',
        	height: '85%',
            scalePhotos: false,/*
            onComplete: function(){
                $.colorbox.fitToPage();
            }*/
        });
    });


    // Play media
    $("body").on( 'click', '.play-media', function(e){
        e.preventDefault();

        var $post = $(this).parents('.post');

        var video = $post.find('.post-media-item');

        if (video[0].paused) {
            video[0].play();
        }
    })


    // get the original PDF
    $("body").on( 'click', '.print-pdf', function(e) {

        e.preventDefault();
        // Truong: make a ajax call to server
        var $data = $(this).data('pdf');
        $.colorbox({width: '90%',height: '80%', html:'<iframe width="100%" height="100%" src="'+base_url+'/api/clipping/pdf/original/'+$data+'" frameborder="0" allowfullscreen></iframe>'});

    })


    /**
     * All things to change when the browser screen changes
     */
    $( window ).resize(function() {
        // Set global action bar position
        //$(".global-action-bar").css({top:$(".header").outerHeight()});

        // set height for advanced search on smaller screen height
        setAdvancedSearchHeight()

    });

    /**
     * Get current pagination url
     * @param offset
     * @returns {string}
     */
    function getPaginationUrl (offset)
    {

        var pagination_url = base_url+"/api/clipping/articles/"+offset;

        if( currentPage == 'search' )
        {
            pagination_url = base_url+"/api/storedsearch/" + searchKey + "/" + offset;
        }
        else if( currentPage == 'filter' )
        {
        	pagination_url = base_url+"/api/clipping/filter/paging/" + offset + "?" + params;
        }
        else if (currentPage == 'feed') {
        	pagination_url = base_url+"/api/outputfeeds/" + feedId + "/" + offset;
        }
        /*else if( currentPage == 'feed' ) {
            pagination_url = base_url+"/api/clipping/feeds/paging/" + offset + "?" + params;
        }*/

        return pagination_url;
    }






    $(".default_select").click(function () {
        if ($(this).hasClass("select_active")) {
            $(this).removeClass('select_active');
            $(".selectoin_menu").hide();
        }
        else {
            $(this).addClass('select_active');
            $(this).closest(".pad_10").siblings(".selectoin_menu").show();
        }
    });
//selection edit function//


    /**
     * Expand Post
     */
$("#main-container").on('click', '.post-expand-btn, .btn-readmore', function(){
    var $post = $(this).parents('.post');
    var post_id = $post.data('id');
    var $expanded_post = $post.children('.expanded-post');
    var $collapsed_post = $post.children('.collapsed-post');
    console.log($expanded_post);

    // If full post wasn't loaded before
    // If expanded-post dom not found
    if( $expanded_post.length == 0 ) {

        var $expandButton = $post.find(".post-expand-btn");
        var $seeMoreContainer = $post.find('.see-more-container');

        $.ajax({
            type:"GET", url:base_url+"/api/clipping/full/"+post_id,
            beforeSend:function () {
                // Show loading animation at "See More" button
                $seeMoreContainer.children('button').hide();
                $seeMoreContainer.append('<div class="dot-spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');
                // Show loading animation at "Expand Icon/button"
                $expandButton.children('span').hide();
                $expandButton.append('<div class="spinner"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>');
            },
            complete:function () {
                $seeMoreContainer.children('.dot-spinner').remove();
                $seeMoreContainer.children('button').show();

                $expandButton.children('.spinner').remove();
                $expandButton.children('span').show();
            },
            success:function (output) {
                $expanded_post = $('<div class="expanded-post">'+output+'</div>');
                $post.append($expanded_post);
                $('select').not('select[multiple]').fancySelect();
                $('[data-toggle="tooltip"]').tooltip({container: 'body'});


                $collapsed_post.hide();
                $expanded_post.show(300);

                $('html, body').animate({
                    scrollTop: $post.offset().top
                }, 300);

            }
        });

    } else {
        $collapsed_post.hide();
        $expanded_post.show(300);

        $('html, body').animate({
            scrollTop: $post.offset().top
        }, 100);

    }


})


    /**
     * Collapse Post
     */
    $("#main-container").on('click', '.btn-collapse', function(){

            var $post = $(this).parents('.post');
            var post_id = $post.data('id');
            var $expanded_post = $post.children('.expanded-post');
            var $collapsed_post = $post.children('.collapsed-post');

            $expanded_post.hide(200, function(){
                $collapsed_post.show();
            });


        }
    );





//blog info image show back function//
    $(".active_clip").click(function () {
        $(this).hide();
        $(this).closest(".panel-body").children('.img-thumbnail').show();
        $(this).closest(".panel-body").children('.image_clipper').show();
    });
//blog info image show back function//


//comment add show function//
    $(".add_comment_bar").click(function () {
        $(this).hide();
        $(this).prev(".add_comment_container").show();
    });
//comment add show function//


//cancel comment functions//
    $(".cancel_comment").click(function () {
        $(this).closest(".add_comment_container").next(".add_comment_bar").show();

        $(this).closest(".add_comment_container").hide();
    });


    // Toggle filter form dropdown
    $(".btn-filter, .cancel-clips, .navbar-filter, .btn-filter-header").click(function(event){
        event.preventDefault();
        toggleFilterForm();
    });


    function toggleFilterForm(event)
    {
        var filterBtn = $(".btn-filter");

        var header = $(".header");

        if (header.hasClass("advanced-search-open")) {
            header.removeClass('advanced-search-open');
        }
        else {
            header.addClass('advanced-search-open');
        }
    }



    // Toggle advance search
    $(".advance-search-btn").click(
        function(e)
        {
            e.preventDefault();
            toggleFilterForm();
        }
    );


    function toggleGlobalActionBar()
    {
        if( !$(".global-action-bar").hasClass('active') ) {
            $(".global-action-bar").addClass('active');
        } else {
            $(".global-action-bar").removeClass('active');
        }
    }



    function showGlobalActionBar()
    {
        $(".global-action-bar").addClass('active');
    }


    function hideGlobalActionBar()
    {
        $(".global-action-bar").removeClass('active');
    }

    
    /* Generate classic pdf */
    $(".global-btn-pdf").click(
		function()
		{
			var url = base_url+"/api/clipping/pdf/file";
			if (currentPage == 'feed') {
				url = base_url+"/api/outputfeeds/clipping/pdf/" + feedId;
			}
			window.location = url;
		}
    )

    
    /* Generate feed pdf */
    /*$(".feed-btn-pdf").click(
    		function()
    		{
    			// Send the ajax request
    			$.ajax({
    				type: "GET",
    				url: base_url+"/api/outputfeeds/" + feedId + ".pdf",
    				success:function (output) {
    					
    				}
    			});
    			
    			
    		}
    )*/
    
    



    // Unselect all clippings
    //$("#unselect-all").click(
    //    function()
    //    {
    //
    //        $('input.clipping-checkbox').prop('checked', false);
    //        $('.clipping-check-btn').removeClass('checked');
    //
    //        hideGlobalActionBar();
    //
    //    }
    //);





    $("#filter-from").datepicker({ dateFormat: 'yy-mm-dd' });
    $("#filter-to").datepicker({ dateFormat: 'yy-mm-dd' });
    $('select').not('select[multiple]').fancySelect().on('change.fs', function() {
        $(this).trigger('change.$');
    });






    // Lazy load clippings
    var pageOffset = 1;
    var loadingInProgress = false;
    var ajaxPaginationComplete = false;
    var headerFixHeight = ($(".header").outerHeight() + $(".navbar-default").outerHeight() + 100 );
    var _isHeaderFixed = false;

    $(window).scroll(function() {

        // Show fixed header
        if( $(window).scrollTop() >= headerFixHeight && !_isHeaderFixed ) {
            $("body").addClass('fixedHeader').css('margin-top', $(".header").outerHeight()+52);
            $(".global-action-bar").css('top',$(".header").outerHeight());
            //$(".header").css('top', -150).animate({top: 0});

            _isHeaderFixed = true;
            $.event.trigger('header:fixed',[_isHeaderFixed]);

        } else if ( $(window).scrollTop() < headerFixHeight && _isHeaderFixed ) {
            $(".header").css({top: -150});
            $(".global-action-bar").css({top: -150});

            _isHeaderFixed = false;
            $.event.trigger('header:fixed',[_isHeaderFixed]);

        }

        if( $(window).scrollTop() <= $(".header").outerHeight()+100 ) {
            $(".header").css('top','');
            $(".global-action-bar").css('top',0);
            $("body").removeClass('fixedHeader').css('margin-top','');
        }

        if( currentPage == 'single' || currentPage == 'feed_overview' ) {
            return;
        }

        var contentLoadHeight = ($(document).height() - $(window).height())-200;
        // Lazy Load / ajax Pagination
        if( !ajaxPaginationComplete && $(window).scrollTop() >= contentLoadHeight && !loadingInProgress ) {

            loadingInProgress = true;
            // Send the ajax request
            $.ajax({
                type:"GET", url: getPaginationUrl(pageOffset),
                beforeSend:function () {

                    $(".footer").append('<div class="dot-spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');

                },
                complete:function () {

                },
                error: function () {
                    // Stop loading anymore content
                    ajaxPaginationComplete = true;
                    $(".footer").html('<div class="text-center">No more results!</div>');

                },
                success:function (output) {
                    $(".footer").html(' ');

                    $("#main-container").append(output);
                    $('select').not('select[multiple]').fancySelect();
                    $('[data-toggle="tooltip"]').tooltip({container: 'body'});

                    loadingInProgress = false;
                    pageOffset++;

                }
            });


        }
    });



    $("#reset-filter").click(function(e){
        //e.preventDefault();
        //resetFilter();
    })


    function resetFilter() {

        loadingInProgress = true;
        currentPage = 'default';

        // Send the ajax request
        $.ajax({
            type:"GET", url: getPaginationUrl(0),
            beforeSend:function () {

                $(".footer").append('<div class="dot-spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');

            },
            complete:function () {

            },
            error: function () {
                // Stop loading anymore content
                ajaxPaginationComplete = true;
                $(".footer").html('<div class="text-center">No more results!</div>');

            },
            success:function (output) {
                $(".footer").html(' ');

                $("#main-container").html(output);
                $('select').not('select[multiple]').fancySelect();

                loadingInProgress = false;
                pageOffset++;

            }
        });
    }


    


});

function tonality(postId, tonalityValue) {
	$.ajax({
        url: base_url+'/api/clipping/article/' + postId + '/' + tonalityValue,
        type: 'POST',
        success: function(response) {

            console.info(response);

        },
        error : function() {
            if( typeof errorCallback === 'function' ) {
                errorCallback();
            }
            console.info('loi');

        }
    });
}



var infobarApp = infobarApp || {

    options: {
        'baseurl': null,
        'params': null,
        'currentPage': null
    },

    init: function(options) {

        if (typeof options != 'undefined')
        {
            if (typeof options !== 'object') {
                options = jQuery.parseJSON(options);
            }
            this.mergeOptions(options);
        }

        infobarApp.feedManagement.init();
        infobarApp.search.init();
        infobarApp.article.init();
        infobarApp.init_header();
    },

    mergeOptions: function(options) {
        //delete options.layers;
        jQuery.extend( this.options, options );
    },

    init_header: function() {
        $("#btnLogout").click(function(e){
            e.preventDefault();
            $("#logoutPopup").modal('show');
        });
    }

};








infobarApp.articleSelection = infobarApp.articleSelection || {

    selectionMode: false,


    options: {
        onSelect: null,
        onDeselect: null,
        onDeselectAll: null
    },



    init: function(options) {

        if (typeof options != 'undefined')
        {
            if (typeof options !== 'object') {
                options = jQuery.parseJSON(options);
            }
            jQuery.extend( this.options, options );
        }

        this.prepare_events();
        this._checkSelection();

    },



    prepare_events: function() {

        $("#main-container").on('click', '.clipping-check-btn',function(){
            infobarApp.articleSelection._toggleSelection($(this));
        });

    },





    _toggleSelection: function(element) {

        if( !element.hasClass('checked') ) {
            this._select(element);
        } else {
            this._deselect(element);
        }

    },




    _select: function(element) {

        inputField  = element.find('input');
        articleId   = inputField.val();

        element.addClass('checked');
        inputField.prop('checked', true);

        infobarApp.articleSelection.selectionMode = true;

        if( typeof infobarApp.articleSelection.options.onSelect === 'function' ){
            infobarApp.articleSelection.options.onSelect(articleId);
        }

    },


    _deselect: function(element) {

        inputField  = element.find('input');
        articleId   = inputField.val();

        element.removeClass('checked');
        inputField.prop('checked', false);

        infobarApp.articleSelection._checkSelection();

        if( typeof infobarApp.articleSelection.options.onDeselect === 'function' ){
            infobarApp.articleSelection.options.onDeselect(articleId);
        }

    },


    _deselectAll: function() {

        $('input.clipping-checkbox').prop('checked', false);
        $('.clipping-check-btn').removeClass('checked');

        infobarApp.articleSelection.selectionMode = false;

    },


    _selectAll: function() {

        $('input.clipping-checkbox').prop('checked', true);
        $('.clipping-check-btn').addClass('checked');

        infobarApp.articleSelection.selectionMode = true;

    },


    _checkSelection: function() {

        isChecked = false;

        $('input.clipping-checkbox').each(
            function()
            {
                if ( $(this).is(":checked") ) {
                    isChecked = true;
                    return false;
                }
            }
        );

        return infobarApp.articleSelection.selectionMode = isChecked;

    }

};




infobarApp.article = infobarApp.article || {


    init: function() {
        this.prepare_events();
        this.updateGlobalActionBar();
    },


    prepare_events: function() {


        // Initializing article selection plugin
        infobarApp.articleSelection.init({
            onSelect: this._onSelect,
            onDeselect: this._onDeselect
        });

        $(".btn-selectAll").click(function(e){
            e.preventDefault();
            infobarApp.article.selectAll();
        });

        $("#unselect-all").click(function(){
            infobarApp.article.deselectAll();
        });
        this.initTonality();
        this.updateGlobalActionBar();

    },


    initTonality: function(){

        $("#main-container").on('click', '.positiveTonality, .negativeTonality', function(){
            $post = $(this).parents('.post');
            $negativeTonality = $post.find('.negativeTonality');
            $positiveTonality = $post.find('.positiveTonality');

            post_id  = $post.data('id');
            tonality = $post.data('tonality');

            // Already active, make it neutral
            if( $(this).hasClass('active') ) {
                $(this).removeClass('active');
                infobarApp.article.tonalityNetwork(post_id, 1)
            }
            // Not positive, make it positive
            else {
                $negativeTonality.removeClass('active');
                $positiveTonality.removeClass('active');
                $(this).addClass('active')

                if( $(this).hasClass('positiveTonality') ) {
                    infobarApp.article.tonalityNetwork(post_id, 2)
                } else {
                    infobarApp.article.tonalityNetwork(post_id, 0)
                }
            }
        });


    },


    tonalityNetwork: function(postId, tonalityValue) {
        $.ajax({
            url: infobarApp.options.baseurl+'/api/clipping/article/' + postId + '/' + tonalityValue,
            type: 'POST',
            success: function(response) {

                console.info(response);

            },
            error : function() {
                console.info('loi');

            }
        });
    },



    toggleSelection: function(element) {

        if( !element.hasClass('checked') ) {
            this.select(element);
        } else {
            this.deselect(element);
        }

        if( this.selectionMode ) {
            this.showGlobalActionBar();
        } else {
            this.hideGlobalActionBar();
        }

    },


    _onSelect: function(articleId) {

        $.ajax({
            url: infobarApp.options.baseurl+'/api/sessionClipboard/articles/'+articleId,
            type: 'PUT'
        });

        infobarApp.article.showGlobalActionBar();

    },

	_onMultipleSelect: function(selected,current) {
		this. _deseletAll_network();
		if (current === undefined) {
			current = 0;
		} else {
			current += 1;
			if (current > (selected.length - 1)) {
				return;
			}
		}
		this._fireSelect(selected,current);
		
	},
	_fireSelect:function(selected, current) {
		var ths = this;
		$.ajax({
            url: infobarApp.options.baseurl+'/api/sessionClipboard/articles/'+selected[current],
            type: 'PUT',
			success:function() {
				ths._onMultipleSelect(selected,current);
			}
        });
	},
	_onMultipleDeSelect: function(selected,current) {
		
		if (current === undefined) {
			current = 0;
		} else {
			current += 1;
			if (current > (selected.length - 1)) {
				return;
			}
		}
		this._fireDeSelect(selected,current);
		
	},
	_fireDeSelect:function(selected, current) {
		var ths = this;
		$.ajax({
            url: infobarApp.options.baseurl+'/api/sessionClipboard/articles/'+selected[current],
            type: 'DELETE',
			success:function() {
				ths._onMultipleDeSelect(selected,current);
			}
        });
	},
    _onDeselect: function(articleId) {

        if( !infobarApp.articleSelection.selectionMode ) {
            infobarApp.article.hideGlobalActionBar();
        }

        $.ajax({
            url: infobarApp.options.baseurl+'/api/sessionClipboard/articles/'+articleId,
            type: 'DELETE'
        });

    },



    deselectAll: function() {

        infobarApp.articleSelection._deselectAll()
        this._deseletAll_network();
        this.hideGlobalActionBar();

    },





   _deseletAll_network: function() {
       $.ajax({
           url: infobarApp.options.baseurl+'/api/sessionClipboard/articles',
           type: 'DELETE'
       });
   },

   selectAll: function() {

       infobarApp.articleSelection._selectAll()
       this._seletAll_network();
       this.updateGlobalActionBar();

   },
   

   _seletAll_network: function() {

       switch ( infobarApp.options.currentPage ) {
           case 'filter' :
               api_endpoint = 'sessionClipboard/articles/filter' + '?' + params;
               break;
           case 'feed' :
               api_endpoint = 'outputfeeds/markall/'+feedId;
               break;
           default:
               api_endpoint = 'sessionClipboard/articles';
       }


       $.ajax({
           url: infobarApp.options.baseurl + '/api/' + api_endpoint,
           type: 'PUT'
       });
   },


    updateGlobalActionBar: function() {
        if( infobarApp.articleSelection.selectionMode ) {
            this.showGlobalActionBar();
        }  else {
            this.hideGlobalActionBar();
        }
    },


    showGlobalActionBar: function ()  {
        $(".global-action-bar").addClass('active');
    },


    hideGlobalActionBar: function() {
        $(".global-action-bar").removeClass('active');
    }

};

/**
 *
 */
infobarApp.feedGeneration = infobarApp.feedGeneration || {

    saveFeedBar_element:    $(".save-feed-container"),
    saveAnalysisContainer:  $(".save-analysis-container"),
    globalBtnLink_element:  $(".global-btn-link"),
    globalBtnSaveAnalysis:  $(".globalBtnSaveAnalysis"),
    saveFeedBar_closeBtn:   $(".btn-close-saveFeedBar"),
    feedDropdownBtn:        $(".btn-feed"),
    feedDropdown_element:   $(".dropdown-feed-list"),
    AllFeedModal_element:   $("#feed-list-modal"),
    viewAllFeedModal_btn:   $("#btn-viewAllFeed"),
    feedSelect_element:     $('#feed-select'),
    saveFeedForm_element:   $('#save-feed-form'),
    newFeedName_element:    $("#new-feed-name"),

    quickDelete_btn:        $("#quickDeleteFeedBtn"),
    quickUndo_btn:          $("#quickUndoFeedBtn"),

    feedData:               {},


    /**
     * Initiate the FeedGaneration
     *
     */
    init: function(){

        this.prepare_events();
        this.updateFeed();

    },


    prepare_events: function() {


        this.globalBtnLink_element.click(function(){
            infobarApp.feedGeneration.toggle_saveFeedBar();
        });

        this.globalBtnSaveAnalysis.click(function(){
            infobarApp.feedGeneration.toggle_saveAnalysis();
        });

        this.saveFeedBar_closeBtn.click(function(e){
            e.preventDefault();
            infobarApp.feedGeneration.hide_saveFeedBar();
        });

        this.feedDropdownBtn.click(function(e){
            e.preventDefault();
            $(this).tooltip('hide');
            infobarApp.feedGeneration.toggle_feedDropdown();
        });

        this.viewAllFeedModal_btn.click(function(){
            infobarApp.feedGeneration.showAllFeedModal();
        });

        this.feedSelect_element.multiselect({
            buttonWidth: '100%',
            maxHeight: 400,
            numberDisplayed: 5,
            nonSelectedText: 'Select other feeds to add'
        });

        this.saveFeedForm_element.submit(function(e){
            e.preventDefault();
            infobarApp.feedGeneration.saveFeed();
        });


        $("#btn-copy-feed-url").click(function() {
            infobarApp.feedGeneration.copyFeedUrl();
        });


        this.quickDelete_btn.click(function() {
            infobarApp.feedGeneration.quickDelete();
        });

        this.quickUndo_btn.click(function() {
            infobarApp.feedGeneration.quickUndo();
        });


        this.AllFeedModal_element.on('click', '.btn-edit-feed', function(){
            var feedId = $(this).data('id');
            infobarApp.feedGeneration.editFeed(feedId);
        });


        this.AllFeedModal_element.on('click', '.btn-delete-feed',function(){
            var feedId = $(this).data('id');
            infobarApp.feedGeneration.deleteFeed(feedId);
        });



        $("#main-container").on('click', '.removeArticle', function(){
            infobarApp.feedGeneration.removeArticle($(this));
        });


        $("#main-container").on('click', '.undo-article-delete', function(){
            infobarApp.feedGeneration.undoRemoveArticle($(this));
        });

        $("#main-container").on('click', '.hide-deleted-article', function(){
            infobarApp.feedGeneration.hideRemovedArticle($(this));
        });



        // On event link type change
        $("#feed-link-type").change(function(){
            var type = $(this).val();
            infobarApp.feedGeneration.__changeFeedUrlType(type);
        })



    },



    editFeed: function(feedId) {

        var containerTr = $(".feed-"+feedId);

        if( containerTr.length == 0 ) {
            return;
        }

        if( !containerTr.next().is('.feedEdit-'+feedId) ) {

            var feedName = containerTr.data('name');

            // Create the edit element view
            var editTr = $('<tr>').addClass('feedItemEdit feedEdit-'+feedId).hide().append(
                $("<td>").append(
                    $("<form>").submit(function(e){
                        submitForm(feedId, e);
                    }).append(
                        $("<input>").attr('type','text').addClass('form-control').val(feedName)
                    )
                ),
                $("<td>").append(
                    $("<button>").addClass('btn btn-primary saveFeedEditBtn').append('Save')
                        .click(function(e){
                            submitForm(feedId, e);
                        }),
                    $("<button>").addClass('btn btn-link pull-right').css({'line-height':'25px'})
                        .click(function(){
                            $(this).parents('tr').hide().prev().show()
                        })
                        .append(
                        $("<span>").addClass('icon icon-close')
                    )
                )
            );

            // Insert the edit element into the dom, right after the related feed view.
            containerTr.after(
                editTr
            );


            function submitForm(feedId, event) {
                event.preventDefault();


                var input = editTr.find('input');
                var btn = editTr.find('.saveFeedEditBtn');

                var newName = input.val();
                btn.button('loading');
                input.prop('disabled', true);

                infobarApp.feedGeneration.editFeed_network(feedId, {'name':newName}, function(response) {
                    infobarApp.feedGeneration.updateFeed();
                });

            };

        } else {
            editTr = containerTr.next();
        }


        containerTr.hide();
        editTr.show().find('input').focus();

        console.log(containerTr);

    },


    editFeed_network : function(feedId, data, callback) {

        $.ajax({
            url: infobarApp.options.baseurl+'/api/outputfeeds/'+feedId,
            type: "POST",
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function(response) {
                callback(response);
            },
            error : function() {
                alert('Unable to edit! Please try again.');
            }
        });

    },



    quickDelete: function() {
        var feedId = this.quickDelete_btn.attr('feed-id');
        this.deleteFeed_network(feedId, function(response){
            infobarApp.feedGeneration.updateFeed();
            $("#copy-container").hide();
            $("#undo-container").show();
        })
    },


    quickUndo: function() {
        var feedId = this.quickUndo_btn.attr('feed-id');
        this.undoDelete_network(feedId, function(response){
            $("#copy-container").show();
            $("#undo-container").hide();
        })
    },



    deleteFeed: function(feedId) {

        var containerTr = $(".feed-"+feedId);
        var feedName = containerTr.data('name');

        var deleteConfirm = confirm('Are you sure you want to delete "'+feedName+'"?');

        if( deleteConfirm ) {
            this.deleteFeed_network(feedId, this.updateFeed);
        }

    },





    deleteFeed_network: function(feedId, callback) {
       $.ajax({
           url: infobarApp.options.baseurl+'/api/outputfeeds/'+feedId,
           type: "DELETE",
           success: function(response) {
               callback(response);
           },
           error : function() {
                alert('Unable to delete! Please try again.');
           }
       });
    },



    undoDelete_network: function(feedId, callback) {
        $.ajax({
            url: infobarApp.options.baseurl+'/api/outputfeeds/'+feedId,
            type: "PUT",
            success: function(response) {
                callback(response);
            },
            error : function() {
                alert('Unable to undo delete! Please try again.');
            }
        });
    },




    saveFeed: function() {

        var feeds = infobarApp.feedGeneration.feedSelect_element.val();
        var newFeed = infobarApp.feedGeneration.newFeedName_element.val();

        var data = {};

        if( newFeed != '' ) {
            data.newfeed = newFeed;
        }

        if( feeds ) {
            data.feeds = feeds;
        }

        this._saveFeed_network(data, this._showNewFeedData);

    },


    _saveFeed_network: function(data, callback){
        $.ajax({
            url: infobarApp.options.baseurl+'/api/outputfeeds/',
            data: JSON.stringify(data),
            contentType: "application/json",
            type: 'PUT',
            success: function(response){
                callback(response);
            },
            error: function(){
                alert('Something went wrong! Please refresh the page and try again.');
            }
        })
    },


    /**
     * Show newly created feed name/url
     *
     * @param data
     * @private
     */
    _showNewFeedData: function(data){

        // Hide Feed create form
        $("#feed-form-container").hide();

        if( !$.isEmptyObject(data) && data.id != null ){
            // Set new feed data
            $("#newFeedName").html(data.name);
            $("#newFeedUrl").val(data.url);
            infobarApp.feedGeneration.quickDelete_btn.attr('feed-id',data.id);
            infobarApp.feedGeneration.quickUndo_btn.attr('feed-id',data.id);
            // Show feed data container
            $("#new-feed-data-container").show();
        } else {
            $("#feedSuccessBox").show();
        }

        infobarApp.feedGeneration.updateFeed();

        infobarApp.articleSelection._deselectAll();


    },





    _resetSaveFeedBar: function(){

        this.newFeedName_element.val('');
        this.feedSelect_element.multiselect('deselectAll', false);
        this.feedSelect_element.multiselect('updateButtonText');

        $("#new-feed-data-container").hide();
        $("#feedSuccessBox").hide();

        $("#feed-form-container").show();

    },








    copyFeedUrl: function() {
        var url = $("#newFeedUrl").val();
        $("#newFeedUrl").select();

        var copySupported = document.queryCommandSupported('copy');

        if( copySupported ) {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copying text command was ' + msg);
        } else {
            key = "Ctrl+C";
            if( navigator.appVersion.indexOf("Mac")!=-1 ) {
                key = 'Command+C';
            }
            window.prompt("To copy the URL press: "+key+", Enter", url);
        }
    },





    __changeFeedUrlType: function(type) {
        var url = $("#newFeedUrl").val();

        url = url.substr(0, url.lastIndexOf(".")) + "." + type;

        $("#newFeedUrl").val(url);
    },







    updateFeed: function() {
        infobarApp.feedGeneration._getFeedsFromNetwork(infobarApp.feedGeneration._updateFeedUI);
    },


    _updateFeedUI: function(data) {

        var feedList = $(".feedDropDownList");
        var feedTable = infobarApp.feedGeneration.AllFeedModal_element.find('table');
        feedList.empty();
        feedTable.empty();
        infobarApp.feedGeneration.feedSelect_element.empty();

        for(x in data) {

            // Populate header feed dropdown list
            if( x < 5 ){

                feedList.append(
                    $('<li>').append(
                        $('<a>').attr('href',data[x].url).append(data[x].name)
                    ));
            }

            // Populate main feed manage (modal) data
            feedTable.append(
                $('<tr>').addClass('feedItemView feed-'+data[x].id).attr('data-name',data[x].name).append(
                    $('<td>').addClass('feed-data').append(
                        $('<a>').attr('href',data[x].url).append(
                            $('<h2>').append(data[x].name)
                        ),
                        $('<span>').append(data[x].count+' articles')
                    ),
                    $('<td>').addClass('feed-buttons').append(

                        '<button data-id="'+data[x].id+'" class="btn btn-icon btn-icon-clean btn-delete-feed">'+
                            '<span class="icon icon-trash"></span>'+
                        '</button>'+
                        '<button data-id="'+data[x].id+'" class="btn btn-icon btn-icon-clean btn-edit-feed">' +
                            '<span class="icon icon-edit"></span>' +
                        '</button>'

                    )
                )
            );

            // Populate save feed bar feed select field
            infobarApp.feedGeneration.feedSelect_element.append(
                $('<option>', {
                    value: data[x].id,
                    text: data[x].name
                })
            );

        }

        infobarApp.feedGeneration.feedSelect_element.multiselect('rebuild');

    },



    _getFeedsFromNetwork: function(successCallback) {
        $.ajax({
            url: infobarApp.options.baseurl+'/api/outputfeeds/',
            success: function(response) {
                infobarApp.feedGeneration.feedData = response;
                successCallback(response);
            },
            error : function() {

            }
        });
    },


    api: {

        /**
         * Remove article from feed
         *
         * @param feedId - Feed ID where the article will be removed from
         * @param articleId - The id of the article which will be removed
         * @param successCallback - CallBack function which will be called on successful article remove
         * @param errorCallback - CallBack function which will be called on any error
         */
        removeArticle: function(feedId, articleId, successCallback, errorCallback) {

            $.ajax({
                url: infobarApp.options.baseurl+'/api/outputfeeds/'+feedId+'/'+articleId,
                type: 'DELETE',
                success: function(response) {

                    if( typeof successCallback === 'function' ) {
                        successCallback(response);
                    }

                },
                error : function() {
                    if( typeof errorCallback === 'function' ) {
                        errorCallback();
                    }

                }
            });

        },



        /**
         * Add article into feed
         *
         * @param feedId - Feed ID where the article will be added
         * @param articleId - The id of the article which will be added
         * @param successCallback - CallBack function which will be called on successful article addition
         * @param errorCallback - CallBack function which will be called on any error
         */
        addArticle: function(feedId, articleId, successCallback, errorCallback) {

            $.ajax({
                url: infobarApp.options.baseurl+'/api/outputfeeds/'+feedId+'/'+articleId,
                type: 'PUT',
                success: function(response) {

                    if( typeof successCallback === 'function' ) {
                        successCallback(response);
                    }

                },
                error : function() {
                    if( typeof errorCallback === 'function' ) {
                        errorCallback();
                    }

                }
            });

        },
        
        
        
        /**
         * mark all articles of feed
         *
         * @param feedId - Feed ID where the article will be added
         * @param articleId - The id of the article which will be added
         * @param successCallback - CallBack function which will be called on successful article addition
         * @param errorCallback - CallBack function which will be called on any error
         */
        markAllArticles: function(feedId) {

            $.ajax({
                url: infobarApp.options.baseurl+'/api/outputfeeds/markall/'+feedId,
                type: 'PUT',
                success: function(response) {

                    console.log('ok');

                },
                error : function() {
                	console.log('error');
                }
            });

        }


    },



    removeArticle: function(element) {

        $article = element.parents('.post');

        var articleId = $article.data('id');
        var feedId = $("body").data('feed-id');

        infobarApp.feedGeneration.api.removeArticle(feedId, articleId, function(){
            element.hide();
            $article.find('.deleteOverlay').show();
        }, function(){
            alert('Something went wrong! Please try again');
        });

    },


    undoRemoveArticle: function(element) {

        $article = element.parents('.post');

        var articleId = $article.data('id');
        var feedId = $("body").data('feed-id');

        infobarApp.feedGeneration.api.addArticle(feedId, articleId, function(){
            $article.find('.deleteOverlay').hide();
            $article.find('.removeArticle').show();
        }, function(){
            alert('Something went wrong! Please try again');
        });

    },



    hideRemovedArticle: function(element) {
        $article = element.parents('.post').slideUp(400,function(){
            $(this).remove();
        });
    },




        showAllFeedModal: function() {
        this.AllFeedModal_element.modal('show');
    },


    toggle_feedDropdown: function() {
        if( this.feedDropdownBtn.hasClass('active') )  {
            this.hide_feedDropdown();
        } else {
            this.show_feedDropdown();
        }
    },


    show_feedDropdown: function() {
        this.feedDropdownBtn.addClass('active');
        this.feedDropdown_element.show();
    },


    hide_feedDropdown: function() {
        this.feedDropdownBtn.removeClass('active');
        this.feedDropdown_element.hide();
    },


    toggle_saveFeedBar: function() {
        if( this.globalBtnLink_element.hasClass('active') ) {
            this.hide_saveFeedBar();
        }  else {
            this.show_saveFeedBar();
        }
    },


    show_saveFeedBar: function() {
        this.globalBtnLink_element.addClass('active');
        this.saveFeedBar_element.show();
    },

    hide_saveFeedBar: function() {
        this.globalBtnLink_element.removeClass('active');
        this.saveFeedBar_element.hide();
        this._resetSaveFeedBar();
        infobarApp.article.updateGlobalActionBar();
    },

    toggle_saveAnalysis: function() {
        if( this.globalBtnSaveAnalysis.hasClass('active') ) {
            this.hide_saveAnalysis();
        }  else {
            this.show_saveAnalysis();
        }
    },


    show_saveAnalysis: function() {
        this.globalBtnSaveAnalysis.addClass('active');
        this.saveAnalysisContainer.show();
    },

    hide_saveAnalysis: function() {
        this.globalBtnSaveAnalysis.removeClass('active');
        this.saveAnalysisContainer.hide();
    }

};