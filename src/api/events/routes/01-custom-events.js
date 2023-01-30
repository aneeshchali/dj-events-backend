module.exports = {
  routes: [
    {
      // Path defined with an URL parameter
      method: "GET",
      path: "/event/me",
      handler: "events.me",
    },
  ],
};
