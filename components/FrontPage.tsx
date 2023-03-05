import Page from "./Page";

type FrontPageProps = {
  title: string;
  pageIndex: number;
  activePageIndex: number;
  backgroundImageUrl: string | undefined;
  backgroundImageUrlLoading: boolean;
};
const FrontPage = (props: FrontPageProps) => {
  return (
    <Page activePageIndex={props.activePageIndex} pageIndex={props.pageIndex}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${props.backgroundImageUrl})`,
          backgroundSize: "cover",
        }}
      >
        {props.title}
      </div>
    </Page>
  );
};

export default FrontPage;
