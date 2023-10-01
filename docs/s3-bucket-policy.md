The s3 bucket used was public and should set up like this in production!

Here is an example of the bucket policy - I used for **development/testing!** (not recommended for production)

```bash
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObjects",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::chat-ai-pdf/*"
        },
        {
            "Sid": "AllowLocalhostForTesting",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::chat-ai-pdf/*",
            "Condition": {
                "IpAddress": {
                    "aws:SourceIp": "127.0.0.1/32"
                }
            }
        }
    ]
}

```
