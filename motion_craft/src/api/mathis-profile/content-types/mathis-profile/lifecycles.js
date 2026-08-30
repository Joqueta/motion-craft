'use strict';

const AUDIT_UID = 'api::mathis-audit-log.mathis-audit-log';
const TARGET_KIND = 'mathis-profile';

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
