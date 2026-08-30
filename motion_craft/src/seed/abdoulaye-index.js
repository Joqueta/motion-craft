'use strict';

const path = require('path');
const { ABDOULAYE_SEED, ABDOULAYE_PROJECTS } = require('./abdoulaye-content');
const { uploadLocalAsset } = require('./upload-local-asset');

const ASSETS_DIR = path.join(__dirname, '../../../assets/abdoulaye');

async function seedSingleTypes(strapi) {
  for (const [uid, definition] of Object.entries(ABDOULAYE_SEED)) {
    try {
      const count = await strapi.query(uid).count();
      if (count > 0) continue;

      const data = { ...definition.text };

      for (const [field, mediaRef] of Object.entries(definition.media)) {
        const fileId = await uploadLocalAsset(strapi, ASSETS_DIR, mediaRef.asset, mediaRef.alt);
        data[field] = fileId;
      }

      await strapi.documents(uid).create({ data, status: 'published' });
      strapi.log.info(`[seed] ${uid} initialisé avec le contenu par défaut.`);
    } catch (error) {
      strapi.log.warn(`[seed] Échec du seed pour ${uid}: ${error.message}`);
    }
  }
}

async function seedProjects(strapi) {
  const uid = 'api::abdoulaye-project.abdoulaye-project';

  try {
    const count = await strapi.query(uid).count();
    if (count > 0) return;

    for (const project of ABDOULAYE_PROJECTS) {
      const data = { ...project.text };

      for (const [field, mediaRef] of Object.entries(project.media)) {
        const fileId = await uploadLocalAsset(strapi, ASSETS_DIR, mediaRef.asset, mediaRef.alt);
        data[field] = fileId;
      }

      await strapi.documents(uid).create({ data, status: 'published' });
    }

    strapi.log.info(`[seed] ${uid} initialisé avec ${ABDOULAYE_PROJECTS.length} projets.`);
  } catch (error) {
    strapi.log.warn(`[seed] Échec du seed pour ${uid}: ${error.message}`);
  }
}

async function seedAbdoulayeContent(strapi) {
  await seedSingleTypes(strapi);
  await seedProjects(strapi);
}

module.exports = { seedAbdoulayeContent };
