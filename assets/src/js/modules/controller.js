// ------------------------------------
//
// Controller
//
// ------------------------------------



(function($) {

    if (typeof window.Controller == 'undefined') window.Controller = {};

    Controller = {

		editors: [],

        init: function() {

			// Create Editor
            this.createEditor();

			// Media Uploaded
            this.mediaUpload();

			// Remove Format for Paste
            // this.removeFormat();

        },

		createEditor() {

			$('[data-editable]').each(function(i) {

                var $this = $(this);

				// Wrap Editable Divs
				$this.attr('tabindex','0').wrapInner("<div data-editor></div>");

				// Set Text Align of Editor
				let alignment = $this.css('text-align');
				$this.attr('data-align',alignment);

				// Import Icons
				var icons = Quill.import('ui/icons');
				icons['bold'] = '<i class="icon -bold" aria-hidden="true">B</i>';
				icons['italic'] = '<i class="icon -italic" aria-hidden="true">I</i>';
				icons['underline'] = '<i class="icon -underline" aria-hidden="true">U</i>';
				icons['strike'] = '<i class="icon -strike" aria-hidden="true">S</i>';
				// icons['image'] = '<i class="icon -image" aria-hidden="true"></i>';

				let type = $this.data('editable');
				let placeholder = $this.data('placeholder');

				// Controller.editorDom(type);

				Controller.editorType(type,placeholder);

				// Controller.removeFormat($this);
                //
                // $this.on('paste', function (evt) {
                //     var clipboarddata =  window.event.clipboardData.getData('text/plain');
                //     console.log("paste value" + clipboarddata);
                // });

				// Controller.editors.push(editor);

			});

		},

		editorType(type,placeholder){

			if (!placeholder) {
				let placeholder = "Click to edit..."
			}

			switch(type){

				case 'wysiwyg':
					return Controller.buildWysiwyg(type,placeholder);
					return Controller.uploadButton();
					break;

				case 'text':
					return Controller.buildText(type,placeholder);
					break;

				case 'textarea':
					return Controller.buildTextarea(type,placeholder);
					break;

				default:
					break;


			}

		},

		buildWysiwyg(type,placeholder){

			var q =  new Quill('[data-editable="'+type+'"] > [data-editor]', {
				modules: {
					toolbar: [
						[{
							header: [1, 2, false]
						}],
						['bold', 'italic', 'underline', 'strike'],
						['blockquote', 'list'],
						// ['image', 'video']
					]
				},
				placeholder: placeholder,
				theme: 'snow',
				scrollingContainer: '[data-editable="'+type+'"]'
			});

            Controller.uploadButton($('[data-editable="wysiwyg"]'));

            return q;

		},

		uploadButton($addMedia){
            console.log('asf');

            $addMedia.each(function(i) {
                $(this).addClass('BOOM').find('.ql-toolbar').append('<span class="ql-formats"><button type="button" class="ql-media"><i class="icon -upload"></i></button></span>');
            });

        },

		buildTextarea(type,placeholder){

			return new Quill('[data-editable="'+type+'"] > [data-editor]', {
				modules: {
					toolbar: [
						['bold', 'italic'],
					]
				},
				placeholder: placeholder,
				theme: 'bubble'
			});

		},

		buildText(type,placeholder){
			$('[data-editable="'+type+'"]').attr('contentEditable', true);
			// Controller.preventFormat()
			Controller.clearFormat($('[contentEditable]'));
		},

		clearFormat(content) {

			content.on('blur', function() {
				console.log('asfasf');
				var $text = $(this).text();

				$(this).html($text);
			});

		},


		// -------------------------------
		// Add Media Upload Functionality
		// -------------------------------

		mediaUpload(){
			var file_frame; // variable for the wp.media file_frame

			// attach a click event (or whatever you want) to some element on your page
			$( '.ql-media' ).on( 'click', function( event ) {
                var $button = $(this);

		        // if the file_frame has already been created, just reuse it
				if ( file_frame ) {
					file_frame.open();
					return;
				}

				file_frame = wp.media.frames.file_frame = wp.media({
					title: $( this ).data( 'uploader_title' ),
					button: {
						text: $( this ).data( 'uploader_button_text' ),
					},
					multiple: false // set this to true for multiple file selection
				});

				file_frame.on( 'select', function() {
					var attachment = file_frame.state().get('selection').first().toJSON();

					// do something with the file here
					$button.closest('.ql-toolbar').next('.ql-container').find('.ql-editor').addClass('boom').append('<img src="'+attachment.url+'"/>');
				});

				file_frame.open();
			});
		},


    };

    module.exports = Controller;

})(jQuery);
