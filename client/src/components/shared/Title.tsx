import { Helmet } from "react-helmet-async";

const Title = ({
  title = "Chat",
  description = "Tis is the chat application",
}) => {
  return (
    <div>
      <Helmet>
        <title>{title} </title>
        <meta name="description" content={description} />
      </Helmet>
    </div>
  );
};

export default Title;
