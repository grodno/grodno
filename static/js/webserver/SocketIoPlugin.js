(function() {
  Object.entity.define({
    id: "SocketServer extends EventHandler",
    methods: function(_super) {
      return {
        config: function(app) {
          var T, io, sockets;
          T = this;
          io = require("socket.io")(this.http);
          io.configure(function() {
            io.set("transports", T.transports || ["xhr-polling"]);
            io.set("polling duration", T.pollingDuration || 15);
            io.enable(T.enable || "log");
          });
          sockets = io.sockets;
          T.broadcastAll = function(ev) {
            sockets.json.send(ev.payload);
          };
          app.post("/", function(req, res) {
            io.emit("message", JSON.stringify(req.body));
            return res.json(req.body);
          });
          sockets.on("connection", function(socket) {
            Object.debug("connection");
            socket.on("connect", function() {
              T.onConnect({});
            });
            socket.on("disconnect", function() {
              console.log("user disconnected");
            });
            socket.on("message", function(ev, callback) {
              Object.debug("message", ev, callback);
              ev.callback = callback || Function.NONE;
              if (ev.user) {
                socket.set("user", ev.user, function() {
                  Object.notify(ev);
                });
              } else {
                socket.get("user", function(err, user) {
                  ev.user = user;
                  Object.notify(ev);
                });
              }
            });
            socket.on("disconnect", function() {
              T.onDisconnect({});
            });
          });
        },
        onConnect: function(ev) {
          Object.debug("onConnect");
        },
        onDisconnect: function(ev) {
          Object.debug("onDisconnect");
        },
        user: function(ev) {
          Object.debug("user");
          ev.callback();
        },
        onEvent: function(ev) {
          var op;
          op = ev.uri.host;
          Object.debug("Socket.", op);
          ev.uri = ev.uri.hash || ev.uri;
          this[op](ev);
        }
      };
    }
  });

}).call(this);
