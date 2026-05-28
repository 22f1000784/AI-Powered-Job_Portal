export const scoreByKeywords = (jobRequirements: string[], candidateSkills: string[], resumeText: string) => {
  if (!jobRequirements.length) return 0;

  // 1. Normalize everything to lowercase
  const jobSet = new Set(jobRequirements.map(s => s.toLowerCase()));
  const candidateSet = new Set(candidateSkills.map(s => s.toLowerCase()));
  const lowerResume = resumeText.toLowerCase();

  // 2. Count Skill Matches
  let matchedSkills = 0;
  jobSet.forEach(skill => {
    if (candidateSet.has(skill) || lowerResume.includes(skill)) {
      matchedSkills++;
    }
  });

  // 3. Calculate Score (Percentage of job skills found)
  const score = matchedSkills / jobSet.size;

  return score; // Returns 0.0 to 1.0
};