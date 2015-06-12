(function stasMain() {
  "use strict";

  // Constants

  var ADMINS = [
    '5days', 'acidtwist', 'ajacksified', /*'akahotcheetos', 'aurora-73', 'bethereinfive',
    'bluemoon3689', 'bluepinkblack', 'bsimpson', 'cat_sweaterz', 'chooter', 'ckk524',
    'cmrnwllsbrn', 'comeforthlazarus', 'curioussavage01', 'danehansen', 'deimorz',
    'dforsyth', 'donotlicktoaster', 'drew', 'drunkeneconomist', 'ekjp', 'florwat',
    'freedomthebucket', 'gooeyblob', 'hellohobbit', 'highshelfofsteam', 'im2lucky',
    'jase', 'jophuds', 'juhjj', 'kaitaan', 'kirbyrules', 'kn0thing', 'krispykrackers',
    'largenocream', 'liltrixxy', 'madlee', 'maxgprime', 'miamiz', 'notenoughcharacters9',
    'ocrasorm', 'pixelinaa', 'powerlanguage', 'rhymeswithandrew', 'rram', 'rrmckinley',
    'ryanmerket', 'sgtjamz', 'spladug', 'sporkicide', 'taxidermyunicornhead', 'tdohz',
    'thorarakis', 'umbrae', 'weffey', 'willowgrain', 'xilvar', 'xiongchiamiov',
    'youngluck', 'zeantsoi', 'zubair'*/
  ]


  // Utilities

  function domify(string) {
    var div = document.createElement('div');
    div.innerHTML = string;
    return div.childNodes;
  }


  // Set up Reddit wrapper
  var reddit = new Snoocore({
    userAgent: '/u/MrJohz STAS@0.0.1 (basically just testing at the moment)',
    oauth: {
      type: 'implicit',
      key: 'GvikeXUxDNflYA',
      redirectUri: 'http://localhost:8000',
      scope: [ 'history' ],
      deviceId: 'DO_NOT_TRACK_THIS_DEVICE'
    },
    decodeHtmlEntities: true
  });

  window.posts = new PostList();

  // Templating
  Handlebars.registerHelper('stripType', function (id) { return id.substring(3); })
  Handlebars.registerHelper('toHuman', function (ts) { return moment.unix(ts).fromNow() })

  var postsTemplate = Handlebars.compile(document.getElementById('content-template').innerHTML);
  var settingsTemplate = Handlebars.compile(document.getElementById('menu-template').innerHTML);
  var renderPoint = document.getElementById('target');


  // Event handlers

  function hideAdmin(name) {
    return function (e) {
      posts.hide(name);
      this.onclick = showAdmin(name);
    }
  }
  function showAdmin(name) {
    return function (e) {
      posts.show(name);
      this.onclick = hideAdmin(name);
    }
  }

  function updateAdmin(admin) {

    return reddit('/user/' + admin + '/comments')
      .listing({ limit: 50, sort: 'new' })
      .then(function commentsThen(slice) {
        var oneWeekAgo = (Date.now() / 1000) - (60 * 60 * 24 * 7 /* one week */);
        var commentsToAdd = [];

        slice.children.forEach(function foreachComment(child) {
          if (child.data.created_utc > oneWeekAgo) {
            commentsToAdd.push(child.data);
          }
        })

        posts.add(commentsToAdd);
      });
  }

  posts.bind('show', function (posts, admin) {
    updateAdmin(admin);
  });
  posts.bind('update', function (posts) {
    renderPoint.innerHTML = postsTemplate({posts: posts.list.toArray()});
  });


  // Main

  window.addEventListener('load', function load() {

    var settings = domify(settingsTemplate({admins: ADMINS}));
    for (var i=0; i < settings.length; i++) {
      var para = settings[i];
      if (para.nodeName !== "P") { continue; }

      para.children[1].onclick = hideAdmin(para.children[0].innerHTML);
      document.getElementById('menu').appendChild(para);
    }

    var promises = ADMINS.map(updateAdmin);

    Q.all(promises).fin(function () {
      document.getElementById('target').classList.remove('loading');
    }).fail(console.error.bind(console));
  });

})();
