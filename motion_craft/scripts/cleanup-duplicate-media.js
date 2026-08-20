'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { compileStrapi, createStrapi } = require('@strapi/strapi');

const { FRITZI_SEED } = require('../src/seed/fritzi-content');

function fileHash(absolutePath) {
  return crypto.createHash('md5').update(fs.readFileSync(absolutePath)).digest('hex');
}

function buildPopulate(definition) {
  const populate = {};
  for (const field of Object.keys(definition.media)) {
    const [parent, child] = field.split('.');
    if (!child) {
      populate[field] = true;
      continue;
    }
    populate[parent] = { populate: [...(populate[parent]?.populate ?? []), child] };
  }
  return populate;
}

function collectReferencedIds(entry, definition, ids) {
  for (const field of Object.keys(definition.media)) {
    const [parent, child] = field.split('.');
    const media = child ? entry[parent]?.[child] : entry[field];
    if (media?.id) ids.add(media.id);
  }
}

async function collectReferencedFileIds(strapi) {
  const referenced = new Set();

  for (const [uid, definition] of Object.entries(FRITZI_SEED)) {
    if (Object.keys(definition.media).length === 0) continue;
    const entries = await strapi.db.query(uid).findMany({ populate: buildPopulate(definition) });
    for (const entry of entries) {
      collectReferencedIds(entry, definition, referenced);
    }
  }

  return referenced;
}

async function run() {
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  app.log.level = 'error';

  try {
    const files = await app.db.query('plugin::upload.file').findMany({});
    const referenced = await collectReferencedFileIds(app);

    const byName = new Map();
    for (const file of files) {
      const list = byName.get(file.name) ?? [];
      list.push(file);
      byName.set(file.name, list);
    }

    let deleted = 0;
    let kept = 0;

    for (const group of byName.values()) {
      if (group.length < 2) continue;

      const byHash = new Map();
      for (const file of group) {
        const absolutePath = path.join(app.dirs.static.public, file.url);
        if (!fs.existsSync(absolutePath)) continue;
        const hash = fileHash(absolutePath);
        const list = byHash.get(hash) ?? [];
        list.push(file);
        byHash.set(hash, list);
      }

      for (const dupes of byHash.values()) {
        if (dupes.length < 2) continue;

        dupes.sort((a, b) => a.id - b.id);
        const keeper = dupes.find((f) => referenced.has(f.id)) ?? dupes[0];
        kept += 1;

        for (const file of dupes) {
          if (file.id === keeper.id) continue;
          if (referenced.has(file.id)) {
            console.warn(`[cleanup] Ignoré ${file.name} (id ${file.id}) : encore référencé ailleurs.`);
            continue;
          }
          await app.plugin('upload').service('upload').remove(file);
          deleted += 1;
          console.log(`[cleanup] Supprimé doublon ${file.name} (id ${file.id}), conservé id ${keeper.id}`);
        }
      }
    }

    console.log(`[cleanup] Terminé. ${deleted} doublon(s) supprimé(s), ${kept} fichier(s) conservé(s).`);
  } finally {
    await app.destroy();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
