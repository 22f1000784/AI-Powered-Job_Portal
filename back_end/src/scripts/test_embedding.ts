import { getEmbedding } from "../services/embeddingService";

(async () => {
  console.log("Testing Xenova embedding...");
  const start = Date.now();
  const emb1 = await getEmbedding("Software engineer with React and Node.js experience");
  console.log("Embedding 1 generated in", Date.now() - start, "ms. Length:", emb1.length);
  
  const start2 = Date.now();
  const emb2 = await getEmbedding("Data Scientist with Python and ML experience");
  console.log("Embedding 2 generated in", Date.now() - start2, "ms. Length:", emb2.length);
  
  process.exit();
})();
