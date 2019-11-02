//sw.js
self.importScripts('dexie.js');

var cacheName = 'GNOC-APP-V1';

var filesToCache = [
	'/',
	'/index.html'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(cacheName)
        .then(function(cache) {
            console.log('[sw.js] cached all files');
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys()
        .then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cName) {
                    if (cName !== cacheName) {
                        return caches.delete(cName);
                    }
                })
            );
        })
    );
});

// Listen to fetch requests
self.addEventListener('fetch', function(event) {
	// We will cache all POST requests, but in the real world, you will probably filter for
	// specific URLs like if(... || event.request.url.href.match(...))
	if (event.request.method === "POST") {
		
		// Init the cache. We use Dexie here to simplify the code. You can use any other
		// way to access IndexedDB of course.
		var db = new Dexie("post_cache");
		db.version(1).stores({
			post_cache: 'key,response,timestamp'
		})
	
		event.respondWith(
			// First try to fetch the request from the server
			fetch(event.request.clone())
			.then(function(response) {
				// If it works, put the response into IndexedDB
				cachePut(event.request.clone(), response.clone(), db.post_cache);
				return response;
			})
			.catch(function() {
				// If it does not work, return the cached response. If the cache does not
				// contain a response for our request, it will give us a 503-response
				return cacheMatch(event.request.clone(), db.post_cache);
			})
		);
	} else {
        event.respondWith(
            caches.match(event.request)
            .then(function(response) {
                if (response) {
                    return response;
                } else {
                    // clone request stream
                    // as stream once consumed, can not be used again
                    var reqCopy = event.request.clone();
                    return fetch(reqCopy) // reqCopy stream consumed
                    .then(function(response) {
                        // bad response
						// response.type !== 'basic' && response.type !== 'cors' means third party origin request
                        if (!response || response.status !== 200 || (response.type !== 'basic' && response.type !== 'cors')) {
                            return response;
						}
                        // clone response stream
                        // as stream once consumed, can not be used again
                        var resCopy = response.clone();
    
                        // ==================== IN BACKGROUND ==================== //
                        // add response to cache and return response
                        caches.open(cacheName)
                        .then(function(cache) {
                            return cache.put(reqCopy, resCopy); // reqCopy, resCopy streams consumed
                        });
                        // ======================================================= //
                        return response; // response stream consumed
                    })
                }
            })
        );
    }
})

/**
 * Serializes a Request into a plain JS object.
 * 
 * @param request
 * @returns Promise
 */ 
function serializeRequest(request) {
	  var serialized = {
		url: request.url,
		headers: serializeHeaders(request.headers),
		method: request.method,
		mode: request.mode,
		credentials: request.credentials,
		cache: request.cache,
		redirect: request.redirect,
		referrer: request.referrer
	  };
	
	  // Only if method is not `GET` or `HEAD` is the request allowed to have body.
	  if (request.method !== 'GET' && request.method !== 'HEAD') {
		return request.clone().text().then(function(body) {
		  serialized.body = body;
		  return Promise.resolve(serialized);
		});
	  }
	  return Promise.resolve(serialized);
}

/**
 * Serializes a Response into a plain JS object
 * 
 * @param response
 * @returns Promise
 */ 
function serializeResponse(response) {
	  var serialized = {
		headers: serializeHeaders(response.headers),
		status: response.status,
		statusText: response.statusText
	  };
	
	  return response.clone().text().then(function(body) {
		  serialized.body = body;
		  return Promise.resolve(serialized);
	  });
}

/**
 * Serializes headers into a plain JS object
 * 
 * @param headers
 * @returns object
 */ 
function serializeHeaders(headers) {
	var serialized = {};
	// `for(... of ...)` is ES6 notation but current browsers supporting SW, support this
	// notation as well and this is the only way of retrieving all the headers.
	for (var entry of headers.entries()) {
		serialized[entry[0]] = entry[1];
	}
	return serialized;
}

/**
 * Creates a Response from it's serialized version
 * 
 * @param data
 * @returns Promise
 */ 
function deserializeResponse(data) {
	return Promise.resolve(new Response(data.body, data));
}

/**
 * Saves the response for the given request eventually overriding the previous version
 * 
 * @param data
 * @returns Promise
 */
function cachePut(request, response, store) {
	var key, data;
	serializeRequest(request.clone())
	.then(function(id){
		var keyCache = {
			body: id.body,
			url: id.url
		}
		key = JSON.stringify(keyCache);
		return serializeResponse(response.clone());
	}).then(function(serializedResponse) {
		data = serializedResponse;
		var entry = {
			key: key,
			response: data,
			timestamp: Date.now()
		};
		store
		.add(entry)
		.catch(function(error){
			store.update(entry.key, entry);
		});
	});
}
	
/**
 * Returns the cached response for the given request or an empty 503-response  for a cache miss.
 * 
 * @param request
 * @return Promise
 */
function cacheMatch(request, store) {
	return serializeRequest(request.clone())
	.then(function(id) {
		var keyCache = {
			body: id.body,
			url: id.url
		}
		return store.get(JSON.stringify(keyCache));
	}).then(function(data){
		if (data) {
			return deserializeResponse(data.response);
		} else {
			return new Response('', {status: 503, statusText: 'Service Unavailable'});
		}
	});
}