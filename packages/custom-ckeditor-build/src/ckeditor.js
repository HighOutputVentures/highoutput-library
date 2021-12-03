/**
 * @license Copyright (c) 2014-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor.js';
import BalloonEditorBase from '@ckeditor/ckeditor5-editor-balloon/src/ballooneditor.js';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment.js';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat.js';
import Autolink from '@ckeditor/ckeditor5-link/src/autolink.js';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote.js';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold.js';
import Code from '@ckeditor/ckeditor5-basic-styles/src/code.js';
import CodeBlock from '@ckeditor/ckeditor5-code-block/src/codeblock.js';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials.js';
import Heading from '@ckeditor/ckeditor5-heading/src/heading.js';
import HorizontalLine from '@ckeditor/ckeditor5-horizontal-line/src/horizontalline.js';
import Image from '@ckeditor/ckeditor5-image/src/image.js';
import ImageInsert from '@ckeditor/ckeditor5-image/src/imageinsert.js';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload.js';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic.js';
import Link from '@ckeditor/ckeditor5-link/src/link.js';
import List from '@ckeditor/ckeditor5-list/src/list.js';
import ListStyle from '@ckeditor/ckeditor5-list/src/liststyle.js';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed.js';
import Mention from '@ckeditor/ckeditor5-mention/src/mention.js';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph.js';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough.js';
import TodoList from '@ckeditor/ckeditor5-list/src/todolist';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline.js';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation.js';
import S3Upload from 'ckeditor5-sss-upload/src/s3upload'
import Video from '@visao/ckeditor5-video/src/video'
import VideoUpload from '@visao/ckeditor5-video/src/videoupload'

const BALLOON_EDITOR_PLUGINS = [
	Autolink,
	Essentials,
	Link,
	Paragraph,
]

class ClassicEditor extends ClassicEditorBase { }
class BalloonEditor extends BalloonEditorBase { }

// Plugins to include in the build.
ClassicEditor.builtinPlugins = [
	Autoformat,
	BlockQuote,
	Bold,
	Code,
	CodeBlock,
	Heading,
	HorizontalLine,
	Image,
	ImageInsert,
	Italic,
	List,
	PasteFromOffice,
	Strikethrough,
	Underline,
	TextTransformation,
	MediaEmbed,
	Alignment,
	...BALLOON_EDITOR_PLUGINS,
];

BalloonEditor.builtinPlugins = BALLOON_EDITOR_PLUGINS

export default {
	ClassicEditor,
	BalloonEditor,
	Mention,
	TodoList,
	S3Upload,
	ListStyle,
	ImageUpload,
	Video,
	VideoUpload,
};