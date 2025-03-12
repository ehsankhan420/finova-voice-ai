// Ultravox SDK Fallback
// This is a minimal implementation that provides the basic interface
// when the actual SDK fails to load

console.warn("Using Ultravox SDK fallback implementation")

window.Ultravox = class Ultravox {
  constructor(options) {
    this.apiKey = options.apiKey
    console.log("Ultravox SDK initialized with API key:", this.apiKey)
  }

  async createCall(options) {
    console.log("Creating call with options:", options)

    // Create a mock session
    const session = {
      id: `session-${Date.now()}`,
      voice: options.voice,

      // Mock methods
      setMicrophoneMuted: (muted) => {
        console.log(`Microphone ${muted ? "muted" : "unmuted"}`)
        if (options.stream) {
          options.stream.getAudioTracks().forEach((track) => {
            track.enabled = !muted
          })
        }
      },

      setAudioEnabled: (enabled) => {
        console.log(`Audio ${enabled ? "enabled" : "disabled"}`)
      },

      end: async () => {
        console.log("Ending call session")
        if (this._onEndedCallback) {
          this._onEndedCallback()
        }
        return Promise.resolve()
      },

      on: (event, callback) => {
        if (event === "ended") {
          this._onEndedCallback = callback
        } else if (event === "error") {
          this._onErrorCallback = callback
        }
      },
    }

    // Simulate transcript updates
    setTimeout(() => {
      if (options.onTranscript) {
        options.onTranscript("Hello! I'm your FINOVA voice assistant powered by Ultravox. ")

        setTimeout(() => {
          options.onTranscript("How can I help you today? ")

          setTimeout(() => {
            options.onTranscript("Could you tell me your name? ")

            setTimeout(() => {
              if (options.onToolCall) {
                options.onToolCall({
                  name: "collect_user_info",
                  arguments: {
                    name: "John Doe",
                    email: "john@example.com",
                    organization: "Example Corp",
                    use_case: "Voice assistant integration",
                  },
                })
              }
            }, 5000)
          }, 3000)
        }, 3000)
      }
    }, 1000)

    return session
  }
}

