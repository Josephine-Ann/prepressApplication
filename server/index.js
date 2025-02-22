const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const nodemailer = require('nodemailer');

const app = express();

app.use(cors());
app.use(express.json())
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// app.use(express.static(path.join(__dirname, 'public')));


app.get('/printJobs', (req, res) => {
  const filePath = path.join(__dirname, 'printJobInfo.json');
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).send('Error reading the file.');
    }
    res.json(JSON.parse(data));
  });
});

app.get('/automatedComments', (req, res) => {
  const filePath = path.join(__dirname, 'automatedComments.json');
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).send('Error reading the file.');
    }
    res.json(JSON.parse(data));
  });
});


app.post('/send-email', upload.single('pdf'), (req, res) => {
  const { file } = req;
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }
  const transporter = nodemailer.createTransport({
    host: '127.0.0.1',
    port: 1025,
    secure: false,
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password',
    },
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: 'recipient@example.com',
    subject: 'PDF with Annotations',
    text: 'Please find the attached PDF with annotations.',
    attachments: [
      {
        filename: 'annotated-document.pdf',
        content: file.buffer,
      },
    ],
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Error sending email:', err);
      return res.status(500).send('Error sending email.');
    }
    console.log('Email sent: ' + info.response);
    res.status(200).send('Email sent successfully.');
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});