const imageForm = document.querySelector("#imageForm");
const imageInput = document.querySelector("#imageInput");
function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

imageForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const file = imageInput.files[0];

  // get secure url from our server
  const { url } = await fetch("/s3Url").then((res) => res.json());
  console.log(url);
  console.log("Refoooo")
  // post the image direclty to the s3 bucket
  await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: file,
  });

  const imageUrl = url.split("?")[0];
  console.log(imageUrl);
  const imagefilename = imageUrl.split("/").pop();
  console.log(imagefilename);
  // post requst to my server to store any extra data

  const img = document.createElement("img");
  img.style.height = "256px";
  img.src = imageUrl;
  document.body.appendChild(img);

  const fetchItem = async (id) => {
    const response = await fetch(
      `/items/${id}`, //id
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((itemData) => {
        if (itemData["Item"]) {
          console.log(JSON.stringify(itemData));
          //console.log(JSON.parse(itemData));
          //obj = JSON.parse(itemData);
          const obj = JSON.stringify(itemData);
          console.log(obj);
          console.log(JSON.parse(obj)["Item"]["scores"]);
          const scores = JSON.parse(obj)["Item"]["scores"];
          //{Neutral: 0.7548700571060181, Negative: 0.20632301270961761, Positive: 0.038769856095314026, Mixed: 0.00003708956501213834}
          var neutral = scores["Neutral"];
          var negative = scores["Negative"];
          var positive = scores["Positive"];
          var mixed = scores["Mixed"];
          // Get the canvas element
          var ctx = document.getElementById("myChart").getContext("2d");

          // Create a new bar chart
          var chart = new Chart(ctx, {
            type: "bar",
            data: {
              labels: ["Neutral", "Positive", "Mixed", "Negative"],
              datasets: [
                {
                  label: "Sentiment",
                  data: [neutral, positive, mixed, negative],
                  backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(255, 206, 86, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                  ],
                  borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                  ],
                  borderWidth: 1,
                },
              ],
            },
            options: {
              scales: {
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: true,
                    },
                  },
                ],
              },
            },
          });

          // Draw the chart
          chart.update();
          // Loop through the values in the item data
          // Insert the value into the appropriate column
        }

        return itemData;
      });
    return response;
  };
  while (true) {
    console.log(1);
    //await delay(10000);
    const item = await fetchItem(imagefilename);
    console.log("try");
    if (item["Item"]) {
      console.log(123, item);
      break;
    }
  }
});
