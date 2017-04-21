// @flow

export type LinkProperties = { [string]: string };
export type LinkTitles = { [string]: string };
export type Link = {|
  [string]: string,
  href: ?string,
  type: ?string,
  rel: string,
  titles: LinkTitles,
  properties: LinkProperties
|};
