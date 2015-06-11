(function postlistDefn() {

  function PostList(initialList) {
    initialList = (typeof initialList === 'undefined') ? [] : initialList;
    this.list = new SortedArray(initialList, function equals(a, b) {
      return a.id == b.id;
    }, function compare(a, b) {
      return b.created_utc - a.created_utc;
    })
  }

  PostList.prototype.add = function(comments) {
    if (!Array.isArray(comments)) {
      comments = [comments];
    }
    this.list.addEach(comments);
    this.trigger('add', this, comments);
    this.trigger('update', this);
  };

  PostList.prototype.remove = function(comment) {
    this.list.delete(comment);
    this.trigger('remove', this, comment);
    this.trigger('update', this);
  }

  MicroEvent.mixin(PostList);
  window.PostList = PostList;
})();
