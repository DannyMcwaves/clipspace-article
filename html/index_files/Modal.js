;var Modal = {};

(function ($) {
    Modal.getConfirmDialog = function(options) {
      defaults = {
        title: 'Please Confirm',
        text: 'Please confirm your choice',
      btnYes: 'Yes',
      btnNo: 'No',
      width: 400,
        callback: function() {
          $(this).dialog('close');
        }
      }
    options = jQuery.extend(defaults, options);

        return $('<div id="confirm" title="' + options.title + '" style="display: none;">' + options.text + '</div>').appendTo("body").dialog({
            dialogClass: 'no-close audex-dialog',
            resizable: false,
            autoOpen: true,
            width: options.width,
            modal: true,
            buttons: {
                "No" : function() {
                    jQuery(this).dialog("close");
                },
                "Yes": options.callback
            },
            close: function() {
                jQuery(this).dialog("destroy").remove();
            }
        });
    }

})(jQuery);