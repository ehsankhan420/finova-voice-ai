import mongoose from "mongoose"

const voiceRequestSchema = new mongoose.Schema({
  originalFilename: {
    type: String,
    required: true,
  },
  storedFilename: {
    type: String,
    required: true,
  },
  prompt: {
    type: String,
    default: "Please transcribe this audio and respond appropriately.",
  },
  response: {
    type: String,
    required: true,
  },
  audioFilename: {
    type: String,
    default: null,
  },
  mimeType: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const VoiceRequest = mongoose.model("VoiceRequest", voiceRequestSchema)

export default VoiceRequest

