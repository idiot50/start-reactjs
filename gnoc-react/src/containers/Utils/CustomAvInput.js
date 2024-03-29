'use strict';

exports.__esModule = true;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactstrap = require('reactstrap');

var _CustomAvBaseInput2 = require('./CustomAvBaseInput');

var _CustomAvBaseInput3 = _interopRequireDefault(_CustomAvBaseInput2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CustomAvInput = function (_CustomAvBaseInput) {
  (0, _inherits3.default)(CustomAvInput, _CustomAvBaseInput);

  function CustomAvInput() {
    (0, _classCallCheck3.default)(this, CustomAvInput);
    return (0, _possibleConstructorReturn3.default)(this, _CustomAvBaseInput.apply(this, arguments));
  }

  CustomAvInput.prototype.getValue = function getValue() {
    return this.props.valueParser ? this.props.valueParser(this.value) : this.value;
  };

  CustomAvInput.prototype.getViewValue = function getViewValue() {
    return this.props.valueFormatter ? this.props.valueFormatter(this.value) : this.value;
  };

  CustomAvInput.prototype.render = function render() {
    var _props = this.props,
        omit1 = _props.errorMessage,
        omit2 = _props.validate,
        omit3 = _props.validationEvent,
        omit4 = _props.state,
        omit5 = _props.trueValue,
        omit6 = _props.falseValue,
        omit7 = _props.valueParser,
        omit8 = _props.valueFormatter,
        className = _props.className,
        tag = _props.tag,
        getRef = _props.getRef,
        _props$id = _props.id,
        id = _props$id === undefined ? this.props.name : _props$id,
        attributes = (0, _objectWithoutProperties3.default)(_props, ['errorMessage', 'validate', 'validationEvent', 'state', 'trueValue', 'falseValue', 'valueParser', 'valueFormatter', 'className', 'tag', 'getRef', 'id']);


    var touched = this.context.FormCtrl.isTouched(this.props.name);
    var hasError = this.context.FormCtrl.hasError(this.props.name);
    var Tag = tag;

    if (Array.isArray(tag)) {
      var tags = void 0;
      Tag = tag[0];
      tags = tag.slice(1);

      attributes.tag = tags;
      if (attributes.tag.length <= 1) {
        attributes.tag = attributes.tag[0];
      }
    }

    var classes = (0, _classnames2.default)(className, touched ? 'is-touched' : 'is-untouched', this.context.FormCtrl.isDirty(this.props.name) ? 'is-dirty' : 'is-pristine', this.context.FormCtrl.isBad(this.props.name) ? 'is-bad-input' : null, hasError ? 'av-invalid' : 'av-valid', touched && hasError && 'is-invalid', attributes.type === 'checkbox' && touched && hasError && 'was-validated');

    var value = this.getViewValue();

    return _react2.default.createElement(Tag, (0, _extends3.default)({}, attributes, {
      ref: getRef
    }, this.getValidatorProps(), {
      className: classes,
      value: value,
      id: id
    }));
  };

  return CustomAvInput;
}(_CustomAvBaseInput3.default);

CustomAvInput.defaultProps = (0, _assign2.default)({}, _CustomAvBaseInput3.default.defaultProps, {
  tag: _reactstrap.Input
});
CustomAvInput.contextTypes = _CustomAvBaseInput3.default.contextTypes;
exports.default = CustomAvInput;