Object.DEBUG = not ('local' in window.location.hostname)

Object.entity.create 
    id : 'app:webclient.Application' 
    title : CONFIG.TITLE
    plugins: [
            
            "remote:HttpService"
            
            "script:ScriptService"

            "settings:Settings"

            {
                id: "entity:ScriptService"
                scriptTypeC:"text/coffeescript"
                methods : (_super) ->
                    resolveUri: (uri) ->
                        uri.path = ('/js/'+uri.domain.replace(/\./g,'/')+'.js').split('/')
                        uri.domain = "*"
                        _super.resolveUri.call @, uri
            }
            {
                
                id:"html:HtmlLoader"
                storage: if Object.DEBUG then null else window.localStorage
            }
            {            
                id:"db:IndexedDatabase"
                #syncPeriod: 1 * 6 *1000
                syncUriExpression: "'script://script.google.com/macros/s/AKfycbx1AsNPawV5QDldh0obaSRkSzaYT1ZA3mbQK40_WFMPDvUjT5cl/exec?doc=0AqQx4KOOt8TGdEZWZHpBdXAtNlVSMUFMOXppQ3ZuMkE&jsonp=callback&ts='+${?.lastSynchedTimestampOnce}"#ByPeriod
                #socketChannel:'grodno.heroku.com'
                version: 5
                scheme: ['meta','links','enums','error']
            }
            {
                id:"gsheet:Cache"
                storage: window.localStorage
                uriPattern:'script://script.google.com/macros/s/AKfycbx1AsNPawV5QDldh0obaSRkSzaYT1ZA3mbQK40_WFMPDvUjT5cl/exec?doc={{domain}}&sheet={{path}}&jsonp=callback&version={{version}}'
            }
            {
                id:"blogger:Cache"
                storage: window.sessionStorage
                uriPattern:"script://www.googleapis.com/blogger/v3/blogs/{{domain}}/posts?key=#{CONFIG.GOOGLE_API_KEY}&jsonp=callback&ssl=true&version={{version}}"
            }
            {
               
                id:'lexio:lexiomated.TextFactory'
                plugins: [
                        'lexiomated.plugin.ParseHtml'
                        'lexiomated.plugin.SplitText'
                        'lexiomated.plugin.Numerics'
                        'lexiomated.plugin.Hardcoded'
                        'lexiomated.plugin.Morpheus'
                        'lexiomated.plugin.WordScore'
                        'lexiomated.plugin.Sentences'
                ]
            }
        ]

doReload = ->
        ls = window.localStorage
        ls.removeItem(ls.key(i)) for o, i in ls
        ls

