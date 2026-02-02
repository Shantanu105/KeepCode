require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Datastore = require('nedb-promises');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure directories exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)){
    fs.mkdirSync(dataDir);
}

// Database Setup (NeDB)
const db = Datastore.create({ filename: path.join(dataDir, 'notes.db'), autoload: true });

// Multer Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
});
const upload = multer({ storage: storage });

// Routes

// GET all notes
app.get('/api/notes', async (req, res) => {
  try {
    const { isArchived, isTrashed } = req.query;
    const filter = {};
    
    // Convert query strings to boolean/filter logic
    if (isArchived !== undefined) filter.isArchived = isArchived === 'true';
    if (isTrashed !== undefined) filter.isTrashed = isTrashed === 'true';

    // Default: active notes
    if (isArchived === undefined && isTrashed === undefined) {
        filter.isArchived = false;
        filter.isTrashed = false;
    }

    // NeDB sort syntax: { field: -1 } for desc
    const notes = await db.find(filter).sort({ isPinned: -1, createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE a note
app.post('/api/notes', async (req, res) => {
  try {
    const noteData = {
        title: req.body.title || '',
        content: req.body.content || {},
        images: req.body.images || [],
        isPinned: req.body.isPinned || false,
        isArchived: false,
        isTrashed: false,
        createdAt: new Date(),
        ...req.body // spread allows overrides but defaults above ensure safety
    };
    
    // Explicitly set these again to ensure they aren't overridden by undefined in ...req.body if passed as such
    if (noteData.isArchived === undefined) noteData.isArchived = false;
    if (noteData.isTrashed === undefined) noteData.isTrashed = false;

    const newNote = await db.insert(noteData);
    res.status(201).json(newNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE a note
app.put('/api/notes/:id', async (req, res) => {
  try {
    const id = req.params.id;
    // NeDB update
    await db.update({ _id: id }, { $set: req.body });
    // Fetch updated document to return it
    const updatedNote = await db.findOne({ _id: id });
    res.json(updatedNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a note (Permanent)
app.delete('/api/notes/:id', async (req, res) => {
    try {
        await db.remove({ _id: req.params.id }, { multi: false });
        res.json({ message: 'Note deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Upload Image
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});