import { Student, Teacher, Topic, Problem, Submission, Message } from '@/types';
import Redis from 'ioredis';

// Check for Redis connection
const redisUrl = typeof process !== 'undefined' ? process.env.REDIS_URL : null;
const isVercelKV = typeof process !== 'undefined' && process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;
const hasRedis = !!redisUrl || isVercelKV;

// Redis client for standard Redis
let redisClient: Redis | null = null;

function getRedisClient(): Redis | null {
  if (!redisUrl) return null;
  if (!redisClient) {
    redisClient = new Redis(redisUrl);
    redisClient.on('error', (err) => console.error('[Redis] Connection error:', err));
    redisClient.on('connect', () => console.log('[Redis] Connected successfully'));
  }
  return redisClient;
}

// Log storage mode on startup
if (typeof process !== 'undefined') {
  const mode = redisUrl ? 'Redis' : (isVercelKV ? 'Vercel KV' : 'In-Memory');
  console.log(`[DB] Storage mode: ${mode}`);
}

// In-memory storage for local development and fallback
let memoryStore: {
  users: (Student | Teacher)[];
  topics: Topic[];
  problems: Problem[];
  submissions: Submission[];
  messages: Message[];
} = {
  users: [],
  topics: [],
  problems: [],
  submissions: [],
  messages: [],
};

let initialized = false;

// Redis helpers for standard Redis
async function redisGet<T>(key: string): Promise<T | null> {
  const client = getRedisClient();
  if (!client) return null;
  try {
    const data = await client.get(`dls:${key}`);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('[Redis] Get error:', e);
    return null;
  }
}

async function redisSet<T>(key: string, value: T): Promise<void> {
  const client = getRedisClient();
  if (!client) return;
  try {
    await client.set(`dls:${key}`, JSON.stringify(value));
  } catch (e) {
    console.error('[Redis] Set error:', e);
  }
}

// KV helpers (only used when Vercel KV is configured)
async function kvGet<T>(key: string): Promise<T | null> {
  if (!isVercelKV) return null;
  try {
    const { kv } = await import('@vercel/kv');
    return await kv.get<T>(key);
  } catch {
    return null;
  }
}

async function kvSet<T>(key: string, value: T): Promise<void> {
  if (!isVercelKV) return;
  try {
    const { kv } = await import('@vercel/kv');
    await kv.set(key, value);
  } catch (e) {
    console.error('KV set error:', e);
  }
}

// Storage abstraction - supports Redis, Vercel KV, or In-Memory
async function getData<T>(key: string, defaultValue: T): Promise<T> {
  // Try standard Redis first
  if (redisUrl) {
    const data = await redisGet<T>(key);
    return data ?? defaultValue;
  }
  // Then try Vercel KV
  if (isVercelKV) {
    const data = await kvGet<T>(key);
    return data ?? defaultValue;
  }
  // Fallback to memory
  return (memoryStore as any)[key] ?? defaultValue;
}

async function setData<T>(key: string, data: T): Promise<void> {
  // Try standard Redis first
  if (redisUrl) {
    await redisSet(key, data);
    return;
  }
  // Then try Vercel KV
  if (isVercelKV) {
    await kvSet(key, data);
  }
  // Always update memory store as cache
  (memoryStore as any)[key] = data;
}

// ==================== USERS ====================
export async function getUsers(): Promise<(Student | Teacher)[]> {
  return getData('users', []);
}

export async function getStudents(): Promise<Student[]> {
  const users = await getUsers();
  return users.filter((u): u is Student => u.role === 'student');
}

export async function getTeachers(): Promise<Teacher[]> {
  const users = await getUsers();
  return users.filter((u): u is Teacher => u.role === 'teacher');
}

export async function getUserById(id: string): Promise<Student | Teacher | null> {
  const users = await getUsers();
  return users.find(u => u.id === id) || null;
}

export async function getUserByEmail(email: string): Promise<Student | Teacher | null> {
  const users = await getUsers();
  return users.find(u => u.email === email) || null;
}

export async function createUser(user: Student | Teacher): Promise<Student | Teacher> {
  const users = await getUsers();
  users.push(user);
  await setData('users', users);
  return user;
}

export async function updateUser(id: string, updates: Partial<Student | Teacher>): Promise<Student | Teacher | null> {
  const users = await getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return null;
  users[index] = { ...users[index], ...updates } as Student | Teacher;
  await setData('users', users);
  return users[index];
}

export async function updateStudentPoints(id: string, pointsDelta: number): Promise<Student | null> {
  const users = await getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1 || users[index].role !== 'student') return null;
  const student = users[index] as Student;
  student.points = Math.max(0, student.points + pointsDelta);
  await setData('users', users);
  return student;
}

export async function markProblemCompleted(studentId: string, problemId: string, points: number): Promise<Student | null> {
  const users = await getUsers();
  const index = users.findIndex(u => u.id === studentId);
  if (index === -1 || users[index].role !== 'student') return null;
  const student = users[index] as Student;

  if (!student.completedProblems.includes(problemId)) {
    student.completedProblems.push(problemId);
    student.points += points;
  }
  student.lastActiveAt = new Date();

  await setData('users', users);
  return student;
}

// ==================== TOPICS ====================
export async function getTopics(): Promise<Topic[]> {
  return getData('topics', []);
}

export async function getTopicById(id: string): Promise<Topic | null> {
  const topics = await getTopics();
  return topics.find(t => t.id === id) || null;
}

export async function getTopicsByGrade(grade: number): Promise<Topic[]> {
  const topics = await getTopics();
  return topics.filter(t => t.grades.includes(grade)).sort((a, b) => a.order - b.order);
}

export async function createTopic(topic: Topic): Promise<Topic> {
  const topics = await getTopics();
  topics.push(topic);
  await setData('topics', topics);
  return topic;
}

export async function updateTopic(id: string, updates: Partial<Topic>): Promise<Topic | null> {
  const topics = await getTopics();
  const index = topics.findIndex(t => t.id === id);
  if (index === -1) return null;
  topics[index] = { ...topics[index], ...updates };
  await setData('topics', topics);
  return topics[index];
}

export async function deleteTopic(id: string): Promise<boolean> {
  const topics = await getTopics();
  const index = topics.findIndex(t => t.id === id);
  if (index === -1) return false;
  topics.splice(index, 1);
  await setData('topics', topics);
  return true;
}

// ==================== PROBLEMS ====================
export async function getProblems(): Promise<Problem[]> {
  return getData('problems', []);
}

export async function getProblemById(id: string): Promise<Problem | null> {
  const problems = await getProblems();
  return problems.find(p => p.id === id) || null;
}

export async function getProblemsByTopic(topicId: string): Promise<Problem[]> {
  const problems = await getProblems();
  return problems.filter(p => p.topicId === topicId).sort((a, b) => a.order - b.order);
}

export async function getProblemsByGrade(grade: number): Promise<Problem[]> {
  const problems = await getProblems();
  return problems.filter(p => p.grades.includes(grade));
}

export async function createProblem(problem: Problem): Promise<Problem> {
  const problems = await getProblems();
  problems.push(problem);
  await setData('problems', problems);
  return problem;
}

export async function updateProblem(id: string, updates: Partial<Problem>): Promise<Problem | null> {
  const problems = await getProblems();
  const index = problems.findIndex(p => p.id === id);
  if (index === -1) return null;
  problems[index] = { ...problems[index], ...updates };
  await setData('problems', problems);
  return problems[index];
}

export async function deleteProblem(id: string): Promise<boolean> {
  const problems = await getProblems();
  const index = problems.findIndex(p => p.id === id);
  if (index === -1) return false;
  problems.splice(index, 1);
  await setData('problems', problems);
  return true;
}

// ==================== SUBMISSIONS ====================
export async function getSubmissions(): Promise<Submission[]> {
  return getData('submissions', []);
}

export async function getSubmissionsByStudent(studentId: string): Promise<Submission[]> {
  const submissions = await getSubmissions();
  return submissions
    .filter(s => s.studentId === studentId)
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

export async function getSubmissionsByProblem(problemId: string): Promise<Submission[]> {
  const submissions = await getSubmissions();
  return submissions.filter(s => s.problemId === problemId);
}

export async function getLatestSubmission(studentId: string, problemId: string): Promise<Submission | null> {
  const submissions = await getSubmissions();
  const studentSubmissions = submissions
    .filter(s => s.studentId === studentId && s.problemId === problemId)
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  return studentSubmissions[0] || null;
}

export async function createSubmission(submission: Submission): Promise<Submission> {
  const submissions = await getSubmissions();
  submissions.push(submission);
  await setData('submissions', submissions);
  return submission;
}

// ==================== MESSAGES ====================
export async function getMessages(): Promise<Message[]> {
  return getData('messages', []);
}

export async function getMessagesBetweenUsers(userId1: string, userId2: string): Promise<Message[]> {
  const messages = await getMessages();
  return messages
    .filter(m =>
      (m.fromUserId === userId1 && m.toUserId === userId2) ||
      (m.fromUserId === userId2 && m.toUserId === userId1)
    )
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export async function getUnreadMessagesForUser(userId: string): Promise<Message[]> {
  const messages = await getMessages();
  return messages.filter(m => m.toUserId === userId && !m.isRead);
}

export async function getConversationsForTeacher(teacherId: string): Promise<{ studentId: string; unreadCount: number; lastMessage: Message | null }[]> {
  const messages = await getMessages();

  // Get all conversations with teacher
  const conversationMap = new Map<string, { messages: Message[] }>();

  for (const msg of messages) {
    if (msg.fromUserId === teacherId || msg.toUserId === teacherId) {
      const studentId = msg.fromUserId === teacherId ? msg.toUserId : msg.fromUserId;
      if (!conversationMap.has(studentId)) {
        conversationMap.set(studentId, { messages: [] });
      }
      conversationMap.get(studentId)!.messages.push(msg);
    }
  }

  // Build conversation list
  const conversations: { studentId: string; unreadCount: number; lastMessage: Message | null }[] = [];

  for (const [studentId, data] of conversationMap) {
    const sortedMessages = data.messages.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    conversations.push({
      studentId,
      unreadCount: sortedMessages.filter(m => m.toUserId === teacherId && !m.isRead).length,
      lastMessage: sortedMessages[0] || null,
    });
  }

  return conversations.sort((a, b) => {
    if (!a.lastMessage) return 1;
    if (!b.lastMessage) return -1;
    return new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime();
  });
}

export async function createMessage(message: Message): Promise<Message> {
  const messages = await getMessages();
  messages.push(message);
  await setData('messages', messages);
  return message;
}

export async function markMessagesAsRead(userId: string, fromUserId: string): Promise<void> {
  const messages = await getMessages();
  messages.forEach(m => {
    if (m.toUserId === userId && m.fromUserId === fromUserId) {
      m.isRead = true;
    }
  });
  await setData('messages', messages);
}

// ==================== INITIALIZATION ====================
export async function initializeDatabase(): Promise<void> {
  if (initialized && !hasRedis) {
    return; // Skip if already initialized (for in-memory mode)
  }

  // Check if users exist
  const users = await getUsers();
  if (users.length === 0) {
    // Create default teacher
    const teacher: Teacher = {
      id: 'teacher-1',
      name: 'Aknazar Arturovich',
      email: 'teacher@school.edu',
      password: 'Khalif1949',
      role: 'teacher',
      classes: [7, 8, 9, 10],
      createdAt: new Date(),
    };

    // Real students data
    const studentsData = [
      // 7 класс (12 students)
      { name: 'Абдильбар Илшат', email: 'ilshat.abdilbar@dls.edu', password: 'ytrhfg', grade: 7 },
      { name: 'Байрамов Али', email: 'ali.bayramov@dls.edu', password: 'qazwsx', grade: 7 },
      { name: 'Бақытжан Абдуррахим', email: 'abdurrahim.bakytzhan@dls.edu', password: 'plmokn', grade: 7 },
      { name: 'Балтас Нұржарық', email: 'nurzharyk.baltas@dls.edu', password: 'xswder', grade: 7 },
      { name: 'Думан Абдурахим', email: 'abdurahim.duman@dls.edu', password: 'bnmhju', grade: 7 },
      { name: 'Жарбул Ерұлан', email: 'erulan.zharbul@dls.edu', password: 'fghjkl', grade: 7 },
      { name: 'Қайырхан Абылай', email: 'abylai.kaiyrkhan@dls.edu', password: 'rewqaz', grade: 7 },
      { name: 'Медетұлы Султан', email: 'sultan.medetuly@dls.edu', password: 'okmijn', grade: 7 },
      { name: 'Нурдаулетов Арслан', email: 'arslan.nurdauletov@dls.edu', password: 'zasxdr', grade: 7 },
      { name: 'Осман Дінмұхаммед', email: 'dinmuhammed.osman@dls.edu', password: 'mnbvcx', grade: 7 },
      { name: 'Темірболат Нұрали', email: 'nuraly.temirbolat@dls.edu', password: 'poiulk', grade: 7 },
      { name: 'Турлыбек Ахмад', email: 'ahmad.turlybek@dls.edu', password: 'lkjhgf', grade: 7 },

      // 8 класс (20 students)
      { name: 'Алтынбек Ділмұхаммед', email: 'dilmuhammed.altynbek@dls.edu', password: 'qwerty', grade: 8 },
      { name: 'Балтас Нұртөре', email: 'nurtore.baltas@dls.edu', password: 'asdfgh', grade: 8 },
      { name: 'Бегалы Жалаңтөс', email: 'zhalantos.begaly@dls.edu', password: 'zxcvbn', grade: 8 },
      { name: 'Бимуханов Альтаир', email: 'altair.bimukhanov@dls.edu', password: 'tyuiop', grade: 8 },
      { name: 'Жеңіс Нұрлыхан', email: 'nurlykhan.zhenis@dls.edu', password: 'ghjklo', grade: 8 },
      { name: 'Кеней Әділхан', email: 'adilkhan.keney@dls.edu', password: 'cvbnml', grade: 8 },
      { name: 'Комбатуров Жангир', email: 'zhangir.kombaturov@dls.edu', password: 'werasd', grade: 8 },
      { name: 'Конгуев Алинұр', email: 'alinur.konguev@dls.edu', password: 'ijnmok', grade: 8 },
      { name: 'Қабдолла Мухаммед', email: 'muhammad.kabdolla@dls.edu', password: 'rfvtgb', grade: 8 },
      { name: 'Қайрат Абулхаир', email: 'abulkhair.kairat@dls.edu', password: 'edcrfv', grade: 8 },
      { name: 'Мақсұт Ерасыл', email: 'erassyl.maksut@dls.edu', password: 'ujmnhy', grade: 8 },
      { name: 'Муканов Мухаммад Амин', email: 'amin.muhammad.mukanov@dls.edu', password: 'iklojm', grade: 8 },
      { name: 'Нуржанов Эльбурихан', email: 'elburikhan.nurzhanov@dls.edu', password: 'plokij', grade: 8 },
      { name: 'Нұрғали Йусуф', email: 'yusuf.nurgaly@dls.edu', password: 'xswdqa', grade: 8 },
      { name: 'Сағынғалиев Абдурахман', email: 'abdurahman.sagingaliev@dls.edu', password: 'vfrtgb', grade: 8 },
      { name: 'Салават Искандер', email: 'iskander.salavat@dls.edu', password: 'hnjmik', grade: 8 },
      { name: 'Серікұлы Дамир', email: 'damir.serikuly@dls.edu', password: 'nbvcxz', grade: 8 },
      { name: 'Тұрсынәлі Бектас', email: 'bektas.tursynali@dls.edu', password: 'oplkij', grade: 8 },
      { name: 'Фархатұлы Дінмұхамед', email: 'dinmuhamed.farkhatuly@dls.edu', password: 'azsxdc', grade: 8 },
      { name: 'Юсуфали Али', email: 'ali.yusufali@dls.edu', password: 'miklop', grade: 8 },

      // 9 класс (16 students)
      { name: 'Аманжол Абдурахман', email: 'abdurahman.amanzhol@dls.edu', password: 'qazxsw', grade: 9 },
      { name: 'Ахмеджанов Инсар', email: 'insar.akhmedzhanov@dls.edu', password: 'edcvfr', grade: 9 },
      { name: 'Ахметали Абылай', email: 'abylai.akhmetali@dls.edu', password: 'tgbnhy', grade: 9 },
      { name: 'Бағаев Ерсұлтан', email: 'ersultan.bagaev@dls.edu', password: 'ujikol', grade: 9 },
      { name: 'Бақытжан Нұрнияз', email: 'nurniyaz.bakytzhan@dls.edu', password: 'plokmn', grade: 9 },
      { name: 'Дүйсенбай Диар', email: 'diar.duisenbai@dls.edu', password: 'zasxdc', grade: 9 },
      { name: 'Жеңіс Мағжан', email: 'magzhan.zhenis@dls.edu', password: 'rfvtgy', grade: 9 },
      { name: 'Калелов Бекарыс', email: 'bekarys.kalelov@dls.edu', password: 'hnjmko', grade: 9 },
      { name: 'Кульжан Диар', email: 'diar.kulzhan@dls.edu', password: 'miknuj', grade: 9 },
      { name: 'Марат Әлмансур', email: 'almansur.marat@dls.edu', password: 'bnmhyt', grade: 9 },
      { name: 'Мехнин Олег', email: 'oleg.mekhnin@dls.edu', password: 'lopkij', grade: 9 },
      { name: 'Разыев Абдулла', email: 'abdulla.raziev@dls.edu', password: 'qwertu', grade: 9 },
      { name: 'Ромазан Елжан', email: 'elzhan.romazan@dls.edu', password: 'asdfju', grade: 9 },
      { name: 'Сәндібек Сағадат', email: 'sagadat.sandibek@dls.edu', password: 'zxcvhy', grade: 9 },
      { name: 'Темержан Санжар', email: 'sanzhar.temerzhan@dls.edu', password: 'plmnok', grade: 9 },
      { name: 'Турдыбеков Искандер', email: 'iskander.turdybekov@dls.edu', password: 'ijnhuy', grade: 9 },

      // 10 класс (15 students)
      { name: 'Аждурлиев Бақберген', email: 'bakbergen.azhdurliev@dls.edu', password: 'rfghyt', grade: 10 },
      { name: 'Арғымбаев Арыс', email: 'arys.argymbaev@dls.edu', password: 'qazplm', grade: 10 },
      { name: 'Ахаев Мансур', email: 'mansur.akhaev@dls.edu', password: 'okmijn', grade: 10 },
      { name: 'Джанытез Серкан', email: 'serkan.dzhanytez@dls.edu', password: 'xswdqe', grade: 10 },
      { name: 'Ербол Санжар', email: 'sanzhar.erbol@dls.edu', password: 'tgbnhy', grade: 10 },
      { name: 'Жумамурат Толе', email: 'tole.zhumamurat@dls.edu', password: 'ikloju', grade: 10 },
      { name: 'Жұмәсіл Мейіржан', email: 'meirzhan.zhumasil@dls.edu', password: 'plmokn', grade: 10 },
      { name: 'Кадырхан Мансур', email: 'mansur.kadyrkhan@dls.edu', password: 'zasxdr', grade: 10 },
      { name: 'Қудайберген Ерасыл', email: 'erassyl.kudaibergen@dls.edu', password: 'fghjkl', grade: 10 },
      { name: 'Мекебай Архат', email: 'arkhat.mekebai@dls.edu', password: 'bnmhju', grade: 10 },
      { name: 'Мустафин Ихсан', email: 'ihsan.mustafin@dls.edu', password: 'rewqaz', grade: 10 },
      { name: 'Өмірзақ Бекасыл', email: 'bekasyl.omirzak@dls.edu', password: 'cvbnml', grade: 10 },
      { name: 'Рысдавлетов Эмирлан', email: 'emirlan.rysdavletov@dls.edu', password: 'tyuiop', grade: 10 },
      { name: 'Сәки Наркес', email: 'narkes.saki@dls.edu', password: 'lkjhgf', grade: 10 },
      { name: 'Ыгзан Самалық', email: 'samalyk.ygzan@dls.edu', password: 'mnbvcx', grade: 10 },
    ];

    const students: Student[] = studentsData.map((s, i) => ({
      id: `student-${s.grade}-${i + 1}`,
      name: s.name,
      email: s.email,
      password: s.password,
      role: 'student' as const,
      grade: s.grade,
      completedProblems: [],
      points: 0,
      achievements: [],
      streakDays: 0,
      lastActiveAt: new Date(),
      createdAt: new Date('2024-09-01'),
      purchasedItems: [],
      equippedAvatar: null,
      equippedFrame: null,
    }));

    await setData('users', [teacher, ...students]);
  }

  // Initialize topics if empty
  const topics = await getTopics();
  if (topics.length === 0) {
    await setData('topics', getDefaultTopics());
  }

  // Initialize problems if empty
  const problems = await getProblems();
  if (problems.length === 0) {
    await setData('problems', getDefaultProblems());
  }

  initialized = true;
}

// Function to delete a user
export async function deleteUser(id: string): Promise<boolean> {
  const users = await getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return false;
  users.splice(index, 1);
  await setData('users', users);
  return true;
}

function getDefaultTopics(): Topic[] {
  return [
    {
      id: 'variables',
      title: 'Variables',
      titleRu: 'Переменные',
      description: 'Learn about variables and data types',
      descriptionRu: 'Изучение переменных и типов данных',
      order: 1,
      icon: 'Variable',
      color: 'blue',
      grades: [7, 8, 9, 10],
      problemIds: ['var-1', 'var-2', 'var-3'],
      documentation: `# Переменные в Python\n\n## Что такое переменная?\n\nПеременная — это именованная область памяти, которая хранит данные.\n\n\`\`\`python\nname = "Иван"\nage = 15\n\`\`\`\n`
    },
    {
      id: 'input-output',
      title: 'Input/Output',
      titleRu: 'Ввод/Вывод',
      description: 'Learn about input and output',
      descriptionRu: 'Изучение ввода и вывода данных',
      order: 2,
      icon: 'Terminal',
      color: 'green',
      grades: [7, 8, 9, 10],
      problemIds: ['io-1', 'io-2'],
      documentation: `# Ввод и вывод в Python\n\n\`\`\`python\nprint("Привет!")\nname = input("Имя: ")\n\`\`\`\n`
    },
    {
      id: 'conditions',
      title: 'Conditions',
      titleRu: 'Условия',
      description: 'Learn about conditional statements',
      descriptionRu: 'Изучение условных операторов',
      order: 3,
      icon: 'GitBranch',
      color: 'yellow',
      grades: [7, 8, 9, 10],
      problemIds: ['cond-1', 'cond-2'],
      documentation: `# Условные операторы\n\n\`\`\`python\nif age >= 18:\n    print("Взрослый")\nelse:\n    print("Ребёнок")\n\`\`\`\n`
    },
    {
      id: 'loops',
      title: 'Loops',
      titleRu: 'Циклы',
      description: 'Learn about loops',
      descriptionRu: 'Изучение циклов',
      order: 4,
      icon: 'RefreshCw',
      color: 'purple',
      grades: [7, 8, 9, 10],
      problemIds: ['loop-1', 'loop-2'],
      documentation: `# Циклы в Python\n\n\`\`\`python\nfor i in range(5):\n    print(i)\n\`\`\`\n`
    },
    {
      id: 'lists',
      title: 'Lists',
      titleRu: 'Списки',
      description: 'Learn about lists',
      descriptionRu: 'Изучение списков',
      order: 5,
      icon: 'List',
      color: 'orange',
      grades: [8, 9, 10],
      problemIds: ['list-1', 'list-2'],
      documentation: `# Списки в Python\n\n\`\`\`python\nnums = [1, 2, 3]\nnums.append(4)\n\`\`\`\n`
    },
    {
      id: 'functions',
      title: 'Functions',
      titleRu: 'Функции',
      description: 'Learn about functions',
      descriptionRu: 'Изучение функций',
      order: 6,
      icon: 'Code',
      color: 'pink',
      grades: [8, 9, 10],
      problemIds: ['func-1', 'func-2'],
      documentation: `# Функции в Python\n\n\`\`\`python\ndef greet(name):\n    return f"Привет, {name}!"\n\`\`\`\n`
    },
  ];
}

function getDefaultProblems(): Problem[] {
  return [
    {
      id: 'var-1',
      topicId: 'variables',
      title: 'Hello Variable',
      titleRu: 'Привет, переменная',
      description: 'Create a variable and print it',
      descriptionRu: 'Создайте переменную message со значением "Hello" и выведите её',
      difficulty: 'easy',
      points: 10,
      order: 1,
      grades: [7, 8, 9, 10],
      starterCode: '# Создайте переменную message и выведите её\n',
      solution: 'message = "Hello"\nprint(message)',
      hints: ['Используйте = для присваивания'],
      testCases: [{ id: 'tc1', input: '', expectedOutput: 'Hello', isHidden: false }]
    },
    {
      id: 'var-2',
      topicId: 'variables',
      title: 'Sum Two Numbers',
      titleRu: 'Сумма двух чисел',
      description: 'Read two numbers and print their sum',
      descriptionRu: 'Прочитайте два числа и выведите их сумму',
      difficulty: 'easy',
      points: 10,
      order: 2,
      grades: [7, 8, 9, 10],
      starterCode: '# Прочитайте два числа и выведите их сумму\n',
      solution: 'a = int(input())\nb = int(input())\nprint(a + b)',
      hints: ['int() преобразует строку в число'],
      testCases: [
        { id: 'tc1', input: '5\n3', expectedOutput: '8', isHidden: false },
        { id: 'tc2', input: '10\n20', expectedOutput: '30', isHidden: false }
      ]
    },
    {
      id: 'var-3',
      topicId: 'variables',
      title: 'Rectangle Area',
      titleRu: 'Площадь прямоугольника',
      description: 'Calculate rectangle area',
      descriptionRu: 'Вычислите площадь прямоугольника',
      difficulty: 'easy',
      points: 15,
      order: 3,
      grades: [7, 8, 9, 10],
      starterCode: '# Прочитайте ширину и высоту\n',
      solution: 'w = int(input())\nh = int(input())\nprint(w * h)',
      hints: ['Площадь = ширина × высота'],
      testCases: [
        { id: 'tc1', input: '5\n3', expectedOutput: '15', isHidden: false },
        { id: 'tc2', input: '10\n10', expectedOutput: '100', isHidden: false }
      ]
    },
    {
      id: 'io-1',
      topicId: 'input-output',
      title: 'Greeting',
      titleRu: 'Приветствие',
      description: 'Read name and greet',
      descriptionRu: 'Выведите приветствие',
      difficulty: 'easy',
      points: 10,
      order: 1,
      grades: [7, 8, 9, 10],
      starterCode: '# Выведите "Hello, <имя>!"\n',
      solution: 'name = input()\nprint(f"Hello, {name}!")',
      hints: ['Используйте f-строки'],
      testCases: [
        { id: 'tc1', input: 'World', expectedOutput: 'Hello, World!', isHidden: false }
      ]
    },
    {
      id: 'io-2',
      topicId: 'input-output',
      title: 'Double',
      titleRu: 'Удвоение',
      description: 'Double the number',
      descriptionRu: 'Удвойте число',
      difficulty: 'easy',
      points: 10,
      order: 2,
      grades: [7, 8, 9, 10],
      starterCode: '# Удвойте число\n',
      solution: 'n = int(input())\nprint(n * 2)',
      hints: ['Умножьте на 2'],
      testCases: [
        { id: 'tc1', input: '5', expectedOutput: '10', isHidden: false }
      ]
    },
    {
      id: 'cond-1',
      topicId: 'conditions',
      title: 'Even or Odd',
      titleRu: 'Чётное или нечётное',
      description: 'Check if number is even or odd',
      descriptionRu: 'Проверьте чётность',
      difficulty: 'easy',
      points: 10,
      order: 1,
      grades: [7, 8, 9, 10],
      starterCode: '# Выведите "even" или "odd"\n',
      solution: 'n = int(input())\nif n % 2 == 0:\n    print("even")\nelse:\n    print("odd")',
      hints: ['% даёт остаток от деления'],
      testCases: [
        { id: 'tc1', input: '4', expectedOutput: 'even', isHidden: false },
        { id: 'tc2', input: '7', expectedOutput: 'odd', isHidden: false }
      ]
    },
    {
      id: 'cond-2',
      topicId: 'conditions',
      title: 'Maximum',
      titleRu: 'Максимум',
      description: 'Find maximum',
      descriptionRu: 'Найдите максимум',
      difficulty: 'easy',
      points: 10,
      order: 2,
      grades: [7, 8, 9, 10],
      starterCode: '# Выведите большее число\n',
      solution: 'a = int(input())\nb = int(input())\nif a > b:\n    print(a)\nelse:\n    print(b)',
      hints: ['Сравните a и b'],
      testCases: [
        { id: 'tc1', input: '5\n3', expectedOutput: '5', isHidden: false },
        { id: 'tc2', input: '10\n20', expectedOutput: '20', isHidden: false }
      ]
    },
    {
      id: 'loop-1',
      topicId: 'loops',
      title: 'Count to N',
      titleRu: 'Счёт до N',
      description: 'Print 1 to N',
      descriptionRu: 'Выведите от 1 до N',
      difficulty: 'easy',
      points: 10,
      order: 1,
      grades: [7, 8, 9, 10],
      starterCode: '# Выведите числа от 1 до N\n',
      solution: 'n = int(input())\nfor i in range(1, n + 1):\n    print(i)',
      hints: ['range(1, n+1)'],
      testCases: [
        { id: 'tc1', input: '5', expectedOutput: '1\n2\n3\n4\n5', isHidden: false }
      ]
    },
    {
      id: 'loop-2',
      topicId: 'loops',
      title: 'Sum 1 to N',
      titleRu: 'Сумма от 1 до N',
      description: 'Sum from 1 to N',
      descriptionRu: 'Сумма от 1 до N',
      difficulty: 'easy',
      points: 15,
      order: 2,
      grades: [7, 8, 9, 10],
      starterCode: '# Выведите сумму\n',
      solution: 'n = int(input())\ntotal = 0\nfor i in range(1, n + 1):\n    total += i\nprint(total)',
      hints: ['Накапливайте сумму'],
      testCases: [
        { id: 'tc1', input: '5', expectedOutput: '15', isHidden: false },
        { id: 'tc2', input: '10', expectedOutput: '55', isHidden: false }
      ]
    },
    {
      id: 'list-1',
      topicId: 'lists',
      title: 'List Sum',
      titleRu: 'Сумма списка',
      description: 'Sum all elements',
      descriptionRu: 'Просуммируйте элементы',
      difficulty: 'easy',
      points: 10,
      order: 1,
      grades: [8, 9, 10],
      starterCode: '# Числа через пробел\n',
      solution: 'nums = list(map(int, input().split()))\nprint(sum(nums))',
      hints: ['split() разделяет строку'],
      testCases: [
        { id: 'tc1', input: '1 2 3 4 5', expectedOutput: '15', isHidden: false }
      ]
    },
    {
      id: 'list-2',
      topicId: 'lists',
      title: 'Find Max',
      titleRu: 'Найти максимум',
      description: 'Find maximum',
      descriptionRu: 'Найдите максимум',
      difficulty: 'easy',
      points: 10,
      order: 2,
      grades: [8, 9, 10],
      starterCode: '# Найдите максимум\n',
      solution: 'nums = list(map(int, input().split()))\nm = nums[0]\nfor n in nums:\n    if n > m:\n        m = n\nprint(m)',
      hints: ['Сравнивайте с текущим максимумом'],
      testCases: [
        { id: 'tc1', input: '3 1 4 1 5 9', expectedOutput: '9', isHidden: false }
      ]
    },
    {
      id: 'func-1',
      topicId: 'functions',
      title: 'Double Function',
      titleRu: 'Функция удвоения',
      description: 'Create double function',
      descriptionRu: 'Создайте функцию',
      difficulty: 'easy',
      points: 10,
      order: 1,
      grades: [8, 9, 10],
      starterCode: '# Создайте функцию double(n)\n',
      solution: 'def double(n):\n    return n * 2\n\nn = int(input())\nprint(double(n))',
      hints: ['Используйте return'],
      testCases: [
        { id: 'tc1', input: '5', expectedOutput: '10', isHidden: false }
      ]
    },
    {
      id: 'func-2',
      topicId: 'functions',
      title: 'Palindrome',
      titleRu: 'Палиндром',
      description: 'Check palindrome',
      descriptionRu: 'Проверьте палиндром',
      difficulty: 'medium',
      points: 20,
      order: 2,
      grades: [8, 9, 10],
      starterCode: '# Функция is_palindrome(s)\n',
      solution: 'def is_palindrome(s):\n    return s == s[::-1]\n\ns = input()\nprint("yes" if is_palindrome(s) else "no")',
      hints: ['s[::-1] разворачивает строку'],
      testCases: [
        { id: 'tc1', input: 'radar', expectedOutput: 'yes', isHidden: false },
        { id: 'tc2', input: 'hello', expectedOutput: 'no', isHidden: false }
      ]
    }
  ];
}
