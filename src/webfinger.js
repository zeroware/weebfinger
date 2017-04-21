// @flow

import type { Link } from "./link";

export type Webfinger = {|
  subject: string,
  aliases: Array<string>,
  links: { [string]: Link },
  properties: { [string]: string }
|};
