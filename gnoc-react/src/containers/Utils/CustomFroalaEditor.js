import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate, Trans } from 'react-i18next';
import { Label } from 'reactstrap';
import { AvGroup, AvInput, AvFeedback} from 'availity-reactstrap-validation';
import { convertModelFroalaEditor, renderRequired } from './Utils';
import Config from './../../config';
// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min.js';

// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

// Require Font Awesome.
import 'font-awesome/css/font-awesome.css';

import FroalaEditor from 'react-froala-wysiwyg';

// Include special components if required.
// import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';
// import FroalaEditorA from 'react-froala-wysiwyg/FroalaEditorA';
// import FroalaEditorButton from 'react-froala-wysiwyg/FroalaEditorButton';
// import FroalaEditorImg from 'react-froala-wysiwyg/FroalaEditorImg';
// import FroalaEditorInput from 'react-froala-wysiwyg/FroalaEditorInput';
import $ from 'jquery'; window.$ = $;

class CustomFroalaEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            
        };
    }

    render() {
        let valueInputHidden;
        if (this.props.model && this.props.model !== "") {
            let valueInput = convertModelFroalaEditor(this.props.model);
            if (valueInput !== "") {
                valueInputHidden = "value";
            }
        }
        return (
            <AvGroup>
                <Label>{this.props.label}</Label>
                {this.props.isRequired ? renderRequired : null}
                <AvInput type={"hidden"} name={"custom-input-" + this.props.name} value={valueInputHidden || ""} placeholder={""} required={this.props.isRequired}/>
                <FroalaEditor
                    tag='textarea'
                    config={{
                        placeholderText: "", //this.props.placeholder,
                        charCounterCount: false,
                        quickInsertTags: [],
                        entities: '&quot;&#39;&iexcl;&cent;&pound;&curren;&yen;&brvbar;&sect;&uml;&copy;&ordf;&laquo;&not;&shy;&reg;&macr;&deg;&plusmn;&sup2;&sup3;&acute;&micro;&para;&middot;&cedil;&sup1;&ordm;&raquo;&frac14;&frac12;&frac34;&iquest;&OElig;&oelig;&Scaron;&scaron;&Yuml;&fnof;&circ;&tilde;&Alpha;&Beta;&Gamma;&Delta;&Epsilon;&Zeta;&Eta;&Theta;&Iota;&Kappa;&Lambda;&Mu;&Nu;&Xi;&Omicron;&Pi;&Rho;&Sigma;&Tau;&Upsilon;&Phi;&Chi;&Psi;&Omega;&alpha;&beta;&gamma;&delta;&epsilon;&zeta;&eta;&theta;&iota;&kappa;&lambda;&mu;&nu;&xi;&omicron;&pi;&rho;&sigmaf;&sigma;&tau;&upsilon;&phi;&chi;&psi;&omega;&thetasym;&upsih;&piv;&ensp;&emsp;&thinsp;&zwnj;&zwj;&lrm;&rlm;&ndash;&mdash;&lsquo;&rsquo;&sbquo;&ldquo;&rdquo;&bdquo;&dagger;&Dagger;&bull;&hellip;&permil;&prime;&Prime;&lsaquo;&rsaquo;&oline;&frasl;&euro;&image;&weierp;&real;&trade;&alefsym;&larr;&uarr;&rarr;&darr;&harr;&crarr;&lArr;&uArr;&rArr;&dArr;&hArr;&forall;&part;&exist;&empty;&nabla;&isin;&notin;&ni;&prod;&sum;&minus;&lowast;&radic;&prop;&infin;&ang;&and;&or;&cap;&cup;&int;&there4;&sim;&cong;&asymp;&ne;&equiv;&le;&ge;&sub;&sup;&nsub;&sube;&supe;&oplus;&otimes;&perp;&sdot;&lceil;&rceil;&lfloor;&rfloor;&lang;&rang;&loz;&spades;&clubs;&hearts;&diams;',

                        // Image Upload
                        // Set the image upload parameter.
                        imageUploadParam: 'file',
                        // Set the image upload URL.
                        imageUploadURL: Config.apiUrl + '/common-stream-service/upload/onUpload',
                        // Additional upload params.
                        imageUploadParams: {url: encodeURIComponent(Config.apiUrl + '/common-stream-service/upload/onDownloadByPath')},
                        // Set request type.
                        imageUploadMethod: 'POST',
                        // Set max image size to 5MB.
                        imageMaxSize: 5 * 1024 * 1024,
                        // Allow to upload JPEG, PNG and JPG.
                        imageAllowedTypes: ['jpeg', 'jpg', 'png', 'gif', 'webp'],

                        // Video Upload
                        // Set the video upload parameter.
                        videoUploadParam: 'file',
                        // Set the video upload URL.
                        videoUploadURL: Config.apiUrl + '/common-stream-service/upload/onUpload',
                        // Additional upload params.
                        videoUploadParams: {url: encodeURIComponent(Config.apiUrl + '/common-stream-service/upload/onDownloadByPath')},
                        // Set request type.
                        videoUploadMethod: 'POST',
                        // Set max video size to 50MB.
                        videoMaxSize: 50 * 1024 * 1024,
                        // Allow to upload MP4, WEBM and OGG
                        videoAllowedTypes: ['mp4', 'webm', 'ogg'],

                        // File Upload
                        // Set the file upload parameter.
                        fileUploadParam: 'file',
                        // Set the file upload URL.
                        fileUploadURL: Config.apiUrl + '/common-stream-service/upload/onUpload',
                        // Additional upload params.
                        fileUploadParams: {url: encodeURIComponent(Config.apiUrl + '/common-stream-service/upload/onDownloadByPath')},
                        // Set request type.
                        fileUploadMethod: 'POST',
                        // Set max file size to 20MB.
                        fileMaxSize: 20 * 1024 * 1024,
                        // Allow to upload any file.
                        fileAllowedTypes: ['*'],
                        events: {
                            // Image Upload
                            'froalaEditor.image.removed': function (e, editor, $img) {
                                const currentUrl = $img[0].currentSrc;
                                const filePath = currentUrl.split("?path=")[1];
                                var xhttp = new XMLHttpRequest();
                                xhttp.onreadystatechange = function() {
                                    // Image was removed.
                                    if (this.readyState === 4 && this.status === 200) {
                                        console.log ('image was deleted');
                                    }
                                };
                                xhttp.open("GET", Config.apiUrl + '/common-stream-service/upload/onDeleteByPath?path=' + filePath, true);
                                xhttp.send(JSON.stringify({
                                    src: $img.attr('src')
                                }));
                            },

                            // Video Upload
                            'froalaEditor.video.removed': function (e, editor, $video) {
                                const currentUrl = $video[0].currentSrc;
                                const filePath = currentUrl.split("?path=")[1];
                                var xhttp = new XMLHttpRequest();
                                xhttp.onreadystatechange = function() {
                                    // Image was removed.
                                    if (this.readyState === 4 && this.status === 200) {
                                        console.log ('file was deleted');
                                    }
                                };
                                xhttp.open("GET", Config.apiUrl + '/common-stream-service/upload/onDeleteByPath?path=' + filePath, true);
                                xhttp.send(JSON.stringify({
                                    src: $video.attr('src')
                                }));
                            },

                            // File Upload
                            'froalaEditor.file.unlink': function (e, editor, file) {
                                const currentUrl = file.getAttribute('href');
                                const filePath = currentUrl.split("?path=")[1];
                                var xhttp = new XMLHttpRequest();
                                xhttp.onreadystatechange = function() {
                                    // Image was removed.
                                    if (this.readyState === 4 && this.status === 200) {
                                        console.log ('video was deleted');
                                    }
                                };
                                xhttp.open("GET", Config.apiUrl + '/common-stream-service/upload/onDeleteByPath?path=' + filePath, true);
                                xhttp.send(JSON.stringify({
                                    src: file.getAttribute('href')
                                }));
                            },

                            //Setting All
                            'froalaEditor.initialized': (e, editor) => {
                                editor.toolbar.hide();
                                if (this.props.isDisabled) {
                                    editor.edit.off();
                                }
                            },
                            'froalaEditor.focus': (e, editor) => {
                                editor.toolbar.show();
                            },
                            'froalaEditor.blur': (e, editor) => {
                                editor.toolbar.hide();
                            },
                        }
                    }}
                    model={this.props.model}
                    onModelChange={this.props.handleModelChange}
                />
                <AvFeedback>{this.props.messageRequire}</AvFeedback>
            </AvGroup>
        );
    }
}

CustomFroalaEditor.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    isRequired: PropTypes.bool.isRequired,
    messageRequire: PropTypes.string,
    model: PropTypes.string,
    handleModelChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    isDisabled: PropTypes.bool
};

export default translate()(CustomFroalaEditor);