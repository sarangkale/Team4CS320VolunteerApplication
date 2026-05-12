import { useState } from "react";
import { createApplication } from "../lib/application.ts";
import type { ApplicationData } from "../../shared/types.ts";

export default function SubmitApp({ onClose, onCreated }: {onClose: () => void, onCreated: (appli: ApplicationData) => void,}){
    //const questions:string[] = ["question1"]  For future improvements, there should be an option for multiple questions
    const [form, setForm] = useState({
        name: "", answer: "", file: "", 
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement, HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };
    const handlePost = async () => {
            if (!form.name.trim())   { setError("Your name is required."); return; }
            if (!form.answer.trim())          { setError("An answer is required."); return; }
            //if (!form.file.trim()) {setError("A file is required."); return;}
    
            setSubmitting(true);
            setError(null);
    
            const res = await createApplication(
                form.name.trim(),
                form.answer.trim(),     
                //form.file.trim(),
                
            );
    
            setSubmitting(false);
    
            if (res.type === "error") {
                console.error("createListing failed:", res.error);
                setError(res.error.msg || res.error.name || "Failed to create listing.");
                return;
            }
    
            onCreated?.(res.data.application);
            onClose?.();
        };

    return(
        <div
            className="fixed inset-0 bg-black/[0.42] z-[200] flex items-center justify-center overflow-y-auto py-8"
            onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
        >
            <div className="bg-white rounded-card w-[90%] max-w-[680px] px-[42px] py-10 shadow-2xl">

                <h2 className="text-2xl font-bold mb-6">Create a Volunteering Opportunity</h2>

                <div className="flex flex-col gap-4">

                    <div className="grid grid-cols-2 gap-x-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[15px] font-medium">Application *</label>
                            <input name="name" value={form.name} onChange={handleChange}
                                placeholder="Your Name"  
                                className="bg-surface border-none rounded-full px-[18px] py-[9px] text-[15px] text-gray-900 outline-none w-full" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[15px] font-medium">Answer *</label>
                            <input name="date" type="date" value={[form.answer]} onChange={handleChange}
                                placeholder="Write a bit about yourself. Why do you want to do this?"
                                className="bg-surface border-none rounded-full px-[18px] py-[9px] text-[15px] text-gray-900 outline-none w-full" />
                        </div>
                        {/* <div> 
                            <div className="answers container"> 
                                {questions.map((question) => (
                                    <div key={question}>
                                        <label className="text-[15px] font-medium">{question}</label>                   This was an attempt of if there were multiple questions and a text box per question.
                                            <input name="needed_skill" value={form.answer} onChange={handleChange}
                                                placeholder="Please type answer here"
                                                className="bg-surface border-none rounded-full px-[18px] py-[9px] text-[15px] text-gray-900 outline-none w-full" />
                                    </div>
                                ))}
                            </div>
                        </div> */}
                    </div>
 

                {error && <p className="mt-3 text-sm text-[#bd0303]">{error}</p>}

                {/* Cancel & Submit buttons */}
                <div className="flex gap-3 mt-7 justify-end">
                    <button
                        className="bg-surface border-none rounded-full px-7 py-3 text-[15px] font-medium cursor-pointer transition-colors hover:bg-surface-dark"
                        onClick={onClose} disabled={submitting}>
                        Cancel
                    </button>
                    <button
                        className="bg-primary text-white border-none rounded-full px-7 py-3 text-[15px] font-medium cursor-pointer transition-colors hover:bg-primary-dark disabled:opacity-50"
                        onClick={handlePost} disabled={submitting}>
                        {submitting ? "Submitting…" : "Submit Application"}
                    </button>
                </div>
            </div>
        </div>
    
        </div>
    );
}