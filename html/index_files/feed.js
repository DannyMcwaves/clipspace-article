window.numberOfSaved = 0;
window.addToFeeds = "";
$(function (){
    // ============================
    //  .......
    // ============================
    $('.feed-lists').on('click','.feed-link', function() {
        var url = $(this).data('url');
        var name = $(this).data('name');
        var count = $(this).data('count');
        var id = $(this).data('id');

        $(this).parents('ul').find('li').removeClass('active');
        $(this).parent('li').addClass('active');
        $('#feedGlobalCheck').prop('checked', false);

        loadFeedArticle(url,id,name,count)

    });

    
    // ============================
    //  Feed Quick share Drop Down
    // ============================
    $('.feedShareTrigger').on('click',function () {
		
        var trigger = $(this);
        var target = trigger.parents('.article-container').find('.shareDrop');
        var check = $(this).attr('data-switch');
        
        if(check != 'on'){
            trigger.attr('data-switch','on');
            trigger.addClass('active');
            target.addClass('open');
        } else {
            trigger.attr('data-switch','off');
            trigger.removeClass('active');
            target.removeClass('open');
        }
        
    });
    $(document).mouseup(function (e) {
        var trigger = $('.article-container').find('.feedShareTrigger');
        var target = $('.article-container').find('.shareDrop');
        var container = target;
        if (!container.is(e.target) // if the target of the click isn't the container...
            && container.has(e.target).length === 0) // ... nor a descendant of the container
        {
            trigger.attr('data-switch','off');
            trigger.removeClass('active');
            target.removeClass('open');
        }
    });

    
    // ============================
    //  Search Feed share Drop Down
    // ============================
    $('.search-feed-share-trigger').on('click',function () {
        var trigger = $(this);
        var target = trigger.parent('li').find('.shareDrop');
        var check = $(this).attr('data-switch');
        
        if(check != 'on'){
            trigger.attr('data-switch','on');
            trigger.addClass('active');
            target.addClass('open');
        } else {
            trigger.attr('data-switch','off');
            trigger.removeClass('active');
            target.removeClass('open');
        }
        
    });
    $(document).mouseup(function (e) {
        var trigger = $('.nav-right-buttons').find('.search-feed-share-trigger'); 
        var target = $('.nav-right-buttons').find('.shareDrop');
        var container = target;
        if (!container.is(e.target) // if the target of the click isn't the container...
            && container.has(e.target).length === 0) // ... nor a descendant of the container
        {
            trigger.attr('data-switch','off');
            trigger.removeClass('active');
            target.removeClass('open');
        }
    });



    // ============================
    //  Feed Quick check
    // ============================
    $('#feedGlobalCheck').on('change',function () {
		if ($(this).prop('checked')) {
            $('.feedSingleCheck').prop('checked', true);
        }
        else {
            $('.feedSingleCheck').prop('checked', false);
        }
    });

});

$(window).load(function () {
    var container = $('.feed-lists');
    container.find('ul').find('li:first-child').find('a').click();
});
// Save search
function savingSearch(clicked){
	
    var trigger = $(clicked);
    var content = trigger.parents('.front');
    var preview = trigger.parents('.shareDrop').find('.backend');
	var data = {};
	if ($("#searchName").val() == "") {
		$("#cancel").html("OK");
		$("#ok").hide();
		$("#modalMessage").html("Name can not be empty !!");
		$("#modalMessageDialog").modal("show");
		
	} else {
		data.name = $("#searchName").val();
		data.filterJsonString = filterJsonString;
		
		$.ajax({
			url:  base_url+ "/api/storedsearch/",
			data: JSON.stringify(data),
			contentType: "application/json",
			type: "PUT",
			success: function(result) {
				$("#quickDeleteSearchBtn").attr("search-id",result.key)
				$("#newSearchName").html(result.name);
				$("#newSearchUrl").val(result.url);
			}
		});
		content.hide();
		preview.fadeIn();
	}
}
function cancelSavingSearch(clicked){
    var trigger = $('.nav-right-buttons').find('.search-feed-share-trigger');
    var target = $('.nav-right-buttons').find('.shareDrop');
    trigger.attr('data-switch','off');
    trigger.removeClass('active');
    target.removeClass('open');
}
function closePreviewSavingSearch(clicked){
    var trigger = $(clicked);
    var content = trigger.parents('.backend');
    var preview = trigger.parents('.shareDrop').find('.front');
    content.hide();
    preview.fadeIn();
}
function loadFeedArticle(url,id,name,count) {
    $.ajax({
        type:"GET", url: url,
        error: function () {
        },
        success:function (output) {
            $('body').data('feed-id', id);
            /*$('.article-container .feed-name').text(name);
            $('.article-container .feed-count').text(parseInt(count) > 1 ? (count + ' articles') : (count + ' article'));
            $(".article-content").html(output);*/
            
            $('.article-container').html(output);
        }
    });
}

/**
 *
 */
infobarApp.feedManagement = infobarApp.feedManagement || {

        feedPage:               $(".feed-page"),

        saveFeedBar_element:    $(".save-feed-container"),
        globalBtnLink_element:  $(".global-btn-link"),
        saveFeedBar_closeBtn:   $(".btn-close-saveFeedBar"),
        feedDropdown_element:   $(".dropdown-feed-list"),
        AllFeedModal_element:   $("#feed-list-modal"),
        viewAllFeedModal_btn:   $("#btn-viewAllFeed"),
        feedSelect_element:     $('#feed-select-overview'),
        saveFeedForm_element:   $('#save-feed-form'),
        newFeedName_element:    $("#new-feed-name"),

        quickDelete_btn:        $("#quickDeleteFeedBtn"),
		quickDeleteSearch_btn:  $("#quickDeleteSearchBtn"),
        quickUndo_btn:          $("#quickUndoFeedBtn"),

        feedData:               {},


        /**
         * Initiate the FeedGaneration
         *
         */
        init: function(){

            this.prepare_events();
            // this.updateFeed();

        },


        prepare_events: function() {


            this.globalBtnLink_element.click(function(){
                infobarApp.feedManagement.toggle_saveFeedBar();
            });

            this.saveFeedBar_closeBtn.click(function(e){
                e.preventDefault();
                infobarApp.feedManagement.hide_saveFeedBar();
            });

            this.viewAllFeedModal_btn.click(function(){
                infobarApp.feedManagement.showAllFeedModal();
            });
			// get feeds, fill feedSelect_element, create multiselect
			
			// popular trick to access master object
			var ths = this;
			// if u are on feeds.html, create multiselect from feeds list, if not, collect from api
			if (window.location.href.indexOf("feeds.html") > -1) {
				$.each($("li[link-type='feed']"), function() {
					ths.feedSelect_element.append("<option value='" + $(this).find("a").attr("data-id") + "'>" + $(this).find("a").attr("data-name") + "</option>");
				});
				var options = {
					buttonWidth: '100%',
					maxHeight: 400,
					numberDisplayed: 5,
					onDropdownShow: function (event) {
						$('#feed-select-overview option[value="' + currentFeed+'"]').prop('disabled', true);
						$("#feed-select-overview").multiselect('destroy');
						$("#feed-select-overview").multiselect();
					},
					nonSelectedText: 'Select other feeds to add'
				};
				ths.feedSelect_element.multiselect({
					buttonWidth: '100%',
					maxHeight: 400,
					numberDisplayed: 5,
					onDropdownShow: function (event) {
					
						$.each($('#feed-select-overview').parent().find("ul").find("input"), function() {
							this.disabled = (this.value == currentFeed);
						});
					
					},
					nonSelectedText: 'Select other feeds to add'
				});
			} else {
				$.ajax({
					url: infobarApp.options.baseurl+'/api/outputfeeds/',
					type: "GET",
					contentType: "application/json",
					success: function(response) {
						$.each(response,function() {
							$("#feed-select-overview").append("<option value='" + this.id + "'>" + this.name + "</option>");
						});
						$("#feed-select-overview").multiselect({
							buttonWidth: '100%',
							maxHeight: 400,
							numberDisplayed: 5,
							nonSelectedText: 'Select other feeds to add'
						});
					},
					error : function() {
						alert('Unable to edit! Please try again.');
					}
				});
			}
			
		

            this.saveFeedForm_element.submit(function(e){
                e.preventDefault();
                infobarApp.feedManagement.saveFeed();
            });


            this.quickDelete_btn.click(function() {
                infobarApp.feedManagement.quickDelete();
            });
			
			this.quickDeleteSearch_btn.click(function() {
                infobarApp.feedManagement.quickDeleteSearch(false);
            });
            
			this.quickUndo_btn.click(function() {
                infobarApp.feedManagement.quickUndo();
            });


            this.AllFeedModal_element.on('click', '.btn-edit-feed', function(){
                var feedId = $(this).data('id');
                infobarApp.feedManagement.editFeed(feedId);
            });


            this.feedPage.on('click', '#btn-delete-feed',function(){
                infobarApp.feedManagement.showDeleteModal();
            });

            $(".btn-confirmDeleteFeed").click(function () {
                feedId = $("body").data('feed-id');
                infobarApp.feedManagement.api.deleteFeed(feedId, infobarApp.feedManagement.updateFeed);
            });

			$(".btn-confirmDeleteSearch").click(function () {
				infobarApp.feedManagement.api.deleteSearch(currentFeed, infobarApp.feedManagement.updateSearch);
            });

			$(".btn-confirmRename").click(function () {
				infobarApp.feedManagement.api.renameFeedOrSearch(currentFeed, infobarApp.feedManagement.refreshUI);
            });
			
            $("#main-container").on('click', '.removeArticle', function(){
                infobarApp.feedManagement.removeArticle($(this));
            });


            $("#main-container").on('click', '.undo-article-delete', function(){
                infobarApp.feedManagement.undoRemoveArticle($(this));
            });

            $("#main-container").on('click', '.hide-deleted-article', function(){
                infobarApp.feedManagement.hideRemovedArticle($(this));
            });



            // On event link type change
            $("#feed-link-type").change(function(){
                var type = $(this).val();
                infobarApp.feedManagement.__changeFeedUrlType(type);
            })

			$("#search-link-type").change(function(){
                var type = $(this).val();
                infobarApp.feedManagement.__changeSearchUrlType(type);
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

                    infobarApp.feedManagement.editFeed_network(feedId, {'name':newName}, function(response) {
                        infobarApp.feedManagement.updateFeed();
                    });

                };

            } else {
                editTr = containerTr.next();
            }


            containerTr.hide();
            editTr.show().find('input').focus();
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
            this.api.deleteFeed(feedId, function(response){
                infobarApp.feedManagement.updateFeed();
                $("#copy-container").hide();
                $("#undo-container").show();
            })
        },

		 quickDeleteSearch: function(showundo) {
            var feedId = this.quickDeleteSearch_btn.attr('search-id');
            this.api.deleteSearch(feedId, function(response){
                infobarApp.feedManagement.updateFeed();
				if (showundo) {
					$("#copy-container").hide();
					$("#undo-container").show();
				} else {
					$(".shareDrop").removeClass("open");
				}
            })
        },
		
        quickUndo: function() {
            var feedId = this.quickUndo_btn.attr('feed-id');
            this.undoDelete_network(feedId, function(response){
                $("#copy-container").show();
                $("#undo-container").hide();
            })
        },



        showDeleteModal: function() {
			if (currentType.indexOf("icon-search") == -1) {
				var feedId = $("body").data('feed-id');
				var containerTr = $(".feed-"+feedId);
				var feedName = containerTr.data('name');

				$("#deleteFeedData").text(feedName);
				$("#feedDeleteModal").modal('show');
			} else {
				$("#deleteSearchData").text(currentName);
				$("#searchDeleteModal").modal('show');
			}
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

		/* deprecated ???? when */
		// if page is feeds.html - we need to check all articles (checked/unchecked) and put/remove from  session
	  saveFeed: function() {
			numberOfSaved = 0;
			var feeds = "";
			var feeds = infobarApp.feedManagement.feedSelect_element.val();
			if (window.location.href.indexOf("feeds.html") > -1) {
				$.each($(".article-content").find(".btn.btn-icon.clipping-check-btn.action-margin"), function() {
					var artid =  $(this).parents(".post").eq(0).attr("data-id");
					if ($(this).hasClass("checked")) {
						infobarApp.article._onSelect(artid);
						numberOfSaved += 1;
					} else {
						infobarApp.article._onDeselect(artid);
					}
				});
			}
			if (window.location.href.indexOf("feeds.html") == -1 || feeds != "") {
				
				var newFeed = infobarApp.feedManagement.newFeedName_element.val();
				addToFeeds = newFeed;
				var data = {};

				if( newFeed != '' ) {
					data.newfeed = newFeed;
				}

				if( feeds ) {
					data.feeds = feeds;
				}
				if (window.location.href.indexOf("feeds.html") == -1) { 
					this._saveFeed_network(data, this._showNewFeedData);
				} else {
					this._saveFeed_network(data, addNewFeedFromFeed);
				}
			} else {
						
				var newFeed = infobarApp.feedManagement.newFeedName_element.val();
			
				var data = {};

				if( newFeed != '' ) {
					data.newfeed = newFeed;
				}
				this._saveFeed_network(data, addNewFeedFromFeed);
			}

        },


        _saveFeed_network: function(data, callback){
			addToFeeds = data.feeds;
			
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
                infobarApp.feedManagement.quickDelete_btn.attr('feed-id',data.id);
                infobarApp.feedManagement.quickUndo_btn.attr('feed-id',data.id);
                // Show feed data container
                $("#new-feed-data-container").show();
            } else {
                $("#feedSuccessBox").show();
            }

            infobarApp.feedManagement.updateFeed();

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



        __changeFeedUrlType: function(type) {
            var url = $("#newFeedUrl").val();
            url = url.substr(0, url.lastIndexOf(".")) + "." + type;
            $("#newFeedUrl").val(url);
        },

	   __changeSearchUrlType: function(type) {
            var url = $("#newSearchUrl").val();
            url = url.substr(0, url.lastIndexOf(".")) + "." + type;
		     $("#newSearchUrl").val(url);
        },






        updateFeed: function() {
			infobarApp.feedManagement._getFeedsFromNetwork(infobarApp.feedManagement._updateFeedUI);
        
		},
		 updateSearch: function() {
		    infobarApp.feedManagement._getFeedsFromNetwork(infobarApp.feedManagement._updateFeedUI);
        },
		refreshUI: function() {
			// refresh feed/ search name in frontend after is updatet in backend
			$("a[data-id='" + currentFeed + "']").find(".feed-name").html($("#newName").val());
			$(".section-header").find(".feed-data").find(".feed-name").html($("#newName").val());
			$("#renameModal").modal("hide");
		},
        _updateFeedUI: function(data) {
			try {
				$(".article-container").find(".feed-data").html("");
				var rmv = $("a[data-id='" + currentFeed + "']")[0].parentNode;
				rmv.parentNode.removeChild(rmv);
				$(".article-content").html("");
				if (currentType.indexOf("icon-search") == -1) {
					$('#feedDeleteModal').modal('hide');
				} else {
					$('#searchDeleteModal').modal('hide');
				}
			} catch (err) {
				
			}
          /*  var feedList = $('.feed-page').find('.feed-lists').find('ul');
            var feedContentList = $('.feed-page').find(".article-container").find(".article-content");
            feedList.empty();
            feedContentList.empty();

            for(x in data) {


                var className =  x == 0 ? 'active' : '';
                var feedListData = '<li class="'+className+'">'+
                                    '<a class="feed-link feed-'+data[x].id+'" href="javascript:;" data-url="'+infobarApp.options.baseurl+'/feedoverview/outputfeeds/'+data[x].id+'.html" data-count="'+data[x].count+'" data-name="'+data[x].name+'" data-id="'+data[x].id+'">'+
                                        '<span class="icon icon-list"></span>'+
                                        '<div class="feed-data">'+
                                            '<div class="feed-name">'+data[x].name+'</div>'+
                                            '<span>'+data[x].count+' articles</span>'+
                                        '</div>'+
                                    '</a>'+
                                   '</li>';

            }
            var url = infobarApp.options.baseurl+'/feedoverview/outputfeeds/'+data[0].id+'.html';
            feedList.html(feedListData);
            loadFeedArticle(url,data[0].id,data[0].name,data[0].count);*/
        },



        _getFeedsFromNetwork: function(successCallback) {
            $.ajax({
                url: infobarApp.options.baseurl+'/api/outputfeeds/',
                success: function(response) {
                    infobarApp.feedManagement.feedData = response;
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
             */
            markAllArticles: function(feedId) {

                $.ajax({
                    url: infobarApp.options.baseurl+'/api/outputfeeds/markall/'+feedId,
                    type: 'PUT',
                    success: function(response) {

                    },
                    error : function() {
                        
                    }
                });

            },

            /**
             * Delete feed
             *
             * @param feedId - Feed id to delete
             * @param callback - Success callback function
             */
            deleteFeed: function(feedId, callback) {
                $.ajax({
                    url: infobarApp.options.baseurl+'/api/outputfeeds/'+feedId,
                    type: "DELETE",
                    success: function(response) {
						console.log("1 " + response);
                        callback(response);
                    },
                    error : function() {
                        alert('Unable to delete! Please try again.');
                    }
                });
            },
			deleteSearch: function(feedId, callback) {
			
                $.ajax({
                    url: infobarApp.options.baseurl+'/api/storedsearch/'+feedId,
                    type: "DELETE",
                    success: function(response) {
						
					     callback(response);
                    },
                    error : function() {
                        alert('Unable to delete! Please try again.');
                    }
                });
            },
			renameFeedOrSearch: function(feedId, callback) {
			
				var data = {
					'name': $("#newName").val()
				};
				// detect feed or search
				if (currentType.indexOf("icon-search") > -1) {
					$.ajax({
						url: infobarApp.options.baseurl+'/api/storedsearch/'+feedId+ "?name=" + $("#newName").val(),
						type: "POST",
						contentType: "application/json",
						data: JSON.stringify(data),
						success: function(response) {
							 callback(response);
						},
						error : function() {
							alert('Unable to rename search! Please try again.');
						}
					});
				} else {
					
					$.ajax({
						url: infobarApp.options.baseurl+'/api/outputfeeds/'+feedId+ "?name=" + $("#newName").val(),
						type: "POST",
						contentType: "application/json",
						data: JSON.stringify(data),
						success: function(response) {
							 callback(response);
						},
						error : function() {
							alert('Unable to rename feed! Please try again.');
						}
					});
				}
            }

        },



        removeArticle: function(element) {

            $article = element.parents('.post');

            var articleId = $article.data('id');
            var feedId = $("body").data('feed-id');

            infobarApp.feedManagement.api.removeArticle(feedId, articleId, function(){
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

            infobarApp.feedManagement.api.addArticle(feedId, articleId, function(){
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
			var el = $("a[data-id='" +currentFeed+ "']")[0].parentNode;
			var $hrf = $(el).find("a"); 
			$hrf.attr("data-count", parseInt($hrf.attr("data-count")) - 1);
			var sp = $hrf.find(".feed-data").find("span");
			sp.html(parseInt(sp.html()) - 1);
			
			var sp = $(".article-container").find(".feed-count");
			sp.html((parseInt(sp.html()) - 1) + " articles");
			
			
        },




        showAllFeedModal: function() {
            this.AllFeedModal_element.modal('show');
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
        }

    };
	var tabs = new Array();
	function setCurrentType(target) {
		// remeber current feed / search status
		// save current to hidden div
		// if hidden dic exist, collect html and display.
		window.scrollTo(0, 0);
		if (window.currentFeed !== undefined) {
			if (!document.getElementById("container_" + window.currentFeed)) {
				var dv = document.createElement("DIV");
				dv.id = "container_" + window.currentFeed;
				dv.style.display = "none";
				document.body.appendChild(dv);
			} else {
				var dv = document.getElementById("container_" + window.currentFeed);
			}
			dv.innerHTML = $(".article-content").html();
			dv.setAttribute("currentPage", cP);
		}
	
		window.currentType = $(target).find("span").eq(0).attr("class");
		window.currentFeed = $(target).attr("data-id");
		window.currentName = $(target).attr("data-name");
		
		if (document.getElementById("container_" + window.currentFeed)) {
			cP = parseInt(document.getElementById("container_" +  $(target).attr("data-id")).getAttribute("currentpage"));
			setTimeout(function() {
				$(".article-content").html(document.getElementById("container_" + window.currentFeed).innerHTML);
			}, 1000);
		}
	}
	function checkVisibility(target) {
		
		// detect current - feed or search and depending on this hide or show checkboxes, delete option etc.
		// needs to be fired on every lazy load bcs new articles must be checked also
		// also status of genereal select (select all) will be implemented on new articles (new in list)
		 $("#feedSearchLinks").slideUp(200);
		if (currentType.indexOf("icon-search") > -1) {
			$(".post").find(".icon-trash").hide();
			$(".article-action").hide();
			$(".control.checkbox").hide();
			$(".article-content").find(".btn.btn-icon.clipping-check-btn.action-margin").hide();
			$('#feedGlobalCheck').unbind("click");
		} else {
			
			$(".article-content").find(".btn.btn-icon.clipping-check-btn.action-margin").show();
			$(".post").find(".icon-trash").show();
			$(".article-action").show();
			
			$('#feedGlobalCheck').unbind("click");
			
			$('#feedGlobalCheck').bind('click',function () {
				var globalCheck = this.checked;
				if (!globalCheck) {
					$(".article-content").find(".btn.btn-icon.clipping-check-btn.action-margin").removeClass("checked");
				} else {
					$(".article-content").find(".btn.btn-icon.clipping-check-btn.action-margin").addClass("checked");
				}
				$.each($(".article-content").find(".btn.btn-icon.clipping-check-btn.action-margin"),function() {
					
					this.checked = globalCheck;
					$(this).unbind("click");
					$(this).bind("click",function(e) {
						e.stopPropagation();
						e.preventDefault();
						infobarApp.article._onSelect($(this).parents(".post").eq(0).attr("data-id"));
						$('#feedGlobalCheck')[0].checked = false;
					});
				});
			});
			$(".control.checkbox").show();
		}
		prepareRenameFeed();
	}
	var cP = 0; 
	var scrollEnabled = true;
	$(document).ready(function() {
		new Clipboard('.copytoclipboard');
		
		var scrollTimeout = null;
		
		$(window).scroll(function(e) {
			/************************************************************************
			// set relative position for feeds list depending on scroll position
			// and is menu displayed on top 
			***************************************************************************/
			/**** font do scroll on every mose point. wait 300ms ... */
			
			if (scrollTimeout == null) {
				scrollTimeout = setTimeout(function() {
					doScroll();
				}, 300);
			} else {
				clearTimeout(scrollTimeout);
				scrollTimeout = null;
				scrollTimeout = setTimeout(function() {
					doScroll();
				}, 300);
			}
		});
		
	});
	function doScroll() {
		
			var win = $(window);
			if (!scrollEnabled) {
				return false;
			}
			var nav = $(".navbar.navbar-default")[0];
			try {
				var d = 120 - $(".global-action-bar.active")[0].offsetHeight;
			} catch (error) {
				var d = 120;
			}
			//console.log($("#articleContainer").is(':visible'));
			if ($(".feed-container").length > 0) {
			console.log($(".feed-container")[0]);
				//$(".feed-container")[0].style.top = (win.scrollTop() - ((win.scrollTop() > 120) ? d : 0)) + "px";
			}
			// lazy load next page
			if ($(document).height() - win.height() == win.scrollTop()) {
				setTimeout(function() {
						if (cP == -1) {
							cP += 1;
							return false;
						} else {
							cP += 1;
						}
						scrollEnabled = false;
						$.get(  base_url + "/feedoverview/" + ((currentType.indexOf("icon-search") > -1) ? "storedsearch/" : "outputfeeds/") + currentFeed + "/" + cP, function( data ) { 
							if (!document.getElementById("tempdiv")) {
								var dv = document.createElement("div");
								dv.id = "tempdiv";
								dv.style.display = "none";
								document.body.appendChild(dv);
								dv.innerHTML = data;
								scrollEnabled = true;
							} else {
								var dv = document.getElementById("tempdiv");
								dv.innerHTML = data;
								scrollEnabled = true;
							}
							
							
							$.each($(dv).children("div"), function() {
								$(".article-content").append($(this));
								if (document.getElementById("feedGlobalCheck").checked) {
									$(this).find(".btn.btn-icon.clipping-check-btn.action-margin").addClass("checked");
								}
								$.each($(dv).children("div"), function() {
									$(".article-content").append($(this));
									if (document.getElementById("feedGlobalCheck").checked) {
										$(this).find(".btn.btn-icon.clipping-check-btn.action-margin").addClass("checked");
									}
									$(this).find(".btn.btn-icon.clipping-check-btn.action-margin").bind("click",function(){
										document.getElementById("feedGlobalCheck").checked = false;
									});
								});
								checkVisibility();
							});
						});
				},100);
			}
			prepareRenameFeed();
			
	}
	function prepareRenameFeed() {
		
		$(".icon.icon-edit").unbind("click");
		$(".icon.icon-edit").bind("click", function() {
			renameFeed();
		});
		
	}
	function renameFeed() {
		
		$("#newName").val(currentName);
		$("#renameModal").modal("show");
	}
	function deleteSelectedArticles() {
		nbrchecked = 0;
		//  set question "Are u sure ..."
		var nbrchecked = $(".article-content").find(".btn.btn-icon.clipping-check-btn.action-margin.checked").length;
		if (nbrchecked == 0) {
			$("#modalMessage").html("No selected articles!");
			$("#ok").html("Close");
			$("#ok").show();
			$("#cancel").hide();
		} else {
			$("#modalMessage").html("Are u sure u wish to delete " +nbrchecked + " articles?");
			$("#ok").html("Cancel");
			$("#ok").show();
			$("#cancel").unbind("click");
			$("#cancel").bind("click", function() {
				continueDeleteArticles();
			});
			$("#cancel").html("Delete");
			$("#cancel").show();
		}
		// show dialog
		$("#modalMessageDialog").modal("show");
	}
	
	var articleIds = [];
	function continueDeleteArticles() {
		
		// find checked artcles and create array with article ids
		var $_checkedPost = $(".btn.btn-icon.clipping-check-btn.action-margin.checked");
		$.each($_checkedPost, function() {
			var $_parent = $(this).parents('.post');
			articleIds.push($_parent.attr("data-id"));
		});
		// call api delete
		$.ajax({
			url: infobarApp.options.baseurl+'/api/outputfeeds/'+ currentFeed + '/articles/' + articleIds.join(','),
			type:"DELETE",
			success:function() {
				$("#modalMessageDialog").modal("hide");
					$.each( $(".article-content").find(".btn.btn-icon.clipping-check-btn.action-margin.checked"), function() {
					var $_parent = $(this).parents('.post');
					$_parent[0].parentNode.removeChild($_parent[0]);
				});
				$.get($("a[data-id='" + currentFeed + "']").attr("data-url"),function(data) {
					$(".article-container").html(data);
					$sp = $("a[data-id='" + currentFeed + "']").find(".feed-data").find("span");
					$sp.html($(".feed-count").html());
					$sp.html($sp.html().replace("articles",""));
					window.scrollTo(0, 0);
					cP = 0;  
				});
			}
		});
	}
	
	function selectAllClicked (e) {
		// prevent open saveFeed dialog. Then check or uncheck feedGlobal check to avoid deep code changes
		// in select - deselec all functionality
		e.stopPropagation();
		if (!$(".article-action").find(".btn.btn-icon.clipping-check-btn.action-margin").hasClass("checked")) {
			$(".article-action").find(".btn.btn-icon.clipping-check-btn.action-margin")[0].className += " checked";
		} else {
			$(".article-action").find(".btn.btn-icon.clipping-check-btn.action-margin")[0].className = $(".article-action").find(".btn.btn-icon.clipping-check-btn.action-margin")[0].className.replace("checked","");
		}
		if ($(e.target).hasClass("btn")) {
			$('#feedGlobalCheck')[0].checked = $(e.target).hasClass("checked");
		} else {
		
			$('#feedGlobalCheck')[0].checked = $(e.target).parent().hasClass("checked");
		}
		var globalCheck = $('#feedGlobalCheck')[0].checked;
		if (!globalCheck) {
			$(".global-action-bar").removeClass("active");
			$(".article-action").find(".btn.btn-icon.clipping-check-btn.action-margin").removeClass("checked");
			$(".article-content").find(".btn.btn-icon.clipping-check-btn.action-margin").removeClass("checked");
		} else {
			$(".global-action-bar").addClass("active");
			$(".article-content").find(".btn.btn-icon.clipping-check-btn.action-margin").addClass("checked");
		}
		
	}

    function getNewSearchFeedUrl() {
        $elm = $("a[data-id='" + currentFeed + "']");
        var url = infobarApp.options.baseurl + "/api/" + ((currentType.indexOf("icon-search") == -1) ? "outputfeeds" : "storedsearch") + "/" + $elm.attr("data-id") + ".html";
        return url;
    }
    function redirect(url) {
        window.location.replace(url);
    }
	function quickShareFeedOrSearch(vl) {
	
		$elm = $("a[data-id='" + currentFeed + "']");
        var url = window.location.host + "" + infobarApp.options.baseurl + "/api/" + ((currentType.indexOf("icon-search") == -1) ? "outputfeeds" : "storedsearch") + "/" + $elm.attr("data-id") + ".html";
		$("#newSearchFeedName").html($elm.attr("data-name"));
		$("#newSearchFeedUrl").val(url);
   	    $("#feedSearchLinks").slideToggle(200);
	   
	}
	function linkSearchFeedChanged(vl) {
		if (vl !== undefined) {
				$("#newSearchFeedUrl").val(window.location.host + "" + infobarApp.options.baseurl + "/api/" + ((currentType.indexOf("icon-search") == -1) ? "outputfeeds" : "storedsearch") + "/" + $elm.attr("data-id") + "." + vl);
		}
		
	}
	// after savefeed, display feed on feeds.html
	function addNewFeed(response) {

		$.each(addToFeeds.split(","),function() {
			var el = $("a[data-id='" + this + "']")[0].parentNode.cloneNode(true);
			var hrf = $(el).find("a")[0]; 
			$(hrf.parenNode).removeClass("active");
			hrf.className = "feed-link feed-" + response.id;
			hrf.setAttribute("data-url", "http://localhost:8080/infobar/feedoverview/outputfeeds/" + response.id + ".html");
			hrf.setAttribute("data-id", response.id);
			hrf.setAttribute("data-name", response.name);
			hrf.setAttribute("data-count", numberOfSaved);
			$(hrf).find(".feed-name").html(response.name);
			$(hrf).find(".feed-data").find("span").html(numberOfSaved);
			$("a[data-id='" + currentFeed + "']")[0].parentNode.parentNode.appendChild(el);
			$("#newFeedName").html(response.name);
			$("#newFeedUrl").val(response.url);
			$("#feed-form-container").hide();
			$("#new-feed-data-container").show();
		});
	}
	// after addarticles, display feed on feeds.html
	function addNewFeedFromFeed (response) {
		/*$.each(addToFeeds, function() {
			var el = $("a[data-id='" +addToFeeds[0]+ "']")[0].parentNode;
			var $hrf = $(el).find("a"); 
			$hrf.attr("data-count", parseInt($hrf.attr("data-count")) + numberOfSaved);
			var sp = $hrf.find(".feed-data").find("span");
			sp.html(parseInt(sp.html()) + numberOfSaved);
		
		});*/
		window.location.reload();
	}
	function slideContent(elm) {
		if (viewport < 2) {
			$(elm).parent().find("div").eq(1).toggleClass("visible");
		}
	}
	function closeAllDialogs() {
	//	$("#saveSearchFeed").hide();
	//	$("#buttonsContainer").hide();
	}