// Utility to handle IndexedDB for storing PDFs client-side
const DB_NAME = 'DocumentPortalDB';
const STORE_NAME = 'documents';
const DB_VERSION = 1;

export const savePDF = async (file: File): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = (event: any) => {
      const db = event.target.result;
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      // We store the file with a fixed key 'latest_pdf' for simplicity in this prototype
      const putRequest = store.put(file, 'latest_pdf');

      putRequest.onsuccess = () => resolve();
      putRequest.onerror = () => reject(new Error('Failed to save PDF to IndexedDB'));
    };

    request.onerror = () => reject(new Error('Failed to open IndexedDB'));
  });
};

export const getPDF = async (): Promise<File | null> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onsuccess = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        resolve(null);
        return;
      }

      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const getRequest = store.get('latest_pdf');

      getRequest.onsuccess = () => resolve(getRequest.result || null);
      getRequest.onerror = () => reject(new Error('Failed to retrieve PDF from IndexedDB'));
    };

    request.onerror = () => reject(new Error('Failed to open IndexedDB'));
  });
};
