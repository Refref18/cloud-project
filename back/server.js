import aws from "aws-sdk";

import express from "express";
import { generateUploadURL } from "./s3.js";
const accessKeyId = "AKIAW3A6TA7AEQ6QWXF4";
const secretAccessKey = "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";
const app = express();

app.use(express.static("front"));

app.get("/s3Url", async (req, res) => {
  //the res is the methods, headers and the file, req is PUT
  const url = await generateUploadURL(); //is a method in s3.js creates a filename with random hexes
  res.send({ url });
});

const dynamoDb = new aws.DynamoDB.DocumentClient({
  region: "us-east-1",
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4",
});

app.get("/items/:id", function (req, res) {
  const params = {
    TableName: "textract-to-comprehend",
    Key: {
      filename: req.params.id,
    },
  };

  dynamoDb.get(params, function (err, data) {
    if (err) {
      console.error("Error retrieving item with id", req.params.id, err);
      res.status(500).send({ error: err });
    } else {
      console.log(
        "Successfully retrieved item with id",
        req.params.id,
        ":",
        data
      );
      res.send(data);
    }
  });
});

app.listen(8080, () => console.log("listening on port 8080"));
