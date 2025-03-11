import React, { useState } from "react";

const Description = ({ isOpen, onClose, onSubmit, type }) => {
    const [description, setDescription] = useState("");

    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[9999]"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white z-200 p-5 rounded-lg shadow-lg w-full max-w-[600px]"
            >
                <h2 className="text-xl font-semibold mb-3">
                    Enter {type} Description
                </h2>

                <textarea
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows="4"
                    placeholder={`Enter reason for ${type.toLowerCase()}...`}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>

                <div className="flex justify-end gap-2 mt-4">
                    <button
                        className="bg-gray-500 text-white px-4 py-2 rounded-md"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded-md"
                        onClick={() => onSubmit(description)}
                    >
                        {type === "Ban" ? "Ban" : "Reject"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Description;
