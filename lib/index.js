"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _xpath = require("xpath");

var _xpath2 = _interopRequireDefault(_xpath);

var _xmldom = require("xmldom");

var _xmldom2 = _interopRequireDefault(_xmldom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function fromJrd(json) {
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

function toJrd(webfinger) {
  var jrd = {
    subject: webfinger.subject,
    aliases: webfinger.aliases,
    properties: webfinger.properties,
    links: []
  };

  for (var i in webfinger.links) {
    jrd.links.push(webfinger.links[i]);
  }

  return jrd;
}

function fromXml(xml) {
  var doc = new _xmldom2.default.DOMParser().parseFromString(xml);

  var select = _xpath2.default.useNamespaces({
    xrd: "http://docs.oasis-open.org/ns/xri/xrd-1.0"
  });

  var subject = select("string(//xrd:Subject)", doc);
  var aliases = select("string(//xrd:Alias)", doc);

  var properties = {};
  var links = {};

  select("/xrd:XRD/xrd:Property", doc).forEach(function (p) {
    var type = p.getAttribute("type");
    var content = select("text()", p)[0].nodeValue;
    properties[type] = content;
  });

  select("//xrd:Link", doc).forEach(function (l) {
    var rel = l.getAttribute("rel");

    var linkTitles = {};
    var linkProperties = {};

    select(".//xrd:Title", l).forEach(function (t) {
      var lang = t.getAttribute("xml:lang");
      linkTitles[lang] = select("text()", t)[0].nodeValue;
    });

    select(".//xrd:Property", l).forEach(function (lp) {
      var pType = lp.getAttribute("type");
      linkProperties[pType] = select("text()", lp)[0].nodeValue;
    });

    links[rel] = {
      href: null,
      type: null,
      rel: rel,
      titles: linkTitles,
      properties: linkProperties
    };

    for (var i = 0; i < l.attributes.length; i++) {
      var attrName = l.attributes.item(i).name;
      links[rel][attrName] = l.getAttribute(attrName);
    }
  });

  var webfinger = {
    subject: subject,
    aliases: aliases || [],
    links: links || {},
    properties: properties || {}
  };

  return webfinger;
}

var weebfinger = {
  fromXml: fromXml,
  fromJsonObject: fromJrd,
  fromJrd: fromJrd,
  toJrd: toJrd
};

exports.default = weebfinger;