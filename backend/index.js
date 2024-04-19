const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const config = require('./config.json');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const authenticateToken = require('./utilities');
const User = require('./models/user.models');
const Note = require('./models/note.model');
const bcrypt = require('bcryptjs');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({origin: '*'}));


app.get('/', (req, res) => {
    res.send('Server is running' );
});

//creating a new user
app.post('/create-account', async (req, res) => {
    const {fullName, email, password} = req.body;


    if(!fullName) {
        return res.status(400).json({error:true, message: 'Full name is required'});
    }

    if(!email) {
        return res.status(400).json({error:true, message: 'Email is required'});
    }

    if(!password) {
        return res.status(400).json({error:true, message: 'Password is required'});
    }
    
    const isUserExist = await User.findOne({email: email});
    if(isUserExist) {
        return res.status(400).json({error:true, message: 'User already exist'});
    }

    // password hash 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    const user = new User({
        fullName,
        email,
        password: hashedPassword
    });

    await user.save();
     
    const accessToken = jwt.sign({ user }, 
        process.env.ACCESS_TOKEN_SECRET ,
         {expiresIn: '3600m'});
     return res.status(200).json({error: false, user, accessToken, message: 'Registration successful!!'});
 
}   
);

//login
//login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if email is provided
        if (!email) {
            return res.status(400).json({ error: true, message: 'Email is required' });
        }

        // Check if password is provided
        if (!password) {
            return res.status(400).json({ error: true, message: 'Password is required' });
        }

        // Find user by email
        const user = await User.findOne({ email });

        // If user does not exist
        if (!user) {
            return res.status(400).json({ error: true, message: 'Invalid credentials' });
        }

        // Compare passwords
        const validPassword = await bcrypt.compare(password, user.password);

        // If password is invalid
        if (!validPassword) {
            return res.status(400).json({ error: true, message: 'Invalid credentials' });
        }

        // If authentication is successful
        const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3600m' });

        // Send success response
        return res.status(200).json({ error: false, user, accessToken, message: 'Login successful!' });
    } catch (error) {
        // If an error occurs
        return res.status(500).json({ error: true, message: 'Internal server error' });
    }
});

//get user
app.get('/get-user', authenticateToken, async (req, res) => {
    const { user } = req.user;
     const isUser = await User.findOne({ _id: user._id });
        if(!isUser) {
            return res.status(400).json({error: true, message: 'User not found'});
        }
        return res.json({ user:{
            fullName: isUser.fullName,
            email: isUser.email,
            _id: isUser._id,
            createdOn: isUser.createdOn
        }
        });
        }

);

    // update user
app.put('/update-user/:userId', authenticateToken, async (req, res) => {
    const { fullName, email, password } = req.body;
    const userId = req.params.userId;

    if(!fullName && !email && !password) {
        return res.status(400).json({error: true, message: 'Nothing to update'});
    }

    try {
        const user = await User.findOne({ _id: userId });
        if(!user) {
            return res.status(400).json({error: true, message: 'User not found'});
        }
        if(fullName) {
            user.fullName = fullName;
        }
        if(email) {
            user.email = email;
        }
        if(password) {
            user.password = password;
        }
        await user.save();
        return res.status(200).json({error: false, user, message: 'User updated successfully'});
    } catch (error) {
        return res.status(500).json({error: true, message: 'Error updating user'});
    }
});




//add notes
app.post('/add-note', authenticateToken, async (req, res) => {
    const { title, content, tags } = req.body;
    const {user} = req.user; 

    if (!title) {
        return res.status(400).json({ error: true, message: 'Title is required' });
    }

    if (!content) {
        return res.status(400).json({ error: true, message: 'Content is required' });
    }

    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user._id
        });
        await note.save();
        return res.status(200).json({ error: false, note, message: 'Note added successfully' });
    } catch (error) {
        return res.status(400).json({ error: true, message: 'Error adding note' });
    }

});

// edit notes
app.put('/edit-note/:noteId', authenticateToken, async (req, res) => {
    const { title, content, tags , isPinned } = req.body;
    const { user } = req.user;
    const noteId  = req.params.noteId;
    if(!title && !content && !tags ) {
        return res.status(400).json({error: true, message: 'Nothing to update'});
    }

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });
        if(!note) {
            return res.status(400).json({error: true, message: 'Note not found'});
        }
        if(title) {
            note.title = title;
        }
        
        if(content) {
            note.content = content;
        }
        if(tags) {
            note.tags = tags;
        }
        if(isPinned) {
            note.isPinned = isPinned;
        }
        await note.save();
        return res.status(200).json({error: false, note, message: 'Note updated successfully'});

    } catch (error) {
        return res.status(500).json({error: true, message: 'Error updating note'});
    }
} );

//get notes
app.get('/get_all_notes', authenticateToken, async (req, res) => {
    const { user } = req.user;
    try {
        const notes = await Note.find({ userId: user._id });
        return res.status(200).json({ error: false, notes, message: 'Notes fetched successfully'});
    } catch (error) {
        return res.status(400).json({ error: true, message: 'Error fetching notes' });
    }
});

//delete notes
app.delete('/delete-note/:noteId', authenticateToken, async (req, res) => {
    const { user } = req.user;
    const noteId = req.params.noteId;

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });
        if(!note) {
            return res.status(404).json({error: true, message: 'Note not found'});
        }
        await note.deleteOne({
            _id: noteId,
            userId: user._id
        }
        );
        return res.status(200).json({error: false, message: 'Note deleted successfully'});
    } catch (error) {
        return res.status(500).json({error: true, message: 'Error deleting note'});
    }
});

// update is pinned
app.put('/update_note_pinned/:noteId', authenticateToken, async (req, res) => {
    const { isPinned } = req.body;
    const { user } = req.user;
    const noteId = req.params.noteId;

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });
        if(!note) {
            return res.status(404).json({error: true, message: 'Note not found'});
        }
        note.isPinned = isPinned;
        await note.save();
        return res.status(200).json({error: false, note, message: 'Note pinned successfully'});
    } catch (error) {
        return res.status(500).json({error: true, message: 'Error updating note'});
    }
});

// serarch notes
app.get('/search-notes', authenticateToken, async (req, res) => {
    const {user} = req.user; 
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: true, message: 'Query is required' });
    }

    try {
        const matchingNotes = await Note.find({
            userId: user._id,
            $or: [
                { title: { $regex: new RegExp(query, 'i') } },
                { content: { $regex: new RegExp(query, 'i') } },
                { tags: { $regex: new RegExp(query, 'i') } }
            ]
        });
       
        return res.status(200).json({ error: false, notes: matchingNotes, message: 'Notes matching the search query fetched successfully' });
       

    } catch (error) {
        return res.status(500).json({ error: true, message: 'Error searching notes' });
    }
});


app.listen(process.env.PORT, () => {
    mongoose.connect(config.connectionString), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    };

    console.log(`Server is running on port ${process.env.PORT}`);
});

module.exports = app;