import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { VibeType } from "../components/DropDown";
import Footer from "../components/Footer";
import Github from "../components/GitHub";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import Page from "../components/Page";
import { ChatGPTMessage } from "../utils/OpenAIStream";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [vibe, setVibe] = useState<VibeType>("Professional");
  const [latestResponse, setLatestResponse] = useState<string>("");
  const [history, setHistory] = useState<ChatGPTMessage[]>([]);
  const [selectedPageIndex, setSelectedPageIndex] = useState<number>(0);

  const historyAsPages = useMemo(() => {
    const pages: { content: string; selectedOptionKey: string }[] = [];
    for (let index = 0; index < history.length; index++) {
      const item = history[index];
      const nextItem = history[index + 1];
      if (item.role === "system") {
        pages.push({
          content: item.content,
          selectedOptionKey: nextItem.content,
        });
      }
    }
    setSelectedPageIndex(pages.length);
    return pages;
  }, [history]);

  async function pickOption(option: string) {
    const newHistory: ChatGPTMessage[] = [
      ...history,
      {
        role: "system",
        content: latestResponse,
      },
      {
        role: "user",
        content: option,
      },
    ];
    setHistory(newHistory);
    await generateBio(newHistory);
  }

  function start() {
    const newHistory: ChatGPTMessage[] = [
      {
        role: "user",
        content: `Write the first paragraph of a choose-your-own-adventure story about ${bio}. Give 3 one-sentence options as to what to do next, clearly labelled with "1:", "2:", "3:", each one on a new line`,
      },
    ];
    setHistory(newHistory);
    return generateBio(newHistory);
  }

  const generateBio = async (history2: ChatGPTMessage[]) => {
    setLatestResponse("");
    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(history2),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setLatestResponse((prev) => prev + chunkValue);
    }
    setLoading(false);
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>AI Quiz Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <a
          className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 shadow-md transition-colors hover:bg-gray-100 mb-5"
          href="https://github.com/THowland1/ai-quiz"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github />
          <p>Star on GitHub</p>
        </a>
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
          Generate your next quiz using chatGPT
        </h1>
        {/* <p className="text-slate-500 mt-5">47,118 bios generated so far.</p> */}
        <div className="max-w-xl w-full">
          <div className="flex mt-10 items-center space-x-3">
            <Image
              src="/1-black.png"
              width={30}
              height={30}
              alt="1 icon"
              className="mb-5 sm:mb-0"
            />
            <p className="text-left font-medium">
              Type in what you want the story to be about
            </p>
          </div>
          <input
            type="text"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black mt-5"
            placeholder={"e.g. 80s Movies"}
          />

          {!loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              onClick={(e) => start()}
            >
              Generate your quiz &rarr;
            </button>
          )}
          {loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          )}
        </div>
        <pre className="whitespace-pre-wrap text-left">
          {/* {JSON.stringify(history, null, 2)} */}
        </pre>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <div className="space-y-10 my-10">
          {latestResponse && (
            <>
              <div>
                <h2 className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto">
                  Your generated quiz
                </h2>
              </div>
            </>
          )}
        </div>
        <div>
          <div className="grid">
            {historyAsPages.map((page, index) => (
              <Page
                content={page.content}
                selectedOptionKey={page.selectedOptionKey}
                onOptionKeySelected={(newKey) => {
                  return pickOption(newKey);
                }}
                pageIndex={index}
                activePageIndex={selectedPageIndex}
              ></Page>
            ))}
            <Page
              content={latestResponse}
              selectedOptionKey={""}
              onOptionKeySelected={(newKey) => {
                return pickOption(newKey);
              }}
              pageIndex={historyAsPages.length}
              activePageIndex={selectedPageIndex}
            ></Page>
          </div>
          <div className="">
            <button
              className="p-2 mx-2 disabled:opacity-50"
              disabled={!(selectedPageIndex > 0)}
              onClick={() => {
                if (selectedPageIndex > 0) {
                  setSelectedPageIndex(selectedPageIndex - 1);
                }
              }}
            >
              &larr;
            </button>
            <span>
              {selectedPageIndex + 1} / {historyAsPages.length + 1}
            </span>
            <button
              className="p-2 mx-2  disabled:opacity-50"
              disabled={!(selectedPageIndex < historyAsPages.length)}
              onClick={() => {
                if (selectedPageIndex < historyAsPages.length) {
                  setSelectedPageIndex(selectedPageIndex + 1);
                }
              }}
            >
              &rarr;
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
