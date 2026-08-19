/**
 * Library of non-denominational reflection prompts.
 * Each day picks 2-3 prompts to pair with the passage.
 */

const PROMPTS = [
  "What word or phrase stands out to you today?",
  "How does this passage speak to your current situation?",
  "What does this reveal about God's character?",
  "Is there a promise here you can hold onto today?",
  "What is one thing you can do today in response to this passage?",
  "How would you explain this passage to a friend?",
  "What comfort or challenge do you find here?",
  "Is there something here you want to thank God for?",
  "What question does this passage raise for you?",
  "How does this passage change the way you see your day ahead?",
  "What would it look like to live this out at work today?",
  "Is there a habit or attitude this passage invites you to reconsider?",
  "Who in your life needs to hear this truth today?",
  "What would you pray in response to these words?",
  "How does this connect to something you've been thinking about recently?",
];

/** Deterministic prompt selection for a given day-of-year. Returns 2 prompts. */
export function getPromptsForDay(dayOfYear: number): [string, string] {
  const i = dayOfYear % PROMPTS.length;
  const j = (dayOfYear + 7) % PROMPTS.length;
  return [PROMPTS[i], PROMPTS[j === i ? (j + 1) % PROMPTS.length : j]];
}
