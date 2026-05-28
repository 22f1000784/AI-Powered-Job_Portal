import '@tensorflow/tfjs'; 
import * as use from '@tensorflow-models/universal-sentence-encoder';
import { cosineSimilarity } from "../utils/math";

// Cache the model so it doesn't reload on every request
let model: use.UniversalSentenceEncoder | null = null;

const getModel = async () => {
  if (!model) {
    console.log("Loading TensorFlow Universal Sentence Encoder...");
    model = await use.load();
  }
  return model;
};

export const matchTexts = async (candidateText: string, jobInputs: any[]) => {
  const encoder = await getModel();

  // 1. Embed the candidate resume (one-off, fast)
  const candidateEmbedding = await encoder.embed([candidateText]);
  const candidateVector = (await candidateEmbedding.array())[0];
  candidateEmbedding.dispose(); // Immediately free memory

  const jobVectors: number[][] = [];
  const BATCH_SIZE = 10; // Smaller batches are safer for JS-only backend

  console.log(`Matching ${jobInputs.length} jobs...`);

  // 2. Loop through jobs in chunks of 10
  for (let i = 0; i < jobInputs.length; i += BATCH_SIZE) {
    const currentBatch = jobInputs.slice(i, i + BATCH_SIZE).map(j => j.text);
    
    // Process the chunk
    const batchEmbeddings = await encoder.embed(currentBatch);
    const batchArray = await batchEmbeddings.array();
    
    jobVectors.push(...batchArray);
    
    // CRITICAL: Clean up tensors to prevent RAM bloat and slowing down
    batchEmbeddings.dispose(); 
    console.log(`Progress: ${Math.min(i + BATCH_SIZE, jobInputs.length)}/${jobInputs.length}`);
  }

  // 3. Final similarity calculation
  const scoredResults = jobInputs.map((job, index) => ({
    ...job.meta,
    score: cosineSimilarity(candidateVector, jobVectors[index])
  }));

  return scoredResults.sort((a, b) => b.score - a.score);
};