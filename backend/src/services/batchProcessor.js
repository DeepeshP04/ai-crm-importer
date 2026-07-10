const extractCRMData = require("./aiService");
const mapRecordsWithHeuristics = require("./heuristicMapper");

const processInBatches = async (
  records,
  batchSize = 100,
  onProgress = () => {}
) => {
  const allResults = [];
  const totalBatches = Math.ceil(records.length / batchSize);

  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    const currentBatch = Math.floor(i / batchSize) + 1;

    onProgress({
      currentBatch,
      totalBatches,
      batchSize: batch.length,
      processedRecords: allResults.length,
      message: `Processing AI batch ${currentBatch} of ${totalBatches}`,
    });

    console.log(
      `Processing batch ${currentBatch} (${batch.length} records)`
    );

    try {
      const batchResult = await extractCRMData(batch);

      if (Array.isArray(batchResult)) {
        allResults.push(...batchResult);
      }
    } catch (error) {
      console.error(`Batch ${currentBatch} failed:`, error.message);

      const fallbackRecords = mapRecordsWithHeuristics(batch);
      allResults.push(...fallbackRecords);
    }

    onProgress({
      currentBatch,
      totalBatches,
      batchSize: batch.length,
      processedRecords: allResults.length,
      message: `Completed ${currentBatch} of ${totalBatches} AI batches`,
    });
  }

  return allResults;
};

module.exports = processInBatches;