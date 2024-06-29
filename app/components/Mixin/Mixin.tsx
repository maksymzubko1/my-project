import Post from "~/components/Post/Post";
import { TMixinRandom } from "~/models/types/mixin.types";
import { isEmpty } from "~/utils";

const Mixin = ({
  id,
  type,
  text,
  textForLink,
  post,
  linkForText,
  linkForImage,
  image,
}: TMixinRandom) => {
  return (
    <div
      id={id}
      className="mixin relative bg-muted px-1 md:px-3 py-2 w-full min-h-[100px] md:max-h-[450px] flex border flex-col gap-2 rounded"
    >
      <span className="z-20 absolute top-0 right-1 text-gray-400 font-bold">
        Mixin {type === "TEXT" ? "Text" : type === "POST" ? "Post" : "Image"}
      </span>
      {type === "TEXT" ? (
        <div className="w-full h-full flex-1 flex gap-2 justify-between flex-col pt-3">
          <p className="z-50">{text}</p>
          {!isEmpty(textForLink) && !isEmpty(linkForText) ? (
            <a
              className={"text-blue-400 underline hover:text-blue-500 text-end"}
              target={"_blank"}
              href={linkForText}
              rel="noreferrer"
            >
              {textForLink}
            </a>
          ) : null}
        </div>
      ) : null}

      {type === "IMAGE" ? (
        <div className="w-full h-full flex gap-2 md:flex-row flex-col">
          {!isEmpty(linkForImage) ? (
            <a href={linkForImage} target={"_blank"} rel="noreferrer">
              <img
                className="min-w-[120px] w-fit max-w-[200px] min-h-[120px] max-h-[200px] rounded"
                src={image?.url}
                alt={"preview"}
              />
            </a>
          ) : (
            <img
              className="min-w-[120px] w-fit max-w-[200px] min-h-[120px] max-h-[200px] rounded"
              src={image?.url}
              alt={"preview"}
            />
          )}
        </div>
      ) : null}

      {type === "POST" ? <Post isEmbed {...post} /> : null}
    </div>
  );
};

export default Mixin;
