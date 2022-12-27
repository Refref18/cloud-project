import json
import boto3
from urllib.parse import unquote_plus

# create a DynamoDB object using the AWS SDK
dynamodb = boto3.resource('dynamodb')
# use the DynamoDB object to select our table
table = dynamodb.Table('textract-to-comprehend')
# store the current time in a human readable format in a variable
#now = strftime("%a, %d %b %Y %H:%M:%S +0000", gmtime())

def extract_text(response,file, extract_by="WORD"):
    line_text = []
    for block in response["Blocks"]:
        if block["BlockType"] == extract_by:
            line_text.append(block["Text"])
    invokeLam=boto3.client("lambda",region_name="us-east-1")
    payload=line_text
    payload=[file,line_text]
    print(file)
    resp=invokeLam.invoke(FunctionName="sentimenta_lambda",InvocationType="Event",Payload=json.dumps(payload))
    
    return line_text


def lambda_handler(event, context):
    textract = boto3.client("textract")
    if event:
        file_obj = event["Records"][0]
        bucketname = str(file_obj["s3"]["bucket"]["name"])
        filename = unquote_plus(str(file_obj["s3"]["object"]["key"]))

        print(f"Bucket: {bucketname} ::: Key: {filename}")

        response = textract.detect_document_text(
            Document={
                "S3Object": {
                    "Bucket": bucketname,
                    "Name": filename,
                }
            }
        )
        print(filename)#s3 bucketa bu isimle kaydedidicem.txt 
        print(json.dumps(response))

        
        raw_text = extract_text(response,filename,extract_by="WORD")
        print(raw_text)
        # extract values from the event object we got from the Lambda service and store in a variable
        str1 = ""
        for ele in raw_text:
            str1 += ele +" "
        print(str1)
        # write name and time to the DynamoDB table using the object we instantiated and save response in a variable
        """response = table.put_item(
            Item={
                'filename': filename,
                'context':str1,
                })"""
        return {
            "statusCode": 200,
            "body": json.dumps("Document processed successfully!"),
        }

    return {"statusCode": 500, "body": json.dumps("There is an issue!")}