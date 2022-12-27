// Define the params object for the get operation
const params = {
  TableName: "textract-to-comprehend",
  Key: {
    [primaryKeyName]: primaryKey,
  },
};

// Create an express app
const app = express();

// Define a route for the GET request
app.get("/get-item/:id", (req, res) => {
  // Use the get method to retrieve the item
  dynamoDB.get(params, function (error, data) {
    if (error) {
      console.error(error);
      res.status(500).send(error);
    } else {
      res.json(data.Item);
    }
  });
});
