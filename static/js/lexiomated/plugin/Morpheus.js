(function() {
  Object.entity.define({
    id: "lexiomated.plugin.Morpheus extends lexiomated.Plugin",
    requires: ['gsheet://1FNyFDeXG68gTfCbWr1gno3KykcUGvH_SXOqrjl1wZhQ/chars', 'gsheet://1JBxZVPj4pbHVlywPd9YzXyAVUrliAnOfFQ5zW57zoBA', 'gsheet://0AqQx4KOOt8TGdExjQ2ZJM0Q5MFBQSVRhYUw1ZHJMSFE'],
    methods: function(_super) {
      return {
        onRequiredLoaded: function(chars) {
          var e, i, _i, _len, _results;
          Word.registry('CHARS', chars);
          _results = [];
          for (i = _i = 0, _len = arguments.length; _i < _len; i = ++_i) {
            e = arguments[i];
            if (i > 0) {
              _results.push(Word.applyDictionaries(e));
            }
          }
          return _results;
        },
        handleEvent: function(event) {
          return event.each('word', function(e) {
            return e.word = Word.get(e.text).analyze();
          });
        }
      };
    }
  });

}).call(this);
