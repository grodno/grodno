
Object.entity.define
    id: 'webserver.RequestParsingPlugin' 
    methods: (_super) ->

        config: (app)->

            parser = require 'body-parser'
            app.use parser.json()
            app.use parser.urlencoded(extended: true)




            
