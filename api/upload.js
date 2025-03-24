import { createClient } from '@supabase/supabase-js';
import multer from 'multer';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const randomId = Math.random().toString(36).substring(7);
        const fileExt = req.file.originalname.split('.').pop();
        const fileName = `${randomId}.${fileExt}`;

        const { data, error } = await supabase.storage
            .from('cdn')
            .upload(`file/${fileName}`, req.file.buffer, { contentType: req.file.mimetype });

        if (error) throw error;

        return res.json({
            url: `https://fisrt-one.vercel.app/file/${randomId}`
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

export default app;
