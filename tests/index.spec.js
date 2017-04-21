var exampleJson = require("./fixtures/webfinger.json");
var exampleXml = require("fs")
  .readFileSync(__dirname + "/fixtures/webfinger.xml")
  .toString();

import weebfinger from "../src/index.js";

describe("with json object", function() {
  var webfinger = weebfinger.fromJrd(exampleJson);
  testWebfingerResult(webfinger);
});

describe("with xml string", function() {
  var webfinger = weebfinger.fromXml(exampleXml);
  testWebfingerResult(webfinger);
});

describe("from jrd to jrd transform", function() {
  var webfinger = weebfinger.fromJrd(exampleJson);
  var generatedJrd = weebfinger.toJrd(webfinger);
  var generatedWebfinger = weebfinger.fromJrd(generatedJrd);
  testWebfingerResult(generatedWebfinger);
});

function testWebfingerResult(webfinger) {
  describe("#links", function() {
    it("returns a non-empty object", function() {
      expect(webfinger.links).not.toBe({});
    });
  });

  describe("#link", function() {
    it("returns a value for a given rel", function() {
      expect(
        webfinger.links["http://webfinger.net/rel/profile-page"].href
      ).toEqual("https://quitter.no/gargron");
    });

    it("returns the template attribute for a given rel", function() {
      expect(
        webfinger.links["http://ostatus.org/schema/1.0/subscribe"].template
      ).toEqual("https://quitter.no/main/ostatussub?profile={uri}");
    });

    it("returns titles map", function() {
      expect(
        webfinger.links["http://spec.example.net/photo/1.0"].titles["en"]
      ).toEqual("User Photo");
    });

    it("returns a properties map", function() {
      expect(
        webfinger.links["http://spec.example.net/photo/1.0"].properties[
          "http://spec.example.net/created/1.0"
        ]
      ).toEqual("1970-01-01");
    });
  });

  describe("#subject", function() {
    it("returns the subject", function() {
      expect(webfinger.subject).toEqual("acct:gargron@quitter.no");
    });
  });

  describe("#aliases", function() {
    it("returns a non-empty array", function() {
      expect(webfinger.aliases).not.toBe({});
    });
  });

  describe("#properties", function() {
    it("returns an array", function() {
      expect(webfinger.properties).not.toBe({});
    });
  });

  describe("#property", function() {
    it("return the value for a key", function() {
      expect(webfinger.properties["http://webfinger.example/ns/name"]).toEqual(
        "Bob Smith"
      );
    });
  });
}
