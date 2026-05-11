import { useState } from "react";
import type { ApplicationData } from "../../shared/types.ts";

export default function SubmitApp(){
    const questions:string[] = ["question1", "question2", "placeholder3"] // get from listing_id -> questions
    const [form, setForm] = useState({
        name: "", answer: "", file: "", 
    });

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement, HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    return(
        <div>
            <div>
                <label className="text-[15px] font-medium">{question}</label>
                            <input name="needed_skill" value={form.answer} onChange={handleChange}
                                placeholder="uid.name"/>  {/* select name from uid */}
            </div>
            <div className="answers container"> 
                {questions.map((question) => (
                    <div key={question} className="skill-tag">
                        <label className="text-[15px] font-medium">{question}</label>
                            <input name="needed_skill" value={form.answer} onChange={handleChange}
                                placeholder="Please type answer here"
                                className="bg-surface border-none rounded-full px-[18px] py-[9px] text-[15px] text-gray-900 outline-none w-full" />
                    </div>
                ))}
            </div>
        </div>
    )
}