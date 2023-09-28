"use strict";
const apiRoutes = require("../middlewares/apiRoutes");
const auth = require("../middlewares/auth");
const path = require("path");

module.exports.configure = (app, endpoints) => {
  app
    .get("/", (req, res) => {
      return res.send("The Gifting Application Server");
    })
    .descriptor({
      name: "Root API",
    });

  app
    .get("/api", (req, res) => {
      return res.send("The Gifting Application Server");
    })
    .descriptor({
      name: "Root API",
    });

  app
    .get("/api/onboarding", (req, res) => {
      return res.send(endpoints.listAllEndpoints(app));
    })
    .descriptor({
      name: "Retrieve APIs documentation",
    });
  //    app.get("/api/users",(req,res) =>{
  //         return res.send(endpoints.listAllEndpoints(app));
  //    }).descriptor({
  //         name: 'Retrieve APIs documentation',
  //    })
  app
    .get("/api/role", (req, res) => {
      return res.send(endpoints.listAllEndpoints(app));
    })
    .descriptor({
      name: "Retrieve APIs documentation",
    });

  const root = path.normalize(__dirname + "./../");
  let api = apiRoutes(root, app);

  api.model("auths").register([
    {
      action: "POST",
      method: "signup",
      url: "/signup",
    },
    {
      action: "POST",
      method: "login",
      url: "/login",
    },
    {
      action: "POST",
      method: "logout",
      url: "/logout/:id",
      filter: auth.validateToken,
    },
    {
      action: "POST",
      method: "setPassword",
      url: "/setPassword/:id",
      filter: auth.validateToken,
    },
    {
      action: "POST",
      method: "changePassword",
      url: "/changePassword/:id",
      // filter: auth.validateToken,
    },
    {
      action: "POST",
      method: "forgotPassword",
      url: "/forgotPassword/:id",
    },
    
  ]);

  api.model("users").register([
    {
      action: "POST",
      method: "create",
      filter:auth.validateToken
    },
    {
      action: "PUT",
      method: "update",
      url: "/:id",
      filter: auth.validateToken,
    },
    {
      action: "GET",
      method: "search",
      filter: auth.validateToken,
    },
    {
      action: "GET",
      method: "get",
      url: "/:id",
      filter: auth.validateToken,
    },
    {
      action: "DELETE",
      method: "delete",
      url: "/:id",
      filter: auth.validateToken,
    },

    {
      action: "POST",
      method: "switchProfile",
      url: "/switch",
      filter: auth.validateToken,
    },
  ]);

  api.model("roles").register([
    {
      action: "POST",
      method: "create",
      
    },
    {
      action: "PUT",
      method: "update",
      url: "/:id",
      // filter: auth.authorize('admin', 'update')
      filter: auth.validateToken,
    },
    {
      action: "GET",
      method: "get",
      url: "/:id",
      filter: auth.validateToken,
    },
    {
      action: "GET",
      method: "search",
      filter: auth.validateToken,
    },
    {
      action: "DELETE",
      method: "delete",
      url: "/:id",
      filter: auth.validateToken,
    },
  ]);

  api.model("profiles").register([
    {
      action: "POST",
      method: "create",
      filter: auth.validateToken,
    },
    {
      action: "PUT",
      method: "update",
      url: "/:id",
      filter: auth.validateToken,
    },
    {
      action: "GET",
      method: "get",
      url: "/:id",
      filter: auth.validateToken,
    },
    {
      action: "GET",
      method: "search",
      // filter: auth.validateToken,
    },
    {
      action: "DELETE",
      method: "delete",
      url: "/:id",
      filter: auth.validateToken,
    },
  ]);
};
