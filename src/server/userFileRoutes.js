import express from "express";
import { ObjectId } from "mongodb";
import multer from "multer";
import fs from "fs";

const UPLOAD_DIR = "uploads/";

const upload = multer({
    dest: UPLOAD_DIR
});

export default function registerUserFileRoutes(app, client, ensureAuthenticated) {
    const files = client.db("portfolio_maker").collection("files");
    const json = express.json();

    express.static(UPLOAD_DIR);

    app.get('/api/files/:uid', ensureAuthenticated, async (req, res) => {
        const { uid } = req.params;
        
        if (!ObjectId.isValid(uid)) {
            return res.status(404).json({ error: "User not found" });
        }

        const ownerFiles = await files
            .find({ owner: new ObjectId(uid) })
            .sort({ uploadedOn: -1 })
            .toArray();

        res.json({ ownerFiles });
    });

    app.post('/api/files', ensureAuthenticated, upload.array("files"), async (req, res) => {
        console.log(req.files);

        for (const file of req.files) {
            await files.insertOne({
                owner: req.user._id,
                filename: file.filename,
                originalName: file.originalname,
                mimeType: file.mimetype,
                size: file.size,
                uploadedOn: new Date()
            });
        }

        res.status(201).json({ success: true });
    });

    app.delete('/api/files/:fileId', ensureAuthenticated, async (req, res) => {
        const { fileId } = req.params;

        if (!ObjectId.isValid(fileId)) {
            return res.status(404).json({ error: "File not found" });
        }

        const result = await files.findOneAndDelete({ owner: new ObjectId(req.user._id), _id: new ObjectId(fileId) })
        
        if (!result) {
            return res.status(404).json({ error: "File not found" });
        }

        fs.unlink(UPLOAD_DIR + result.filename, (err) => {
            if (err) console.error(err);
        });

        res.status(204).send();

    });
}