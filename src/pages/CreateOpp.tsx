import { useState } from "react";
import { createListing } from "../lib/listings.ts";
import type { ListingData } from "../../shared/types.ts";

export default function CreateOpp({ onClose, onCreated }: {
    onClose: () => void,
    onCreated: (listing: ListingData) => void,
}) {
    const [form, setForm] = useState({
        name: "", capacity: "", date: "", duration: "",
        transport: "", street: "", city: "", state: "",
        zip_code: "", description: "", needed_skill: "",
    });

    const [tags, setTags] = useState<string[]>([]);
    const [addingTag, setAddingTag] = useState(false);
    const [newTagValue, setNewTagValue] = useState("");

    const [questions, setQuestions] = useState<string[]>([]);
    const [addingQuestion, setAddingQuestion] = useState(false);
    const [newQuestionValue, setNewQuestionValue] = useState("");
    const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
    const [editingQuestionValue, setEditingQuestionValue] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        console.log(value);
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // --- Tag handlers ---
    const handleAddTag = () => {
        if (addingTag) {
            if (newTagValue.trim() && !tags.includes(newTagValue.trim())) {
                setTags((prev) => [...prev, newTagValue.trim()]);
            }
            setNewTagValue("");
            setAddingTag(false);
        } else {
            setAddingTag(true);
        }
    };

    const handleRemoveTag = (index: number) =>
        setTags((prev) => prev.filter((_, i) => i !== index));

    // --- Question handlers ---
    const handleAddQuestion = () => {
        if (addingQuestion) {
            if (newQuestionValue.trim()) {
                setQuestions((prev) => [...prev, newQuestionValue.trim()]);
            }
            setNewQuestionValue("");
            setAddingQuestion(false);
        } else {
            setAddingQuestion(true);
        }
    };

    const handleRemoveQuestion = (index: number) => {
        setQuestions((prev) => prev.filter((_, i) => i !== index));
        if (editingQuestionIndex === index) {
            setEditingQuestionIndex(null);
            setEditingQuestionValue("");
        }
    };

    const handleStartEditQuestion = (index: number) => {
        setEditingQuestionIndex(index);
        setEditingQuestionValue(questions[index]);
    };

    const handleSaveEditQuestion = (index: number) => {
        if (editingQuestionValue.trim()) {
            setQuestions((prev) =>
                prev.map((q, i) => (i === index ? editingQuestionValue.trim() : q))
            );
        }
        setEditingQuestionIndex(null);
        setEditingQuestionValue("");
    };

    // --- Submit ---
    const handlePost = async () => {
        if (!form.name.trim())   { setError("Opportunity name is required."); return; }
        if (!form.date)          { setError("Date is required."); return; }
        if (!form.street.trim() || !form.city.trim() || !form.state.trim() || !form.zip_code.trim()) {
            setError("Full address is required (street, city, state, zip)."); return;
        }
        if (!form.capacity || isNaN(Number(form.capacity)) || Number(form.capacity) < 1) {
            setError("A valid volunteer total is required."); return;
        }

        setSubmitting(true);
        setError(null);

        const res = await createListing(
            form.name.trim(),
            form.description.trim(),
            (new Date(form.date)).toISOString(),
            form.duration.trim(),
            Number(form.capacity),
            tags.join(", "),
            form.needed_skill.trim() ? [form.needed_skill.trim()] : [],
            form.transport.trim(),
            form.street.trim(),
            form.city.trim(),
            form.state.trim(),
            form.zip_code.trim(),
            questions.length > 0 ? questions : null,
        );

        setSubmitting(false);

        if (res.type === "error") {
            console.error("createListing failed:", res.error);
            setError(res.error.msg || res.error.name || "Failed to create listing.");
            return;
        }

        onCreated?.(res.data.listing);
        onClose?.();
    };

    return (
        <div
            className="fixed inset-0 bg-black/[0.42] z-[200] flex items-center justify-center overflow-y-auto py-8"
            onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
        >
            <div className="bg-white rounded-card w-[90%] max-w-[680px] px-[42px] py-10 shadow-2xl">

                <h2 className="text-2xl font-bold mb-6">Create a Volunteering Opportunity</h2>

                <div className="flex flex-col gap-2">

                    {/* Row 1: Name | Date */}
                    {/* <div className="flex flex-col gap-1.5">
                        <label className="text-[15px] font-medium">Opportunity Name *</label>
                        <input name="name" value={form.name} onChange={handleChange}
                            placeholder="e.g. Community Cleanup"
                            className="bg-surface border-none rounded-full px-[18px] py-[9px] text-[15px] text-gray-900 outline-none w-full" />
                    </div> */}
                    <div className="grid grid-cols-2 gap-x-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[15px] font-medium">Opportunity Name *</label>
                            <input name="name" value={form.name} onChange={handleChange}
                                placeholder="e.g. Community Cleanup"
                                className="bg-surface border-none rounded-full px-[18px] py-[9px] text-[15px] text-gray-900 outline-none w-full" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[15px] font-medium">Date *</label>
                            <input name="date" type="datetime-local" value={form.date} onChange={handleChange}
                                className="bg-surface border-none rounded-full px-[18px] py-[9px] text-[15px] text-gray-900 outline-none w-full" />
                        </div>
                        {/* <div className="flex flex-col gap-1.5">
                            <label className="text-[15px] font-medium">Time *</label>
                            <input name="time" type="time" value={[form.time.split(":")[0], form.time.split(":")[1]].join(":")}
                            onChange={e =>{
                                console.log(e.target.value);
                                console.log([form.time.split(":")[0], form.time.split(":")[1]].join(":"));
                                handleChange({
                                    ...e,
                                    target: {
                                        ...e.target,
                                        value: e.target.valueAsDate!.toISOString().split("T")[1]
                                    }
                                })}}
                                className="bg-surface border-none rounded-full px-[18px] py-[9px] text-[15px] text-gray-900 outline-none w-full" />
                        </div> */}
                    </div>

                    {/* Row 2: Capacity | Duration */}
                    <div className="grid grid-cols-2 gap-x-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[15px] font-medium">Volunteer Total *</label>
                            <input name="capacity" type="number" min={1} value={form.capacity} onChange={handleChange}
                                placeholder="25"
                                className="bg-surface border-none rounded-full px-[18px] py-[9px] text-[15px] text-gray-900 outline-none w-full" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[15px] font-medium">Duration</label>
                            <input name="duration" value={form.duration} onChange={handleChange}
                                placeholder="e.g. 3 hours"
                                className="bg-surface border-none rounded-full px-[18px] py-[9px] text-[15px] text-gray-900 outline-none w-full" />
                        </div>
                    </div>

                    {/* Row 3: Transport | Needed Skill */}
                    <div className="grid grid-cols-2 gap-x-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[15px] font-medium">Transport</label>
                            <input name="transport" value={form.transport} onChange={handleChange}
                                placeholder="e.g. Bus provided"
                                className="bg-surface border-none rounded-full px-[18px] py-[9px] text-[15px] text-gray-900 outline-none w-full" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[15px] font-medium">Needed Skill</label>
                            <input name="needed_skill" value={form.needed_skill} onChange={handleChange}
                                placeholder="e.g. First Aid"
                                className="bg-surface border-none rounded-full px-[18px] py-[9px] text-[15px] text-gray-900 outline-none w-full" />
                        </div>
                    </div>

                    {/* Row 4: Street | City */}
                    <div className="grid grid-cols-2 gap-x-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[15px] font-medium">Street *</label>
                            <input name="street" value={form.street} onChange={handleChange}
                                placeholder="123 Main St"
                                className="bg-surface border-none rounded-full px-[18px] py-[9px] text-[15px] text-gray-900 outline-none w-full" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[15px] font-medium">City *</label>
                            <input name="city" value={form.city} onChange={handleChange}
                                placeholder="Amherst"
                                className="bg-surface border-none rounded-full px-[18px] py-[9px] text-[15px] text-gray-900 outline-none w-full" />
                        </div>
                    </div>

                    {/* Row 5: State | Zip */}
                    <div className="grid grid-cols-2 gap-x-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[15px] font-medium">State *</label>
                            <input name="state" value={form.state} onChange={handleChange}
                                placeholder="MA"
                                className="bg-surface border-none rounded-full px-[18px] py-[9px] text-[15px] text-gray-900 outline-none w-full" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[15px] font-medium">Zip Code *</label>
                            <input name="zip_code" value={form.zip_code} onChange={handleChange}
                                placeholder="01002"
                                className="bg-surface border-none rounded-full px-[18px] py-[9px] text-[15px] text-gray-900 outline-none w-full" />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[15px] font-medium">Description</label>
                        <textarea name="description" value={form.description} onChange={handleChange}
                            rows={4} placeholder="Describe the opportunity…"
                            className="bg-surface border-none rounded-[16px] px-[18px] py-3 text-[15px] text-gray-900 outline-none w-full resize-y leading-[1.55]" />
                    </div>

                    {/* Tags */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[15px] font-medium">Tags / Categories</label>
                        <div className="flex flex-wrap gap-2 items-center">
                            {tags.map((tag, i) => (
                                <span key={i} onClick={() => handleRemoveTag(i)} title="Click to remove"
                                    className="bg-badge text-white rounded-full px-3.5 py-1.5 text-sm font-medium cursor-pointer select-none transition-colors hover:opacity-80">
                                    {tag}
                                </span>
                            ))}
                            {addingTag && (
                                <input autoFocus value={newTagValue}
                                    onChange={(e) => setNewTagValue(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleAddTag();
                                        if (e.key === "Escape") { setAddingTag(false); setNewTagValue(""); }
                                    }}
                                    placeholder="Tag name"
                                    className="bg-surface border-none rounded-full px-3.5 py-1.5 text-sm w-[110px] outline-none" />
                            )}
                            <button onClick={handleAddTag}
                                className="bg-surface border-none rounded-full px-4 py-1.5 text-sm cursor-pointer text-gray-900 transition-colors hover:bg-surface-dark">
                                {addingTag ? "✓ Add" : "+ Tag"}
                            </button>
                        </div>
                    </div>

                    {/* Questionnaire */}
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-0.5">
                            <label className="text-[15px] font-medium">Applicant Questionnaire</label>
                            <p className="text-[13px] text-gray-500 leading-snug">
                                Questions volunteers will be asked to answer when applying.
                            </p>
                        </div>

                        {questions.length > 0 && (
                            <div className="flex flex-col gap-2 mt-1">
                                {questions.map((q, i) => (
                                    <div key={i} className="bg-surface rounded-[14px] px-[18px] py-3 flex flex-col gap-2">
                                        {editingQuestionIndex === i ? (
                                            <div className="flex flex-col gap-2">
                                                <textarea
                                                    autoFocus
                                                    rows={2}
                                                    value={editingQuestionValue}
                                                    onChange={(e) => setEditingQuestionValue(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter" && !e.shiftKey) {
                                                            e.preventDefault();
                                                            handleSaveEditQuestion(i);
                                                        }
                                                        if (e.key === "Escape") {
                                                            setEditingQuestionIndex(null);
                                                            setEditingQuestionValue("");
                                                        }
                                                    }}
                                                    className="bg-white border-none rounded-[10px] px-3 py-2 text-[14px] text-gray-900 outline-none w-full resize-none leading-[1.5]"
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleSaveEditQuestion(i)}
                                                        className="bg-primary text-white border-none rounded-full px-4 py-1.5 text-sm font-medium cursor-pointer transition-colors hover:bg-primary-dark">
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => { setEditingQuestionIndex(null); setEditingQuestionValue(""); }}
                                                        className="bg-white border-none rounded-full px-4 py-1.5 text-sm cursor-pointer text-gray-600 transition-colors hover:bg-surface-dark">
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-start justify-between gap-3">
                                                <span className="text-[14px] text-gray-800 leading-snug flex-1">
                                                    <span className="text-gray-400 font-medium mr-2 select-none">{i + 1}.</span>
                                                    {q}
                                                </span>
                                                <div className="flex gap-1 shrink-0">
                                                    <button
                                                        onClick={() => handleStartEditQuestion(i)}
                                                        title="Edit question"
                                                        className="bg-transparent border-none rounded-full w-7 h-7 flex items-center justify-center text-gray-400 cursor-pointer transition-colors hover:bg-surface-dark hover:text-gray-700 text-[13px]">
                                                        ✎
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemoveQuestion(i)}
                                                        title="Remove question"
                                                        className="bg-transparent border-none rounded-full w-7 h-7 flex items-center justify-center text-gray-400 cursor-pointer transition-colors hover:bg-surface-dark hover:text-red-500 text-[15px]">
                                                        ×
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {addingQuestion && (
                            <div className="flex flex-col gap-2 mt-1">
                                <textarea
                                    autoFocus
                                    rows={2}
                                    value={newQuestionValue}
                                    onChange={(e) => setNewQuestionValue(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleAddQuestion();
                                        }
                                        if (e.key === "Escape") {
                                            setAddingQuestion(false);
                                            setNewQuestionValue("");
                                        }
                                    }}
                                    placeholder="e.g. Do you have experience working with children?"
                                    className="bg-surface border-none rounded-[14px] px-[18px] py-3 text-[14px] text-gray-900 outline-none w-full resize-none leading-[1.5]"
                                />
                            </div>
                        )}

                        <div className="flex gap-2 mt-1">
                            <button
                                onClick={handleAddQuestion}
                                className="bg-surface border-none rounded-full px-4 py-1.5 text-sm cursor-pointer text-gray-900 transition-colors hover:bg-surface-dark">
                                {addingQuestion ? "✓ Add Question" : "+ Question"}
                            </button>
                            {addingQuestion && (
                                <button
                                    onClick={() => { setAddingQuestion(false); setNewQuestionValue(""); }}
                                    className="bg-transparent border-none rounded-full px-4 py-1.5 text-sm cursor-pointer text-gray-500 transition-colors hover:bg-surface">
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>

                </div>

                {error && <p className="mt-3 text-sm text-[#bd0303]">{error}</p>}

                {/* Footer buttons */}
                <div className="flex gap-3 mt-7 justify-end">
                    <button
                        className="bg-surface border-none rounded-full px-7 py-3 text-[15px] font-medium cursor-pointer transition-colors hover:bg-surface-dark"
                        onClick={onClose} disabled={submitting}>
                        Cancel
                    </button>
                    <button
                        className="bg-primary text-white border-none rounded-full px-7 py-3 text-[15px] font-medium cursor-pointer transition-colors hover:bg-primary-dark disabled:opacity-50"
                        onClick={handlePost} disabled={submitting}>
                        {submitting ? "Posting…" : "Post Event"}
                    </button>
                </div>
            </div>
        </div>
    );
}