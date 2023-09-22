const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const BUCKET_NAME = 'amplify-r3fcarviewer-dev-90441-deployment';
const FOLDER_PREFIX = '4ad8e2c2/';

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    try {
        const imageUrls = await getAllImageUrlsFromFolder();
        console.log(imageUrls)
        return {
            statusCode: 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET",
                "Access-Control-Allow-Headers": "Content-Type"
            },            
            body: JSON.stringify({ imageUrls: imageUrls }),
        };
    } catch (err) {
        console.error('Error fetching image URLs:', err);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify('Error fetching image URLs'),
        };
    }
};

function getAllImageUrlsFromFolder() {
    return new Promise((resolve, reject) => {
        console.log("Starting listObjectsV2 for bucket:", BUCKET_NAME, "with prefix:", FOLDER_PREFIX);
        
        s3.listObjectsV2({ Bucket: BUCKET_NAME, Prefix: FOLDER_PREFIX }, (err, data) => {
            if (err) {
                console.error("Error [1] listing S3 objects:", err);
                reject(err);
                return;
            } 

            console.log("Objects retrieved from S3:", data.Contents.length);

            try {
                const signedUrls = data.Contents.map(obj => {
                    console.log("Generating signed URL for object:", obj.Key);
                    return s3.getSignedUrl('getObject', {
                        Bucket: BUCKET_NAME,
                        Key: obj.Key,
                        Expires: 3600
                    });
                });
                
                console.log("Total signed URLs generated:", signedUrls.length);
                resolve(signedUrls);
            } catch (signedUrlError) {
                console.error("Error [2] generating signed URLs:", signedUrlError);
                reject(signedUrlError);
            }
        });
    });
}

