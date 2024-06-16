import moment from "moment";
import { scheduleJob } from "node-schedule";

import { prisma } from "~/db.server";
import RssService from "~/services/rss.service";
import { getMinutesFromInterval } from "~/utils";
import { createTags } from "~/models/tags.server";
import type { Post, Tag } from "@prisma/client";

async function createPost({
                      body,
                      title,
                      image,
                      tags,
                      description,
                      createdAt,
                    }: Pick<Post, "body" | "title" | "description"> & {
  createdAt?: Post["createdAt"];
} & {
  tags: Tag["name"][];
} & {
  image?: string;
},) {
  const createdTags = await createTags({ tags });

  const postData: any = {
    title,
    body,
    description,
    tagPost: {
      create: createdTags.map((tag) => ({
        tag: {
          connect: { id: tag.id },
        },
      })),
    },
  };

  if (image) {
    postData.image = {
      create: {
        url: image,
      },
    };
  }

  if (createdAt) {
    postData.createdAt = createdAt;
  }

  return prisma.post.create({
    data: postData,
  });
}

scheduleJob("* * * * *", async () => {
  console.log("cron started");
  try {
    const rssList = await prisma.rSSSettings.findMany();

    const filteredRss = rssList.filter(rss => moment().diff(moment(rss.lastFetched), "minutes") >= getMinutesFromInterval(rss.interval));

    console.log(`${filteredRss.length} rss filtered...`);
    console.log(`start to fetch rss...`);

    for (const rss of filteredRss) {
      try {
        await RssService.isValidRss(rss.source);
        console.log(`fetching ${rss.id} rss`);
        const result = await RssService.fetchRssAndParseToJson(rss.source, rss.fieldMatching, rss.stopTags);

        const filteredResult = result.filter(item => item?.["body"].length > 0 && item?.["title"].length > 0);

        console.log(`${filteredResult.length} rss items filtered...`);

        for (const resultItem of filteredResult) {
          const itemsInDatabase = await prisma.post.findMany({
            where: {
              title: resultItem["title"],
              createdAt: new Date(resultItem?.["pubDate"] || new Date())
            }
          });

          if (itemsInDatabase.length === 0) {

            await createPost({
              description: resultItem?.["description"] || "",
              body: resultItem["body"],
              createdAt: new Date(resultItem?.["pubDate"] || new Date()),
              title: resultItem["title"],
              image: resultItem?.["image"] || undefined,
              tags: resultItem?.["tags"] || []
            });
          }
        }
      } catch (e: any) {
        console.log("failed to update rss", e?.message);
      }
    }

    console.log("cron ended");
  } catch (e: any) {
    console.log("cron error: ", e?.message);
  }
});