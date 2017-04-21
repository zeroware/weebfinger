"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromJsonObject = fromJsonObject;
exports.fromXml = fromXml;

var _xpath = require("xpath");

var _xpath2 = _interopRequireDefault(_xpath);

var _xmldom = require("xmldom");

var _xmldom2 = _interopRequireDefault(_xmldom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function fromJsonObject(json) {
  var webfinger = {
    subject: json.subject,
    aliases: json.aliases || [],
    links: {},
    properties: json.properties || {}
  };

  if (json.links) {
    for (var i in json.links) {
      var link = json.links[i];
      webfinger.links[link.rel] = link;
    }
  }

  return webfinger;
}

function fromXml(xml) {
  var doc = new _xmldom2.default.DOMParser().parseFromString(xml);
  var subject = doc.select1("string(//xmlns:Subject)");
  var aliases = doc.select("string(//xlmns:Alias)");

  var properties = doc.select("/xmlns:XRD/xmlns:Property");

  var webfinger = {
    subject: subject,
    aliases: aliases || [],
    links: {},
    properties: properties || {}
  };

  return webfinger;
}