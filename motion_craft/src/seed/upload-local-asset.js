'use strict';

const fs = require('fs');
const path = require('path');

const MIME_TYPES = {
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
};

async function uploadLocalAsset(strapi, baseDir, relativePath, alternativeText) {
  const absolutePath = path.join(baseDir, relativePath);

  if (!fs.existsSync(absolutePath)) {
    strapi.log.warn(`[seed] Fichier introuvable, champ laissé vide: ${absolutePath}`);
    return null;
  }

  // Encode the source folder into the filename so distinct assets that share
  // a basename (e.g. home/bg-about-me.svg vs about/bg-about-me.svg) stay
  // distinct, while the same relativePath reused across fields (e.g.
  // default-image.svg used for 5 fritzi-project fields) dedupes to one file.
  const seedFilename = relativePath.replace(/[\\/]/g, '-');

  const existing = await strapi.query('plugin::upload.file').findOne({ where: { name: seedFilename } });
  if (existing) {
    return existing.id;
  }

  const ext = path.extname(absolutePath).toLowerCase();
  const mimetype = MIME_TYPES[ext] ?? 'application/octet-stream';

  const [file] = await strapi.plugin('upload').service('upload').upload({
    data: { fileInfo: { alternativeText } },
    files: {
      filepath: absolutePath,
      originalFilename: seedFilename,
      mimetype,
      size: fs.statSync(absolutePath).size,
    },
  });

  return file.id;
}

module.exports = { uploadLocalAsset };
