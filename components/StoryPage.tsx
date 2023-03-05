import classNames from "classnames";
import { useEffect, useMemo, useRef, useState } from "react";
import { parseResponse } from "../utils/parseResponse";
import Page from "./Page";

type StoryPageProps = {
  content: string;
  selectedOptionKey: string;
  onOptionKeySelected: (optionKey: string) => Promise<void>;
  pageIndex: number;
  activePageIndex: number;
  onRegenerate?: () => Promise<void>;
};
const StoryPage = (props: StoryPageProps) => {
  const pageContent = useMemo(
    () => parseResponse(props.content),
    [props.content]
  );
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const [contentCool, setContentCool] = useState(false);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setContentCool(false);
    timerRef.current = setTimeout(() => setContentCool(true), 1000);
  }, [props.content]);

  return (
    <Page pageIndex={props.pageIndex} activePageIndex={props.activePageIndex}>
      <p className="text-justify my-8">{pageContent.paragraph}</p>
      <div className="text-center">
        {pageContent.options.map((option) => {
          return (
            <>
              <button
                className={classNames(
                  "border border-indigo-800  rounded  font-medium px-4 py-2 mt-4  w-full",
                  {
                    "hover:bg-indigo-100": !props.selectedOptionKey,
                    "opacity-25":
                      props.selectedOptionKey &&
                      props.selectedOptionKey !== option.key,
                    "bg-indigo-100":
                      props.selectedOptionKey &&
                      props.selectedOptionKey === option.key,
                  }
                )}
                disabled={!!props.selectedOptionKey}
                onClick={(e) => props.onOptionKeySelected(option.key)}
              >
                {option.text}
              </button>
            </>
          );
        })}
      </div>
      {!props.selectedOptionKey && (
        <button
          className={classNames(
            "border border-indigo-500  rounded  font-medium px-2 py-1 mt-4   hover:bg-indigo-100",
            "text-xs mx-auto mt-auto",
            "transition-opacity opacity-0 duration-300",
            {
              "opacity-100": contentCool,
            }
          )}
          onClick={() => {
            if (props.onRegenerate) {
              props.onRegenerate();
            }
          }}
        >
          Regenerate page
        </button>
      )}
    </Page>
  );
};

export default StoryPage;
