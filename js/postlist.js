(function postlistDefn() {

  // SortedSet comparison methods
  function plEquals(a, b) { return a.id == b.id; }
  function plCompare(a, b) { return b.created_utc - a.created_utc; }

  function PostList(initialList) {
    initialList = (typeof initialList === 'undefined') ? [] : initialList;
    this.hidden = new SortedSet([], plEquals, plCompare);
    this.list = new SortedSet(initialList, plEquals, plCompare);
  }

  PostList.prototype.hide = function(name) {
    name = name.toLowerCase();
    this.list = this.list.filter((function hideByName(value) {
      if (value.author.toLowerCase() == name) {
        this.hidden.push(value);
        return false;
      }

      return true;
    }).bind(this));

    this.trigger('hide', this);
    this.trigger('update', this);
  }

  PostList.prototype.show = function(name) {
    name = name.toLowerCase();
    this.hidden = this.hidden.filter((function showByName(value) {
      if (value.author.toLowerCase() == name) {
        this.list.push(value);
        return false;
      }

      return true;
    }).bind(this));

    this.trigger('show', this);
    this.trigger('update', this);
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
