(function stasMain() {
  "use strict";

  var ADMINS = [
    '5days', 'acidtwist', 'ajacksified'/*, 'akahotcheetos', 'aurora-73', 'bethereinfive',
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

  // TODO: This is only attached to window for testing purposes
  window.posts = new PostList();


  var template = document.getElementById('template').innerHTML;
  var renderPoint = document.getElementById('target');
  posts.bind('update', function(posts) {
    renderPoint.innerHTML = Mustache.render(template, {posts: posts.list.toArray()});
  })

  window.addEventListener('load', function load() {
    ADMINS.forEach(function foreachAdmin(admin) {

      reddit('/user/' + admin + '/comments')
        .listing({ limit: 10, sort: 'new', t: 'month' })
        .then(function commentsThen(slice) {
          var oneMonthAgo = (Date.now() / 1000) - (60 * 60 * 24 * 30 /* one month */);
          var commentsToAdd = [];

          slice.children.forEach(function foreachComment(child) {
            if (child.data.created_utc > oneMonthAgo) {
              commentsToAdd.push(child.data);
            }
          })

          posts.add(commentsToAdd);
        });

    });
  });

})();
