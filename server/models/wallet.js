import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
    instructor: { type:mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    availableBalance: { type: Number, default: 0 },
    totalEarned: { type: Number, default: 0 }
});


export default mongoose.model("Wallet", walletSchema);

