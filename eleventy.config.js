import { readFileSync } from "node:fs";

const readData = (name) => JSON.parse(readFileSync(`src/_data/${name}.json`, "utf8"));

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");

  // WordPress slugs keep their percent-encoded unicode (%e2%97%8b = ○)
  eleventyConfig.addFilter("urldecode", (s) => decodeURIComponent(s));

  // what the placeholder card shows for a show with no poster (macros can't see global data)
  const artistNames = new Map(readData("artists").map((a) => [a.slug, a.name]));
  const venueNames = new Map(readData("venues").map((v) => [v.slug, v.name]));
  eleventyConfig.addFilter("cardInfo", (event) => {
    const [y, m, d] = event.start.slice(0, 10).split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    const part = (opts) => date.toLocaleDateString("en-CA", { timeZone: "UTC", ...opts });
    const names = (event.artists || []).map((s) => artistNames.get(s)).filter(Boolean);
    return {
      weekday: part({ weekday: "short" }),
      monthDay: part({ month: "short", day: "numeric" }),
      year: y,
      // no credited acts: the event title, cut before the separators that start the extra bits
      headliner: names[0] || event.title.split(/\s+(?:[|○•]|\/\/)\s+/)[0],
      with: names.slice(1, 3),
      more: Math.max(names.length - 3, 0),
      venue: venueNames.get(event.venue) || "",
    };
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
