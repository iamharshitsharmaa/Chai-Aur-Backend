import mongoose, {Schema} from "mongoose";

const subscriptionSchema = new Schema({
   subscriber: {
         type: mongoose.Schema.Types.ObjectId,
            ref: "User",
   },
   
});

export const Subscription = mongoose.model("Subscription", subscriptionSchema);