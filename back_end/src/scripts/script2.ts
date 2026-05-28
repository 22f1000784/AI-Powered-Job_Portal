import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6IjIyZjEwMDA3ODRAZHMuc3R1ZHkuaWl0bS5hYy5pbiJ9.r018kf-6P0n-FhSyQ4Rh8uM0Ot1QJT_VOI28sWBhPm8",
});

async function test() {
  try {
    console.log("script started")
    const res = await client.embeddings.create({
      model: "text-embedding-3-small",
      input: "hello world",
    });

    console.log("✅ KEY WORKING");
    console.log(res.data[0].embedding.slice(0, 5));
  } catch (err: any) {
    console.error("❌ ERROR:", err.message);
  }
}

test();