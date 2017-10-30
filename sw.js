var STATIC_CACHE = 'static-cache';
var RUNTIME_CACHE = 'runtime-cache';
var urlsToCache = [
	'/',
	'/build/app.css',
	'/build/app.js',
	'/build/images/account.svg',
	'/build/images/group.svg',
	'/build/images/help.svg',
	'/build/images/notifications.svg',
	'/build/images/settings.svg'
];

self.addEventListener('install', function (event) {
	event.waitUntil(
		caches.open(STATIC_CACHE)
			.then(function (cache) {
				console.log('Opened cache');
				return cache.addAll(urlsToCache);
			})
	);
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return (cacheName !== STATIC_CACHE && cacheName !== RUNTIME_CACHE);
        }).map(function(cacheName) {
          return caches.delete(cacheName); // remove OLD caches
        })
      );
    })
  );
});

self.addEventListener('fetch', function (event) {
	var request = event.request;
	// for paginated messages go to network always
	if (request.url.indexOf('message-list.appspot.com/messages') > -1 && request.url.indexOf('pageToken') > -1) {
		event.respondWith(fetch(event.request));
	} else if (request.url.indexOf('message-list.appspot.com/messages') > -1 || request.url.indexOf('message-list.appspot.com/photos') > -1) {
		// cache response
		event.respondWith(
			caches.open(RUNTIME_CACHE).then(function(cache) {
				return cache.match(event.request).then(function (response) {
					return response || fetch(event.request).then(function(response) {
						cache.put(event.request, response.clone());
						return response;
					});
				});
			})
		);
	} else {   // cache fallback to network
		event.respondWith(
			caches.match(event.request)
				.then(function (response) {
					if (response) {
						return response;
					}
					return fetch(event.request);
				}
			)
		);
	}
});
