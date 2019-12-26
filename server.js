const express = require('express');
const connectDb = require('./config/db');

// create express app
const app = express();
connectDb();
const PORT = process.env.PORT || 5000 ;

app.use(express.json({extended:true}))
// define a simple route
app.get('/', (req, res) => {
    res.send('API Running');
});

//Creating Routes

app.use('/api/users',require('./routes/api/users'));
app.use('/api/auth',require('./routes/api/auth'));
app.use('/api/profile',require('./routes/api/profiles'));
app.use('/api/post',require('./routes/api/posts'));
// // listen for requests
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});