import boto3
from pprint import pprint
# create a DynamoDB object using the AWS SDK
dynamodb = boto3.resource('dynamodb')
# use the DynamoDB object to select our table
table = dynamodb.Table('textract-to-comprehend')
# store the current time in a human readable format in a variable
#now = strftime("%a, %d %b %Y %H:%M:%S +0000", gmtime())

def lambda_handler(event, context):
    s3 = boto3.client("s3")
    bucket = "comprehend-s3-bucket"
    key = "negative.txt"
    file = s3.get_object(Bucket=bucket, Key=key)
    print(str(event[0]))
    paragraph = str(event[1])
    filename=event[0]
    # traverse in the string
    str1 = ""
    for ele in event[1]:
        str1 += ele +" "
    comprehend = boto3.client("comprehend")

    # Extracting sentiments using comprehend
    response = comprehend.detect_sentiment(Text=str1, LanguageCode="en")
    print(response)
    import json
    from decimal import Decimal
    item = json.loads(json.dumps(response["SentimentScore"]), parse_float=Decimal)
    res = table.put_item(
            Item={
                'filename': filename,
                'scores':item,
                'mood':response["Sentiment"],
                'context':str1,
                
            })
    """
    if(response["Sentiment"] == "POSITIVE"):
        statistic["POSITIVE"] += 1
        show_image("./ic_positive.png")
    """
    #print(event)# event line_text
    return "Hello from Lambda"
    return "Thanks"