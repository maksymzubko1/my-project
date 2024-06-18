import React from "react";
import { Badge } from "~/components/shadcn/ui/badge";
import moment from "moment";
import Button from "~/components/Button/Button";

interface PostProps {
  id: string;
  description: string;
  image: null | { id: string; url: string };
  tagPost: { tag: { name: string } }[];
  title: string;
  createdAt: Date;
}

const Post = ({ id, tagPost, description, image, title, createdAt }: PostProps) => {
  return (
    <div id={id} className="bg-gray-50 px-3 py-2 w-full min-h-[100px] max-h-[350px] flex flex-col gap-2 border-gray-500 border rounded">
      <h2 className="text-lg">{title}</h2>
      <div className="w-full h-full flex gap-2">
        <img className="min-w-[120px] max-w-[200px] min-h-[120px] max-h-[200px]"
             src={image ? image.url : "https://placehold.co/400"} alt={"post-image"} />
        <p>{description || "No description provided."}</p>
      </div>
      <div className="grid gap-3 ">
        {tagPost.length > 0 && <div className="flex flex-wrap items-center gap-2">
          {tagPost.map(tagItem =>
            <Badge variant="default">{tagItem.tag.name}</Badge>
          )}
        </div>}
        <span className="flex justify-between items-center">
          <Button variant={"secondary-2"} link={{to: `/posts/${id}`}}>View post</Button>
          {moment(createdAt).format("YYYY-MM-DD HH:mm")}
        </span>
      </div>
    </div>
  );
};

export default Post;