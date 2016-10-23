// TODO: refactor with promises

/**
Implements an indexedDB-based repository for persistent storage
of tracks accross sessions.
Provides methods to list/add/delete tracks and positions.
*/
const trackStorage = function() {
    let db = null;

    function openDB(success) {
        if(db != null) {
            success();
            return;
        }
        const request = window.indexedDB.open('geotracker', 1);
        request.onupgradeneeded = function(evt) {
            console.log('Creating track store...');
            evt.currentTarget.result.createObjectStore(
                'tracks', { keyPath: 'id', autoIncrement: true }
            );
            console.log('Creating position store...');
            const positionStore = evt.currentTarget.result.createObjectStore(
                'positions', { keyPath: 'id' }
            );
            console.log('Creating position index...');
            positionStore.createIndex(
                'positionIdx', 'trackId', { unique: false }
            );
            console.log('Database ready.')
        };
        request.onerror = function(event) {
            alert('Error opening DB: '+request.errorCode);
        };
        request.onsuccess = function(event) {
            db = request.result;
            db.onerror = function(event) {
                // Generic error handler for the whole DB
                console.error("DB error: " + event.target.errorCode);
            };
            success();
        };
    };

    const publicMethods = {
        createTrack(success, error) {
            const newTrack = {
                name: '<No name>',
                createdAt: Date.now(),
            };

            openDB(function() {
                const transaction = db.transaction(['tracks'], 'readwrite');
                transaction.oncomplete = function(event) {
                    success(newTrack);
                };

                const trackStore = transaction.objectStore('tracks');
                const request = trackStore.add(newTrack);
                request.onsuccess = function(event) {
                    const newTrackId = event.target.result;
                    newTrack.id = newTrackId;
                };
            });
        },

        addPosition(trackId, position, success, error) {
            openDB(function() {
                const transaction = db.transaction(['positions'], 'readwrite');
                transaction.oncomplete = function(event) {
                    success(position.id);
                };

                const trackStore = transaction.objectStore('positions');
                position.trackId = trackId;
                // generate a numerical Id based on timestamp and trackId for range selection
                position.id = Number(trackId) * (1e16) + position.timestamp;
                trackStore.add(position);
            });
        },

        deleteTrack(trackId, success, error) {
            openDB(function() {
                const transaction = db.transaction(['tracks', 'positions'], 'readwrite');
                // first delete positions, then track if succesful
                const positionRequest = transaction
                .objectStore('positions')
                .delete(IDBKeyRange.bound(Number(trackId) * (1e16), (Number(trackId)+1) * (1e16), false, true));

                positionRequest.onsuccess = event => {
                    transaction
                    .objectStore('tracks')
                    .delete(Number(trackId));
                }

                transaction.oncomplete = event => { success(); };
            });
        },

        getTrackList(success, error) {
            openDB(function() {
                const objectStore = db.transaction(['tracks'], 'readonly').objectStore('tracks');
                const request = objectStore.openCursor();
                const recordedTracks = [];
                request.onsuccess = function(event) {
                    const cursor = event.target.result;
                    // Too bad getAll() isn't standard...
                    if (cursor) {
                        recordedTracks.push(cursor.value);
                        cursor.continue();
                    } else {
                        success(recordedTracks);
                    }
                };
            });
        },

        getTrack(trackId, success, error) {
            openDB(function() {
                const trackStore = db.transaction(['tracks'], 'readonly').objectStore('tracks');
                const request = trackStore.get(trackId);
                request.onsuccess = () => {
                    success(request.result);
                };
            });
        },

        getTrackPositions(trackId, success, error) {
            openDB(function() {
                const positions = [];
                const positionStore = db.transaction(['positions'], 'readonly').objectStore('positions');
                const positionIdx = positionStore.index('positionIdx');
                const request = positionIdx.openCursor(IDBKeyRange.only(Number(trackId)));
                request.onsuccess = function(event) {
                    const cursor = event.target.result;
                    if (cursor) {
                        positions.push(cursor.value);
                        cursor.continue();
                    } else {
                        // sort by time stamp (useless?)
                        positions.sort(function(a, b) { return (a.timestamp - b.timestamp); });
                        success(positions);
                    }
                };
                request.onerror = function() {
                    console.error(request.errorCode);
                }
            });
        },

        close() {
            if(db != null) {
                db.close();
                db = null;
            }
        }
    };

    return publicMethods;
};

export default trackStorage;
