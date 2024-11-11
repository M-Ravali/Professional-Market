const express = require('express');
const connectDB = require('./config/config');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes')
const professionalRoutes = require('./routes/professionalRoute')
const bookingRoutes = require('./routes/bookingRoute')

const cors = require('cors');
const path = require('path');

dotenv.config();
connectDB();

const app = express();

  
console.log(`JWT_SECRET: ${process.env.JWT_SECRET}`);
  
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/users', profileRoutes)
app.use('/api', professionalRoutes)  
app.use('/api', bookingRoutes)  


// Middleware to serve static files (like your HTML, CSS, and JS)
app.use(express.static(path.join(__dirname, '../frontend')));

// Route to handle reset password link
app.get('/reset-password/:token', (req, res) => {
  const token = req.params.token;
  // Render the reset password page, passing the token if necessary
  res.sendFile(path.join(__dirname, '../frontend','resetpassword.html'));
});
  

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


