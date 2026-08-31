'use strict';

const path = require('path');
const { FRITZI_SEED } = require('./fritzi-content');
const { uploadLocalAsset } = require('./upload-local-asset');

const ASSETS_DIR = path.join(__dirname, '../../../assets/fritzi');

async function seedFritziContent(strapi) {
  for (const [uid, definition] of Object.entries(FRITZI_SEED)) {
    try {
      const published = await strapi.documents(uid).findFirst({ status: 'published' });
      if (published) continue;

      const data = { ...definition.text };

      for (const [field, mediaRef] of Object.entries(definition.media)) {
        const fileId = await uploadLocalAsset(strapi, ASSETS_DIR, mediaRef.asset, mediaRef.alt);
        const [parent, child] = field.split('.');
        if (child) {
          data[parent] = { ...(data[parent] ?? {}), [child]: fileId };
        } else {
          data[field] = fileId;
        }
      }

      // A draft-only entry (e.g. created by hand in the admin, never published)
      // blocks a fresh create — update and publish it instead of skipping.
      const draft = await strapi.documents(uid).findFirst();
      if (draft) {
        await strapi.documents(uid).update({ documentId: draft.documentId, data });
        await strapi.documents(uid).publish({ documentId: draft.documentId });
      } else {
        await strapi.documents(uid).create({ data, status: 'published' });
      }
      strapi.log.info(`[seed] ${uid} initialisé avec le contenu par défaut.`);
    } catch (error) {
      strapi.log.warn(`[seed] Échec du seed pour ${uid}: ${error.message}`);
    }
  }
}

module.exports = { seedFritziContent };
