import fs from 'fs';
import path from 'path';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import { console } from 'inspector';
import mime from 'mime-types';


dotenv.config();

const __dirname = path.resolve();

export const uploadToS3 = async(file,folderName)=>{

    

       
        const fileName = path.basename(file);

        const targetPath = `/files/${folderName}/${fileName}`;

        // console.log("targetPath",targetPath);

        return uploadFile(file, targetPath);
        

}


export const readAllFiles = async (dir)=> {
    const files = await fs.promises.readdir(dir);
    const filesList = [];
    for (const file of files) {
        const filePath = path.join(dir, file);

        // console.log("file-> ",file);

        const stat = await fs.promises
            .lstat(filePath)
            .catch((err) => console.log(err));
        if (stat && stat.isDirectory()) {
            const nestedFiles = await readAllFiles(filePath);
            filesList.push(...nestedFiles);
        } else {
            filesList.push(filePath);
        }
    }
    return filesList;
 
};






const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY ,   // AWS access key
    secretAccessKey: process.env.AWS_SECRET_KEY ,  // AWS secret key
    endpoint: process.env.AWS_ENDPOINT ,  // S3 compatible storage endpoint(by default aws s3 endpoint)
    s3ForcePathStyle: true,  
    signatureVersion: 'v4'   
});

export async function uploadFile(filePath, targetPath) {
    try {
        // Read the file content from the filePath
        const fileContent = fs.readFileSync(filePath);

        console.log("filepath",filePath);
        
        // Get the file name from the filePath
        const fileName = path.basename(filePath);
        
        // Define the S3 upload parameters
        const uploadParams = {
            Bucket: process.env.AWS_BUCKET ,  // Your S3 bucket name
            Key: `${targetPath}`,  // Target path in S3
            Body: fileContent
        };

        // console.log(uploadParams);
        
        // Upload the file to S3
        const data = await s3.upload(uploadParams).promise();
        // console.log(`File uploaded successfully. ${data.Location}`);
        // console.log(`Uploaded file: ${fileName}`);


        // console.log("data",data);

        const type = mime.lookup(fileName); // Get the file type using mime-types library
        // console.log("type",type);
        const fileMetadata = {
            name: fileName,
            size: fs.statSync(filePath).size, //  file size
            extension: path.extname(fileName), //  file type (extension)
            url: data.Location, // The URL of the uploaded file in S3,
            data: data,
            mimetype: type, // file type (MIME type eg. 'text/javascript')
            filePath: filePath, // Local file path

        };

       
        return fileMetadata; 
    } catch (err) {
        console.error("Error uploading file:", err);
        
        return null; 
        
    }
}

