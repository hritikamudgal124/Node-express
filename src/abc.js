const express = require("express");
const fs = require("fs/promises");
const crypto = require("crypto")

const app = express();
const PORT = 3000;
const FILE_PATH = 'student.json';

// let studentId = 1;
const customRandomID = ()=>{
  return crypto.randomBytes(4).toString('hex')
}

app.use(express.json());

app.get('/api/students', async (req, res) => {
  try {
    const data = await fs.readFile(FILE_PATH, 'utf8');
    const students = JSON.parse(data);
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const { firstname, lastname, email, phone } = req.body;

    if (!firstname || !lastname || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const newStudent = {
      id: customRandomID(),
      firstname,
      lastname,
      email,
      phone
    };

    const existingData = await fs.readFile(FILE_PATH, 'utf8');
    const students = JSON.parse(existingData);

    students.push(newStudent);

    await fs.writeFile(FILE_PATH, JSON.stringify(students, null, 2), 'utf8');

    res.json({ success: true, message: 'Student added successfully', data: newStudent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.put('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { firstname, lastname, email, phone } = req.body;

    if (!firstname || !lastname || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const existingData = await fs.readFile(FILE_PATH, 'utf8');
    const students = JSON.parse(existingData);

    const index = students.findIndex(student => student.id == id);
    if (index !== -1) {
      students[index] = { id: parseInt(id), firstname, lastname, email, phone };
      await fs.writeFile(FILE_PATH, JSON.stringify(students), 'utf8');

      res.json({ success: true, message: 'Student updated successfully', data: students[index] });
    } else {
      res.status(404).json({ success: false, message: 'Student not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const existingData = await fs.readFile(FILE_PATH, 'utf8');
    const students = JSON.parse(existingData);

    const filteredStudents = students.filter(student => student.id != id);

    await fs.writeFile(FILE_PATH, JSON.stringify(filteredStudents, null, 2), 'utf8');

    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/api/students/search', async (req, res) => { //to search /api/students/search?query=searchTerm(eg./api/students/search?query=hritika)
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ success: false, message: 'Missing parameter' });
    }

    const existingData = await fs.readFile(FILE_PATH, 'utf8');
    const students = JSON.parse(existingData);

    const searchResults = students.filter(student =>
      student.firstname.toLowerCase().includes(query.toLowerCase()) ||
      student.lastname.toLowerCase().includes(query.toLowerCase()) ||
      student.email.toLowerCase().includes(query.toLowerCase()) ||
      student.phone.toLowerCase().includes(query.toLowerCase())
    );

    res.json({ success: true, message: 'Search results', data: searchResults });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


app.listen(PORT, () => {
  console.log("Server is running on" + PORT);
});
