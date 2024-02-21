const urlOverrides = [
  ['practice-bulletin/articles/2020/10/medication-abortion-up-to-70-days-of-gestation', '/practice-bulletin/articles/2020/10/medication-abortion-up-to-70-days-gestation.pdf']
  ['practice-bulletin/articles/2019/03/obstetric-analgesia-and-anesthesia', 'practice-bulletin/articles/2019/03/obstetric-analgesia-and-anesthesia-labor-causes.pdf']
];

const overrides = new Map(urlOverrides);

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const downloadPDF = (pdfUrl) => {
  const fileName = pdfUrl.split("/").slice(-1);

  const link = document.createElement("a");
  link.href = pdfUrl;
  link.download = fileName;
  link.dispatchEvent(new MouseEvent("click"));
};

const getArticleLinks = () => {
  const anchorTags = $(".listings-container")[0].getElementsByTagName("a");
  const anchorTagArray = [...anchorTags];

  return anchorTagArray.map((aTag) => aTag.href);
};

/**
 * @param articleUrl - Example: https://www.acog.org/clinical/clinical-guidance/practice-bulletin/articles/2021/08/anemia-in-pregnancy
 * @returns - Url in form https://www.acog.org/-/media/project/acog/acogorg/clinical/files/practice-bulletin/articles/2021/08/anemia-in-pregnancy.pdf
 */
const convertUrl = (articleUrl) => {
  const fileBaseUrl = "https://www.acog.org/-/media/project/acog/acogorg/clinical/files";
  const articlePart = articleUrl.split("/clinical-guidance/")[1];

  const override = overrides.get(articlePart);
  
  if (override) {
    return `${fileBaseUrl}/${override}`;
  }
  
  return `${fileBaseUrl}/${articlePart}.pdf`;
};

const downloadAll = async (pdfLinks) => {
  for (let i = 0; i < pdfLinks.length; i++) {
    const pdfLink = pdfLinks[i];
    console.debug("Processing: ", pdfLink);
    const response = await fetch(pdfLink);

    await sleep(100);

    if (
      response.status === 200 &&
      response.url !== "https://www.acog.org/error/404"
    ) {
      downloadPDF(pdfLink);
      console.log("Downloaded: ", pdfLink);
    } else {
      failedUrls.push(pdfLink);
      console.error("Link not found: ", pdfLink);
    }
  }
};

// 1. Click on Section

// 2. Get all Article Links
const articleLinks = getArticleLinks();

const failedUrls = [];

// 3. Download all links
const pdfLinks = articleLinks.map(convertUrl);

await downloadAll(pdfLinks);
