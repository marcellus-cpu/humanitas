/**
 * HUMANITAS IMAGE FIXER v3 — LoremFlickr keyword matching
 * Upload to GitHub root as: fix-images.js
 * Already included in all articles via <script src="/humanitas/fix-images.js"></script>
 */
(function(){
  'use strict';

  // Map URL keywords to LoremFlickr search terms
  // LoremFlickr: https://loremflickr.com/WIDTH/HEIGHT/keyword
  var articleImages = {
    'africa-forward-summit': 'nairobi,kenya,africa,summit',
    'roman-law':             'rome,ancient,colosseum,forum',
    'empire-collapse':       'ruins,ancient,empire,history',
    'silk-road':             'desert,camel,trade,ancient',
    'democracy-older':       'athens,greece,ancient,democracy',
    'compound-interest':     'finance,money,investment,wealth',
    'reading-a-contract':    'law,contract,legal,justice',
    'credit-scores':         'banking,credit,finance,cards',
    'wills-trusts':          'estate,will,family,legal',
    'what-is-ai':            'technology,computer,digital,ai',
    'stock-market':          'stock,market,trading,finance',
    'neuroscience-love':     'love,couple,heart,brain',
    'cognitive-bias':        'psychology,mind,thinking,brain',
    'science-of-loneliness': 'solitude,alone,person,lonely',
    'attachment-theory':     'family,bond,connection,care',
    'james-webb':            'space,galaxy,cosmos,stars',
    'free-will':             'philosophy,mind,thinking,light',
    'great-barrier-reef':    'coral,reef,ocean,underwater'
  };

  var sectionImages = {
    'civilisation': 'history,ancient,civilisation',
    'intelligence': 'finance,law,technology,business',
    'human':        'people,human,psychology,emotion',
    'cosmos':       'space,astronomy,universe,stars',
    'ideas':        'philosophy,thinking,books,library',
    'earth':        'nature,wildlife,environment,earth',
    'politics':     'politics,government,parliament,flag'
  };

  function getKeyword(){
    var url = window.location.pathname.toLowerCase();
    for(var key in articleImages){
      if(url.indexOf(key) !== -1) return articleImages[key];
    }
    for(var sec in sectionImages){
      if(url.indexOf(sec) !== -1) return sectionImages[sec];
    }
    return 'knowledge,books,writing,ideas';
  }

  var keyword = getKeyword();
  var counter = 0;

  function makeUrl(w, h){
    counter++;
    // LoremFlickr with lock parameter for consistency per page
    return 'https://loremflickr.com/' + w + '/' + h + '/' + keyword + '?lock=' + counter;
  }

  function fixImg(img){
    var w = 1200, h = 600;
    // Detect size from element dimensions
    var ew = img.offsetWidth || img.naturalWidth;
    if(ew > 0 && ew < 400){ w = 400; h = 267; }
    else if(ew >= 400 && ew < 700){ w = 640; h = 427; }
    img.src = makeUrl(w, h);
    img.removeAttribute('onerror');
  }

  function processAll(){
    document.querySelectorAll('img').forEach(function(img){
      var src = img.getAttribute('src') || '';

      // Replace Wikimedia/Wikipedia hotlinks immediately
      if(src.indexOf('wikimedia') !== -1 || src.indexOf('wikipedia') !== -1){
        fixImg(img); return;
      }

      // Replace broken Picsum with LoremFlickr
      if(src.indexOf('picsum.photos') !== -1){
        fixImg(img); return;
      }

      // Handle any other broken image
      if(img.complete && img.naturalWidth === 0 && src){
        fixImg(img); return;
      }

      img.addEventListener('error', function(){ fixImg(this); }, {once:true});
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', processAll);
  } else {
    processAll();
  }

  window.addEventListener('load', processAll);

}());
