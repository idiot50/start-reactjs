import React, { useMemo, useCallback } from 'react';
import { Button} from 'reactstrap';
import { Trans } from 'react-i18next';
import i18n from 'i18next';
import {useDropzone} from 'react-dropzone';
import FileSaver from 'file-saver';
import moment from 'moment';
import { confirmAlert } from 'react-confirm-alert';
import './../../scss/react-confirm-alert/react-confirm-alert.css';
import CustomDraggable from './CustomDraggable';

export function convertDateToDDMMYYYYHHMISS(inputDate) {
    if (inputDate instanceof Date) {
        const temp_date = inputDate;
        const dd = temp_date.getDate() > 9 ? temp_date.getDate() : '0' + temp_date.getDate();
        const MM = (temp_date.getMonth() + 1) > 9 ? (temp_date.getMonth() + 1) : '0' + (temp_date.getMonth() + 1);
        const yyyy = temp_date.getFullYear();
        const hh = temp_date.getHours() > 9 ? temp_date.getHours() : '0' + temp_date.getHours();
        const mi = temp_date.getMinutes() > 9 ? temp_date.getMinutes() : '0' + temp_date.getMinutes();
        const ss = temp_date.getSeconds() > 9 ? temp_date.getSeconds() : '0' + temp_date.getSeconds();
        return dd + '/' + MM + '/' + yyyy + ' ' + hh + ':' + mi + ':' + ss;
    }
    if (typeof inputDate === 'string' || inputDate instanceof String) {
        const offset = moment().parseZone().utcOffset() - moment.parseZone(inputDate).utcOffset();
        return moment(inputDate).add((offset - 420) * -1, 'minute').format('DD/MM/YYYY HH:mm:ss');
    }
    return null;
};

export function Dropzone(props) {
    const baseStyle = {
        width: '100%',
        height: '100%',
        borderWidth: 2,
        borderColor: '#666',
        borderStyle: 'dashed',
        borderRadius: 5,
        padding: '5px'
    };
    const activeStyle = {
        borderStyle: 'solid',
        borderColor: '#6c6',
        backgroundColor: '#eee'
    };
    const acceptStyle = {
        borderStyle: 'solid',
        borderColor: '#00e676'
    };
    const rejectStyle = {
        borderStyle: 'solid',
        borderColor: '#ff1744'
    };
    const onDrop = useCallback(acceptedFiles => {
        props.onDrop(acceptedFiles);
    }, []);
    const { getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
        open
    } = useDropzone({
        onDrop
    });
    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
            isDragActive,
            isDragReject
        ]);

    const rootProps = getRootProps({
        style,
        // Disable click and keydown behavior
        onClick: event => event.stopPropagation(),
        onKeyDown: event => {
            if (event.keyCode === 32 || event.keyCode === 13) {
                event.stopPropagation();
            }
        }
    });
    return (
        <div {...rootProps}>
            <input {...getInputProps()} />
            <p style={{marginBottom: '0.5em'}}><Trans i18nKey="common:common.label.dragFiles" /></p>
            <p style={{marginBottom: '0.5em'}}>{props.acceptFile ? props.acceptFile : <Trans i18nKey="common:common.label.acceptFile"/>}</p>
            <p style={{marginBottom: '0.5em'}}>{i18n.t("common:common.label.maxFileSizeCustom", {maxFileSize: props.maxFileSize ? props.maxFileSize : "39"})}</p>
            <Button type="button" onClick={open} color="primary">
                <Trans i18nKey="common:common.button.chooseFile" />
            </Button>
        </div>
    );
};

export function DropzoneImport(props) {
    const baseStyle = {
        width: '100%',
        height: '100%',
        borderWidth: 2,
        borderColor: '#666',
        borderStyle: 'dashed',
        borderRadius: 5,
        padding: '5px 0px 0px 5px'
    };
    const activeStyle = {
        borderStyle: 'solid',
        borderColor: '#6c6',
        backgroundColor: '#eee'
    };
    const acceptStyle = {
        borderStyle: 'solid',
        borderColor: '#00e676'
    };
    const rejectStyle = {
        borderStyle: 'solid',
        borderColor: '#ff1744'
    };
    const onDrop = useCallback(acceptedFiles => {
        props.onDrop(acceptedFiles);
    }, []);
    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
        open
    } = useDropzone({
        accept: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel.sheet.macroEnabled.12', 'application/vnd.ms-excel'],
        multiple: false,
        onDrop
    });
    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
            isDragActive,
            isDragReject
    ]);
    const rootProps = getRootProps({
        style,
        // Disable click and keydown behavior
        onClick: event => event.stopPropagation(),
        onKeyDown: event => {
            if (event.keyCode === 32 || event.keyCode === 13) {
                event.stopPropagation();
            }
        }
    });
    return (
        <div {...rootProps}>
            <input {...getInputProps()} />
            <p style={{ marginBottom: '0.5em' }}><Trans i18nKey="common:common.label.dragFiles" /></p>
            <p style={{ marginBottom: '0.5em' }}><Trans i18nKey="common:common.label.acceptFileExcel" /></p>
            <p style={{ marginBottom: '0.5em' }}><Trans i18nKey="common:common.label.maxFileSize" /></p>
            <button type="button" onClick={open}>
                <Trans i18nKey="common:common.button.chooseFileImport" />
            </button>
            <aside>
                <ul style={{ paddingLeft: '0rem', marginBottom: '0rem' }}>
                {
                    props.file ?
                    <div>
                        <span style={{ cursor: 'pointer', fontSize: '18px', marginRight: '6px' }} onClick={() => props.removeFile(props.file)}><i className="fa fa-times-circle"></i></span>
                        {props.file.path} - {props.file.size} bytes
                    </div>
                    : null
                }
                </ul>
            </aside>
            <span style={{ marginLeft: '-6px' }}>
                <Button type="button" color="link" onClick={() => props.onClickDownloadFileTemplate()}>
                    {props.titleTemplate}
                </Button>
            </span>
        </div>
    );
}

export function DropzoneAttachment(props) {
    const baseStyle = {
        width: '100%',
        height: '100%',
        borderWidth: 2,
        borderColor: '#666',
        borderStyle: 'dashed',
        borderRadius: 5,
        padding: '5px'
    };
    const activeStyle = {
        borderStyle: 'solid',
        borderColor: '#6c6',
        backgroundColor: '#eee'
    };
    const acceptStyle = {
        borderStyle: 'solid',
        borderColor: '#00e676'
    };
    const rejectStyle = {
        borderStyle: 'solid',
        borderColor: '#ff1744'
    };
    const onDrop = useCallback(acceptedFiles => {
        props.onDrop(acceptedFiles);
    }, []);
    const { getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
        open
    } = useDropzone({
        onDrop
    });
    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
            isDragActive,
            isDragReject
    ]);
    const acceptedFilesItems = props.files.map((file, index) => (
        <div key={index}>
            <span style={{ cursor: 'pointer', fontSize: '18px' }} onClick={() => props.removeFile(file)}><i className="fa fa-times-circle"></i></span>
            {
                file[props.fileId] ? <Button style={{ marginTop:'-6px' }} color="link" onClick={() => props.downloadFile(file)}>{file.fileName}</Button>
                : <Button style={{ marginTop:'-6px' }} color="link" onClick={() => downloadFileLocal(file)}>{file.fileName}</Button>
            }
        </div>
    ));

    const rootProps = getRootProps({
        style,
        // Disable click and keydown behavior
        onClick: event => event.stopPropagation(),
        onKeyDown: event => {
            if (event.keyCode === 32 || event.keyCode === 13) {
                event.stopPropagation();
            }
        }
    });
    return (
        <div {...rootProps}>
            <input {...getInputProps()} />
            <p style={{marginBottom: '0.5em'}}><Trans i18nKey="common:common.label.dragFiles" /></p>
            <p style={{marginBottom: '0.5em'}}>{props.acceptFile ? props.acceptFile : <Trans i18nKey="common:common.label.acceptFile"/>}</p>
            <p style={{marginBottom: '0.5em'}}>{i18n.t("common:common.label.maxFileSizeCustom", {maxFileSize: props.maxFileSize ? props.maxFileSize : "39"})}</p>
            <Button type="button" onClick={open} color="primary">
                <Trans i18nKey="common:common.button.chooseFile" />
            </Button>
            <aside>
                <ul style={{ paddingLeft: '0rem', marginBottom: '0.5rem' }}>
                    {acceptedFilesItems}
                </ul>
            </aside>
        </div>
    );
};

export function DropzoneTable(props) {
    const activeStyle = {
        borderStyle: 'solid',
        borderColor: '#6c6',
        backgroundColor: '#eee'
    };
    const acceptStyle = {
        borderStyle: 'solid',
        borderColor: '#00e676'
    };
    const rejectStyle = {
        borderStyle: 'solid',
        borderColor: '#ff1744'
    };
    const onDrop = useCallback(acceptedFiles => {
        props.onDrop(acceptedFiles);
    }, []);
    const { getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
        open
    } = useDropzone({
        onDrop,
        multiple: false
    });
    const style = useMemo(() => ({
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
            isDragActive,
            isDragReject
        ]);

    const rootProps = getRootProps({
        style,
        // Disable click and keydown behavior
        onClick: event => event.stopPropagation(),
        onKeyDown: event => {
            if (event.keyCode === 32 || event.keyCode === 13) {
                event.stopPropagation();
            }
        }
    });
    return (
        <div {...rootProps}>
            <input {...getInputProps()} />
            <Button type="button" onClick={open} color="primary">
                <Trans i18nKey="common:common.button.chooseFile" />
            </Button>
        </div>
    );
};

export function downloadFileLocal(item) {
    FileSaver.saveAs(item, item.fileName);
}

export function convertModelFroalaEditor(model) {
    // if (model && model !== "") {
    //     return model.split('<p data-f-id')[0];
    // } else {
    //     return model;
    // }
    return model;
}

export const renderRequired = <span>{" "}<label style={{color: 'rgb(248, 108, 107)'}}>(*)</label></span>;

export function validSubmitForm(event, values, formId) {
    if(values && values.constructor === Object) {
        for (const key in values) {
            if(values.hasOwnProperty(key)) {
                if(key.indexOf('custom-input-') !== -1) {
                    delete values[key];
                }
            }
        }
    }
}

export function invalidSubmitForm(event, errors, values, formId) {
    if (errors && errors.length > 0) {
        if (errors[0].indexOf('custom-input-') !== -1) {
            const idElement = errors[0].split("input-")[0] + errors[0].split("input-")[1];
            if (document.getElementById(formId).elements
                && document.getElementById(formId).elements[idElement]) {
                document.getElementById(formId).elements[idElement].focus();
            }
            if (document.getElementById(formId).elements
                && document.getElementById(formId).elements[errors[0]].nextElementSibling
                && document.getElementById(formId).elements[errors[0]].nextElementSibling.classList
                && (
                    document.getElementById(formId).elements[errors[0]].nextElementSibling.classList.contains('rc-tree-select')
                    ||
                    document.getElementById(formId).elements[errors[0]].nextElementSibling.classList.contains('input-popup-control')
                    )
                ) {
                document.getElementById(formId).elements[errors[0]].nextElementSibling.focus();
            }
        } else {
            if (document.getElementById(formId).elements && document.getElementById(formId).elements[errors[0]]) {
                document.getElementById(formId).elements[errors[0]].focus();
            }
        }
    }
}

export function confirmAlertInfo(content, textOk, textCancel, callbackOk, callbackCancel) {
    const options = {
        // title: 'Title',
        // message: 'Message',
        // buttons: [
        //     {
        //         label: 'Yes',
        //         onClick: () => alert('Click Yes')
        //     },
        //     {
        //         label: 'No',
        //         onClick: () => alert('Click No')
        //     }
        // ],
        // childrenElement: () => <div />,
        customUI: ({ onClose }) => {
            return (
                <CustomDraggable
                children={
                    <div className='confirm-alert-custom-ui-info'>
                        <p className="no-cursor">{content}</p>
                        <Button type="button" style={{ marginRight: '5px' }} onClick={() => {
                            callbackOk();
                            onClose();
                        }} color="primary">
                            <i className="fa fa-check" style={{ marginRight: '3px' }}></i>{textOk}
                        </Button>
                        <Button type="button" autoFocus onClick={() => {
                            callbackCancel();
                            onClose();
                        }} color="secondary">
                            <i className="fa fa-remove" style={{ marginRight: '3px' }}></i>{textCancel}
                        </Button>
                    </div>
                }
                />
            );
        },
        // closeOnEscape: true,
        // closeOnClickOutside: true,
        // willUnmount: () => {},
        // onClickOutside: () => {},
        // onKeypressEscape: () => {}
    };
    confirmAlert(options);
}

export function confirmAlertDelete(content, callbackOk) {
    const options = {
        // title: 'Title',
        // message: 'Message',
        // buttons: [
        //     {
        //         label: 'Yes',
        //         onClick: () => alert('Click Yes')
        //     },
        //     {
        //         label: 'No',
        //         onClick: () => alert('Click No')
        //     }
        // ],
        // childrenElement: () => <div />,
        customUI: ({ onClose }) => {
            return (
                <CustomDraggable
                children={
                    <div className='confirm-alert-custom-ui-delete'>
                        <h5 style={{ cursor: 'default' }}>
                            <i className="fa fa-warning" style={{ color: '#f86c6b', marginRight: '10px' }}></i>
                            {i18n.t("common:common.title.warning")}
                        </h5>
                        <p className="no-cursor">{content}</p>
                        <Button type="button" style={{ marginRight: '5px' }} onClick={() => {
                            callbackOk();
                            onClose();
                        }} color="primary">
                            <i className="fa fa-check" style={{ marginRight: '3px' }}></i>{i18n.t("common:common.button.agree")}
                        </Button>
                        <Button type="button" autoFocus onClick={onClose} color="secondary">
                            <i className="fa fa-remove" style={{ marginRight: '3px' }}></i>{i18n.t("common:common.button.cancel")}
                        </Button>
                    </div>
                }
                />
            );
        },
        // closeOnEscape: true,
        // closeOnClickOutside: true,
        // willUnmount: () => {},
        // onClickOutside: () => {},
        // onKeypressEscape: () => {}
    };
    confirmAlert(options);
}

export function setChildTreeData(treeData, curKey, curValue, child) {
    const loop = (data) => {
        data.forEach((item) => {
            if (item[curKey] === curValue) {
                item.children = child;
            } else {
                if (item.children) {
                    loop(item.children);
                }
            }
        });
    };
    loop(treeData);
}

export const colors = [
    '#20a8d8', '#4dbd74', '#e83e8c', '#ffc107', '#63c2de', '#c8ced3',
    '#f8cb00', '#73818f', '#6f42c1', '#20c997', '#17a2b8'
];

export const renderFlag = [
    { value: 'flag-icon-ad', label: 'Andorra' }, { value: 'flag-icon-ae', label: 'United Arab Emirates' },
    { value: 'flag-icon-af', label: 'Afghanistan' },{ value: 'flag-icon-ag', label: 'Antigua and Barbuda' }, 
    { value: 'flag-icon-ai', label: 'Anguilla' }, { value: 'flag-icon-al', label: 'Albania' },
    { value: 'flag-icon-am', label: 'Armenia' }, 
    // { value: 'flag-icon-an', label: 'Netherlands Antilles' }, 
    { value: 'flag-icon-ao', label: 'Angola' }, 
    { value: 'flag-icon-aq', label: 'Antarctica' }, { value: 'flag-icon-ar', label: 'Argentina' }, 
    { value: 'flag-icon-as', label: 'American Samoa' }, { value: 'flag-icon-at', label: 'Áo' }, 
    { value: 'flag-icon-au', label: 'Australia' },  { value: 'flag-icon-aw', label: 'Aruba' },
    { value: 'flag-icon-ax', label: 'Åland Islands' },  { value: 'flag-icon-az', label: 'Azerbaijan' },
    { value: 'flag-icon-ba', label: 'Bosnia and Herzegovina' }, { value: 'flag-icon-bb', label: 'Barbados' },
    { value: 'flag-icon-bd', label: 'Bangladesh' },{ value: 'flag-icon-be', label: 'Bỉ' }, 
    { value: 'flag-icon-bf', label: 'Burkina Faso' },{ value: 'flag-icon-bg', label: 'Bulgaria' }, 
    { value: 'flag-icon-bh', label: 'Bahrain' }, { value: 'flag-icon-bi', label: 'Burundi' }, 
    { value: 'flag-icon-bj', label: 'Bénin' }, 
    { value: 'flag-icon-bm', label: 'Bermuda' }, { value: 'flag-icon-bn', label: 'Brunei Darussalam' },
    { value: 'flag-icon-bo', label: 'Bolivia' }, 
    { value: 'flag-icon-br', label: 'Brasil' }, { value: 'flag-icon-bs', label: 'Bahamas' }, 
    { value: 'flag-icon-bt', label: 'Bhutan' },  { value: 'flag-icon-bv', label: 'Bouvet Island' },
    { value: 'flag-icon-bw', label: 'Botswana' },  { value: 'flag-icon-by', label: 'Belarus' }, 
    { value: 'flag-icon-bz', label: 'Belize' }, { value: 'flag-icon-ca', label: 'Canada' },
    { value: 'flag-icon-cc', label: 'Cocos (Keeling) Islands' }, { value: 'flag-icon-cd', label: 'Congo, the Democratic Republic of the' }, 
    { value: 'flag-icon-cf', label: 'Central African Republic' },  { value: 'flag-icon-cg', label: 'Congo' }, 
    { value: 'flag-icon-ch', label: 'Thụy Sĩ' }, { value: 'flag-icon-ci', label: 'Côte d\'Ivoire' }, 
    { value: 'flag-icon-ck', label: 'Cook Islands' },  { value: 'flag-icon-cl', label: 'Chile' }, 
    { value: 'flag-icon-cm', label: 'Cameroon' },  { value: 'flag-icon-cn', label: 'China' }, 
    { value: 'flag-icon-co', label: 'Colombia' }, { value: 'flag-icon-cr', label: 'Costa Rica' }, 
    { value: 'flag-icon-cu', label: 'Cuba' },{ value: 'flag-icon-cv', label: 'Cape Verde' }, 
    { value: 'flag-icon-cx', label: 'Christmas Island' }, 
    { value: 'flag-icon-cy', label: 'Cộng hòa Síp' },  { value: 'flag-icon-cz', label: 'Czech Republic' }, 
    { value: 'flag-icon-de', label: 'Đức' }, { value: 'flag-icon-dj', label: 'Djibouti' }, 
    { value: 'flag-icon-dk', label: 'Đan Mạch' },  { value: 'flag-icon-dm', label: 'Dominica' }, 
    { value: 'flag-icon-do', label: 'Cộng hòa Dominica' },  { value: 'flag-icon-dz', label: 'Algérie' }, 
    { value: 'flag-icon-ec', label: 'Ecuador' }, { value: 'flag-icon-ee', label: 'Estonia' }, 
    { value: 'flag-icon-eg', label: 'Ai Cập' },  { value: 'flag-icon-eh', label: 'Western Sahara' },
    { value: 'flag-icon-er', label: 'Eritrea' },  { value: 'flag-icon-es', label: 'Tây Ban Nha' }, 
    { value: 'flag-icon-et', label: 'Ethiopia' }, { value: 'flag-icon-fi', label: 'Phần Lan' }, 
    { value: 'flag-icon-fj', label: 'Fiji' }, { value: 'flag-icon-fk', label: 'Falkland Islands (Malvinas)' }, 
    { value: 'flag-icon-fm', label: 'Micronesia, Federated States of' }, { value: 'flag-icon-fo', label: 'Quần đảo Faroe' }, 
    { value: 'flag-icon-fr', label: 'Pháp' },  { value: 'flag-icon-ga', label: 'Gabon' }, 
    { value: 'flag-icon-gb', label: 'United Kingdom' },  { value: 'flag-icon-gd', label: 'Grenada' }, 
    { value: 'flag-icon-ge', label: 'Georgia' }, { value: 'flag-icon-gf', label: 'French Guiana' }, 
    { value: 'flag-icon-gg', label: 'Guernsey' }, { value: 'flag-icon-gh', label: 'Ghana' }, 
    { value: 'flag-icon-gi', label: 'Gibraltar' }, { value: 'flag-icon-gl', label: 'Greenland' }, 
    { value: 'flag-icon-gm', label: 'Gambia' }, { value: 'flag-icon-gn', label: 'Guinea' }, 
    { value: 'flag-icon-gp', label: 'Guadeloupe' }, { value: 'flag-icon-gq', label: 'Equatorial Guinea' }, 
    { value: 'flag-icon-gr', label: 'Hy Lạp' }, { value: 'flag-icon-gs', label: '	South Georgia and the South Sandwich Islands' }, 
    { value: 'flag-icon-gt', label: 'Guatemala' }, { value: 'flag-icon-gu', label: 'Guam' },
    { value: 'flag-icon-gw', label: 'Guinea-Bissau' }, { value: 'flag-icon-gy', label: 'Guyana' }, 
    { value: 'flag-icon-hk', label: 'Hong Kong' }, { value: 'flag-icon-hm', label: 'Heard Island and McDonald Islands' },
    { value: 'flag-icon-hn', label: 'Honduras' }, { value: 'flag-icon-hr', label: 'Croatia' },
    { value: 'flag-icon-ht', label: 'Haiti' }, { value: 'flag-icon-hu', label: 'Hungary' },
    { value: 'flag-icon-id', label: 'Indonesia' }, { value: 'flag-icon-ie', label: 'Ireland' },
    { value: 'flag-icon-il', label: 'Israel' }, { value: 'flag-icon-im', label: 'Isle of Man' },
    { value: 'flag-icon-in', label: 'India' }, { value: 'flag-icon-io', label: 'British Indian Ocean Territory' },
    { value: 'flag-icon-iq', label: 'Iraq' }, { value: 'flag-icon-ir', label: 'Iran, Islamic Republic of' },
    { value: 'flag-icon-is', label: 'Iceland' }, { value: 'flag-icon-it', label: 'Ý' },
    { value: 'flag-icon-je', label: 'Jersey' }, { value: 'flag-icon-jm', label: 'Jamaica' },
    { value: 'flag-icon-jo', label: 'Jordan' }, { value: 'flag-icon-jp', label: 'Japan' },
    { value: 'flag-icon-ke', label: 'Kenya' }, { value: 'flag-icon-kg', label: 'Kyrgyzstan' },
    { value: 'flag-icon-kh', label: 'Campuchia' }, { value: 'flag-icon-ki', label: 'Kiribati' },
    { value: 'flag-icon-km', label: 'Comoros' }, { value: 'flag-icon-kn', label: 'Saint Kitts and Nevis' },
    { value: 'flag-icon-kp', label: 'Korea, Democratic People\'s Republic of' }, { value: 'flag-icon-kr', label: 'Korea, Republic of' },
    { value: 'flag-icon-kw', label: 'Kuwait' }, { value: 'flag-icon-ky', label: 'Cayman Islands' },
    { value: 'flag-icon-kz', label: 'Kazakhstan' }, 
    { value: 'flag-icon-la', label: 'Lao People\'s Democratic Republic' }, { value: 'flag-icon-lb', label: 'Liban' },
    { value: 'flag-icon-lc', label: 'Saint Lucia' }, { value: 'flag-icon-li', label: 'Liechtenstein' },
    { value: 'flag-icon-lk', label: 'Sri Lanka' }, { value: 'flag-icon-lr', label: 'Liberia' },
    { value: 'flag-icon-ls', label: 'Lesotho' }, { value: 'flag-icon-lt', label: 'Litva' },
    { value: 'flag-icon-lu', label: 'Luxembourg' }, { value: 'flag-icon-lv', label: 'Latvia' },
    { value: 'flag-icon-ly', label: 'Libyan Arab Jamahiriya' },
    { value: 'flag-icon-ma', label: 'Maroc' }, { value: 'flag-icon-mc', label: 'Monaco' },
    { value: 'flag-icon-md', label: 'Moldova, Republic of' }, { value: 'flag-icon-me', label: 'Montenegro' },
    { value: 'flag-icon-mg', label: 'Madagascar' },
    { value: 'flag-icon-mh', label: 'Marshall Islands' }, { value: 'flag-icon-mk', label: 'Macedonia, the former Yugoslav Republic of' },
    { value: 'flag-icon-ml', label: 'Mali' }, { value: 'flag-icon-mm', label: 'Myanma' },
    { value: 'flag-icon-mn', label: 'Mông Cổ' }, { value: 'flag-icon-mo', label: 'Macao' },
    { value: 'flag-icon-mp', label: 'Northern Mariana Islands' }, { value: 'flag-icon-mq', label: 'Martinique' },
    { value: 'flag-icon-mr', label: 'Mauritanie' }, { value: 'flag-icon-ms', label: 'Montserrat' },
    { value: 'flag-icon-mt', label: 'Malta' }, { value: 'flag-icon-mu', label: 'Mauritius' },
    { value: 'flag-icon-mv', label: 'Maldives' }, { value: 'flag-icon-mw', label: 'Malawi' },
    { value: 'flag-icon-mx', label: 'México' }, { value: 'flag-icon-my', label: 'Malaysia' },
    { value: 'flag-icon-mz', label: 'Mozambique' }, 
    { value: 'flag-icon-na', label: 'Namibia' }, { value: 'flag-icon-nc', label: 'New Caledonia' },
    { value: 'flag-icon-ne', label: 'Niger' }, { value: 'flag-icon-nf', label: 'Norfolk Island' },
    { value: 'flag-icon-ng', label: 'Nigeria' }, { value: 'flag-icon-ni', label: 'Nicaragua' },
    { value: 'flag-icon-nl', label: 'Hà Lan' }, { value: 'flag-icon-no', label: 'Na Uy' },
    { value: 'flag-icon-np', label: 'Nepal' }, { value: 'flag-icon-nr', label: 'Nauru' },
    { value: 'flag-icon-nu', label: 'Niue' }, { value: 'flag-icon-nz', label: 'New Zealand' },
    { value: 'flag-icon-om', label: 'Oman' }, { value: 'flag-icon-pa', label: 'Panama' },
    { value: 'flag-icon-pe', label: 'Peru' }, { value: 'flag-icon-pf', label: 'French Polynesia' },
    { value: 'flag-icon-pg', label: 'Papua New Guinea' }, { value: 'flag-icon-ph', label: 'Philippines' },
    { value: 'flag-icon-pk', label: 'Pakistan' }, { value: 'flag-icon-pl', label: 'Poland' },
    { value: 'flag-icon-pm', label: 'Saint Pierre and Miquelon' }, { value: 'flag-icon-pn', label: 'Pitcairn' },
    { value: 'flag-icon-pr', label: 'Puerto Rico' }, { value: 'flag-icon-ps', label: 'Palestinian Territory, Occupied' },
    { value: 'flag-icon-pt', label: 'Bồ Đào Nha' }, { value: 'flag-icon-pw', label: 'Palau' },
    { value: 'flag-icon-py', label: 'Paraguay' }, { value: 'flag-icon-qa', label: 'Qatar' },
    { value: 'flag-icon-re', label: 'Réunion' }, { value: 'flag-icon-ro', label: 'România' },
    { value: 'flag-icon-rs', label: 'Serbia' }, { value: 'flag-icon-ru', label: 'Russian Federation' },
    { value: 'flag-icon-rw', label: 'Rwanda' }, 
    { value: 'flag-icon-sa', label: 'Ả Rập Saudi' }, { value: 'flag-icon-sb', label: 'Solomon Islands' },
    { value: 'flag-icon-sc', label: 'Seychelles' }, { value: 'flag-icon-sd', label: 'Sudan' },
    { value: 'flag-icon-se', label: 'Thụy Điển' }, { value: 'flag-icon-sg', label: 'Singapore' },
    { value: 'flag-icon-sh', label: 'Saint Helena' }, { value: 'flag-icon-si', label: 'Slovenia' },
    { value: 'flag-icon-sj', label: 'Svalbard and Jan Mayen' }, { value: 'flag-icon-sk', label: 'Slovakia' },
    { value: 'flag-icon-sl', label: 'Sierra Leone' }, { value: 'flag-icon-sm', label: 'San Marino' },
    { value: 'flag-icon-sn', label: 'Senegal' }, { value: 'flag-icon-so', label: 'Somalia' },
    { value: 'flag-icon-sr', label: 'Suriname' },
    { value: 'flag-icon-st', label: 'Sao Tome and Principe' }, { value: 'flag-icon-sv', label: 'El Salvador' },
     { value: 'flag-icon-sy', label: 'Syrian Arab Republic' },
    { value: 'flag-icon-sz', label: 'Swaziland' }, 
    { value: 'flag-icon-tc', label: 'Turks and Caicos Islands' }, { value: 'flag-icon-td', label: 'Chad' },
    { value: 'flag-icon-tf', label: 'French Southern Territories' }, { value: 'flag-icon-tg', label: 'Togo' },
    { value: 'flag-icon-th', label: 'Thailand' }, { value: 'flag-icon-tj', label: 'Tajikistan' },
    { value: 'flag-icon-tk', label: 'Tokelau' }, { value: 'flag-icon-tl', label: 'Timor-Leste' },
    { value: 'flag-icon-tm', label: 'Turkmenistan' }, { value: 'flag-icon-tn', label: 'Tunisia' },
    { value: 'flag-icon-to', label: 'Tonga' }, { value: 'flag-icon-tr', label: 'Turkey' },
    { value: 'flag-icon-tt', label: 'Trinidad and Tobago' }, { value: 'flag-icon-tv', label: 'Tuvalu' },
    { value: 'flag-icon-tw', label: 'Taiwan, Province of China' }, { value: 'flag-icon-tz', label: 'Tanzania, United Republic of' },
    { value: 'flag-icon-ua', label: 'Ukraina' }, { value: 'flag-icon-ug', label: 'Uganda' },
    { value: 'flag-icon-um', label: 'United States Minor Outlying Islands' }, { value: 'flag-icon-us', label: 'United States' },
    { value: 'flag-icon-uy', label: 'Uruguay' }, { value: 'flag-icon-uz', label: 'Uzbekistan' },
    { value: 'flag-icon-va', label: 'Holy See (Vatican City State)' }, { value: 'flag-icon-vc', label: 'Saint Vincent and the Grenadines' },
    { value: 'flag-icon-ve', label: 'Venezuela' }, { value: 'flag-icon-vg', label: 'Virgin Islands, British' },
    { value: 'flag-icon-vi', label: 'Virgin Islands, U.S.' }, { value: 'flag-icon-vn', label: 'Việt Nam' },
    { value: 'flag-icon-vu', label: 'Vanuatu' }, 
    { value: 'flag-icon-wf', label: 'Wallis and Futuna' }, { value: 'flag-icon-ws', label: 'Samoa' },
    { value: 'flag-icon-ye', label: 'Yemen' }, { value: 'flag-icon-yt', label: 'Mayotte' },
    { value: 'flag-icon-za', label: 'South Africa' }, { value: 'flag-icon-zm', label: 'Zambia' },
    { value: 'flag-icon-zw', label: 'Zimbabwe' },
];

export const selectWeekListUtils = [
    {itemId: 1, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.1") },
    {itemId: 2, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.2") },
    {itemId: 3, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.3") },
    {itemId: 4, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.4") },
    {itemId: 5, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.5") },
    {itemId: 6, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.6") },
    {itemId: 7, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.7") },
    {itemId: 8, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.8") },
    {itemId: 9, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.9") },
    {itemId: 10, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.10") },
    {itemId: 11, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.11") },
    {itemId: 12, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.12") },
    {itemId: 13, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.13") },
    {itemId: 14, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.14") },
    {itemId: 15, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.15") },
    {itemId: 16, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.16") },
    {itemId: 17, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.17") },
    {itemId: 18, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.18") },
    {itemId: 19, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.18") },
    {itemId: 20, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.20") },
    {itemId: 21, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.21") },
    {itemId: 22, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.22") },
    {itemId: 23, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.23") },
    {itemId: 24, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.24") },
    {itemId: 25, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.25") },
    {itemId: 26, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.26") },
    {itemId: 27, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.27") },
    {itemId: 28, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.28") },
    {itemId: 29, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.29") },
    {itemId: 30, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.30") },
    {itemId: 31, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.31") },
    {itemId: 32, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.32") },
    {itemId: 33, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.33") },
    {itemId: 34, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.34") },
    {itemId: 35, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.35") },
    {itemId: 36, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.36") },
    {itemId: 37, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.37") },
    {itemId: 38, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.38") },
    {itemId: 39, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.39") },
    {itemId: 40, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.40") },
    {itemId: 41, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.41") },
    {itemId: 42, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.42") },
    {itemId: 43, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.43") },
    {itemId: 44, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.44") },
    {itemId: 45, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.45") },
    {itemId: 46, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.46") },
    {itemId: 47, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.47") },
    {itemId: 48, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.48") },
    {itemId: 49, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.49") },
    {itemId: 50, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.50") },
    {itemId: 51, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.51") },
    {itemId: 52, itemName:  i18n.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.week.52") }    

];