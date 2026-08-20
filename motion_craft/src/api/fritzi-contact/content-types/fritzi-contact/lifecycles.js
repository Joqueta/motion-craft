'use strict';

const AUDIT_UID = 'api::fritzi-audit-log.fritzi-audit-log';
const TARGET_KIND = 'fritzi-contact';

module.exports = {
  async afterCreate() {
    await strapi.service(AUDIT_UID).logAction({ action: 'create', target: TARGET_KIND });
  },
  async afterUpdate() {
    await strapi.service(AUDIT_UID).logAction({ action: 'update', target: TARGET_KIND });
  },
  async afterDelete() {
    await strapi.service(AUDIT_UID).logAction({ action: 'delete', target: TARGET_KIND });
  },
};
