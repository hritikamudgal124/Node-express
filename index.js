const express = require("express");
let array = [
  {
    id: 1,
    first_name: "ad",
    last_name: "mack",
  },
  {
    id: 2,
    first_name: "ad",
    last_name: "mack",
  },
];
const app = express();

app.use(express.json());
// app.get("/", (req, res) => {
//   res.send({ array });
// });

// // 1 method (post)
// app.post("/getPost", (req, res) => {
//   console.log(req);
//   const element = req.body;
//   // const name = req.body.name
//   // array.push(name)
//   array.push(element);
//   // res.send({message:"data send successfully", data:array})
//   res.json(element);
// });

// //get
app.get("/api/array", (req, res) => {
  res.send({ data: array });
});

// // 2 method (post)
app.post("/api/array", (req, res) => {
  const element = {
    id: array.length + 1,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
  };
  array.push(element);
  // res.send({ data: array });
  res.json(array);
});

// //push
app.put("/api/array/:id", (req, res) => {
  let { id } = req.params;
  let { first_name, last_name } = req.body;
  let isData = array.some((ele) => ele.id === parseInt(id));
  try{

    if (isData) {
      array = array.map((ele) => {
        if (ele.id === parseInt(id)) {
          return {
            ...ele,
            first_name: first_name ?? ele.first_name,
            last_name: last_name ?? ele.last_name,
          };
        } else {
          return ele;
        }
      });
  
      res.status(203).json(array);
    } else {
      res.status(404).send("Data not found");
    }
  }
  catch(e){
    res.status(500).send(e);
  }
  
});
app.listen(8000, () => {
  console.log("listening to 4000 port k");
});

console.log("sdfl");
