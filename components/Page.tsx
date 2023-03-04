import classNames from "classnames";
import { useState } from "react";
import { parseResponse } from "../utils/parseResponse";

type PageProps = {
  content: string;
  selectedOptionKey: string;
  onOptionKeySelected: (optionKey: string) => Promise<void>;
  pageIndex: number;
  activePageIndex: number;
};
const Page = (props: PageProps) => {
  const pageContent = parseResponse(props.content);
  const [loading, setLoading] = useState(false);
  const isPreviousPage = props.pageIndex < props.activePageIndex;
  return (
    <div
      className={classNames(
        "w-full max-w-md mx-auto p-8 shadow h-full flex flex-col justify-between relative",
        "row-start-1 col-start-1 bg-white",
        {
          "animate-[flip_1s_linear_1_forwards] origin-[-4px] z-10":
            isPreviousPage,
        }
      )}
    >
      <div
        className={classNames(
          "absolute inset-0 bg-white z-10 pointer-events-none opacity-0",
          {
            "animate-[appear-midway_1s_linear_1_forwards]": isPreviousPage,
          }
        )}
      ></div>
      <p className="text-justify my-8">{pageContent.paragraph}</p>
      <div className="flex flex-col items-center justify-center max-w-xl mx-auto">
        {pageContent.options.map((option) => {
          return (
            <>
              <button
                className={classNames(
                  "border border-black  rounded  font-medium px-4 py-2 mt-4  w-full",
                  {
                    "hover:bg-black/5": !props.selectedOptionKey,
                    "opacity-25":
                      props.selectedOptionKey &&
                      props.selectedOptionKey !== option.key,
                    "bg-sky-200":
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
    </div>
  );
};

export default Page;
