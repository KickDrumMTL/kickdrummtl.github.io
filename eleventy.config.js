export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");

  // WordPress slugs keep their percent-encoded unicode (%e2%97%8b = ○)
  eleventyConfig.addFilter("urldecode", (s) => decodeURIComponent(s));

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
