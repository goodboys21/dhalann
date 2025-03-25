import multer from 'multer';
import { createClient } from '@supabase/supabase-js';

const upload = multer({ storage: multer.memoryStorage() });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    upload.single('file')(req, res, async (err) => {
        if (err) return res.status(500).json({ error: 'Upload failed' });

        const { buffer, originalname, mimetype } = req.file;

        const { data, error } = await supabase.storage
            .from(process.env.BUCKET_NAME)
            .upload(`uploads/${originalname}`, buffer, { contentType: mimetype });

        if (error) return res.status(500).json({ error: error.message });

        const { publicURL } = supabase.storage.from(process.env.BUCKET_NAME).getPublicUrl(`uploads/${originalname}`);

        res.json({ url: publicURL });
    });
}
