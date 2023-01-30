"use strict";
const { sanitizeEntity } = require("strapi-utils/lib");

/**
 * events controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::events.events", ({ strapi }) => ({
  // Method 1: Creating an entirely custom action
  async me(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.badRequest(null, [
        { messages: [{ id: "No  authorization header was found" }] },
      ]);
    }

    const data = await strapi.entityService.findMany("api::events.events", {
      user: user.id,
    });
    console.log(data);
    if (!data) {
      return ctx.notFound();
    }
    const result = await sanitizeEntity(data, {
      model: strapi.getModel("api::events.events"),
    });
    return result;
  },
}));
