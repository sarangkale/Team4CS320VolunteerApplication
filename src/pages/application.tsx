import { useState } from "react";
import { applyToListing } from "../lib/application.ts";
import type { DashboardEvent } from "./volunteer_dashboard_events.tsx";

export default function SubmitApp({ listing, onClose }: { listing: DashboardEvent, onClose: () => void }) {
    const questions: string[] = listing.questions;
    const [answers, setAnswers] = useState(new Array<string>(listing.questions.length).fill(""));
    const [error, setError] = useState<string | null>(null)

    const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement, HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setAnswers((prev) => prev.map((e, i) => i === Number(name) ? value : e));
    };
    const handlePost = async () => {
        if (answers.some(e => e.length === 0)) { setError("An answer is required."); return; }

        setError(null);

        const res = await applyToListing(
            listing.id,
            answers
        );

        if (res.type === "error") {
            console.error("createListing failed:", res.error);
            setError(res.error.msg || res.error.name || "Failed to create listing.");
            return;
        }

        onClose();
    };

    return (
        <div
            className="fixed inset-0 bg-black/[0.42] z-[200] flex items-center justify-center overflow-y-auto py-8"
            onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
        >
            <div className="bg-white rounded-card w-[90%] max-w-[680px] px-[42px] py-10 shadow-2xl">

                <h2 className="text-2xl font-bold mb-6">Create a Volunteering Opportunity</h2>

                <div className="flex flex-col gap-4">

                    <div className="grid gap-x-6">
                        <div className="answers container">
                            {questions.length === 0 ? <p>No questionnaire for this opportunity</p>
                                : questions.map((question, i) => (
                                <div key={question}>
                                    <label className="text-[15px] font-medium">{question}</label>
                                    <input name={String(i)} value={answers[i]} onChange={handleAnswerChange}
                                        placeholder="Please type answer here"
                                        className="bg-surface border-none rounded-full px-[18px] py-[9px] text-[15px] text-gray-900 outline-none w-full" />
                                </div>
                            ))}
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

                    {/* Footer buttons */}
                    <div className="flex gap-3 mt-7 justify-end">
                        <button
                            className="bg-surface border-none rounded-full px-7 py-3 text-[15px] font-medium cursor-pointer transition-colors hover:bg-surface-dark"
                            onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            className="bg-primary text-white border-none rounded-full px-7 py-3 text-[15px] font-medium cursor-pointer transition-colors hover:bg-primary-dark disabled:opacity-50"
                            onClick={handlePost}>
                            Submit Application
                        </button>
                    </div>
                </div>
            </div>
            <div>
            </div>
        </div>
    );
}
