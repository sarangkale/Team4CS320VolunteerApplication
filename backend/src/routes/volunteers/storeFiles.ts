import express from "express";
import { createSupabaseClient } from "../authRouting.ts";
import { decode } from 'base64-arraybuffer';

export default async function storefile(req: express.Request, res: express.Response) { 
    const supabase = await createSupabaseClient(req.accessToken!, req.refreshToken!);
    
    const { data, error } = await supabase.storage.from('ApplicationFiles')
                                                .upload(req.get('filepath'), decode('base64FileData'), {contentType: 'application/pdf'})
                                                // make sure the 1st param of upload() actually gets a filepath
    if (error) {
        return res.status(400).json({error: "upload failed"})
    } else {
        return res.json(data)
        // double check what data actually is and we are returning what we actually want to return
    }

}