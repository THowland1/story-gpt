import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { VibeType } from "../components/DropDown";
import Footer from "../components/Footer";
import FrontPage from "../components/FrontPage";
import Github from "../components/GitHub";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import Page from "../components/Page";
import StoryPage from "../components/StoryPage";
import { ChatGPTMessage } from "../utils/OpenAIStream";
import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";

const IDEAS = [
  "Time traveler's dilemma",
  "Choose pirate's treasure map",
  "Survive zombie apocalypse",
  "Defeat space invaders",
  "Haunted house escape",
  "Wizard duel decision",
  "Escape prison island",
  "Lost in jungle",
  "Ninja rescue mission",
  "Mythical creature quest",
  "Alien planet exploration",
  "Time travel conundrum",
  "Ghost hunter investigation",
  "Underwater adventure",
  "Superhero team-up challenge",
  "Robot uprising decision",
  "Choose spy's gadgets",
  "Planetary disaster rescue",
  "Dragon tamings",
  "Post-apocalyptic survival",
  "Jungle temple adventure",
  "Cyborg lab escape",
  "Search for lost artifact",
  "Interactive murder mystery",
  "Pirate captain's journey",
  "Deep space dilemma",
  "Explore abandoned city",
  "Desert island survival",
  "Choose wizard's familiars",
  "Interactive spy mission",
  "Journey to the center",
  "Shape-shifter's secret mission",
  "Lost in space decision",
  "Choose superhero's powers",
  "Medieval castle adventure",
  "Time traveler's paradox",
  "Escape from secret lab",
  "Save kingdom decision",
  "Choose knight's armor",
  "Fantasy quest",
  "Undercover cop dilemma",
  "Choose dragon's element",
  "Hidden temple expedition",
  "Alien invasion response",
  "Vampire hunter decision",
  "Space station survival",
  "Treasure hunter",
  "Interactive spy thriller",
  "Robot uprising response",
  "Superhero origin story",
  "Choose wizard's spellbook",
  "Galactic battle decision",
  "Jungle tribe encounter",
  "Mystic forest adventure",
  "Secret agent's mission",
  "Choose ninja's weapon",
  "Choose pirate's ship",
  "Time travel paradox",
  "Survive monster invasion",
  "Interactive detective story",
  "Choose ghost hunter's equipment",
  "Haunted mansion escape",
  "Planetary exploration decision",
  "Escape from underwater lab",
  "Mythical beast encounter",
  "Choose cyborg's upgrades",
  "Lost city adventure",
  "Pirate treasure decision",
  "Choose knight's steed",
  "Interactive spy adventure",
  "Robot rebellion decision",
  "Choose superhero's costume",
  "Interactive wizarding world",
  "Space exploration decision",
  "Escape from medieval dungeon",
  "Search for hidden treasure",
  "Choose ninja's strategy",
  "Choose pirate's crew",
  "Time travel conundrum",
  "Fight against the gods",
];

async function generateImageUrlFromPrompt(
  prompt: string
): Promise<{ url: string }> {
  const response = await fetch("/api/generate-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });
  const body = await response.json();

  return body;
}

async function generateTitleFromPrompt(prompt: string): Promise<string> {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      {
        role: "user",
        content: prompt,
      },
    ]),
  });
  const body = await response.json();

  return body;
}

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [vibe, setVibe] = useState<VibeType>("Professional");
  const [latestResponse, setLatestResponse] = useState<string>("");
  const [history, setHistory] = useState<ChatGPTMessage[]>([]);
  const [selectedPageIndex, setSelectedPageIndex] = useState<number>(0);
  const [state, setState] = useState<
    "before create" | "before open" | "after open"
  >("before create");
  const imageQuery = useQuery({
    queryKey: ["imageUrls", bio],
    queryFn: ({ queryKey }) =>
      generateImageUrlFromPrompt(
        `A storybook illustration for a story about ${queryKey[1]}`
      ),
    enabled: false,
  });
  const titleQuery = useQuery({
    queryKey: ["titles", bio],
    queryFn: ({ queryKey }) =>
      generateTitleFromPrompt(`Write a title for a story about ${queryKey[1]}`),
    enabled: false,
  });

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
    if (state === "after open") {
      setSelectedPageIndex(pages.length + 1);
    } else {
      setSelectedPageIndex(pages.length);
    }
    return pages;
  }, [history, state]);

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

  async function start() {
    imageQuery.refetch();
    titleQuery.refetch();
    const newHistory: ChatGPTMessage[] = [
      {
        role: "user",
        content: `Write the first paragraph of a choose-your-own-adventure story about ${bio}. Give 3 one-sentence options as to what to do next, clearly labelled with "1:", "2:", "3:", each one on a new line`,
      },
    ];
    setHistory(newHistory);
    await setImageUrl();
    setState("before open");
    return generateBio(newHistory);
  }

  async function setImageUrl() {}

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
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-4 sm:mt-8">
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />

        <div className="contents">
          <div
            className="grid text-indigo-900 shadow-[2px_2px_7px_5px_#0004] relative"
            style={{
              minWidth: "min(450px, 100%)",
              aspectRatio: "11 / 15",
            }}
          >
            <form
              className={classNames(
                "w-full max-w-md mx-auto p-8 pl-12 shadow h-full flex flex-col justify-between absolute inset-0",
                "row-start-1 col-start-1  origin-[-4px] z-10 transition-opacity bg-indigo-500",
                "book-gradient",
                {
                  "opacity-0 pointer-events-none": history.length > 0,
                  "opacity-100": history.length === 0,
                }
              )}
              onSubmit={(e) => {
                e.preventDefault();
                start();
              }}
            >
              <p className="text-3xl font-semibold text-white flex-1">
                Choose your own adventure with a ChatGPT-authored story about...
              </p>
              <div>
                <div className="">
                  <input
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="text-indigo-700 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 mt-3"
                    placeholder={"e.g. A greyhound who saves the day"}
                  />
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    className="text-indigo-100 font-light text-sm"
                    onClick={() => {
                      setBio(IDEAS[Math.floor(Math.random() * IDEAS.length)]);
                    }}
                  >
                    random
                  </button>
                </div>

                {!loading && (
                  <button className="bg-indigo-700 border border-white/30 rounded-xl text-white font-medium px-4 py-2  mt-2 hover:bg-indigo-800 w-full">
                    Let's go &rarr;
                  </button>
                )}
                {loading && (
                  <button
                    className="bg-indigo-600 rounded-xl text-white font-medium px-4 py-2 mt-2 hover:bg-indigo-800 w-full"
                    disabled
                  >
                    <LoadingDots color="white" style="large" />
                  </button>
                )}
              </div>
              <div className="flex-1"></div>
            </form>
            <FrontPage
              title={titleQuery.data}
              titleLoading={titleQuery.isLoading}
              backgroundImageUrl={imageQuery.data?.url}
              backgroundImageUrlLoading={imageQuery.isLoading}
              pageIndex={0}
              activePageIndex={selectedPageIndex}
            ></FrontPage>
            {historyAsPages.map((page, index) => (
              <StoryPage
                content={page.content}
                selectedOptionKey={page.selectedOptionKey}
                onOptionKeySelected={(newKey) => {
                  return pickOption(newKey);
                }}
                pageIndex={index + 1}
                activePageIndex={selectedPageIndex}
              ></StoryPage>
            ))}
            {state === "after open" && (
              <StoryPage
                content={latestResponse}
                selectedOptionKey={""}
                onOptionKeySelected={(newKey) => {
                  return pickOption(newKey);
                }}
                pageIndex={historyAsPages.length + 1}
                activePageIndex={selectedPageIndex}
              ></StoryPage>
            )}
          </div>
          <div
            className={classNames("transition-opacity", {
              "opacity-0": state === "before create",
              "opacity-100": state !== "before create",
            })}
          >
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
              {selectedPageIndex + 1} / {historyAsPages.length + 2}
            </span>
            <button
              className="p-2 mx-2  disabled:opacity-50"
              disabled={!(selectedPageIndex < historyAsPages.length + 1)}
              onClick={() => {
                if (state !== "after open") {
                  setState("after open");
                }
                if (selectedPageIndex < historyAsPages.length + 1) {
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
