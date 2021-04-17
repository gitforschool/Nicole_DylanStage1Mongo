var express = require('express');
var router = express.Router();

// mongoose is a API wrapper overtop of mongodb, just like
// .ADO.Net is a wrapper over raw SQL server interface
const mongoose = require("mongoose");

const GradedAssignments = require("../GradedAssignments");

// edited to include my non-admin, user level account and PW on mongo atlas
// and also to include the name of the mongo DB that the collection
const dbURI =
 " mongodb+srv://Nicole922:1982_Benji@cluster.17qlh.mongodb.net/GradeBook?retryWrites=true&w=majority";

// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);

const options = {
  reconnectTries: Number.MAX_VALUE,
  poolSize: 10
};

mongoose.connect(dbURI, options).then(
  () => {
    console.log("Database connection established!");
  },
  err => {
    console.log("Error connecting Database instance due to: ", err);
  }
);



/* GET home page. */
router.get('/', function(req, res) {
  res.sendFile('index.html');
});

/* GET all ToDos */
router.get('/GradedAssignments', function(req, res) {
  // find {  takes values, but leaving it blank gets all}
  GradedAssignments.find({}, (err, AllAssignments) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    res.status(200).json(AllAssignments);
  });
});




/* post a new ToDo and push to Mongo */
router.post('/NewAssignment', function(req, res) {

    let oneNewGradedAssignment = new GradedAssignments(req.body);  // call constuctor in ToDos code that makes a new mongo ToDo object
    console.log(req.body);
    oneNewGradedAssignment.save((err, assignment) => {
      if (err) {
        res.status(500).send(err);
      }
      else {
      console.log(assignment);
      res.status(201).json(assignment);
      }
    });
});


router.delete('/DeleteAssignment/:id', function (req, res) {
  GradedAssignments.deleteOne({ _id: req.params.id }, (err, note) => { 
    if (err) {
      res.status(404).send(err);
    }
    res.status(200).json({ message: "Graded Assignment was successfully deleted" });
  });
});


router.put('/UpdateGradedAssignment/:id', function (req, res) {
  GradedAssignments.findOneAndUpdate(
    { _id: req.params.id },
    { assignment: req.body.assignment, class: req.body.class, grade: req.body.grade,   completed: req.body.completed },
   { new: true },
    (err, assignment) => {
      if (err) {
        res.status(500).send(err);
    }
    res.status(200).json(assignment);
    })
  });


  /* GET one ToDos */
router.get('/FindAssignment/:id', function(req, res) {
  console.log(req.params.id );
  GradedAssignments.find({ _id: req.params.id }, (err, oneAssignment) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    res.status(200).json(oneAssignment);
  });
});

module.exports = router;