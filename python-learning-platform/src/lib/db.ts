import { Student, Teacher, Topic, Problem, Submission, Message, Announcement } from '@/types';
import Redis from 'ioredis';
import { problems as defaultProblemsData } from '@/data/problems';
import { topics as defaultTopicsData } from '@/data/topics';

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
  announcements: Announcement[];
} = {
  users: [],
  topics: [],
  problems: [],
  submissions: [],
  messages: [],
  announcements: [],
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
  // Always update memory store as cache first
  (memoryStore as any)[key] = data;

  // Try standard Redis first
  if (redisUrl) {
    await redisSet(key, data);
    return;
  }
  // Then try Vercel KV
  if (isVercelKV) {
    await kvSet(key, data);
  }
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

export async function resetProblems(): Promise<void> {
  await setData('problems', defaultProblemsData);
}

export async function resetTopics(): Promise<void> {
  await setData('topics', defaultTopicsData);
}

export async function resetAllData(): Promise<void> {
  await setData('topics', defaultTopicsData);
  await setData('problems', defaultProblemsData);
}

export async function resetAllStudentProgress(): Promise<number> {
  const users = await getUsers();
  let resetCount = 0;

  for (let i = 0; i < users.length; i++) {
    if (users[i].role === 'student') {
      const student = users[i] as Student;
      student.points = 0;
      student.completedProblems = [];
      resetCount++;
    }
  }

  await setData('users', users);
  return resetCount;
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

export async function deleteSubmissionsByStudentAndProblem(studentId: string, problemId: string): Promise<number> {
  const submissions = await getSubmissions();
  const filteredSubmissions = submissions.filter(
    s => !(s.studentId === studentId && s.problemId === problemId)
  );
  const deletedCount = submissions.length - filteredSubmissions.length;
  await setData('submissions', filteredSubmissions);
  return deletedCount;
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

// ==================== ANNOUNCEMENTS ====================
export async function getAnnouncements(): Promise<Announcement[]> {
  return getData('announcements', []);
}

export async function getAnnouncementById(id: string): Promise<Announcement | null> {
  const announcements = await getAnnouncements();
  return announcements.find(a => a.id === id) || null;
}

export async function createAnnouncement(announcement: Announcement): Promise<Announcement> {
  const announcements = await getAnnouncements();
  announcements.unshift(announcement); // Add to beginning (newest first)
  await setData('announcements', announcements);
  return announcement;
}

export async function updateAnnouncement(id: string, updates: Partial<Announcement>): Promise<Announcement | null> {
  const announcements = await getAnnouncements();
  const index = announcements.findIndex(a => a.id === id);
  if (index === -1) return null;
  announcements[index] = { ...announcements[index], ...updates, updatedAt: new Date() };
  await setData('announcements', announcements);
  return announcements[index];
}

export async function deleteAnnouncement(id: string): Promise<boolean> {
  const announcements = await getAnnouncements();
  const index = announcements.findIndex(a => a.id === id);
  if (index === -1) return false;
  announcements.splice(index, 1);
  await setData('announcements', announcements);
  return true;
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
  return defaultTopicsData;
}

function getDefaultTopics_OLD(): Topic[] {
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
      documentation: `# Переменные в Python

## Что такое переменная?

Представь, что переменная — это **коробка с названием**, в которую ты можешь положить что угодно: число, текст или другие данные. Когда тебе понадобится это значение, ты просто обращаешься к коробке по имени.

> **Простыми словами:** Переменная = имя + значение

## Как создать переменную?

Чтобы создать переменную, просто напиши её имя, поставь знак \`=\` и укажи значение:

\`\`\`python
message = "Привет, мир!"
age = 15
height = 1.75
is_student = True
\`\`\`

## Типы данных

В Python есть несколько основных типов данных:

| Тип | Описание | Пример |
|-----|----------|--------|
| \`str\` | Строка (текст) | \`"Привет"\` |
| \`int\` | Целое число | \`42\` |
| \`float\` | Дробное число | \`3.14\` |
| \`bool\` | Логический тип | \`True\` или \`False\` |

### Примеры

\`\`\`python
# Строка (текст в кавычках)
name = "Алия"

# Целое число
score = 100

# Дробное число
temperature = 36.6

# Логическое значение
is_online = True
\`\`\`

## Правила именования переменных

- Имя может содержать буквы, цифры и символ \`_\`
- Имя **не может** начинаться с цифры
- Имя **не может** содержать пробелы
- Python различает большие и маленькие буквы (\`Name\` и \`name\` — разные переменные)

\`\`\`python
# Правильно ✓
user_name = "Иван"
age2 = 16
myScore = 95

# Неправильно ✗
# 2age = 16       # начинается с цифры
# user name = "Иван"  # содержит пробел
\`\`\`

## Изменение значения переменной

Ты можешь изменить значение переменной в любой момент:

\`\`\`python
points = 10
print(points)  # Выведет: 10

points = 25
print(points)  # Выведет: 25

points = points + 5
print(points)  # Выведет: 30
\`\`\`

## Важно запомнить

- Используй понятные имена: \`age\` лучше чем \`a\`
- Для текста используй кавычки: \`"текст"\` или \`'текст'\`
- Числа пишутся без кавычек: \`42\`, а не \`"42"\`

> **Совет:** Называй переменные так, чтобы было понятно, что в них хранится!

## Полезные видео

- [Python для начинающих - Переменные](https://www.youtube.com/watch?v=pPkw7IQ8lww)
- [Типы данных в Python](https://www.youtube.com/watch?v=DplfLAGY6-o)
`
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
      documentation: `# Ввод и вывод данных в Python

## Функция print() — вывод данных

Функция \`print()\` выводит информацию на экран. Это как "сказать" компьютеру, чтобы он что-то показал.

\`\`\`python
print("Привет, мир!")
print(42)
print(3.14)
\`\`\`

**Результат:**
\`\`\`
Привет, мир!
42
3.14
\`\`\`

### Вывод нескольких значений

Можно вывести несколько значений через запятую:

\`\`\`python
name = "Алия"
age = 15

print("Имя:", name)
print("Возраст:", age)
print(name, "-", age, "лет")
\`\`\`

**Результат:**
\`\`\`
Имя: Алия
Возраст: 15
Алия - 15 лет
\`\`\`

## Функция input() — ввод данных

Функция \`input()\` позволяет пользователю ввести данные с клавиатуры.

\`\`\`python
name = input("Как тебя зовут? ")
print("Привет,", name)
\`\`\`

> **Важно:** \`input()\` всегда возвращает **строку** (текст), даже если ты ввёл число!

### Ввод чисел

Чтобы получить число, нужно преобразовать строку:

\`\`\`python
# Для целых чисел используй int()
age = int(input("Сколько тебе лет? "))

# Для дробных чисел используй float()
height = float(input("Какой у тебя рост? "))
\`\`\`

### Пример программы

\`\`\`python
# Программа-калькулятор
a = int(input("Введите первое число: "))
b = int(input("Введите второе число: "))

summa = a + b
print("Сумма:", summa)
\`\`\`

## f-строки — удобный вывод

f-строки позволяют вставлять переменные прямо в текст:

\`\`\`python
name = "Дамир"
age = 14

# Обычный способ
print("Привет, " + name + "! Тебе " + str(age) + " лет.")

# С помощью f-строки (удобнее!)
print(f"Привет, {name}! Тебе {age} лет.")
\`\`\`

> **Совет:** Перед кавычками ставь букву \`f\`, а переменные пиши в фигурных скобках \`{}\`

## Частые ошибки

\`\`\`python
# Ошибка: складываем строку и число
age = input("Возраст: ")
new_age = age + 1  # Ошибка! age - это строка

# Правильно:
age = int(input("Возраст: "))
new_age = age + 1  # Теперь работает!
\`\`\`

## Важно запомнить

- \`print()\` — выводит данные на экран
- \`input()\` — получает данные от пользователя (всегда строка!)
- \`int()\` — преобразует в целое число
- \`float()\` — преобразует в дробное число
- f-строки: \`f"Текст {переменная}"\`

## Полезные видео

- [Print и Input в Python](https://www.youtube.com/watch?v=BuglYKnd2X4)
- [f-строки в Python](https://www.youtube.com/watch?v=fLpK_JhTt7M)
`
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
      documentation: `# Условные операторы в Python

## Что такое условие?

Условие — это проверка. Компьютер смотрит, выполняется ли условие, и в зависимости от этого делает разные вещи.

> **Пример из жизни:** Если на улице дождь — возьми зонт, иначе — не бери.

## Оператор if (если)

\`\`\`python
age = 16

if age >= 18:
    print("Ты совершеннолетний")
\`\`\`

> **Важно:** После \`if\` обязательно ставь двоеточие \`:\` и делай отступ (4 пробела или Tab)

## Оператор if-else (если-иначе)

\`\`\`python
age = 16

if age >= 18:
    print("Ты совершеннолетний")
else:
    print("Ты несовершеннолетний")
\`\`\`

**Результат:** \`Ты несовершеннолетний\`

## Оператор if-elif-else (несколько условий)

\`elif\` — это сокращение от "else if" (иначе если)

\`\`\`python
score = 75

if score >= 90:
    print("Отлично! Оценка 5")
elif score >= 70:
    print("Хорошо! Оценка 4")
elif score >= 50:
    print("Удовлетворительно. Оценка 3")
else:
    print("Нужно подтянуть знания. Оценка 2")
\`\`\`

**Результат:** \`Хорошо! Оценка 4\`

## Операторы сравнения

| Оператор | Значение | Пример |
|----------|----------|--------|
| \`==\` | Равно | \`a == b\` |
| \`!=\` | Не равно | \`a != b\` |
| \`>\` | Больше | \`a > b\` |
| \`<\` | Меньше | \`a < b\` |
| \`>=\` | Больше или равно | \`a >= b\` |
| \`<=\` | Меньше или равно | \`a <= b\` |

### Примеры

\`\`\`python
a = 10
b = 5

print(a == b)   # False (10 не равно 5)
print(a != b)   # True (10 не равно 5)
print(a > b)    # True (10 больше 5)
print(a < b)    # False (10 не меньше 5)
\`\`\`

## Логические операторы

| Оператор | Значение | Пример |
|----------|----------|--------|
| \`and\` | И (оба условия должны быть True) | \`a > 0 and b > 0\` |
| \`or\` | ИЛИ (хотя бы одно условие True) | \`a > 0 or b > 0\` |
| \`not\` | НЕ (инвертирует условие) | \`not a > 0\` |

### Примеры

\`\`\`python
age = 16
has_ticket = True

# Оба условия должны выполняться
if age >= 12 and has_ticket:
    print("Можешь пройти на фильм")

# Хотя бы одно условие
if age < 7 or age > 65:
    print("Бесплатный проезд")
\`\`\`

## Проверка чётности числа

\`\`\`python
number = int(input("Введите число: "))

if number % 2 == 0:
    print("Число чётное")
else:
    print("Число нечётное")
\`\`\`

> **Подсказка:** Оператор \`%\` даёт остаток от деления. Если \`число % 2 == 0\`, значит число делится на 2 без остатка — оно чётное.

## Частые ошибки

\`\`\`python
# Ошибка: = вместо ==
if age = 18:    # Неправильно!
    print("...")

if age == 18:   # Правильно!
    print("...")

# Ошибка: забыли двоеточие
if age > 18     # Неправильно!
    print("...")

if age > 18:    # Правильно!
    print("...")
\`\`\`

## Важно запомнить

- \`if\` — если условие верно
- \`else\` — иначе (если условие не верно)
- \`elif\` — иначе если (проверить другое условие)
- После условия ставь двоеточие \`:\`
- Код внутри условия должен быть с отступом

## Полезные видео

- [Условные операторы if-else](https://www.youtube.com/watch?v=b6cRVyhVyrI)
- [Логические операторы в Python](https://www.youtube.com/watch?v=XeJOFsLvh_o)
`
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
      documentation: `# Циклы в Python

## Что такое цикл?

Цикл — это способ **повторить** действие несколько раз. Вместо того чтобы писать один и тот же код много раз, мы используем цикл.

> **Пример из жизни:** "Повтори упражнение 10 раз" — это цикл!

## Цикл for — когда знаешь сколько раз

Цикл \`for\` используется, когда ты знаешь, сколько раз нужно повторить действие.

\`\`\`python
# Повторить 5 раз
for i in range(5):
    print("Привет!")
\`\`\`

**Результат:**
\`\`\`
Привет!
Привет!
Привет!
Привет!
Привет!
\`\`\`

### Функция range()

\`range()\` создаёт последовательность чисел:

\`\`\`python
# range(5) = 0, 1, 2, 3, 4
for i in range(5):
    print(i)
\`\`\`

**Результат:** \`0 1 2 3 4\` (каждое число на новой строке)

\`\`\`python
# range(1, 6) = 1, 2, 3, 4, 5
for i in range(1, 6):
    print(i)
\`\`\`

**Результат:** \`1 2 3 4 5\`

\`\`\`python
# range(0, 10, 2) = 0, 2, 4, 6, 8 (шаг 2)
for i in range(0, 10, 2):
    print(i)
\`\`\`

**Результат:** \`0 2 4 6 8\`

## Перебор элементов

С помощью \`for\` можно перебирать элементы списка или строки:

\`\`\`python
# Перебор строки
name = "Python"
for letter in name:
    print(letter)
\`\`\`

\`\`\`python
# Перебор списка
fruits = ["яблоко", "банан", "апельсин"]
for fruit in fruits:
    print(f"Я люблю {fruit}")
\`\`\`

## Цикл while — пока условие верно

Цикл \`while\` повторяется, пока условие истинно (True).

\`\`\`python
count = 1

while count <= 5:
    print(count)
    count = count + 1
\`\`\`

**Результат:** \`1 2 3 4 5\`

> **Важно:** Не забудь изменять условие внутри цикла, иначе цикл будет бесконечным!

### Пример: угадай число

\`\`\`python
secret = 7
guess = 0

while guess != secret:
    guess = int(input("Угадай число от 1 до 10: "))

    if guess < secret:
        print("Больше!")
    elif guess > secret:
        print("Меньше!")

print("Молодец! Ты угадал!")
\`\`\`

## Операторы break и continue

### break — выйти из цикла

\`\`\`python
for i in range(10):
    if i == 5:
        break  # Выходим из цикла
    print(i)
\`\`\`

**Результат:** \`0 1 2 3 4\`

### continue — пропустить итерацию

\`\`\`python
for i in range(5):
    if i == 2:
        continue  # Пропускаем 2
    print(i)
\`\`\`

**Результат:** \`0 1 3 4\`

## Сумма чисел от 1 до N

\`\`\`python
n = int(input("Введите N: "))
summa = 0

for i in range(1, n + 1):
    summa = summa + i

print(f"Сумма чисел от 1 до {n} = {summa}")
\`\`\`

## Таблица умножения

\`\`\`python
num = 7

for i in range(1, 11):
    print(f"{num} x {i} = {num * i}")
\`\`\`

## Важно запомнить

- \`for\` — когда знаешь количество повторений
- \`while\` — когда не знаешь, сколько раз повторять
- \`range(n)\` — числа от 0 до n-1
- \`range(a, b)\` — числа от a до b-1
- \`break\` — выход из цикла
- \`continue\` — пропустить итерацию

## Полезные видео

- [Цикл for в Python](https://www.youtube.com/watch?v=ptn_LB5vLJI)
- [Цикл while в Python](https://www.youtube.com/watch?v=qTY29mKYm_E)
- [break и continue](https://www.youtube.com/watch?v=XAnOfp0Vp1k)
`
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
      documentation: `# Списки в Python

## Что такое список?

Список — это **набор элементов** в одной переменной. Представь, что это коробка, в которой лежит несколько вещей.

> **Пример из жизни:** Список покупок, список учеников в классе, список оценок.

## Создание списка

\`\`\`python
# Пустой список
my_list = []

# Список чисел
numbers = [1, 2, 3, 4, 5]

# Список строк
fruits = ["яблоко", "банан", "апельсин"]

# Смешанный список
mixed = [1, "привет", 3.14, True]
\`\`\`

## Доступ к элементам

Элементы списка нумеруются с **0** (не с 1!):

\`\`\`python
fruits = ["яблоко", "банан", "апельсин"]

print(fruits[0])  # яблоко (первый элемент)
print(fruits[1])  # банан (второй элемент)
print(fruits[2])  # апельсин (третий элемент)
print(fruits[-1]) # апельсин (последний элемент)
\`\`\`

> **Запомни:** Индексация начинается с 0!

## Изменение элементов

\`\`\`python
fruits = ["яблоко", "банан", "апельсин"]

fruits[1] = "груша"
print(fruits)  # ["яблоко", "груша", "апельсин"]
\`\`\`

## Основные методы списков

### Добавление элементов

\`\`\`python
fruits = ["яблоко", "банан"]

# append() — добавить в конец
fruits.append("апельсин")
print(fruits)  # ["яблоко", "банан", "апельсин"]

# insert() — вставить по индексу
fruits.insert(1, "груша")
print(fruits)  # ["яблоко", "груша", "банан", "апельсин"]
\`\`\`

### Удаление элементов

\`\`\`python
fruits = ["яблоко", "банан", "апельсин"]

# remove() — удалить по значению
fruits.remove("банан")
print(fruits)  # ["яблоко", "апельсин"]

# pop() — удалить по индексу
fruits.pop(0)
print(fruits)  # ["апельсин"]
\`\`\`

### Другие полезные методы

\`\`\`python
numbers = [3, 1, 4, 1, 5, 9, 2, 6]

# Длина списка
print(len(numbers))  # 8

# Сортировка
numbers.sort()
print(numbers)  # [1, 1, 2, 3, 4, 5, 6, 9]

# Переворот
numbers.reverse()
print(numbers)  # [9, 6, 5, 4, 3, 2, 1, 1]

# Подсчёт элемента
print(numbers.count(1))  # 2 (единица встречается 2 раза)
\`\`\`

## Перебор списка

\`\`\`python
fruits = ["яблоко", "банан", "апельсин"]

# Перебор элементов
for fruit in fruits:
    print(fruit)

# Перебор с индексом
for i in range(len(fruits)):
    print(f"{i}: {fruits[i]}")
\`\`\`

## Встроенные функции

\`\`\`python
numbers = [3, 1, 4, 1, 5, 9]

print(sum(numbers))   # 23 (сумма)
print(min(numbers))   # 1 (минимум)
print(max(numbers))   # 9 (максимум)
print(len(numbers))   # 6 (длина)
\`\`\`

## Срезы (slices)

Срезы позволяют получить часть списка:

\`\`\`python
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

print(numbers[2:5])   # [2, 3, 4] (с 2 по 4 индекс)
print(numbers[:3])    # [0, 1, 2] (первые 3 элемента)
print(numbers[7:])    # [7, 8, 9] (с 7 индекса до конца)
print(numbers[::2])   # [0, 2, 4, 6, 8] (каждый второй)
\`\`\`

## Ввод списка с клавиатуры

\`\`\`python
# Ввод чисел через пробел: 1 2 3 4 5
line = input("Введите числа через пробел: ")
numbers = line.split()  # ['1', '2', '3', '4', '5']
numbers = list(map(int, numbers))  # [1, 2, 3, 4, 5]

# Или короче:
numbers = list(map(int, input().split()))
\`\`\`

## Пример: найти максимум

\`\`\`python
numbers = [3, 1, 4, 1, 5, 9, 2, 6]

# Способ 1: встроенная функция
print(max(numbers))  # 9

# Способ 2: цикл
maximum = numbers[0]
for num in numbers:
    if num > maximum:
        maximum = num
print(maximum)  # 9
\`\`\`

## Важно запомнить

- Индексы начинаются с 0
- \`append()\` — добавить в конец
- \`remove()\` — удалить по значению
- \`pop()\` — удалить по индексу
- \`len()\` — длина списка
- \`sum()\`, \`min()\`, \`max()\` — сумма, минимум, максимум

## Полезные видео

- [Списки в Python](https://www.youtube.com/watch?v=dYKDL8_ULNY)
- [Методы списков](https://www.youtube.com/watch?v=J2RFvMM-isQ)
- [Срезы списков](https://www.youtube.com/watch?v=ajrtAuDg3yw)
`
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
      documentation: `# Функции в Python

## Что такое функция?

Функция — это **блок кода с именем**, который можно вызывать много раз. Вместо того чтобы копировать один и тот же код, ты создаёшь функцию и вызываешь её когда нужно.

> **Пример из жизни:** Рецепт — это функция. Ты пишешь его один раз, а готовить по нему можешь много раз!

## Зачем нужны функции?

- **Меньше повторений** — не нужно копировать код
- **Проще читать** — код становится понятнее
- **Легче исправлять** — меняешь в одном месте

## Создание функции

Чтобы создать функцию, используй ключевое слово \`def\`:

\`\`\`python
def greet():
    print("Привет!")
    print("Как дела?")

# Вызываем функцию
greet()
greet()
\`\`\`

**Результат:**
\`\`\`
Привет!
Как дела?
Привет!
Как дела?
\`\`\`

## Функции с параметрами

Параметры — это данные, которые функция получает при вызове:

\`\`\`python
def greet(name):
    print(f"Привет, {name}!")

greet("Алия")    # Привет, Алия!
greet("Дамир")   # Привет, Дамир!
\`\`\`

### Несколько параметров

\`\`\`python
def introduce(name, age):
    print(f"Меня зовут {name}, мне {age} лет")

introduce("Алия", 15)
introduce("Дамир", 16)
\`\`\`

## Возврат значения (return)

Функция может **вернуть** результат с помощью \`return\`:

\`\`\`python
def add(a, b):
    result = a + b
    return result

# Сохраняем результат в переменную
summa = add(5, 3)
print(summa)  # 8

# Или сразу выводим
print(add(10, 20))  # 30
\`\`\`

### Примеры полезных функций

\`\`\`python
# Функция для вычисления квадрата числа
def square(n):
    return n * n

print(square(5))   # 25
print(square(12))  # 144


# Функция для проверки чётности
def is_even(n):
    return n % 2 == 0

print(is_even(4))   # True
print(is_even(7))   # False


# Функция для нахождения максимума
def maximum(a, b):
    if a > b:
        return a
    else:
        return b

print(maximum(10, 5))  # 10
\`\`\`

## Параметры по умолчанию

Можно задать значение параметра по умолчанию:

\`\`\`python
def greet(name, greeting="Привет"):
    print(f"{greeting}, {name}!")

greet("Алия")                    # Привет, Алия!
greet("Дамир", "Здравствуй")     # Здравствуй, Дамир!
\`\`\`

## Функция может вызывать другую функцию

\`\`\`python
def square(n):
    return n * n

def sum_of_squares(a, b):
    return square(a) + square(b)

print(sum_of_squares(3, 4))  # 9 + 16 = 25
\`\`\`

## Практические примеры

### Функция для проверки палиндрома

\`\`\`python
def is_palindrome(text):
    # Убираем пробелы и приводим к нижнему регистру
    text = text.lower().replace(" ", "")
    # Сравниваем с перевёрнутой строкой
    return text == text[::-1]

print(is_palindrome("шалаш"))     # True
print(is_palindrome("Python"))    # False
print(is_palindrome("А роза упала на лапу Азора"))  # True
\`\`\`

### Функция для вычисления факториала

\`\`\`python
def factorial(n):
    result = 1
    for i in range(1, n + 1):
        result = result * i
    return result

print(factorial(5))   # 120 (1*2*3*4*5)
print(factorial(4))   # 24 (1*2*3*4)
\`\`\`

## Локальные и глобальные переменные

\`\`\`python
x = 10  # Глобальная переменная

def my_function():
    y = 5  # Локальная переменная (только внутри функции)
    print(x)  # Можем читать глобальную
    print(y)

my_function()
print(x)  # 10 (работает)
# print(y)  # Ошибка! y существует только внутри функции
\`\`\`

## Частые ошибки

\`\`\`python
# Ошибка: забыли скобки при вызове
def greet():
    print("Привет!")

greet    # Неправильно!
greet()  # Правильно!

# Ошибка: забыли return
def add(a, b):
    result = a + b
    # Нет return — функция вернёт None

x = add(5, 3)
print(x)  # None
\`\`\`

## Важно запомнить

- \`def\` — создание функции
- \`return\` — возврат значения
- Параметры — данные, которые функция получает
- Функцию нужно сначала создать, потом вызывать
- Локальные переменные существуют только внутри функции

## Полезные видео

- [Функции в Python для начинающих](https://www.youtube.com/watch?v=3jTtFu8elpY)
- [Параметры и return](https://www.youtube.com/watch?v=EfGVm18QFRE)
- [Области видимости переменных](https://www.youtube.com/watch?v=sAtXyTmWHvw)
`
    },
  ];
}

function getDefaultProblems(): Problem[] {
  return defaultProblemsData;
}
