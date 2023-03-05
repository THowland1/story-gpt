import Page from "./Page";

type FrontPageProps = {
  title: string | undefined;
  titleLoading: boolean;
  pageIndex: number;
  activePageIndex: number;
  backgroundImageUrl: string | undefined;
  backgroundImageUrlLoading: boolean;
};
const FrontPage = (props: FrontPageProps) => {
  return (
    <Page activePageIndex={props.activePageIndex} pageIndex={props.pageIndex}>
      <div
        className="absolute inset-0 p-12"
        style={{
          backgroundImage: `url(${props.backgroundImageUrl})`,
          backgroundSize: "cover",
        }}
      >
        <div
          className="text-4xl text-white font-bold"
          style={{
            textShadow: `0 0 2px #0028a999,  
   0 0 2px #0028a999,
   0 0 2px #0028a999,
   0 0 2px #0028a999`,
          }}
        >
          {props.title}
        </div>
      </div>

      <div
        className="absolute inset-0 p-12"
        style={{
          background:
            "linear-gradient(to right, #0003, #0003 1%,  #fff7 1.5%, transparent 2.25%, transparent 2.75%, #0003 3.75%, #0003 4.5%,#fff7 5.25%,#fff7 5.5%, transparent 6%, transparent), linear-gradient(340deg, #0003, transparent)",
        }}
      ></div>
    </Page>
  );
};

export default FrontPage;
