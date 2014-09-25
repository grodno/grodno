// Generated by CoffeeScript 1.8.0
(function() {
  require('./axoid/axoid.coffee');

  require('./commons/commons.coffee');

  require('./webserver/utils.coffee');

  Object.DEBUG = true;

  Object.entity.create({
    id: 'entity:EventHandler',
    handleEvent: function(ev) {
      require('./' + ev.uri.domain.replace(/\./g, '/') + '.coffee');
      return ev.callback();
    }
  });

  Object.entity.create({
    id: 'app:webserver.Application',
    config: require('./config.coffee'),
    ipaddress: process.env.OPENSHIFT_NODEJS_IP || process.env.IP || "127.0.0.1",
    port: process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8000,
    plugins: ['file:webserver.FilesPlugin', 'webserver.RequestParsingPlugin', 'webserver.DispatcherPlugin', 'home:webserver.HomePlugin', 'webserver.DustPlugin', 'webserver.ResponsePlugin']
  });

}).call(this);
