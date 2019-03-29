'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactResizeDetector = require('react-resize-detector');

var _reactResizeDetector2 = _interopRequireDefault(_reactResizeDetector);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _lodash = require('lodash.throttle');

var _lodash2 = _interopRequireDefault(_lodash);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _ShowMore = require('./components/ShowMore');

var _ShowMore2 = _interopRequireDefault(_ShowMore);

var _Tab = require('./components/Tab');

var _Tab2 = _interopRequireDefault(_Tab);

var _TabPanel = require('./components/TabPanel');

var _TabPanel2 = _interopRequireDefault(_TabPanel);

var _InkBar = require('./components/InkBar');

var _InkBar2 = _interopRequireDefault(_InkBar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var tabPrefix = 'tab-';
var panelPrefix = 'panel-';

var Tabs = function (_Component) {
  _inherits(Tabs, _Component);

  function Tabs(props) {
    _classCallCheck(this, Tabs);

    var _this = _possibleConstructorReturn(this, (Tabs.__proto__ || Object.getPrototypeOf(Tabs)).call(this, props));

    _this.onResetTab = function () {
      _this.setState({ selectedTabKey: 0 });
    };

    _this.onResize = function () {
      if (_this.tabsWrapper) {
        var currentIsCollapsed = _this.getIsCollapsed();
        _this.setState({ blockWidth: _this.tabsWrapper.offsetWidth }, function () {
          var items = _this.props.items;
          var selectedTabKey = _this.state.selectedTabKey;

          var nextIsCollapsed = _this.getIsCollapsed();
          if (currentIsCollapsed && !nextIsCollapsed && selectedTabKey === -1 && items && items.length) {
            var firstTabKey = items[0].key || 0;
            _this.setState({ selectedTabKey: firstTabKey });
          }
        });
      }
    };

    _this.onChangeTab = function (nextTabKey) {
      var onChange = _this.props.onChange;
      var selectedTabKey = _this.state.selectedTabKey;

      var isCollapsed = _this.getIsCollapsed();
      if (isCollapsed && selectedTabKey === nextTabKey) {
        // hide on mobile
        _this.setState({ selectedTabKey: -1 });
      } else {
        // change active tab
        _this.setState({ selectedTabKey: nextTabKey });
      }

      if (onChange) {
        onChange(nextTabKey);
      }
    };

    _this.onFocusTab = function (focusedTabKey) {
      return function () {
        return _this.setState({ focusedTabKey: focusedTabKey });
      };
    };

    _this.onBlurTab = function () {
      return _this.setState({ focusedTabKey: null });
    };

    _this.onKeyDown = function (event) {
      var focusedTabKey = _this.state.focusedTabKey;

      if (event.keyCode === 13 && focusedTabKey !== null) {
        _this.setState({ selectedTabKey: focusedTabKey });
      }
    };

    _this.setTabsDimensions = function () {
      if (!_this.tabsWrapper) {
        // it shouldn't happens evern. Just paranoic check
        return;
      }

      // initial wrapper width calculation
      var blockWidth = _this.tabsWrapper.offsetWidth;

      // calculate width and offset for each tab
      var tabsTotalWidth = 0;
      var tabDimensions = {};
      Object.keys(_this.tabRefs).forEach(function (key) {
        if (_this.tabRefs[key]) {
          var width = _this.tabRefs[key].tab.offsetWidth;
          tabDimensions[key.replace(tabPrefix, '')] = { width: width, offset: tabsTotalWidth };
          tabsTotalWidth += width;
        }
      });

      _this.setState({ tabDimensions: tabDimensions, tabsTotalWidth: tabsTotalWidth, blockWidth: blockWidth });
    };

    _this.getTabs = function () {
      var _this$props = _this.props,
          showMore = _this$props.showMore,
          transform = _this$props.transform,
          transformWidth = _this$props.transformWidth,
          items = _this$props.items,
          allowRemove = _this$props.allowRemove,
          removeActiveOnly = _this$props.removeActiveOnly,
          _onRemove = _this$props.onRemove;
      var _this$state = _this.state,
          blockWidth = _this$state.blockWidth,
          tabsTotalWidth = _this$state.tabsTotalWidth,
          tabDimensions = _this$state.tabDimensions,
          showMoreWidth = _this$state.showMoreWidth;

      var selectedTabKey = _this.getSelectedTabKey();
      var collapsed = blockWidth && transform && blockWidth < transformWidth;

      var tabIndex = 0;
      var availableWidth = blockWidth - (tabsTotalWidth > blockWidth ? showMoreWidth : 0);

      return items.reduce(function (result, item, index) {
        var _item$key = item.key,
            key = _item$key === undefined ? index : _item$key,
            title = item.title,
            content = item.content,
            getContent = item.getContent,
            disabled = item.disabled,
            tabClassName = item.tabClassName,
            panelClassName = item.panelClassName;


        var selected = selectedTabKey === key;
        var payload = { tabIndex: tabIndex, collapsed: collapsed, selected: selected, disabled: disabled, key: key };
        var tabPayload = _extends({}, payload, {
          title: title,
          onRemove: function onRemove(evt) {
            if (typeof _onRemove === 'function') {
              _onRemove(key, evt);
            }
          },
          allowRemove: allowRemove && (!removeActiveOnly || selected),
          className: tabClassName
        });

        var panelPayload = _extends({}, payload, {
          content: content,
          getContent: getContent,
          className: panelClassName
        });

        var tabWidth = tabDimensions[key] ? tabDimensions[key].width : 0;

        tabIndex += 1;

        /* eslint-disable no-param-reassign */
        if (
        // don't need to `Show more` button
        !showMore
        // initial call
        || !blockWidth
        // collapsed mode
        || collapsed
        // all tabs are fit into the block
        || blockWidth > tabsTotalWidth
        // current tab fit into the block
        || availableWidth - tabWidth > 0) {
          result.tabsVisible.push(tabPayload);
        } else {
          result.tabsHidden.push(tabPayload);
          if (selected) result.isSelectedTabHidden = true;
        }
        /* eslint-enable no-param-reassign */

        result.panels[key] = panelPayload; // eslint-disable-line no-param-reassign
        availableWidth -= tabWidth;

        return result;
      }, { tabsVisible: [], tabsHidden: [], panels: {}, isSelectedTabHidden: false });
    };

    _this.getTabProps = function (_ref) {
      var title = _ref.title,
          key = _ref.key,
          selected = _ref.selected,
          collapsed = _ref.collapsed,
          tabIndex = _ref.tabIndex,
          disabled = _ref.disabled,
          className = _ref.className,
          onRemove = _ref.onRemove,
          allowRemove = _ref.allowRemove;
      return {
        selected: selected,
        allowRemove: allowRemove,
        children: title,
        key: tabPrefix + key,
        id: tabPrefix + key,
        ref: function ref(e) {
          return _this.tabRefs[tabPrefix + key] = e;
        },
        originalKey: key,
        onClick: _this.onChangeTab,
        onFocus: _this.onFocusTab,
        onBlur: _this.onBlurTab,
        onRemove: onRemove,
        panelId: panelPrefix + key,
        classNames: _this.getClassNamesFor('tab', {
          selected: selected,
          collapsed: collapsed,
          tabIndex: tabIndex,
          disabled: disabled,
          className: className
        })
      };
    };

    _this.getPanelProps = function (_ref2) {
      var key = _ref2.key,
          content = _ref2.content,
          getContent = _ref2.getContent,
          className = _ref2.className;
      return {
        getContent: getContent,
        children: content,
        key: panelPrefix + key,
        id: panelPrefix + key,
        tabId: tabPrefix + key,
        classNames: _this.getClassNamesFor('panel', { className: className })
      };
    };

    _this.getShowMoreProps = function (isShown, isSelectedTabHidden, showMoreLabel) {
      return {
        onShowMoreChanged: _this.showMoreChanged,
        isShown: isShown,
        label: showMoreLabel,
        hasChildSelected: isSelectedTabHidden
      };
    };

    _this.getClassNamesFor = function (type, _ref3) {
      var selected = _ref3.selected,
          collapsed = _ref3.collapsed,
          tabIndex = _ref3.tabIndex,
          disabled = _ref3.disabled,
          _ref3$className = _ref3.className,
          className = _ref3$className === undefined ? '' : _ref3$className;
      var _this$props2 = _this.props,
          tabClass = _this$props2.tabClass,
          panelClass = _this$props2.panelClass;

      switch (type) {
        case 'tab':
          return (0, _classnames2.default)('RRT__tab', className, tabClass, {
            'RRT__tab--first': !tabIndex,
            'RRT__tab--selected': selected,
            'RRT__tab--disabled': disabled,
            'RRT__tab--collapsed': collapsed
          });
        case 'panel':
          return (0, _classnames2.default)('RRT__panel', className, panelClass);
        default:
          return '';
      }
    };

    _this.getSelectedTabKey = function () {
      var items = _this.props.items;
      var selectedTabKey = _this.state.selectedTabKey;


      if (typeof selectedTabKey === 'undefined') {
        if (!items[0]) {
          return undefined;
        }

        return items[0].key || 0;
      }

      return selectedTabKey;
    };

    _this.getIsCollapsed = function () {
      var _this$props3 = _this.props,
          transform = _this$props3.transform,
          transformWidth = _this$props3.transformWidth;
      var blockWidth = _this.state.blockWidth;

      return blockWidth && transform && blockWidth < transformWidth;
    };

    _this.showMoreChanged = function (element) {
      if (!element) {
        return;
      }

      var showMoreWidth = _this.state.showMoreWidth;
      var offsetWidth = element.offsetWidth;

      if (showMoreWidth === offsetWidth) {
        return;
      }

      _this.setState({
        showMoreWidth: offsetWidth
      });
    };

    _this.tabRefs = {};

    _this.state = {
      tabDimensions: {},
      blockWidth: 0,
      tabsTotalWidth: 0,
      showMoreWidth: 40,
      selectedTabKey: props.selectedTabKey,
      focusedTabKey: null
    };

    _this.onResizeThrottled = (0, _lodash2.default)(_this.onResize, props.resizeThrottle, { trailing: true });
    return _this;
  }

  _createClass(Tabs, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.setTabsDimensions();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var items = this.props.items;
      var selectedTabKey = this.state.selectedTabKey;

      var newState = {};
      if (items !== nextProps.items) {
        newState.blockWidth = 0;
      }

      if (selectedTabKey !== nextProps.selectedTabKey) {
        newState.selectedTabKey = nextProps.selectedTabKey;
      }

      if (Object.keys(newState).length) {
        this.setState(newState);
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      var _state = this.state,
          selectedTabKey = _state.selectedTabKey,
          blockWidth = _state.blockWidth,
          showMoreWidth = _state.showMoreWidth;
      var _props = this.props,
          items = _props.items,
          transform = _props.transform,
          showMore = _props.showMore,
          showInkBar = _props.showInkBar,
          allowRemove = _props.allowRemove,
          removeActiveOnly = _props.removeActiveOnly;


      return items !== nextProps.items || nextProps.transform !== transform || nextProps.showMore !== showMore || nextProps.showInkBar !== showInkBar || nextProps.allowRemove !== allowRemove || nextProps.removeActiveOnly !== removeActiveOnly || nextState.blockWidth !== blockWidth || nextState.showMoreWidth !== showMoreWidth || nextState.selectedTabKey !== selectedTabKey;
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      var blockWidth = this.state.blockWidth;

      if (!blockWidth) {
        this.setTabsDimensions();
      }
      if (prevProps.selectedTabKey !== this.props.selectedTabKey && this.props.selectedTabKey === 0) {
        this.onResetTab();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props2 = this.props,
          showInkBar = _props2.showInkBar,
          containerClass = _props2.containerClass,
          tabsWrapperClass = _props2.tabsWrapperClass,
          showMore = _props2.showMore,
          transform = _props2.transform,
          showMoreLabel = _props2.showMoreLabel;
      var tabDimensions = this.state.tabDimensions;

      var _getTabs = this.getTabs(),
          tabsVisible = _getTabs.tabsVisible,
          tabsHidden = _getTabs.tabsHidden,
          panels = _getTabs.panels,
          isSelectedTabHidden = _getTabs.isSelectedTabHidden;

      var isCollapsed = this.getIsCollapsed();
      var selectedTabKey = this.getSelectedTabKey();
      var selectedTabDimensions = tabDimensions[selectedTabKey] || {};

      var containerClasses = (0, _classnames2.default)('RRT__container', containerClass);
      var tabsClasses = (0, _classnames2.default)('RRT__tabs', tabsWrapperClass, { RRT__accordion: isCollapsed });

      return _react2.default.createElement(
        'div',
        { className: containerClasses, ref: function ref(e) {
            return _this2.tabsWrapper = e;
          }, onKeyDown: this.onKeyDown },
        _react2.default.createElement(
          'div',
          { className: tabsClasses },
          tabsVisible.reduce(function (result, tab) {
            result.push(_react2.default.createElement(_Tab2.default, _this2.getTabProps(tab)));

            if (isCollapsed && selectedTabKey === tab.key) {
              result.push(_react2.default.createElement(_TabPanel2.default, _this2.getPanelProps(panels[tab.key])));
            }
            return result;
          }, []),
          !isCollapsed && _react2.default.createElement(
            _ShowMore2.default,
            this.getShowMoreProps(showMore, isSelectedTabHidden, showMoreLabel),
            tabsHidden.map(function (tab) {
              return _react2.default.createElement(_Tab2.default, _this2.getTabProps(tab));
            })
          )
        ),
        showInkBar && !isCollapsed && !isSelectedTabHidden && _react2.default.createElement(_InkBar2.default, { left: selectedTabDimensions.offset || 0, width: selectedTabDimensions.width || 0 }),
        !isCollapsed && panels[selectedTabKey] && _react2.default.createElement(_TabPanel2.default, this.getPanelProps(panels[selectedTabKey])),
        (showMore || transform) && _react2.default.createElement(_reactResizeDetector2.default, { handleWidth: true, onResize: this.onResizeThrottled })
      );
    }
  }]);

  return Tabs;
}(_react.Component);

exports.default = Tabs;


Tabs.propTypes = {
  /* eslint-disable react/no-unused-prop-types */
  // list of tabs
  items: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.object]),
  /* eslint-enable react/no-unused-prop-types */
  // selected tab key
  selectedTabKey: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
  // show 'X' and remove tab
  allowRemove: _propTypes2.default.bool,
  // show 'X' closing element only for active tab
  removeActiveOnly: _propTypes2.default.bool,
  // move tabs to the special `Show more` tab if they don't fit into a screen
  showMore: _propTypes2.default.bool,
  // materialUI-like rail under the selected tab
  showInkBar: _propTypes2.default.bool,
  // transform to the accordion on small screens
  transform: _propTypes2.default.bool,
  // tabs will be transformed to accodrion for screen sizes below `transformWidth`px
  transformWidth: _propTypes2.default.number,
  // onChange active tab callback
  onChange: _propTypes2.default.func,
  // onRemove callback
  onRemove: _propTypes2.default.func,
  // frequency of onResize recalculation fires
  resizeThrottle: _propTypes2.default.number,
  // classnames
  containerClass: _propTypes2.default.string,
  tabsWrapperClass: _propTypes2.default.string,
  tabClass: _propTypes2.default.string,
  panelClass: _propTypes2.default.string,
  // labels
  showMoreLabel: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.node])
};

Tabs.defaultProps = {
  items: [],
  selectedTabKey: undefined,
  showMore: true,
  showInkBar: false,
  allowRemove: false,
  removeActiveOnly: false,
  transform: true,
  transformWidth: 800,
  resizeThrottle: 100,
  containerClass: undefined,
  tabsWrapperClass: undefined,
  tabClass: undefined,
  panelClass: undefined,
  showMoreLabel: '...',
  onChange: function onChange() {
    return null;
  },
  onRemove: function onRemove() {
    return null;
  }
};