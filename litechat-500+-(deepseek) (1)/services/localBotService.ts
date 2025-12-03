/**
 * This service replicates the Python script's logic exactly.
 * It generates the static dataset and handles keyword matching.
 */

// Generate the 1000+ item static QA dataset
const buildQaPairs = (): Map<string, string> => {
  const map = new Map<string, string>();

  // Helper to add to map
  const add = (q: string, a: string) => map.set(q.toLowerCase(), a);

  // 1. Learning Advice (1-250)
  for (let i = 1; i <= 250; i++) {
    add(`学习建议${i}`, `学习建议${i}：今天完成一个小目标，例如复习 ${i % 5 + 1} 个知识点。`);
  }

  // 2. Efficiency Tips (1-200)
  for (let i = 1; i <= 200; i++) {
    add(`效率技巧${i}`, `效率技巧${i}：使用番茄工作法 ${25 + (i % 15)} 分钟再休息。`);
  }

  // 3. Mood Encouragement (1-200)
  for (let i = 1; i <= 200; i++) {
    add(`心情鼓励${i}`, `心情鼓励${i}：深呼吸一下，你已经做得很好。`);
  }

  // 4. Health Reminders (1-150)
  for (let i = 1; i <= 150; i++) {
    add(`健康提醒${i}`, `健康提醒${i}：起来走走，喝一口水，活动颈椎。`);
  }

  // 5. Trivia (1-150)
  for (let i = 1; i <= 150; i++) {
    add(`趣味问答${i}`, `趣味问答${i}：我最喜欢的数字是 ${i % 9 + 1}，你呢？`);
  }

  // 6. Programming Tips (1-150)
  for (let i = 1; i <= 150; i++) {
    add(`编程提示${i}`, `编程提示${i}：调试时先写小例子重现问题。`);
  }

  return map;
};

// Initialize the dataset once
export const QA_MAP = buildQaPairs();
export const QA_COUNT = QA_MAP.size;

export const getLocalResponse = (message: string): string => {
  const text = message.trim();
  const lower = text.toLowerCase();

  if (!text) {
    return "我没听清，你可以再说一次吗？";
  }

  if (['exit', 'quit', 'bye', '拜拜'].includes(lower)) {
    return "再见！(请直接关闭标签页)";
  }

  // Time
  if (text.includes("时间") || lower.includes("time")) {
    const now = new Date();
    return `现在是 ${now.toLocaleTimeString()} (日期: ${now.toLocaleDateString()})`;
  }

  // Date
  if (text.includes("日期") || lower.includes("date")) {
    return `今天是 ${new Date().toLocaleDateString()}`;
  }

  // Weather
  if (["天气", "weather", "温度"].some(w => text.includes(w) || lower.includes(w))) {
    const responses = [
      "我没有实时天气数据，但记得带伞，天气说变就变。",
      "天气未知，不过多喝水总没错！",
      "我不连网，但你可以告诉我现在天气怎样。"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Jokes
  if (["笑话", "joke"].some(w => text.includes(w) || lower.includes(w))) {
    const jokes = [
      "程序员为什么总是分不清万圣节和圣诞节？因为 OCT 31 == DEC 25。",
      "昨天写了个递归笑话，可惜讲到一半我又开始讲了。",
      "我想讲个缓存的笑话，可是你已经笑过了。",
      "一个 SQL 语句走进一家酒吧，走到两张桌子中间说：'我可以 Join 你们吗？'",
      "0 是 假，1 是 真，其他的都是乱码。"
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }

  // Mood/Happiness
  if (["你开心吗", "心情", "mood"].some(w => text.includes(w) || lower.includes(w))) {
    const responses = [
      "和你聊天我就很开心！",
      "心情不错，继续和我聊聊吧。",
      "我没有情绪芯片，但我正专注地听你说。"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Thanks
  if (["谢谢", "thx", "thanks"].some(w => text.includes(w) || lower.includes(w))) {
    const responses = [
      "不客气！",
      "小事儿，随时找我。",
      "很高兴能帮到你。"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // More
  if (["再来一个", "再说一个", "再讲一个"].some(w => text.includes(w))) {
    return "可以问我时间、日期、天气、笑话、心情，或者试试大量预置问答（例如：学习建议1）。";
  }

  // Favorites
  if (text.includes("你喜欢什么") || lower.includes("favorite")) {
    return "我喜欢学习新问题，再告诉你答案。";
  }

  // Greetings
  if (["你好", "hi", "hello", "嗨", "hey"].some(w => text.includes(w) || lower.includes(w))) {
    const greetings = [
      "你好！很高兴见到你。",
      "嗨，有什么可以帮你？",
      "Hello!"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // Identity
  if (text.includes("你是谁") || lower.includes("who are you")) {
    return "我是一个被移植到 React 的简易聊天机器人。";
  }

  // Help
  if (text.includes("帮助") || lower.includes("help")) {
    return `试着问我时间、日期、天气、笑话，或输入这些预置关键词如“学习建议1”。我有 ${QA_COUNT} 条预置问答。`;
  }

  // Check specific keys in the huge map
  const exactMatch = QA_MAP.get(lower);
  if (exactMatch) {
    return exactMatch;
  }

  // Fallback
  const fallbacks = [
    "这个问题我还不会，但我会继续学习！",
    "有意思的话题，再详细说说？",
    "我现在只懂一些简单的问题，试试切换到 Gemini 模式？"
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
};