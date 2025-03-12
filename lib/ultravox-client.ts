// // This file would contain the Ultravox client implementation
// // For now, we're using direct imports in the voice-call page
// // This is a placeholder for future refactoring

// export async function initializeUltravox() {
//     try {
//       // Get the API key from our secure endpoint
//       const response = await fetch("/api/ultravox-token")
//       const { apiKey } = await response.json()
  
//       if (!apiKey) {
//         throw new Error("Failed to get Ultravox API key")
//       }
  
//       // Dynamically import the Ultravox SDK
//       const UltravoxModule = await import("@ultravox/sdk")
//       const Ultravox = UltravoxModule.default || UltravoxModule
  
//       // Initialize and return the client
//       return new Ultravox({ apiKey })
//     } catch (error) {
//       console.error("Failed to initialize Ultravox client:", error)
//       throw error
//     }
//   }
  
  