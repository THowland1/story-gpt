import classNames from "classnames";
import { parseResponse } from "../utils/parseResponse";
import Page from "./Page";

type StoryPageProps = {
  content: string;
  selectedOptionKey: string;
  onOptionKeySelected: (optionKey: string) => Promise<void>;
  pageIndex: number;
  activePageIndex: number;
};
const StoryPage = (props: StoryPageProps) => {
  const pageContent = parseResponse(props.content);
  return (
    <Page pageIndex={props.pageIndex} activePageIndex={props.activePageIndex}>
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
    </Page>
  );
};

export default StoryPage;
