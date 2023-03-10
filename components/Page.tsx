import classNames from "classnames";

type PageProps = {
  children: React.ReactNode;
  pageIndex: number;
  activePageIndex: number;
};
const Page = (props: PageProps) => {
  const isPreviousPage = props.pageIndex < props.activePageIndex;
  return (
    <div
      className={classNames(
        "w-full max-w-md mx-auto p-8 shadow h-full flex flex-col relative rounded-sm overflow-hidden",
        "row-start-1 col-start-1 bg-white  origin-[-4px]",
        "font-serif",
        "text-xs leading-5 sm:text-sm sm:leading-6",
        {
          "animate-[flip_500ms_linear_1_forwards] z-10": isPreviousPage,
        }
      )}
      style={{
        zIndex:
          props.pageIndex === props.activePageIndex
            ? 1
            : props.pageIndex === props.activePageIndex - 1
            ? 2
            : 0,
      }}
    >
      <div
        className={classNames(
          "absolute inset-0 bg-white z-10 pointer-events-none opacity-0",
          {
            "animate-[appear-midway_500ms_linear_1_forwards]": isPreviousPage,
          }
        )}
      ></div>
      {props.children}
    </div>
  );
};

export default Page;
