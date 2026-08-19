'use strict';
const { createCoreService } = require('@strapi/strapi').factories;

const UID = 'api::fritzi-audit-log.fritzi-audit-log';

module.exports = createCoreService(UID, ({ strapi }) => ({
  async logAction({ action, target }) {
    const ctx = strapi.requestContext.get();
    const author = ctx?.state?.user?.email ?? 'system';
    await strapi.documents(UID).create({
      data: { at: new Date(), action, target, author },
    });
  },
}));
