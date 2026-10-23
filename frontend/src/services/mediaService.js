import { storage, isFirebaseConfigured } from '../firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const ALLOWED_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif'
]);

// Azure Blob Storage Configuration from environment or defaults
const AZURE_STORAGE_ACCOUNT = import.meta.env.VITE_AZURE_STORAGE_ACCOUNT || 'onlymemes';
const AZURE_STORAGE_CONTAINER = import.meta.env.VITE_AZURE_STORAGE_CONTAINER || 'onlymemes';
const AZURE_SAS_TOKEN = import.meta.env.VITE_AZURE_STORAGE_SAS_TOKEN || 'sv=2026-02-06&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2027-10-23T17:31:55Z&st=2026-10-23T09:16:55Z&spr=https&sig=00Vx%2Bxhj0F3cLeQgtNoXBrbUI65I5fywBxD7Tv8%2BQMQ%3D';
const STORAGE_PROVIDER = import.meta.env.VITE_STORAGE_PROVIDER || 'azure';

export const isAzureConfigured = Boolean(AZURE_STORAGE_ACCOUNT && AZURE_SAS_TOKEN);

/**
 * Validates file size and format according to strict platform limits.
 * 
 * @param {File} file 
 * @returns {{ isValid: boolean, error?: string }}
 */
export function validateMediaFile(file) {
  if (!file) {
    return { isValid: false, error: 'No media file provided.' };
  }

  // Strict 10MB client-side limit
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    return {
      isValid: false,
      error: `File size exceeds 10 MB limit (${sizeInMB} MB). Please choose a compressed file.`
    };
  }

  // File type inspection
  if (!ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
    return {
      isValid: false,
      error: `Format "${file.type || 'unknown'}" is not supported. Allowed formats: PNG, JPEG, WEBP, GIF.`
    };
  }

  return { isValid: true };
}

/**
 * Uploads media file to Microsoft Azure Blob Storage via direct BlockBlob REST API
 * with native XMLHttpRequest upload progress tracking.
 * Appends SAS token so private containers can serve media directly to web clients.
 * 
 * @param {File} file - Media file to upload
 * @param {string} userId - Current user's UID
 * @param {function(number):void} onProgress - Progress callback (0-100)
 * @returns {Promise<string>} Authenticated Media Blob URL
 */
async function uploadToAzureBlob(file, userId, onProgress) {
  const rawSas = AZURE_SAS_TOKEN || '';
  const sasToken = rawSas.startsWith('?') ? rawSas.substring(1) : rawSas;

  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const blobPath = `memes/${userId}/${Date.now()}_${sanitizedName}`;
  const uploadUrl = `https://${AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/${AZURE_STORAGE_CONTAINER}/${blobPath}?${sasToken}`;
  // Private container support: append SAS token with Read permission so <img> tags render smoothly
  const mediaUrl = `https://${AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/${AZURE_STORAGE_CONTAINER}/${blobPath}?${sasToken}`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl, true);
    xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob');
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve(mediaUrl);
      } else {
        console.error('Azure Blob upload error:', xhr.status, xhr.statusText, xhr.responseText);
        reject(new Error(`Azure Blob Storage error (${xhr.status}): ${xhr.statusText || 'Upload failed'}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error during Azure Blob upload. Ensure CORS is enabled on your Azure Storage Account.'));
    };

    xhr.send(file);
  });
}

/**
 * Uploads media file to Firebase Storage
 * 
 * @param {File} file 
 * @param {string} userId 
 * @param {function(number):void} onProgress 
 * @returns {Promise<string>}
 */
async function uploadToFirebaseStorage(file, userId, onProgress) {
  return new Promise((resolve, reject) => {
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `memes/${userId}/${Date.now()}_${sanitizedName}`;
    const storageRef = ref(storage, storagePath);

    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type
    });

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const percentage = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        onProgress(percentage);
      },
      (error) => {
        console.error('Firebase Storage upload failure:', error);
        reject(error);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

/**
 * Master Media Uploader:
 * Supports Azure Blob Storage, Firebase Storage, and Local Demo simulation.
 * 
 * @param {File} file - Media file to upload
 * @param {string} userId - Current user's UID
 * @param {function(number):void} onProgress - Progress callback (0-100)
 * @returns {Promise<string>} Download URL
 */
export async function uploadMediaFile(file, userId, onProgress) {
  const validation = validateMediaFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  // 1. If Azure Blob Storage is configured or selected
  if (STORAGE_PROVIDER === 'azure' && isAzureConfigured) {
    return uploadToAzureBlob(file, userId, onProgress);
  }

  // 2. If Firebase is configured
  if (isFirebaseConfigured) {
    return uploadToFirebaseStorage(file, userId, onProgress);
  }

  // 3. Fallback demo mode: simulate upload progress and return Data URL
  return new Promise((resolve) => {
    let progress = 10;
    onProgress(progress);
    const interval = setInterval(() => {
      progress += 25;
      if (progress >= 100) {
        clearInterval(interval);
        onProgress(100);
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      } else {
        onProgress(progress);
      }
    }, 80);
  });
}
