import { openDB } from 'idb';

/**
Implements an indexedDB-based repository for persistent storage
of tracks accross sessions.
Provides methods to list/add/delete tracks and positions.
*/
const openDBPromise = openDB('geotracker', 1, { upgrade: upgradeDB });

function upgradeDB(db) {
  console.log('Creating track store...');
  db.createObjectStore('tracks', { keyPath: 'id', autoIncrement: true });
  console.log('Creating position store...');
  const positionStore = db.createObjectStore('positions', { keyPath: 'id' });
  console.log('Creating position index...');
  positionStore.createIndex('positionIdx', 'trackId', { unique: false });
  console.log('Database ready.');
}

export function createTrack() {
  const newTrack = {
    name: null,
    createdAt: Date.now(),
  };

  return openDBPromise.then(db => {
    return db
      .transaction('tracks', 'readwrite')
      .objectStore('tracks')
      .add(newTrack)
      .then(newTrackId => {
        newTrack.id = newTrackId;
        return newTrack;
      });
  });
}

export function updateTrack(updatedTrack) {
  return openDBPromise.then(db => {
    return db
      .transaction('tracks', 'readwrite')
      .objectStore('tracks')
      .put(updatedTrack);
  });
}

export function addPositionToTrack(trackId, position) {
  const newPosition = {
    ...position,
    trackId,
    // generate a numerical Id based on timestamp and trackId for range selection
    id: Number(trackId) * 1e13 + position.timestamp,
  };

  return openDBPromise.then(db => {
    return db
      .transaction('positions', 'readwrite')
      .objectStore('positions')
      .add(newPosition);
  });
}

export function deleteTrack(trackId) {
  const positionsRange = IDBKeyRange.bound(
    Number(trackId) * 1e16,
    (Number(trackId) + 1) * 1e16,
    false,
    true
  );

  return openDBPromise.then(db => {
    return db
      .transaction('positions', 'readwrite')
      .objectStore('positions')
      .delete(positionsRange)
      .then(() => {
        // use another transaction whereas it should be done in the same, because of microtask bug.
        // see: https://github.com/jakearchibald/idb/blob/master/README.md#transaction-lifetime
        return db
          .transaction('tracks', 'readwrite')
          .objectStore('tracks')
          .delete(Number(trackId));
      });
  });
}

export function getTrackList() {
  return openDBPromise.then(db => {
    return db.transaction('tracks', 'readonly').objectStore('tracks').getAll();
  });
}

export function getTrack(trackId) {
  return openDBPromise.then(db => {
    return db
      .transaction('tracks', 'readonly')
      .objectStore('tracks')
      .get(trackId);
  });
}

export function getTrackPositions(trackId) {
  return openDBPromise.then(db => {
    return db
      .transaction('positions', 'readonly')
      .objectStore('positions')
      .index('positionIdx')
      .getAll(IDBKeyRange.only(Number(trackId)))
      .then(positions => {
        return positions.sort((a, b) => a.timestamp - b.timestamp);
      });
  });
}

export function clearTrackDatabase() {
  return openDBPromise.then(db => {
    // TODO: the delete promise never resolves if connections aren't closed,
    // but when closing it, any further attempt to use the db results in error
    // db.close();
    // return idb.delete('geotracker');
    return db
      .transaction('positions', 'readwrite')
      .objectStore('positions')
      .clear()
      .then(() => {
        // use another transaction whereas it should be done in the same, because of microtask bug.
        // see: https://github.com/jakearchibald/idb/blob/master/README.md#transaction-lifetime
        return db
          .transaction('tracks', 'readwrite')
          .objectStore('tracks')
          .clear();
      });
  });
}
