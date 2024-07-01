import { Link, useLocation, useNavigate } from "@remix-run/react";
import moment from "moment";

import Button from "~/components/Button/Button";
import { Badge } from "~/components/shadcn/ui/badge";
import { useCallback } from "react";

interface PostProps {
  id: string;
  description: string;
  image: null | { id: string; url: string };
  tagPost: { tag: { name: string } }[];
  title: string;
  createdAt: Date;
  isEmbed?: boolean;
}

const Post = ({
                id,
                tagPost,
                description,
                image,
                title,
                createdAt,
                isEmbed
              }: PostProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const onClickTag = useCallback((tag: string) => {
    const tagsList = [...new Set(location.pathname
        .split("/")?.at(-1)
        .split("&")
        .filter((_item) => _item.length)
      || []
    )];

    if (tagsList.includes(tag)) {
      const _tags = tagsList.filter(_tag => _tag !== tag).join("&");
      if (_tags.length > 0) {
        navigate({ pathname: `/tags/${_tags}` });
      } else {
        navigate({ pathname: "/" });
      }
    } else {
      tagsList.push(tag);
      navigate({ pathname: `/tags/${tagsList.join("&")}` });
    }
  }, [location]);

  return (
    <div
      id={id}
      className={
        isEmbed
          ? "w-full h-full flex flex-col gap-2 pt-2"
          : "bg-muted px-2 md:px-3 py-2 w-full min-h-[100px] md:max-h-[450px] flex border flex-col gap-2 rounded"
      }
    >
      <h2 className="text-lg">{title}</h2>
      <div className="w-full h-full flex gap-2 md:flex-row flex-col">
        <img
          className="min-w-[120px] w-fit max-w-[200px] min-h-[120px] max-h-[200px] rounded"
          src={image ? image.url : "https://placehold.co/400?text=No image"}
          alt={"post-preview"}
        />
        <p>{description || "No description provided."}</p>
      </div>
      <div className="grid gap-3 ">
        {tagPost.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            {tagPost.map((tagItem) => (
              <Badge onClick={() => onClickTag(tagItem.tag.name)}
                     className="cursor-pointer hover:bg-blue-200 transition-all" variant="outline">
                {tagItem.tag.name}
              </Badge>
            ))}
          </div>
        ) : null}
        <span className="flex justify-between items-center">
          <Button variant={"secondary-2"}
                  link={{ to: `/posts/${id}`, search: `backUrl=${location.pathname}${location.search}` }}>
            View post
          </Button>
          {moment(createdAt).format("MM-DD-YYYY HH:mm")}
        </span>
      </div>
    </div>
  );
};

export default Post;
