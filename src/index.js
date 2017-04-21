// @flow

import type { Link } from "./link";
import type { Webfinger } from "./webfinger";

import xpath from "xpath";
import dom from "xmldom";

function fromJrd(json: Object): Webfinger {
  let webfinger: Webfinger = {
    subject: json.subject,
    aliases: json.aliases || [],
    links: {},
    properties: json.properties || {}
  };

  if (json.links) {
    for (var i in json.links) {
      let link = json.links[i];
      webfinger.links[link.rel] = link;
    }
  }

  return webfinger;
}

function toJrd(webfinger: Webfinger): Object {
  let jrd = {
    subject: webfinger.subject,
    aliases: webfinger.aliases,
    properties: webfinger.properties,
    links: []
  };

  for (let i in webfinger.links) {
    jrd.links.push(webfinger.links[i]);
  }

  return jrd;
}

function fromXml(xml: string): Webfinger {
  let doc = new dom.DOMParser().parseFromString(xml);

  let select = xpath.useNamespaces({
    xrd: "http://docs.oasis-open.org/ns/xri/xrd-1.0"
  });

  let subject = select("string(//xrd:Subject)", doc);
  let aliases = select("string(//xrd:Alias)", doc);

  let properties = {};
  let links = {};

  select("/xrd:XRD/xrd:Property", doc).forEach(function(p) {
    let type = p.getAttribute("type");
    let content = select("text()", p)[0].nodeValue;
    properties[type] = content;
  });

  select("//xrd:Link", doc).forEach(function(l) {
    let rel = l.getAttribute("rel");

    let linkTitles = {};
    let linkProperties = {};

    select(".//xrd:Title", l).forEach(function(t) {
      let lang = t.getAttribute("xml:lang");
      linkTitles[lang] = select("text()", t)[0].nodeValue;
    });

    select(".//xrd:Property", l).forEach(function(lp) {
      let pType = lp.getAttribute("type");
      linkProperties[pType] = select("text()", lp)[0].nodeValue;
    });

    links[rel] = {
      href: null,
      type: null,
      rel: rel,
      titles: linkTitles,
      properties: linkProperties
    };

    for (let i = 0; i < l.attributes.length; i++) {
      let attrName = l.attributes.item(i).name;
      links[rel][attrName] = l.getAttribute(attrName);
    }
  });

  let webfinger: Webfinger = {
    subject: subject,
    aliases: aliases || [],
    links: links || {},
    properties: properties || {}
  };

  return webfinger;
}

const weebfinger = {
  fromXml,
  fromJsonObject: fromJrd,
  fromJrd,
  toJrd
};

export default weebfinger;
export type { Webfinger };
