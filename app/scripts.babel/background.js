'use strict';
var mainDomain = 'https://www.flipkart.com';
chrome.runtime.onInstalled.addListener(details => {
 // console.log('previousVersion', details.previousVersion);
});

chrome.tabs.onUpdated.addListener(tabId => {
 // console.log('previousVersion', tabId);
  //chrome.pageAction.show(tabId);
});
// if AFFID id is added on my name then showy y on plugin icon.
chrome.cookies.get({url: mainDomain, name:'AFFID'}, function(res){
  if(res && res.value == 'rampellip'){
    chrome.browserAction.setBadgeText({text: 'Y'});
  }else{
    chrome.browserAction.setBadgeText({text: ''});
  }
})

/**
 * get query param obj if query is passed
 */
 function getURLParmsObj(query){
  query = query.replace('?','');
  var params = query.split('&');
  var paramObj = params.map(function(item){
    var values = item.split('=');
    var obj = {};
    obj[values[0]] = values[1];
   return obj;
  });
  return paramObj;
 }

 // before request change the url with affid.
chrome.webRequest.onBeforeRequest.addListener(
  function(info) {
    if(info.type === 'main_frame' && info.url.indexOf('rampellip') <= -1){
      var url = info.url;
      var parser = document.createElement('a');
          parser.href = url;
          if(parser.search != ''){
            var queryParam = parser.search;
            var queryObj = getURLParmsObj(queryParam);
          }
      var modefiedUrl = url.replace('www.flipkart.com','dl.flipkart.com/dl');
      var redirect = appendReferalURL(modefiedUrl);
      return {redirectUrl: redirect};
    }
  },
  // filters
  {
    urls: [
      'https://www.flipkart.com/*'
    ],
  },
  // extraInfoSpec
  ['blocking']);
var customParam = encodeURI('affid=rampellip');
chrome.browserAction.onClicked.addListener(function (tab) {
  var url = tab.url;
  var newUrl ;
  // if empty tab is opened the open flipkart domain.
   if(url.indexOf('chrome://') == 0){
      newUrl =  mainDomain;
   } else if(url.indexOf('flipkart.com') >= 0 && url.indexOf('rampellip') <= -1) {
      newUrl = appendReferalURL(url);
   } else {
     return ;
   }
  chrome.tabs.update(tab.id, {url: newUrl});
});
// appends Referal it to the url.
function appendReferalURL(url){
  var hashStart = (url.indexOf('#') === -1) ? url.length : url.indexOf('#');
  var querySymbol = (url.indexOf('?') === -1) ? '?' : '&';
  var newUrl = url.substring(0, hashStart) + querySymbol + customParam +
               url.substring(hashStart);
               return newUrl;
}