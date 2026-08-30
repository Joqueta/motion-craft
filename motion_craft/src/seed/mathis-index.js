'use strict';

const path = require('path');
const { MATHIS_SEED, MATHIS_PROJECTS } = require('./mathis-content');
const { uploadLocalAsset } = require('./upload-local-asset');

const ASSETS_DIR = path.join(__dirname, '../../../assets/mathis');

async function seedSingleTypes(strapi) {
  for (const [uid, definition] of Object.entries(MATHIS_SEED)) {
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
  const uid = 'api::mathis-project.mathis-project';

  try {
    const count = await strapi.query(uid).count();
    if (count > 0) return;

    for (const project of MATHIS_PROJECTS) {
      const data = { ...project.text };

      for (const [field, mediaRef] of Object.entries(project.media)) {
        const fileId = await uploadLocalAsset(strapi, ASSETS_DIR, mediaRef.asset, mediaRef.alt);
        data[field] = fileId;
      }

      await strapi.documents(uid).create({ data, status: 'published' });
    }

    strapi.log.info(`[seed] ${uid} initialisé avec ${MATHIS_PROJECTS.length} projets.`);
  } catch (error) {
    strapi.log.warn(`[seed] Échec du seed pour ${uid}: ${error.message}`);
  }
}

async function seedMathisContent(strapi) {
  await seedSingleTypes(strapi);
  await seedProjects(strapi);
}

module.exports = { seedMathisContent };
