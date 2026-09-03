import { useState } from "react";
import { Sparkles, Copy, RefreshCw } from "lucide-react";

function App() {
  // Form states
  const [platform, setPlatform] = useState("LinkedIn");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Professional");

  // Output states
  const [generatedContent, setGeneratedContent] = useState("");
  const [loading, setLoading] = useState(false);

  // Generate content
  const handleGenerate = async () => {
  if (!topic.trim()) {
    alert("Please enter a topic.");
    return;
  }

  setLoading(true);
  setGeneratedContent("");

  try {
    const response = await fetch("https://ai-content-generator-api.onrender.com/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        platform,
        topic,
        tone,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to generate content.");
    }

    setGeneratedContent(data.content);
  } catch (error) {
    console.error("API Error:", error);
    setGeneratedContent(error.message);
  } finally {
    setLoading(false);
  }
};

  // Copy generated content
  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedContent);
    alert("Content copied!");
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white">
              <Sparkles size={18} />
            </div>

            <h1 className="text-lg font-bold text-gray-900">
              ContentAI
            </h1>
          </div>

          <div className="text-sm text-gray-500">
            AI Content Generator
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Page heading */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Create content with AI
          </h2>

          <p className="mt-2 text-gray-500">
            Turn your ideas into engaging content for any platform.
          </p>
        </div>

        {/* Content */}
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Generator */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">
              Create content
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Tell us what you want to create.
            </p>

            {/* Platform */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Platform
              </label>

              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
              >
                <option className="bg-black text-white">LinkedIn</option>
                <option className="bg-black text-white">Instagram</option>
                <option className="bg-black text-white">X / Twitter</option>
                <option className="bg-black text-white">Blog</option>
              </select>
            </div>

            {/* Topic */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                What do you want to talk about?
              </label>

              <textarea
                rows="5"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Why every developer should learn AI..."
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>

            {/* Tone */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Tone
              </label>

              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
              >
                <option className="bg-black text-white">Professional</option>
                <option className="bg-black text-white">Friendly</option>
                <option className="bg-black text-white">Casual</option>
                <option className="bg-black text-white">Persuasive</option>
                <option className="bg-black text-white">Inspirational</option>
              </select>
            </div>

            {/* Generate button */}
           <button
              onClick={handleGenerate}
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate Content
                </>
              )}
            </button>
          </section>

          {/* Result */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Generated content
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Your AI-generated content will appear here.
                </p>
              </div>

              {generatedContent && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  <Copy size={16} />
                  Copy
                </button>
              )}
            </div>

            {/* Generated content */}
            <div className="mt-6 min-h-[400px] rounded-xl border bg-gray-50 p-6">
              {generatedContent ? (
                <div className="whitespace-pre-wrap text-sm leading-7 text-gray-700">
                  {generatedContent}
                </div>
              ) : (
                <div className="flex min-h-[350px] items-center justify-center">
                  <div className="text-center">
                    <Sparkles
                      size={32}
                      className="mx-auto text-gray-400"
                    />

                    <p className="mt-3 font-medium text-gray-700">
                      Nothing generated yet
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Enter a topic and click Generate Content.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

export default App;