const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

connectDB();

app.use(express.json());

app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/post', require('./routes/post'));
app.use('/api/river', require('./routes/river'));
app.use('/api/master-admin', require('./routes/masterAdmin'));
app.use('/api/confirm-email', require('./routes/confirmEmail'));
app.use('/api/proxy', require('./routes/proxy'));

// serve static assests in production
if (process.env.NODE_ENV === 'production') {
  // set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
