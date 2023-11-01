const cloudinary = require('cloudinary').v2;
const app = require('./app');
const { connectDatabase } = require('./config/database');

connectDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
  secure: true
});

const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
