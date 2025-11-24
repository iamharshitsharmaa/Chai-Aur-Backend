import mongoose from "mongoose";
const todoSchema = new mongoose.Schema({

    tittle: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },

}, { timestamps: true });

export const Todo = mongoose.model("Todo", todoSchema);