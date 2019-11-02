"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactTransitionGroup = require("react-transition-group");

require("../../scss/react-sliding-side-panel/index.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getPanelGlassStyle = function getPanelGlassStyle(type, size) {
  var horizontal = type === 'bottom' || type === 'top';
  return _objectSpread({
    width: horizontal ? '100%' : "".concat(100 - size, "%"),
    // height: horizontal ? "".concat(100 - size, "vh") : '100vh',
    height: '100%'
  }, type === 'right' && {
    left: 0
  }, type === 'top' && {
    bottom: 0
  }, {
    position: 'inherit'
  });
};

var getPanelStyle = function getPanelStyle(type, size) {
  var horizontal = type === 'bottom' || type === 'top';
  return _objectSpread({
    width: horizontal ? '100%' : "".concat(size, "%"),
    // height: horizontal ? "".concat(size, "vh") : '100vh',
    height: '100%',
    background: '#f0f3f5'
  }, type === 'right' && {
    right: 0
  }, type === 'bottom' && {
    bottom: 0
  }, {
    position: 'inherit',
    overflow: 'auto',
    borderLeft: '1px solid #c8ced3'
  });
};

var SlidingPanel = function SlidingPanel(_ref) {
  var type = _ref.type,
      size = _ref.size,
      isOpen = _ref.isOpen,
      onOpen = _ref.onOpen,
      onOpening = _ref.onOpening,
      onOpened = _ref.onOpened,
      onClose = _ref.onClose,
      onClosing = _ref.onClosing,
      onClosed = _ref.onClosed,
      backdropClicked = _ref.backdropClicked,
      children = _ref.children;
  var glassBefore = type === 'right' || type === 'bottom';
  var horizontal = type === 'bottom' || type === 'top';
  return _react["default"].createElement("div", {
    style: { position: 'relative'}
  }, _react["default"].createElement("div", {
    className: "sliding-panel-container ".concat(isOpen ? 'active' : '')
  }, _react["default"].createElement(_reactTransitionGroup.CSSTransition, {
    "in": isOpen,
    timeout: 400,
    classNames: "panel-container-".concat(type),
    unmountOnExit: true,
    onEnter: function onEnter(node, isAppearing) {
      return onOpen(node, isAppearing);
    },
    onEntering: function onEntering(node, isAppearing) {
      return onOpening(node, isAppearing);
    },
    onEntered: function onEntered(node, isAppearing) {
      return onOpened(node, isAppearing);
    },
    onExit: function onExit(node) {
      return onClose(node);
    },
    onExiting: function onExiting(node) {
      return onClosing(node);
    },
    onExited: function onExited(node) {
      return onClosed(node);
    },
    style: {
      display: horizontal ? 'block' : 'flex',
      height: '100%'
    }
  }, _react["default"].createElement("div", null, glassBefore && _react["default"].createElement("div", {
    className: "glass",
    style: getPanelGlassStyle(type, size),
    onClick: function onClick(e) {
      return backdropClicked(e);
    }
  }), _react["default"].createElement("div", {
    className: "panel",
    style: getPanelStyle(type, size)
  }, _react["default"].createElement("div", {
    className: "panel-content"
  }, children)), !glassBefore && _react["default"].createElement("div", {
    className: "glass",
    style: getPanelGlassStyle(type, size),
    onClick: function onClick(e) {
      return backdropClicked(e);
    }
  })))));
};

SlidingPanel.propTypes = {
  type: _propTypes["default"].oneOf(['top', 'right', 'bottom', 'left']),
  size: _propTypes["default"].number,
  isOpen: _propTypes["default"].bool.isRequired,
  onOpen: _propTypes["default"].func,
  onOpening: _propTypes["default"].func,
  onOpened: _propTypes["default"].func,
  onClose: _propTypes["default"].func,
  onClosing: _propTypes["default"].func,
  onClosed: _propTypes["default"].func,
  backdropClicked: _propTypes["default"].func,
  children: _propTypes["default"].element
};
SlidingPanel.defaultProps = {
  type: 'left',
  size: 50,
  onOpen: function onOpen() {
    return null;
  },
  onOpening: function onOpening() {
    return null;
  },
  onOpened: function onOpened() {
    return null;
  },
  onClose: function onClose() {
    return null;
  },
  onClosing: function onClosing() {
    return null;
  },
  onClosed: function onClosed() {
    return null;
  },
  backdropClicked: function backdropClicked() {
    return null;
  },
  children: null
};
var _default = SlidingPanel;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qc3giXSwibmFtZXMiOlsiZ2V0UGFuZWxHbGFzc1N0eWxlIiwidHlwZSIsInNpemUiLCJob3Jpem9udGFsIiwid2lkdGgiLCJoZWlnaHQiLCJsZWZ0IiwiYm90dG9tIiwicG9zaXRpb24iLCJnZXRQYW5lbFN0eWxlIiwicmlnaHQiLCJvdmVyZmxvdyIsIlNsaWRpbmdQYW5lbCIsImlzT3BlbiIsIm9uT3BlbiIsIm9uT3BlbmluZyIsIm9uT3BlbmVkIiwib25DbG9zZSIsIm9uQ2xvc2luZyIsIm9uQ2xvc2VkIiwiYmFja2Ryb3BDbGlja2VkIiwiY2hpbGRyZW4iLCJnbGFzc0JlZm9yZSIsIm5vZGUiLCJpc0FwcGVhcmluZyIsImRpc3BsYXkiLCJlIiwicHJvcFR5cGVzIiwiUHJvcFR5cGVzIiwib25lT2YiLCJudW1iZXIiLCJib29sIiwiaXNSZXF1aXJlZCIsImZ1bmMiLCJlbGVtZW50IiwiZGVmYXVsdFByb3BzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTUEsa0JBQWtCLEdBQUcsU0FBckJBLGtCQUFxQixDQUFDQyxJQUFELEVBQU9DLElBQVAsRUFBZ0I7QUFDekMsTUFBTUMsVUFBVSxHQUFHRixJQUFJLEtBQUssUUFBVCxJQUFxQkEsSUFBSSxLQUFLLEtBQWpEO0FBQ0E7QUFDRUcsSUFBQUEsS0FBSyxFQUFFRCxVQUFVLEdBQUcsT0FBSCxhQUFnQixNQUFNRCxJQUF0QixPQURuQjtBQUVFRyxJQUFBQSxNQUFNLEVBQUVGLFVBQVUsYUFBTSxNQUFNRCxJQUFaLFVBQXVCO0FBRjNDLEtBR01ELElBQUksS0FBSyxPQUFULElBQW9CO0FBQUVLLElBQUFBLElBQUksRUFBRTtBQUFSLEdBSDFCLEVBSU1MLElBQUksS0FBSyxLQUFULElBQWtCO0FBQUVNLElBQUFBLE1BQU0sRUFBRTtBQUFWLEdBSnhCO0FBS0VDLElBQUFBLFFBQVEsRUFBRTtBQUxaO0FBT0QsQ0FURDs7QUFX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QUF6QjtBQWNBdEIsWUFBWSxDQUFDdUIsWUFBYixHQUE0QjtBQUMxQmxDLEVBQUFBLElBQUksRUFBRSxNQURvQjtBQUUxQkMsRUFBQUEsSUFBSSxFQUFFLEVBRm9CO0FBRzFCWSxFQUFBQSxNQUFNLEVBQUU7QUFBQSxXQUFNLElBQU47QUFBQSxHQUhrQjtBQUkxQkMsRUFBQUEsU0FBUyxFQUFFO0FBQUEsV0FBTSxJQUFOO0FBQUEsR0FKZTtBQUsxQkMsRUFBQUEsUUFBUSxFQUFFO0FBQUEsV0FBTSxJQUFOO0FBQUEsR0FMZ0I7QUFNMUJDLEVBQUFBLE9BQU8sRUFBRTtBQUFBLFdBQU0sSUFBTjtBQUFBLEdBTmlCO0FBTzFCQyxFQUFBQSxTQUFTLEVBQUU7QUFBQSxXQUFNLElBQU47QUFBQSxHQVBlO0FBUTFCQyxFQUFBQSxRQUFRLEVBQUU7QUFBQSxXQUFNLElBQU47QUFBQSxHQVJnQjtBQVMxQkMsRUFBQUEsZUFBZSxFQUFFO0FBQUEsV0FBTSxJQUFOO0FBQUEsR0FUUztBQVUxQkMsRUFBQUEsUUFBUSxFQUFFO0FBVmdCLENBQTVCO2VBYWVULFkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7IENTU1RyYW5zaXRpb24gfSBmcm9tICdyZWFjdC10cmFuc2l0aW9uLWdyb3VwJztcbmltcG9ydCAnLi9pbmRleC5jc3MnO1xuXG5jb25zdCBnZXRQYW5lbEdsYXNzU3R5bGUgPSAodHlwZSwgc2l6ZSkgPT4ge1xuICBjb25zdCBob3Jpem9udGFsID0gdHlwZSA9PT0gJ2JvdHRvbScgfHwgdHlwZSA9PT0gJ3RvcCc7XG4gIHJldHVybiB7XG4gICAgd2lkdGg6IGhvcml6b250YWwgPyAnMTAwdncnIDogYCR7MTAwIC0gc2l6ZX12d2AsXG4gICAgaGVpZ2h0OiBob3Jpem9udGFsID8gYCR7MTAwIC0gc2l6ZX12aGAgOiAnMTAwdmgnLFxuICAgIC4uLih0eXBlID09PSAncmlnaHQnICYmIHsgbGVmdDogMCB9KSxcbiAgICAuLi4odHlwZSA9PT0gJ3RvcCcgJiYgeyBib3R0b206IDAgfSksXG4gICAgcG9zaXRpb246ICdpbmhlcml0JyxcbiAgfTtcbn07XG5cbmNvbnN0IGdldFBhbmVsU3R5bGUgPSAodHlwZSwgc2l6ZSkgPT4ge1xuICBjb25zdCBob3Jpem9udGFsID0gdHlwZSA9PT0gJ2JvdHRvbScgfHwgdHlwZSA9PT0gJ3RvcCc7XG4gIHJldHVybiB7XG4gICAgd2lkdGg6IGhvcml6b250YWwgPyAnMTAwdncnIDogYCR7c2l6ZX12d2AsXG4gICAgaGVpZ2h0OiBob3Jpem9udGFsID8gYCR7c2l6ZX12aGAgOiAnMTAwdmgnLFxuICAgIC4uLih0eXBlID09PSAncmlnaHQnICYmIHsgcmlnaHQ6IDAgfSksXG4gICAgLi4uKHR5cGUgPT09ICdib3R0b20nICYmIHsgYm90dG9tOiAwIH0pLFxuICAgIHBvc2l0aW9uOiAnaW5oZXJpdCcsXG4gICAgb3ZlcmZsb3c6ICdhdXRvJyxcbiAgfTtcbn07XG5cbmNvbnN0IFNsaWRpbmdQYW5lbCA9ICh7XG4gIHR5cGUsXG4gIHNpemUsXG4gIGlzT3BlbixcbiAgb25PcGVuLFxuICBvbk9wZW5pbmcsXG4gIG9uT3BlbmVkLFxuICBvbkNsb3NlLFxuICBvbkNsb3NpbmcsXG4gIG9uQ2xvc2VkLFxuICBiYWNrZHJvcENsaWNrZWQsXG4gIGNoaWxkcmVuLFxufSkgPT4ge1xuICBjb25zdCBnbGFzc0JlZm9yZSA9IHR5cGUgPT09ICdyaWdodCcgfHwgdHlwZSA9PT0gJ2JvdHRvbSc7XG4gIGNvbnN0IGhvcml6b250YWwgPSB0eXBlID09PSAnYm90dG9tJyB8fCB0eXBlID09PSAndG9wJztcbiAgcmV0dXJuIChcbiAgICA8ZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9e2BzbGlkaW5nLXBhbmVsLWNvbnRhaW5lciAke2lzT3BlbiA/ICdhY3RpdmUnIDogJyd9YH0+XG4gICAgICAgIDxDU1NUcmFuc2l0aW9uXG4gICAgICAgICAgaW49e2lzT3Blbn1cbiAgICAgICAgICB0aW1lb3V0PXs1MDB9XG4gICAgICAgICAgY2xhc3NOYW1lcz17YHBhbmVsLWNvbnRhaW5lci0ke3R5cGV9YH1cbiAgICAgICAgICB1bm1vdW50T25FeGl0XG4gICAgICAgICAgb25FbnRlcj17KG5vZGUsIGlzQXBwZWFyaW5nKSA9PiBvbk9wZW4obm9kZSwgaXNBcHBlYXJpbmcpfVxuICAgICAgICAgIG9uRW50ZXJpbmc9eyhub2RlLCBpc0FwcGVhcmluZykgPT4gb25PcGVuaW5nKG5vZGUsIGlzQXBwZWFyaW5nKX1cbiAgICAgICAgICBvbkVudGVyZWQ9eyhub2RlLCBpc0FwcGVhcmluZykgPT4gb25PcGVuZWQobm9kZSwgaXNBcHBlYXJpbmcpfVxuICAgICAgICAgIG9uRXhpdD17bm9kZSA9PiBvbkNsb3NlKG5vZGUpfVxuICAgICAgICAgIG9uRXhpdGluZz17bm9kZSA9PiBvbkNsb3Npbmcobm9kZSl9XG4gICAgICAgICAgb25FeGl0ZWQ9e25vZGUgPT4gb25DbG9zZWQobm9kZSl9XG4gICAgICAgICAgc3R5bGU9e3sgZGlzcGxheTogaG9yaXpvbnRhbCA/ICdibG9jaycgOiAnZmxleCcgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICB7Z2xhc3NCZWZvcmUgJiYgKFxuICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2xhc3NcIlxuICAgICAgICAgICAgICAgIHN0eWxlPXtnZXRQYW5lbEdsYXNzU3R5bGUodHlwZSwgc2l6ZSl9XG4gICAgICAgICAgICAgICAgb25DbGljaz17ZSA9PiBiYWNrZHJvcENsaWNrZWQoZSl9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbFwiIHN0eWxlPXtnZXRQYW5lbFN0eWxlKHR5cGUsIHNpemUpfT5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1jb250ZW50XCI+e2NoaWxkcmVufTwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICB7IWdsYXNzQmVmb3JlICYmIChcbiAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImdsYXNzXCJcbiAgICAgICAgICAgICAgICBzdHlsZT17Z2V0UGFuZWxHbGFzc1N0eWxlKHR5cGUsIHNpemUpfVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2UgPT4gYmFja2Ryb3BDbGlja2VkKGUpfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9DU1NUcmFuc2l0aW9uPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5TbGlkaW5nUGFuZWwucHJvcFR5cGVzID0ge1xuICB0eXBlOiBQcm9wVHlwZXMub25lT2YoWyd0b3AnLCAncmlnaHQnLCAnYm90dG9tJywgJ2xlZnQnXSksXG4gIHNpemU6IFByb3BUeXBlcy5udW1iZXIsXG4gIGlzT3BlbjogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgb25PcGVuOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25PcGVuaW5nOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25PcGVuZWQ6IFByb3BUeXBlcy5mdW5jLFxuICBvbkNsb3NlOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25DbG9zaW5nOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25DbG9zZWQ6IFByb3BUeXBlcy5mdW5jLFxuICBiYWNrZHJvcENsaWNrZWQ6IFByb3BUeXBlcy5mdW5jLFxuICBjaGlsZHJlbjogUHJvcFR5cGVzLmVsZW1lbnQsXG59O1xuXG5TbGlkaW5nUGFuZWwuZGVmYXVsdFByb3BzID0ge1xuICB0eXBlOiAnbGVmdCcsXG4gIHNpemU6IDUwLFxuICBvbk9wZW46ICgpID0+IG51bGwsXG4gIG9uT3BlbmluZzogKCkgPT4gbnVsbCxcbiAgb25PcGVuZWQ6ICgpID0+IG51bGwsXG4gIG9uQ2xvc2U6ICgpID0+IG51bGwsXG4gIG9uQ2xvc2luZzogKCkgPT4gbnVsbCxcbiAgb25DbG9zZWQ6ICgpID0+IG51bGwsXG4gIGJhY2tkcm9wQ2xpY2tlZDogKCkgPT4gbnVsbCxcbiAgY2hpbGRyZW46IG51bGwsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBTbGlkaW5nUGFuZWw7XG4iXX0=