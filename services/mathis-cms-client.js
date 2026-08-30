import { createCmsClient } from "../lib/cms.js";
import config from "../config.js";

const client = createCmsClient({
  baseUrl: config.cmsUrl,
  timeout: config.timeout,
  retries: config.retries,
});

export default client;
