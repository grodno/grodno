var APP = {
    ID : 'grodno.co'
    ,
    TITLE : 'Grodno'
    ,
    COPYRIGHT : '2013 Grodno'
    ,
    SOURCES:{
        SITE:'https://script.google.com/macros/s/AKfycbx1AsNPawV5QDldh0obaSRkSzaYT1ZA3mbQK40_WFMPDvUjT5cl/exec?doc=0AqQx4KOOt8TGdEZWZHpBdXAtNlVSMUFMOXppQ3ZuMkE'
        ,
        TOURNAMENTS : 'https://script.google.com/macros/s/AKfycbwAEd1uSQRIi15_OEKvhwxZUQ7Kc0NA7lP-DMmgmEp3-G17tgM4/exec'
    }
    ,
    GAT :{
        account: 'UA-37246628-1'
    }
    ,
    GOOGLE_API_KEY:'AIzaSyAGenobWLKI-F6MWzrHIXmviwJww43n2EM'//'AIzaSyA--IJRFbmFubpjcz5Yherycv6Vy48qBY0'
};

APP.LOCATION = Object.parseUri(''+window.location);

APP.DEBUG = (AP.LOCATION.authority.indexOf('local')+1);

APP.VERSION =  APP.DEBUG ? -1 : "1.0.3";

(function (global) {

    // register async listener for cached resources
    Object.cache.createJSSource(APP.VERSION);   
   
    // entity type factory
    Object.entity.ENTITY_TYPE_FACTORY_URL = 'js://{0}';
            
    // register async listener for pages
    Object.entity.create({
        id:'CachedResourceProvider:page', 
        version: APP.VERSION, 
        urlTemplate:'/page/{0}.html?v='+APP.VERSION,
        cacheDeserializer: Function.NONE
    });

    // register data provider for Blogger posts
    Object.entity.create({
        id:'CachedResourceProvider:blogger' , 
        version: ''+Math.round((new Date()).valueOf() / 86400000),
        scope : 'session', 
        urlTemplate:'[jsonp]https://www.googleapis.com/blogger/v3/blogs/1638693468845489013/posts?{0}&key='+APP.GOOGLE_API_KEY
    });
    
    Object.entity.create("WebStorage://#settings");
 
    // @define UI [Application] entity
    Object.entity.define('Application extends box', {
        
        siteUrl:'[jsonp]'+APP.SOURCES.SITE
        ,
        properties:['nonequal:page', 'content', 'site','html:html']
        , 
        contentUrlExpression : '"page://"+(${@.page}||"home")'
        ,
        methods: function(_super) {
            var _host = APP.LOCATION.authority;
            
            var _page = function(u){
                
                var h = (u.hash && (u.hash[0]=='!' || u.hash[0]=='~')) ? u.hash.substring(1) : null;
                if (h) return h;
                
                var ispage = u.type? (_host===u.authority) : (u.id.substr(0,2)!=='//'), p = u.path[0];
                return (ispage && (p.indexOf('.')==-1))? p : null;
            }
            return {
                init : function() {
                    var T = this;

                    _super.init.apply(this, arguments);

                    global.onclick = function (ev0){ 
                        var ev = Object.dom.createEvent(ev0);
                        var href = ev.target.href;
                        if (href) {
                            var h = _page(Object.parseUri(href));
                            if (h!==null) {
                                T.go(h);
                                return false;
                            }
                        }
                        return true;
                    }
                    
                    this.go(_page(APP.LOCATION) || null);
                }
            }
        }
        ,
        // go to page
        go: function(h) {
            h = h || '';
            this._set('page', h);
            try {
                window.history.pushState({}, null, h?('/#~'+h):'');
            } catch (e) {
                        
            }
        }
        ,
        // adopt html content
        contentAsyncAdapter: function(err, t) {
            this.setChildren(null);
            this._set('html', '');
            
            if (!t) return '<p class="label label-error">Page '+this.page+' is unavailable</p>';
            
            if (t.substring(0,1)=='{') {
                this.setChildren(Object.parse(t));
            } else {
                this._set('html', t);
            } 
            return '';
        }
        ,
        siteChanged : function(ev) {
            //Object.dom.init(this);
            Object.log(ev.value)
        }  
        ,
        htmlChanged : function() {
            Object.dom.init(this);
        }

    });
    
    Object.entity.define('GalleryList extends List', {
        itemTemplate:'<hr/><dt><h5>{name}</h5></dt><dd class="row"><div class="span2"><a href="{url}" target="_blank"><img src="{icon}" class="img-polaroid"/></a></div>'+
    '<div class="span6"><p>{description}</p><a href="{url}" target="_blank" class="btn btn-primary" type="button">Открыть галерею  »</a></div></dd>'
    });
    
    Object.entity.define('TournamentsList extends List', {
        itemTemplate:'<hr/><dt><h5>{name} <span style="float:right;" class="label">{date}, {location}</span></h5></dt><dd class="row"><div class="span2"><a href="{url}" target="_blank"><img src="{icon}" class="img-polaroid"/><br/>подробнее...</a></div>'
        ,
        methods: function(_super) {

            return { 
                
                dataAsyncAdapter : function(err, data) {
                    this.domNode.innerHTML='';
                    return this.normalizeItemDataIterator(this.normalizeCellsIterator(Object.get(data,'feed.entry'),[]),[]);
                }
                ,
                normalizeItemDataIterator: (function(v, i){
                    if (i<2) return;
                    
                    v.date = Object.get(v,'A');
                    v.name = Object.get(v,'B');
                    v.location = Object.get(v,'C');
                    v.url = Object.get(v,'D');
                    v.icon = Object.get(v,'E');
                    this.push(v);
                }).iterator()  
                ,
                normalizeCellsIterator: (function(v){
                    var key = Object.get(v,'title.$t'), col= key[0], row=Number(key.substring(1));
                    ;
                    if (!this[row]){
                        this[row] = {};
                    }
                    this[row][col] = Object.get(v,'content.$t');
                }).iterator()  
            }

        }  
    });

})(window)