'use strict';

const { seedFritziContent } = require('./seed');

const PUBLIC_READ_ACTIONS = [
  'api::fritzi-profile.fritzi-profile.find',
  'api::fritzi-profile.fritzi-profile.findOne',
  'api::fritzi-home.fritzi-home.find',
  'api::fritzi-home.fritzi-home.findOne',
  'api::fritzi-about.fritzi-about.find',
  'api::fritzi-about.fritzi-about.findOne',
  'api::fritzi-contact.fritzi-contact.find',
  'api::fritzi-contact.fritzi-contact.findOne',
  'api::fritzi-project.fritzi-project.find',
  'api::fritzi-project.fritzi-project.findOne',
];

async function ensurePublicReadAccess(strapi) {
  const publicRole = await strapi
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  if (!publicRole) return;

  const existing = await strapi.query('plugin::users-permissions.permission').findMany({
    where: { role: publicRole.id, action: { $in: PUBLIC_READ_ACTIONS } },
  });
  const existingActions = new Set(existing.map((permission) => permission.action));

  const toCreate = PUBLIC_READ_ACTIONS.filter((action) => !existingActions.has(action));

  await Promise.all(
    toCreate.map((action) =>
      strapi.query('plugin::users-permissions.permission').create({
        data: { action, role: publicRole.id },
      }),
    ),
  );
}

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    await ensurePublicReadAccess(strapi);
    await seedFritziContent(strapi);
  },
};
