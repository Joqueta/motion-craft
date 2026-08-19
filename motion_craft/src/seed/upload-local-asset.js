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

  const ext = path.extname(absolutePath).toLowerCase();
  const mimetype = MIME_TYPES[ext] ?? 'application/octet-stream';

  const [file] = await strapi.plugin('upload').service('upload').upload({
    data: { fileInfo: { alternativeText } },
    files: {
      filepath: absolutePath,
      originalFilename: path.basename(absolutePath),
      mimetype,
      size: fs.statSync(absolutePath).size,
    },
  });

  return file.id;
}

module.exports = { uploadLocalAsset };
