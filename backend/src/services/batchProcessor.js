const extractCRMData = require("./aiService");

const processInBatches = async (records, batchSize = 100) => {
  const allResults = [];

  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);

    console.log(
      `Processing batch ${Math.floor(i / batchSize) + 1} (${batch.length} records)`
    );

    try {

    const batchResult = await extractCRMData(batch);

    if(Array.isArray(batchResult)){
        allResults.push(...batchResult);
    }

}
catch(error){

    console.error("Batch Failed:", error.message);

}

    if (Array.isArray(batchResult)) {
      allResults.push(...batchResult);
    }
  }

  return allResults;
};

module.exports = processInBatches;