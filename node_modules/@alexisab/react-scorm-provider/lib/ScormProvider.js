"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ScoContext = void 0;

var _react = _interopRequireWildcard(require("react"));

var _pipwerksScormApiWrapper = require("pipwerks-scorm-api-wrapper");

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ScoContext = _react.default.createContext({
  apiConnected: false,
  learnerName: "",
  completionStatus: "incomplete",
  suspendData: {},
  scormVersion: "",
  getSuspendData: function getSuspendData() {},
  setSuspendData: function setSuspendData() {},
  setStatus: function setStatus() {},
  set: function set() {},
  get: function get() {}
});

exports.ScoContext = ScoContext;

var ScormProvider =
/*#__PURE__*/
function (_Component) {
  _inherits(ScormProvider, _Component);

  function ScormProvider(props) {
    var _this;

    _classCallCheck(this, ScormProvider);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ScormProvider).call(this, props));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_log", function () {
      if (_this.props.debug) {
        var _console;

        (_console = console).log.apply(_console, arguments);
      }
    });

    _this._log("ScormProvider constructor called!"); // bind class methods as needed


    _this.getSuspendData = _this.getSuspendData.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.setSuspendData = _this.setSuspendData.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.setStatus = _this.setStatus.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.createScormAPIConnection = _this.createScormAPIConnection.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.closeScormAPIConnection = _this.closeScormAPIConnection.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.set = _this.set.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.get = _this.get.bind(_assertThisInitialized(_assertThisInitialized(_this))); // define state, including methods to be passed to context consumers
    // this entire state will be passed as 'sco' to consumers

    _this.state = {
      apiConnected: false,
      learnerName: "",
      completionStatus: "incomplete",
      suspendData: {},
      scormVersion: "",
      getSuspendData: _this.getSuspendData,
      setSuspendData: _this.setSuspendData,
      setStatus: _this.setStatus,
      set: _this.set,
      get: _this.get
    };
    return _this;
  }

  _createClass(ScormProvider, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this._log("ScormProvider componentDidMount called!");

      this.createScormAPIConnection();
      window.addEventListener("beforeunload", this.closeScormAPIConnection);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this._log("ScormProvider componentWillUnmount called!");

      this.closeScormAPIConnection();
      window.removeEventListener("beforeunload", this.closeScormAPIConnection);
    }
  }, {
    key: "createScormAPIConnection",
    value: function createScormAPIConnection() {
      var _this2 = this;

      this._log("ScormProvider createScormAPIConnection method called!");

      if (this.state.apiConnected) return;
      if (this.props.version) _pipwerksScormApiWrapper.SCORM.version = this.props.version;
      if (typeof this.props.debug === "boolean") _pipwerksScormApiWrapper.debug.isActive = this.props.debug;

      var scorm = _pipwerksScormApiWrapper.SCORM.init();

      if (scorm) {
        var version = _pipwerksScormApiWrapper.SCORM.version;
        var learnerName = version === "1.2" ? _pipwerksScormApiWrapper.SCORM.get("cmi.core.student_name") : _pipwerksScormApiWrapper.SCORM.get("cmi.learner_name");

        var completionStatus = _pipwerksScormApiWrapper.SCORM.status("get");

        this.setState({
          apiConnected: true,
          learnerName: learnerName,
          completionStatus: completionStatus,
          scormVersion: version
        }, function () {
          _this2.getSuspendData();
        });
      } else {
        // could not create the SCORM API connection
        this._log("ScormProvider init error: could not create the SCORM API connection");
      }
    }
  }, {
    key: "closeScormAPIConnection",
    value: function closeScormAPIConnection() {
      this._log("ScormProvider closeScormAPIConnection method called!");

      if (!this.state.apiConnected) return;
      this.setSuspendData();

      _pipwerksScormApiWrapper.SCORM.status("set", this.state.completionStatus);

      _pipwerksScormApiWrapper.SCORM.save();

      var success = _pipwerksScormApiWrapper.SCORM.quit();

      if (success) {
        this.setState({
          apiConnected: false,
          learnerName: "",
          completionStatus: "incomplete",
          suspendData: {},
          scormVersion: ""
        });
      } else {
        // could not close the SCORM API connection
        this._log("ScormProvider error: could not close the API connection");
      }
    }
  }, {
    key: "getSuspendData",
    value: function getSuspendData() {
      if (!this.state.apiConnected) return;

      var data = _pipwerksScormApiWrapper.SCORM.get("cmi.suspend_data");

      var suspendData = data && data.length > 0 ? JSON.parse(data) : {};
      this.setState({
        suspendData: suspendData
      });
    }
  }, {
    key: "setSuspendData",
    value: function setSuspendData(key, val) {
      if (!this.state.apiConnected) return;
      var currentData = _objectSpread({}, this.state.suspendData) || {};
      if (key && val) currentData[key] = val;

      var success = _pipwerksScormApiWrapper.SCORM.set("cmi.suspend_data", JSON.stringify(currentData));

      if (success) {
        this.setState({
          suspendData: currentData
        }, function () {
          _pipwerksScormApiWrapper.SCORM.save();
        });
      } else {
        // error setting suspend data
        this._log("ScormProvider setStatus error: could not set the suspend data provided");
      }
    }
  }, {
    key: "setStatus",
    value: function setStatus(status) {
      if (!this.state.apiConnected) return;
      var validStatuses = ["passed", "completed", "failed", "incomplete", "browsed", "not attempted"];

      if (validStatuses.includes(status)) {
        var success = _pipwerksScormApiWrapper.SCORM.status("set", status);

        if (success) {
          this.setState({
            completionStatus: status
          }, function () {
            _pipwerksScormApiWrapper.SCORM.save();
          });
        } else {
          // error setting status
          this._log("ScormProvider setStatus error: could not set the status provided");
        }
      }
    }
  }, {
    key: "set",
    value: function set(param, val) {
      if (!this.state.apiConnected) return;

      var success = _pipwerksScormApiWrapper.SCORM.set(param, val);

      if (success) {
        _pipwerksScormApiWrapper.SCORM.save();
      } else {
        // error setting value
        this._log("ScormProvider set error: could not set:", param, val);
      }
    }
  }, {
    key: "get",
    value: function get(param) {
      if (!this.state.apiConnected) return;
      return _pipwerksScormApiWrapper.SCORM.get(param);
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement(ScoContext.Provider, {
        value: this.state
      }, this.props.children);
    }
  }]);

  return ScormProvider;
}(_react.Component);

ScormProvider.propTypes = {
  version: _propTypes.default.bool,
  debug: _propTypes.default.bool
};
ScormProvider.defaultProps = {
  debug: false
};
var _default = ScormProvider;
exports.default = _default;