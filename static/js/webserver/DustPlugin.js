(function() {
  Object.entity.define({
    id: 'webserver.DustPlugin',
    templatePattern: "file://*/views/{0}.html",
    methods: function(_super) {
      return {
        config: function(app) {
          var dust;
          dust = require("dustjs-linkedin");
          dust.optimizers.format = function(context, node) {
            return node;
          };
          dust.onLoad = (function(_this) {
            return function(view, callback) {
              return Object.event.fire(String.format(_this.templatePattern, view), callback);
            };
          })(this);
          return app.use(function(req, res, next) {
            var context, viewId;
            if (!(viewId = req.viewId)) {
              return next();
            }
            context = Object.clone(req.result || {}, {
              app: app.config,
              viewId: viewId
            });
            return dust.render(viewId, context, function(err, result) {
              req.error = err;
              req.result = result;
              return next();
            });
          });
        }
      };
    }
  });

}).call(this);
