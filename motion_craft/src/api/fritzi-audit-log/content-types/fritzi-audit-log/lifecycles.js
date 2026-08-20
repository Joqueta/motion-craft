'use strict';

const { computeIdsToDelete } = require('../../services/retention.js');

const UID = 'api::fritzi-audit-log.fritzi-audit-log';

module.exports = {
  async afterCreate() {
    const entries = await strapi.db.query(UID).findMany({
      select: ['id', 'at'],
      orderBy: { at: 'desc' },
    });
    const idsToDelete = computeIdsToDelete(entries, Date.now());
    if (idsToDelete.length > 0) {
      await strapi.db.query(UID).deleteMany({ where: { id: { $in: idsToDelete } } });
    }
  },
};
