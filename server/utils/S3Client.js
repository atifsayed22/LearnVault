import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

// This MUST be called before the S3Client is initialized
dotenv.config();
export const s3 = new S3Client(
    {
        region: process.env.AWS_REGION,
        credential:{
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    }
)
