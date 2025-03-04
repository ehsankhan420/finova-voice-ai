import Image from "next/image"
import { Sparkles, Upload, Volume2, Wand2, Zap } from "lucide-react"
import UploadForm from "@/components/upload-form"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="min-h-screen transition-colors duration-300 relative">
      <div className="noise"></div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-[-1]">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_hsl(var(--primary)/0.08)_0%,_transparent_50%)] animate-gradient"></div>
      </div>

      <header className="sticky top-0 z-10 w-full border-b bg-background/80 backdrop-blur-md transition-all duration-300">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Icon-swk7WBmbgmNpfLAhcW7L0zgvSEnqeu.png"
                alt="FINOVA Logo"
                width={40}
                height={40}
                className="h-10 w-auto transition-transform hover:scale-105"
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
          <nav className="flex items-center gap-6">
            <a
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              How It Works
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#api"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              API
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="container py-8 md:py-12">
        <section className="py-8 md:py-12 lg:py-16">
          <div className="mx-auto max-w-4xl text-center relative">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50 animate-pulse-custom"></div>
            <h1 className="animate-fade-up text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl gradient-text">
              Transform Voice to Text to Voice with AI
            </h1>
            <p className="mt-6 animate-fade-up text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed opacity-0 animation-delay-200">
              Upload voice recordings, get AI-powered text responses, and convert them back to natural speech.
            </p>
            <div className="mt-8 flex justify-center gap-4 animate-fade-up opacity-0 animation-delay-300">
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 button-hover"
              >
                <Zap className="mr-2 h-4 w-4" />
                Explore Features
              </a>
            </div>
          </div>

          <div className="mt-12 animate-fade-up opacity-0 animation-delay-400">
            <UploadForm />
          </div>
        </section>

        <section id="features" className="py-16 md:py-20 relative">
          <div className="absolute -top-40 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl opacity-70 animate-float"></div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-16 gradient-text">
            Key Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group rounded-xl border p-6 shadow-sm card-hover animate-fade-up opacity-0 animation-delay-100 bg-card/80 backdrop-blur-sm">
              <div className="mb-4 rounded-full bg-primary/10 p-3 w-fit transition-transform group-hover:scale-110 duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full animate-pulse-custom"></div>
                <Upload className="h-6 w-6 text-primary relative z-10" />
              </div>
              <h3 className="text-xl font-bold group-hover:text-primary transition-colors">Voice Upload</h3>
              <p className="mt-2 text-muted-foreground">
                Upload voice recordings in various formats for AI processing.
              </p>
            </div>

            <div className="group rounded-xl border p-6 shadow-sm card-hover animate-fade-up opacity-0 animation-delay-200 bg-card/80 backdrop-blur-sm">
              <div className="mb-4 rounded-full bg-primary/10 p-3 w-fit transition-transform group-hover:scale-110 duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full animate-pulse-custom"></div>
                <Wand2 className="h-6 w-6 text-primary relative z-10" />
              </div>
              <h3 className="text-xl font-bold group-hover:text-primary transition-colors">AI Processing</h3>
              <p className="mt-2 text-muted-foreground">
                Powered by Google's Gemini 1.5 Flash for accurate voice-to-text conversion.
              </p>
            </div>

            <div className="group rounded-xl border p-6 shadow-sm card-hover animate-fade-up opacity-0 animation-delay-300 bg-card/80 backdrop-blur-sm">
              <div className="mb-4 rounded-full bg-primary/10 p-3 w-fit transition-transform group-hover:scale-110 duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full animate-pulse-custom"></div>
                <Volume2 className="h-6 w-6 text-primary relative z-10" />
              </div>
              <h3 className="text-xl font-bold group-hover:text-primary transition-colors">Voice Synthesis</h3>
              <p className="mt-2 text-muted-foreground">
                Convert AI responses back to natural-sounding speech with ElevenLabs.
              </p>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-16 md:py-20 relative">
          <div
            className="absolute -top-20 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-70 animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-16 gradient-text">
            How It Works
          </h2>

          <div className="relative">
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-primary/30 via-primary/50 to-primary/30 animate-pulse-custom"></div>

            <div className="relative grid gap-8 md:grid-cols-2">
              <div
                className="flex flex-col items-end md:text-right animate-slide-in-left opacity-0"
                style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
              >
                <div className="mb-2 flex items-center">
                  <div className="relative z-10 rounded-full bg-background p-1 text-primary ring-2 ring-primary/50 shadow-lg">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary animate-pulse-custom">
                      <span className="text-sm font-bold text-primary-foreground">1</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border bg-card/80 backdrop-blur-sm p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-card">
                  <h3 className="text-xl font-bold">Upload Voice</h3>
                  <p className="mt-2 text-muted-foreground">
                    Upload your voice recording through our intuitive interface.
                  </p>
                </div>
              </div>

              <div
                className="flex flex-col items-start md:pt-16 animate-slide-in-right opacity-0"
                style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
              >
                <div className="mb-2 flex items-center">
                  <div className="relative z-10 rounded-full bg-background p-1 text-primary ring-2 ring-primary/50 shadow-lg">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-primary animate-pulse-custom"
                      style={{ animationDelay: "0.2s" }}
                    >
                      <span className="text-sm font-bold text-primary-foreground">2</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border bg-card/80 backdrop-blur-sm p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-card">
                  <h3 className="text-xl font-bold">AI Processing</h3>
                  <p className="mt-2 text-muted-foreground">
                    Gemini 1.5 Flash processes your voice and generates a text response.
                  </p>
                </div>
              </div>

              <div
                className="flex flex-col items-end md:text-right animate-slide-in-left opacity-0"
                style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
              >
                <div className="mb-2 flex items-center">
                  <div className="relative z-10 rounded-full bg-background p-1 text-primary ring-2 ring-primary/50 shadow-lg">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-primary animate-pulse-custom"
                      style={{ animationDelay: "0.4s" }}
                    >
                      <span className="text-sm font-bold text-primary-foreground">3</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border bg-card/80 backdrop-blur-sm p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-card">
                  <h3 className="text-xl font-bold">Text Response</h3>
                  <p className="mt-2 text-muted-foreground">View the AI-generated text response to your voice input.</p>
                </div>
              </div>

              <div
                className="flex flex-col items-start md:pt-16 animate-slide-in-right opacity-0"
                style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}
              >
                <div className="mb-2 flex items-center">
                  <div className="relative z-10 rounded-full bg-background p-1 text-primary ring-2 ring-primary/50 shadow-lg">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-primary animate-pulse-custom"
                      style={{ animationDelay: "0.6s" }}
                    >
                      <span className="text-sm font-bold text-primary-foreground">4</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border bg-card/80 backdrop-blur-sm p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-card">
                  <h3 className="text-xl font-bold">Voice Synthesis</h3>
                  <p className="mt-2 text-muted-foreground">
                    Convert the text response back to natural speech using ElevenLabs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="api" className="py-16 md:py-20 relative mb-8">
          <div
            className="absolute -top-20 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl opacity-70 animate-float"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-16 gradient-text">
            API Integration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-xl border p-6 shadow-sm card-hover animate-fade-up opacity-0 animation-delay-200 bg-card/80 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="rounded-full bg-primary/10 p-2 animate-pulse-custom">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Gemini 1.5 Flash API</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Google's state-of-the-art multimodal AI model that processes audio and generates text responses.
              </p>
              <div className="rounded-lg bg-muted p-4 overflow-hidden group relative">
                <div className="absolute inset-0 w-full h-full animate-shimmer opacity-0 group-hover:opacity-100"></div>
                <pre className="text-sm overflow-x-auto transition-all duration-300 group-hover:text-primary relative z-10">
                  <code>POST /api/process-voice</code>
                </pre>
              </div>
            </div>

            <div className="rounded-xl border p-6 shadow-sm card-hover animate-fade-up opacity-0 animation-delay-300 bg-card/80 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="rounded-full bg-primary/10 p-2 animate-pulse-custom" style={{ animationDelay: "0.2s" }}>
                  <Volume2 className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold">ElevenLabs API</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Advanced text-to-speech API that converts AI-generated text into natural-sounding voice.
              </p>
              <div className="rounded-lg bg-muted p-4 overflow-hidden group relative">
                <div className="absolute inset-0 w-full h-full animate-shimmer opacity-0 group-hover:opacity-100"></div>
                <pre className="text-sm overflow-x-auto transition-all duration-300 group-hover:text-primary relative z-10">
                  <code>POST /api/synthesize-speech</code>
                </pre>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-muted/40 transition-colors duration-300 relative overflow-hidden mt-8">
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent pointer-events-none"></div>
        <div className="container flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between relative z-10">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Icon-swk7WBmbgmNpfLAhcW7L0zgvSEnqeu.png"
                alt="FINOVA Logo"
                width={32}
                height={32}
                className="h-8 w-auto"
                style={{ objectFit: "contain" }}
              />
            </div>
            <span className="text-lg font-semibold">FINOVA</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 FINOVA. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

