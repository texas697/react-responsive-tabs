'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint jsx-a11y/no-noninteractive-element-interactions: 0, jsx-a11y/no-noninteractive-tabindex: 0 */

var ShowMore = function (_Component) {
  _inherits(ShowMore, _Component);

  function ShowMore() {
    _classCallCheck(this, ShowMore);

    var _this = _possibleConstructorReturn(this, (ShowMore.__proto__ || Object.getPrototypeOf(ShowMore)).call(this));

    _this.onFocus = function () {
      return _this.setState({ isFocused: true });
    };

    _this.onBlur = function () {
      return _this.setState({ isFocused: false });
    };

    _this.onKeyDown = function (event) {
      var _this$state = _this.state,
          isFocused = _this$state.isFocused,
          isHidden = _this$state.isHidden;

      if (event.keyCode === 13) {
        if (isFocused) {
          _this.setState({ isHidden: !isHidden });
        } else if (!isHidden) {
          _this.setState({ isHidden: true });
        }
      }
    };

    _this.close = function () {
      var isHidden = _this.state.isHidden;

      if (!isHidden) {
        _this.setState({ isHidden: true });
      }
    };

    _this.toggleVisibility = function (event) {
      var isHidden = _this.state.isHidden;

      event.stopPropagation();
      _this.setState({ isHidden: !isHidden });
    };

    _this.state = {
      isFocused: false,
      isHidden: true
    };
    return _this;
  }

  _createClass(ShowMore, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      if (typeof window !== 'undefined') {
        window.addEventListener('click', this.close);
        window.addEventListener('keydown', this.onKeyDown);
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      var _props = this.props,
          children = _props.children,
          isShown = _props.isShown,
          hasChildSelected = _props.hasChildSelected;

      return children.length !== nextProps.children.length || isShown !== nextProps.isShown || hasChildSelected !== nextProps.hasChildSelected || this.state !== nextState;
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (typeof window !== 'undefined') {
        window.removeEventListener('click', this.close);
        window.removeEventListener('keydown', this.onKeyDown);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          isShown = _props2.isShown,
          children = _props2.children,
          onShowMoreChanged = _props2.onShowMoreChanged,
          hasChildSelected = _props2.hasChildSelected,
          label = _props2.label;
      var isHidden = this.state.isHidden;

      if (!isShown || !children || !children.length) {
        return null;
      }

      var isListHidden = isHidden;
      var showMoreStyles = (0, _classnames2.default)({
        RRT__showmore: true,
        'RRT__showmore--selected': hasChildSelected
      });

      var listStyles = (0, _classnames2.default)({
        'RRT__showmore-list': true,
        'RRT__showmore-list--opened': !isListHidden
      });

      var showMoreLabelStyles = (0, _classnames2.default)({
        'RRT__showmore-label': true,
        'RRT__showmore-label--selected': !isListHidden
      });

      return _react2.default.createElement(
        'div',
        {
          ref: onShowMoreChanged,
          className: showMoreStyles,
          role: 'navigation',
          tabIndex: '0',
          onFocus: this.onFocus,
          onBlur: this.onBlur,
          onClick: this.toggleVisibility
        },
        _react2.default.createElement(
          'div',
          { className: showMoreLabelStyles },
          label
        ),
        _react2.default.createElement(
          'div',
          { className: listStyles, 'aria-hidden': isListHidden, role: 'menu' },
          children
        )
      );
    }
  }]);

  return ShowMore;
}(_react.Component);

exports.default = ShowMore;


ShowMore.propTypes = {
  children: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.object, _propTypes2.default.string]),
  hasChildSelected: _propTypes2.default.bool,
  isShown: _propTypes2.default.bool.isRequired,
  onShowMoreChanged: _propTypes2.default.func,
  label: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.node])
};

ShowMore.defaultProps = {
  children: undefined,
  hasChildSelected: false,
  label: '...',
  onShowMoreChanged: function onShowMoreChanged() {
    return null;
  }
};