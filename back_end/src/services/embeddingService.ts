import { pipeline } from "@xenova/transformers";

let extractor: any = null;

// Load model only once (important for performance)
const loadModel = async () => {
  if (!extractor) {
    extractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
  }
};

export const getEmbedding = async (text: string): Promise<number[]> => {
  await loadModel();

  const output = await extractor(text, {
    pooling: "mean",
    normalize: true,
  });

  return Array.from(output.data);
};