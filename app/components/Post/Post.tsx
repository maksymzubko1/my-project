import { Link } from "@remix-run/react";
import moment from "moment";

import Button from "~/components/Button/Button";
import { Badge } from "~/components/shadcn/ui/badge";

interface PostProps {
  id: string;
  description: string;
  image: null | { id: string; url: string };
  tagPost: { tag: { name: string } }[];
  title: string;
  createdAt: Date;
}

const Post = ({
  id,
  tagPost,
  description,
  image,
  title,
  createdAt,
}: PostProps) => {
  return (
    <div
      id={id}
      className="bg-muted px-1 md:px-3 py-2 w-full min-h-[100px] md:max-h-[350px] flex border flex-col gap-2 rounded"
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
              <Link key={tagItem.tag.name} to={`/tag/${tagItem.tag.name}`}>
                <Badge className="cursor-pointer" variant="outline">
                  {tagItem.tag.name}
                </Badge>
              </Link>
            ))}
          </div>
        ) : null}
        <span className="flex justify-between items-center">
          <Button variant={"secondary-2"} link={{ to: `/posts/${id}` }}>
            View post
          </Button>
          {moment(createdAt).format("YYYY-MM-DD HH:mm")}
        </span>
      </div>
    </div>
  );
};

export default Post;
