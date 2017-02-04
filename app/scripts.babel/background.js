'use strict';
chrome.runtime.onInstalled.addListener(details => {
 // console.log('previousVersion', details.previousVersion);
});

chrome.tabs.onUpdated.addListener(tabId => {
 // console.log('previousVersion', tabId);
  //chrome.pageAction.show(tabId);
});
chrome.webRequest.onBeforeRequest.addListener(
  function(info) {
    if(info.type === 'main_frame' && info.url.indexOf('rampellip') <= -1){
      var url = info.url;
      var redirect = appendReferalURL(url);
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
   if(url.indexOf('chrome://') == 0){
      newUrl =  'https://www.flipkart.com/';
   } else if(url.indexOf('rampellip') <= -1) {
      newUrl = appendReferalURL(url);
   } else {
     return ;
   }
  chrome.tabs.update(tab.id, {url: newUrl});
});

function appendReferalURL(url){
  var hashStart = (url.indexOf('#') === -1) ? url.length : url.indexOf('#');
  var querySymbol = (url.indexOf('?') === -1) ? '?' : '&';
  var newUrl = url.substring(0, hashStart) + querySymbol + customParam +
               url.substring(hashStart);
               return newUrl;
}