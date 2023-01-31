"use strict";
const { sanitizeEntity } = require("strapi-utils/lib");

/**
 * events controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::events.events", ({ strapi }) => ({
  // Create event with linked user
  async create(ctx) {
    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      data.user = ctx.state.user.id;
      entity = await strapi.entityService.create("api::events.events", {
        data: { data, files },
      });
    } else {
      ctx.request.body.data.user = ctx.state.user.id;
      entity = await strapi.entityService.create("api::events.events", {
        data: ctx.request.body.data,
      });
    }
    return sanitizeEntity(entity, {
      model: strapi.getModel("api::events.events"),
    });
  },
  // Update user event
  async update(ctx) {
    const { id } = ctx.params;

    let entity;

    const events = await strapi.entityService.findMany("api::events.events", {
      filters: {
        $and: [{ id: ctx.params.id }, { user: ctx.state.user.id }],
      },
    });

    if (events.length === 0) {
      return ctx.response.unauthorized(`You can't update this entry`);
    }

    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.entityService.update("api::events.events", id, {
        data: {
          data,
          files,
        },
      });
    } else {
      entity = await strapi.entityService.update("api::events.events", id, {
        data: ctx.request.body.data,
      });
    }

    return sanitizeEntity(entity, {
      model: strapi.getModel("api::events.events"),
    });
  },
  // Delete a user event
  async delete(ctx) {
    const { id } = ctx.params;

    const events = await strapi.entityService.findMany("api::events.events", {
      filters: {
        $and: [{ id: ctx.params.id }, { user: ctx.state.user.id }],
      },
    });

    if (events.length === 0) {
      return ctx.response.unauthorized(`You can't update this entry`);
    }

    const entity = await await strapi.entityService.delete(
      "api::events.events",
      id
    );
    return sanitizeEntity(entity, {
      model: strapi.getModel("api::events.events"),
    });
  },

  // Method 1: Creating an entirely custom action
  async me(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.badRequest(null, [
        { messages: [{ id: "No  authorization header was found" }] },
      ]);
    }

    const data = await strapi.entityService.findMany("api::events.events", {
      filters: { user: user.id },
    });
    if (!data) {
      return ctx.notFound();
    }
    const result = await sanitizeEntity(data, {
      model: strapi.getModel("api::events.events"),
    });
    return result;
  },
}));
