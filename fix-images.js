/**
 * Humanitas Image Fixer
 * Upload this file to GitHub root as: fix-images.js
 * It automatically fixes every broken image on every page.
 * No changes needed to individual articles.
 */
(function(){
  'use strict';

  // Map of keywords in page URL to appropriate Picsum seed images
  var imageMap = {
    'roman-law':        ['roman640', 'ancient360', 'marble480'],
    'empire-collapse':  ['ruins640', 'history360', 'ancient480'],
    'silk-road':        ['desert640', 'caravan360', 'trade480'],
    'democracy':        ['athens640', 'columns360', 'agora480'],
    'compound-interest':['finance640', 'money360', 'wealth480'],
    'reading-a-contract':['law640', 'document360', 'legal480'],
    'credit-scores':    ['bank640', 'finance360', 'credit480'],
    'wills-trusts':     ['estate640', 'will360', 'trust480'],
    'what-is-ai':       ['tech640', 'computer360', 'digital480'],
    'stock-market':     ['stocks640', 'market360', 'invest480'],
    'neuroscience-love':['love640', 'brain360', 'heart480'],
    'cognitive-bias':   ['mind640', 'thinking360', 'psychology480'],
    'science-of-loneliness':['solitude640', 'person360', 'alone480'],
    'attachment-theory':['bond640', 'connection360', 'family480'],
    'james-webb':       ['space640', 'galaxy360', 'cosmos480'],
    'free-will':        ['philosophy640', 'mind360', 'thought480']
  };

  // Fallback seeds by section
  var sectionMap = {
    'civilisation': 'history',
    'intelligence': 'finance',
    'human':        'people',
    'cosmos':       'space',
    'ideas':        'philosophy',
    'earth':        'nature'
  };

  function getSeed(){
    var url = window.location.pathname.toLowerCase();
    // Check article-specific map first
    for(var key in imageMap){
      if(url.indexOf(key) !== -1){
        return imageMap[key][0];
      }
    }
    // Fall back to section
    for(var sec in sectionMap){
      if(url.indexOf(sec) !== -1){
        return sectionMap[sec];
      }
    }
    return 'article';
  }

  var seed = getSeed();
  var counter = 0;

  function fixImage(img){
    counter++;
    var w = img.naturalWidth || img.width || 640;
    var h = img.naturalHeight || img.height || 360;
    // Use aspect ratio from element
    var aspect = img.getAttribute('data-aspect') || '16/9';
    var pw = 640, ph = 360;
    if(aspect === '3/2'){ ph = 427; }
    if(aspect === '4/3'){ ph = 480; }
    img.src = 'https://picsum.photos/seed/' + seed + counter + '/' + pw + '/' + ph;
    img.onerror = null; // prevent loop
  }

  function handleBrokenImages(){
    var imgs = document.querySelectorAll('img');
    imgs.forEach(function(img){
      // If already broken
      if(img.complete && (img.naturalWidth === 0 || img.naturalHeight === 0)){
        fixImage(img);
      }
      // If breaks later
      img.addEventListener('error', function(){
        fixImage(this);
      }, {once: true});
    });
  }

  // Run on DOM ready
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', handleBrokenImages);
  } else {
    handleBrokenImages();
  }

  // Also catch any dynamically added images
  if(window.MutationObserver){
    var observer = new MutationObserver(function(mutations){
      mutations.forEach(function(m){
        m.addedNodes.forEach(function(node){
          if(node.tagName === 'IMG'){
            node.addEventListener('error', function(){ fixImage(this); }, {once:true});
          }
          if(node.querySelectorAll){
            node.querySelectorAll('img').forEach(function(img){
              img.addEventListener('error', function(){ fixImage(this); }, {once:true});
            });
          }
        });
      });
    });
    observer.observe(document.body || document.documentElement, {childList:true, subtree:true});
  }

}());
