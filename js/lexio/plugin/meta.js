// Lexio plugin
(function () {

    var _reg = (function(v, p){
        this[v.id] = v;
        if (v.ids){
            v.ids = v.ids.split(',');
            for (var i = 0; i < v.ids.length; i++) {
               this[v.ids[i]] = v; 
            }
        }
    }).iterator();
            
    var registry = (function(v){
        var key = v.toUpperCase();
        _reg(this[v], String[key] || (String[key]={}));
                
    }).iterator();
    
    var enums = (function(v){
        var key = v.key.toUpperCase();
        var b = String[key] || (String[key]={});
        b[v.id] = v.value;
        
    }).iterator();
  
    Array.prototype.mirrorItems = function() {
        return (function(v){
            this.push(v.mirror(''));
        }).iterator()(this, [])
    };

    var treeGenerator = (function(v){
        Object.set(this, (v+'_').split('').join('.'),v);
    }).iterator();
        
    var addIntoTree = function(key, data) {
        return treeGenerator(data, String[key] || (String[key] = {}));
    };
    
    var TYPE_U = {
        type:'x'
    }
    var DIFTONGS=['oo','ea','ei','th','gh','ou','sh','ch'];
    String.signature = function(x) {
        for ( var i = 0, r = "", l = x.length, p, c; i < l; i++) {
            c = x[i];
            if (c!==p && DIFTONGS.indexOf(p+c)===-1) {
                r += (String.CHARS[c] || TYPE_U).type;
                p = c;                
            }

        }
        return r;
    };

    var applySourceData = function(data) {
                
        registry(['chars','roots','complexies','hardcoded','chars','root_masks'], data);
                
        enums(data['~']);
                
        data.complexies && addIntoTree('COMPLEXIES_TREE', data.complexies.getKeys());
        data.prefixes && addIntoTree('PREFIXES_TREE', data.prefixes.getKeys());
        data.suffixes && addIntoTree('SUFFIXES_TREE', data.suffixes.getKeys().mirrorItems());
        data.flexies && addIntoTree('FLEXIES_TREE', data.flexies.getKeys().mirrorItems());
    };
    
    Object.entity.define("lexio/plugin/meta extends lexio/Plugin", {
        
        methods: function(_super){
             
            return {
                init: function(){
                
                    _super.init.call(this);
                    
                    var T = this;
                    
                    Function.perform([
                        
                        function(sources){
                            
                            for ( var i = 0, l=sources.length; i < l; i++) {
                                Object.notify(sources[i], this.cb());
                            }
                            
                            return true;
                        }
                        ,
                        function(err){
                            Function.iterate(applySourceData, Array.slice(arguments,2), T.home)
                            T.home.setReady();
                        }
                        ], this.sources);
                    
                }
                ,                
                // implementation of perform on event
                perform: function(err, ev) {
                    return ev;
                }
            };
            
        }
    });
    
})();




