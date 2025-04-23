import AWS from 'aws-sdk';
import { URL } from 'url';
import dotenv from 'dotenv';
dotenv.config();


const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    endpoint: process.env.AWS_ENDPOINT, //  http://127.0.0.1:9000
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
});

/**
 * Generate a presigned URL for accessing a file in MinIO or AWS S3.
 * @param {Object} bucketInfo - Metadata object containing Bucket, Key, Location and ETag
 * @param {string} mimetype - The MIME type of the file (e.g., 'text/javascript')
 * @param {string} dispositionType - 'inline' (default) or 'attachment'
 * @param {number} expiresInSeconds - URL expiry time in seconds (default: 900)
 * @returns {Promise<string>} - A fully signed URL using your MinIO domain
 */
const generatePresignedUrl = async (
    bucketInfo,
    mimetype,
    dispositionType = 'inline',
    expiresInSeconds = 900
) => {
    const { Location, Bucket, Key } = bucketInfo;

    // Clean up the Key (remove leading slash if present)
    const cleanedKey = Key.startsWith('/') ? Key.slice(1) : Key;

    // Extract base URL (like http://127.0.0.1:9000)
    const baseUrl = new URL(Location).origin;

    const params = {
        Bucket,
        Key: cleanedKey,
        Expires: expiresInSeconds,
        ResponseContentDisposition: dispositionType,
        ResponseContentType: mimetype,
    };

    try {
        // Generate the signed URL (AWS format)
        const signedUrl = await s3.getSignedUrlPromise('getObject', params);

        // Rebuilding the URL to match the MinIO format
        const parsed = new URL(signedUrl);
        const fullPath = `/${Bucket}/${cleanedKey}`;
        const finalUrl = `${baseUrl}${fullPath}${parsed.search}`;

        return finalUrl;
    } catch (error) {
        console.error('Error generating presigned URL:', error);
        throw error;
    }
};

export default generatePresignedUrl;



// const bucketInfo = {
//     ETag: '',
//     Location:'' ,       
//     key: '',
//     Key: '',
//     Bucket:  '',
// };



// const mimetype= 'application/pdf'; 

// generatePresignedUrl(bucketInfo, mimetype, 'inline', 60)
//     .then(url => {
//         console.log('Signed URL:', url);
//     })
//     .catch(console.error);

