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
    </Page>
  );
};

export default FrontPage;
