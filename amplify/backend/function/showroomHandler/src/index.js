const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const BUCKET_NAME = 'amplify-r3fcarviewer-dev-90441-deployment'; // replace with your bucket's name
const FOLDER_PREFIX = '4ad8e2c2/';   // replace with your folder's name

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    try {
        const imageUrls = await getAllImageUrlsFromFolder();
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify({ imageUrls }),
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
        s3.listObjectsV2({ Bucket: BUCKET_NAME, Prefix: FOLDER_PREFIX }, (err, data) => {
            if (err) {
                reject(err);
            } else {
                const signedUrls = data.Contents.map(obj => {
                    return s3.getSignedUrl('getObject', {
                        Bucket: BUCKET_NAME,
                        Key: obj.Key,
                        Expires: 3600 // URL expires in 1 hour
                    });
                });
                resolve(signedUrls);
            }
        });
    });
}
