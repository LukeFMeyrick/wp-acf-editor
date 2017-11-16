<?php

/**
 *
 * @wordpress-plugin
 * Plugin Name: WP Frontend ACF Editor
 * Description: A Frontend Editor for Wordpress and ACF Flexible Layout
 * Author: Paul Joseph Cox
 * Version: 1.0
 * Author URI: http://pauljosephcox.com/
 */



if (!defined('ABSPATH')) exit;

/**
 * Main WP_ACF_Editor Class
 *
 * @class Split_Screen
 * @version 0.1
 */
class WP_ACF_Editor {

	public $errors = false;
	public $notices = false;
	public $slug = 'wp-acf-editor';

	function __construct() {

		$this->path = plugin_dir_path(__FILE__);
		$this->folder = basename($this->path);
		$this->dir = plugin_dir_url(__FILE__);
		$this->version = '1.0.0';

		$this->errors = false;
		$this->notice = false;

		// Actions
		add_action('wp_enqueue_scripts', array($this,'scripts'),11,1);
		add_action('parse_request', array($this,'router'));
		add_action('wp_footer', array($this,'render'));
		add_shortcode('frontend-button', array($this,'frontend_shortcode'));

	}

	public function is_admin(){

		if( !current_user_can('editor') && !current_user_can('administrator') ) return false;
		return true;

	}

	/**
	 * Include Styles and Functionality
	 * @return null
	 */

	public function scripts() {

		// Guard administrators
		if( !$this->is_admin() ) return;


		// Include Quill
		wp_enqueue_script('quill','//cdn.quilljs.com/1.3.4/quill.js',null,$this->version, false);

		// Include Quill Bubble Styles
		wp_enqueue_style('bubble', '//cdn.quilljs.com/1.3.4/quill.bubble.css',null,$this->version);

		// Include Quill Snow Styles
		// wp_enqueue_style('snow', '//cdn.quilljs.com/1.3.4/quill.snow.css',null,$this->version);

		// Add Media Uploader
		wp_enqueue_media();

		// Include Dependencies
		wp_enqueue_style('wp_flexible_layout_editor', $this->dir .'assets/dist/css/site.min.css',null,$this->version);
		wp_enqueue_script('wp_flexible_layout_editor', $this->dir.'assets/dist/js/site.js', null, $this->version,true);

	}

	function frontend_shortcode( $args ) {
		// check if user can upload files
		if ( current_user_can( 'upload_files' ) ) {
			$str = __( 'Select File', 'frontend-media' );
			return '<input id="frontend-button" type="button" value="' . $str . '" class="button" style="position: relative; z-index: 1;"><img id="frontend-image" />';
		}
		return __( 'Please Login To Upload', 'frontend-media' );
	}

	/**
	 * Router
	 * @param OBJ $wp
	 * @return null
	 */

	public function router($wp) {

		$pagename = (isset($wp->query_vars['pagename'])) ? $wp->query_vars['pagename'] : $wp->request;

		switch ($pagename) {

			case 'api/editor/save':
				$this->save($_POST);
				break;

			default:
				break;

		}

	}

	public function render(){

		if( !$this->is_admin() ) return;

		include($this->path . 'templates/editor.php');

	}

	public function save($vars){

		if(!$this->is_admin()) return;

		foreach($vars['acf'] as $key=>$value){

			// TODO: Make work with rows
			if(!strstr($key, 'row')) update_post_meta($vars['postid'],$key,$value);

		}

		echo json_encode(array('success'=>true));
		die;


	}


}


// ------------------------------------
// Go
// ------------------------------------

$wp_acf_editor = new WP_ACF_Editor();

// function admin_edit($type, $dom, $placeholder, $wrap=null) {
//     //
// 	// if (!is_admin()) return;
//     //
// 	// if (!$dom) $dom = 'div';
// 	// if (!$wrap) $wrap = $dom;
// 	// if (!$placeholder) $placeholder = 'Edit this...';
//     //
// 	// echo '>' . '<' . $dom . ' data-editable=' . $type . ' data-placeholder=' . $placeholder . '></' . $dom . '></' . $wrap . '>';
//
// }
