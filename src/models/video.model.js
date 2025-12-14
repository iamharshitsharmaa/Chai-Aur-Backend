import mongoose, { Schema } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const videoSchema = new Schema(
    {
        tittle : {
            type: String,
            required: true,
            trim: true
        },
        description : {
            type: String,
            required: true,
            trim: true
        },
        videofile: {
            type: String,
            required: true,
            trim: true
        },
        thumbnail: {
            type: String,
            trim: true
        },
        duration: {
            type: Number,
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        isPublic: {
            type: Boolean,
            default: true
        },
        owner:{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }

        
    },{ timestamps: true }
)


export const Video = mongoose.model('Video', videoSchema);