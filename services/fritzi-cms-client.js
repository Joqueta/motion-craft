import { createCmsClient } from "../lib/cms.js";
import config from "../config.js";

// Separate instance from services/cms-client.js: auth-service.js attaches the
// admin JWT to that shared client, which would otherwise leak into these
// public reads (and break them if the token is stale/expired).
const client = createCmsClient({
  baseUrl: config.cmsUrl,
  timeout: config.timeout,
  retries: config.retries,
});

export default client;
