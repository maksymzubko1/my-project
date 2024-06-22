import * as iconv from "iconv-lite";
import moment from "moment";
import Parser from "rss-parser";

class RSSService {
  private removeExtraSpaces(text: string) {
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join("\n")
      .replace("noopener nofollow", "nofollow noopener");
  }

  private getRssFields(rssData: object[]): string[] {
    const readonlyFields = [
      "pubDate",
      "categories",
      "title",
      "isoDate",
      "link",
      "author",
      "guid",
      "creator",
      "dc:creator",
    ];

    return rssData.reduce((acc: string[], curr) => {
      Object.entries(curr).forEach(([key, value]) => {
        if (
          typeof value === "string" &&
          !acc.includes(key) &&
          !readonlyFields.includes(key)
        ) {
          acc.push(key);
        }
      });

      return acc;
    }, []) as string[];
  }

  private containsStopTags(entry: string[], stopTags: string[]) {
    if (entry) {
      return entry.some((_entry) => stopTags.includes(_entry));
    } else {
      return false;
    }
  }

  private parseEntry(entry: any, stopTags: string[], fieldMatching: object) {
    if (this.containsStopTags(entry?.["categories"], stopTags)) {
      return null;
    }

    const _dbObject = {};

    // field matching
    for (const [dbKey, entryKey] of Object.entries(fieldMatching)) {
      _dbObject[dbKey] = entry[entryKey]
        ? this.removeExtraSpaces(entry[entryKey])
        : "";
    }

    // default matching
    if ("pubDate" in entry) {
      _dbObject["pubDate"] = moment(entry["pubDate"]);
    }

    if ("title" in entry) {
      _dbObject["title"] = entry["title"];
    }

    if ("enclosure" in entry) {
      const image = entry["enclosure"];
      _dbObject["image"] = image?.url;
    }

    if ("image" in entry) {
      const image = entry["image"];
      _dbObject["image"] = image?.url;
    }

    if ("categories" in entry) {
      _dbObject["tags"] = entry?.["categories"] ?? [];
    }

    return _dbObject;
  }

  async isValidRss(rssUrl: string): Promise<{ keys: string[] }> {
    try {
      const response = await fetch(rssUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch resource");
      }

      const content = await response.text();

      const parser = new Parser({ customFields: { item: ["description"] } });
      const data = await parser.parseString(content);

      const keys = this.getRssFields(data.items);

      return { keys };
    } catch (error) {
      throw error;
    }
  }

  async fetchRssAndParseToJson(
    rssUrl: string,
    fieldMatching: any,
    stopTags: string[],
  ): Promise<object[]> {
    try {
      const response = await fetch(rssUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch resource");
      }

      const contentType: string | null =
        response.headers.get("content-type") ??
        response.headers.get("Content-Type");
      const encoding = contentType?.includes("charset=windows-1251")
        ? "windows-1251"
        : "utf-8";

      const buffer = await response.arrayBuffer();

      const utf8Content =
        encoding === "windows-1251"
          ? iconv.decode(Buffer.from(buffer), "windows-1251")
          : Buffer.from(buffer).toString("utf8");

      const parser = new Parser({ customFields: { item: ["description"] } });
      const data = await parser.parseString(utf8Content);

      const jsonResult = [];

      if (data.items) {
        jsonResult.push(
          ...data.items
            .map((entry: any) =>
              this.parseEntry(entry, stopTags, fieldMatching),
            )
            .filter((entry) => entry),
        );
      }

      return jsonResult;
    } catch (error) {
      throw error;
    }
  }
}

export default new RSSService();
