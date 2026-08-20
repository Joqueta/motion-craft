'use strict';

const AUDIT_UID = 'api::fritzi-audit-log.fritzi-audit-log';

function targetOf(result) {
  return String(result?.slug ?? result?.id ?? '');
}

module.exports = {
  async afterCreate(event) {
    await strapi.service(AUDIT_UID).logAction({ action: 'create', target: targetOf(event.result) });
  },
  async afterUpdate(event) {
    await strapi.service(AUDIT_UID).logAction({ action: 'update', target: targetOf(event.result) });
  },
  async afterDelete(event) {
    await strapi.service(AUDIT_UID).logAction({ action: 'delete', target: targetOf(event.result) });
  },
};
