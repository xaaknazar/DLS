import { promises as fs } from 'fs';
import path from 'path';
import { Student, Teacher, Topic, Problem, Submission, Message, User } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Generic read/write functions
async function readJsonFile<T>(filename: string, defaultValue: T): Promise<T> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return defaultValue;
  }
}

async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// ==================== USERS ====================
export async function getUsers(): Promise<(Student | Teacher)[]> {
  return readJsonFile('users.json', []);
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
  await writeJsonFile('users.json', users);
  return user;
}

export async function updateUser(id: string, updates: Partial<Student | Teacher>): Promise<Student | Teacher | null> {
  const users = await getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return null;
  users[index] = { ...users[index], ...updates } as Student | Teacher;
  await writeJsonFile('users.json', users);
  return users[index];
}

export async function updateStudentPoints(id: string, pointsDelta: number): Promise<Student | null> {
  const users = await getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1 || users[index].role !== 'student') return null;
  const student = users[index] as Student;
  student.points = Math.max(0, student.points + pointsDelta);
  await writeJsonFile('users.json', users);
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

  await writeJsonFile('users.json', users);
  return student;
}

// ==================== TOPICS ====================
export async function getTopics(): Promise<Topic[]> {
  return readJsonFile('topics.json', []);
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
  await writeJsonFile('topics.json', topics);
  return topic;
}

export async function updateTopic(id: string, updates: Partial<Topic>): Promise<Topic | null> {
  const topics = await getTopics();
  const index = topics.findIndex(t => t.id === id);
  if (index === -1) return null;
  topics[index] = { ...topics[index], ...updates };
  await writeJsonFile('topics.json', topics);
  return topics[index];
}

export async function deleteTopic(id: string): Promise<boolean> {
  const topics = await getTopics();
  const filtered = topics.filter(t => t.id !== id);
  if (filtered.length === topics.length) return false;
  await writeJsonFile('topics.json', filtered);
  // Also delete related problems
  const problems = await getProblems();
  await writeJsonFile('problems.json', problems.filter(p => p.topicId !== id));
  return true;
}

// ==================== PROBLEMS ====================
export async function getProblems(): Promise<Problem[]> {
  return readJsonFile('problems.json', []);
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
  await writeJsonFile('problems.json', problems);
  return problem;
}

export async function updateProblem(id: string, updates: Partial<Problem>): Promise<Problem | null> {
  const problems = await getProblems();
  const index = problems.findIndex(p => p.id === id);
  if (index === -1) return null;
  problems[index] = { ...problems[index], ...updates };
  await writeJsonFile('problems.json', problems);
  return problems[index];
}

export async function deleteProblem(id: string): Promise<boolean> {
  const problems = await getProblems();
  const filtered = problems.filter(p => p.id !== id);
  if (filtered.length === problems.length) return false;
  await writeJsonFile('problems.json', filtered);
  return true;
}

// ==================== SUBMISSIONS ====================
export async function getSubmissions(): Promise<Submission[]> {
  return readJsonFile('submissions.json', []);
}

export async function getSubmissionsByStudent(studentId: string): Promise<Submission[]> {
  const submissions = await getSubmissions();
  return submissions.filter(s => s.studentId === studentId).sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );
}

export async function getSubmissionsByProblem(problemId: string): Promise<Submission[]> {
  const submissions = await getSubmissions();
  return submissions.filter(s => s.problemId === problemId);
}

export async function getLatestSubmission(studentId: string, problemId: string): Promise<Submission | null> {
  const submissions = await getSubmissions();
  const filtered = submissions
    .filter(s => s.studentId === studentId && s.problemId === problemId)
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  return filtered[0] || null;
}

export async function createSubmission(submission: Submission): Promise<Submission> {
  const submissions = await getSubmissions();
  submissions.push(submission);
  await writeJsonFile('submissions.json', submissions);
  return submission;
}

// ==================== MESSAGES ====================
export async function getMessages(): Promise<Message[]> {
  return readJsonFile('messages.json', []);
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
  const students = await getStudents();

  const conversationMap = new Map<string, { messages: Message[]; unreadCount: number }>();

  messages.forEach(m => {
    if (m.fromUserId === teacherId || m.toUserId === teacherId) {
      const studentId = m.fromUserId === teacherId ? m.toUserId : m.fromUserId;
      if (!conversationMap.has(studentId)) {
        conversationMap.set(studentId, { messages: [], unreadCount: 0 });
      }
      const conv = conversationMap.get(studentId)!;
      conv.messages.push(m);
      if (m.toUserId === teacherId && !m.isRead) {
        conv.unreadCount++;
      }
    }
  });

  return Array.from(conversationMap.entries())
    .filter(([studentId]) => students.some(s => s.id === studentId))
    .map(([studentId, data]) => ({
      studentId,
      unreadCount: data.unreadCount,
      lastMessage: data.messages.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0] || null
    }))
    .sort((a, b) => {
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime();
    });
}

export async function createMessage(message: Message): Promise<Message> {
  const messages = await getMessages();
  messages.push(message);
  await writeJsonFile('messages.json', messages);
  return message;
}

export async function markMessagesAsRead(userId: string, fromUserId: string): Promise<void> {
  const messages = await getMessages();
  messages.forEach(m => {
    if (m.toUserId === userId && m.fromUserId === fromUserId) {
      m.isRead = true;
    }
  });
  await writeJsonFile('messages.json', messages);
}

// ==================== INITIALIZATION ====================
export async function initializeDatabase(): Promise<void> {
  await ensureDataDir();

  // Check if users exist
  const users = await getUsers();
  if (users.length === 0) {
    // Create default teacher
    const teacher: Teacher = {
      id: 'teacher-1',
      name: 'Учитель Информатики',
      email: 'teacher@school.edu',
      password: 'teacher123', // In production, this should be hashed
      role: 'teacher',
      classes: [7, 8, 9, 10],
      createdAt: new Date(),
    };

    // Create 80 students (20 per grade)
    const students: Student[] = [];
    for (const grade of [7, 8, 9, 10]) {
      for (let i = 1; i <= 20; i++) {
        students.push({
          id: `student-${grade}-${i}`,
          name: `Ученик ${grade}-${i}`,
          email: `student${grade}_${i}@school.edu`,
          password: 'student123',
          role: 'student',
          grade,
          completedProblems: [],
          points: 0,
          achievements: [],
          streakDays: 0,
          lastActiveAt: new Date(),
          createdAt: new Date('2024-09-01'),
        });
      }
    }

    await writeJsonFile('users.json', [teacher, ...students]);
  }

  // Initialize topics if empty
  const topics = await getTopics();
  if (topics.length === 0) {
    await writeJsonFile('topics.json', getDefaultTopics());
  }

  // Initialize problems if empty
  const problems = await getProblems();
  if (problems.length === 0) {
    await writeJsonFile('problems.json', getDefaultProblems());
  }
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
      documentation: `# Переменные в Python

## Что такое переменная?

Переменная — это именованная область памяти, которая хранит данные.

## Создание переменных

\`\`\`python
name = "Иван"
age = 15
height = 1.75
is_student = True
\`\`\`

## Типы данных

- **str** — строки
- **int** — целые числа
- **float** — дробные числа
- **bool** — логические значения (True/False)
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
      documentation: `# Ввод и вывод в Python

## Вывод данных - print()

\`\`\`python
print("Привет, мир!")
print("Меня зовут", name)
\`\`\`

## Ввод данных - input()

\`\`\`python
name = input("Как тебя зовут? ")
age = int(input("Сколько тебе лет? "))
\`\`\`
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
      documentation: `# Условные операторы

## if, elif, else

\`\`\`python
age = 18

if age < 18:
    print("Несовершеннолетний")
elif age == 18:
    print("Только исполнилось 18!")
else:
    print("Совершеннолетний")
\`\`\`

## Операторы сравнения

- \`==\` — равно
- \`!=\` — не равно
- \`<\`, \`>\` — меньше, больше
- \`<=\`, \`>=\` — меньше или равно, больше или равно
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

## Цикл for

\`\`\`python
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

for letter in "Python":
    print(letter)
\`\`\`

## Цикл while

\`\`\`python
count = 0
while count < 5:
    print(count)
    count += 1
\`\`\`
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

## Создание списка

\`\`\`python
numbers = [1, 2, 3, 4, 5]
names = ["Анна", "Борис", "Вика"]
mixed = [1, "два", 3.0, True]
\`\`\`

## Операции со списками

\`\`\`python
numbers.append(6)     # Добавить элемент
numbers.remove(3)     # Удалить элемент
print(numbers[0])     # Первый элемент
print(len(numbers))   # Длина списка
\`\`\`
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

## Создание функции

\`\`\`python
def greet(name):
    return f"Привет, {name}!"

message = greet("Мир")
print(message)
\`\`\`

## Функция с несколькими параметрами

\`\`\`python
def add(a, b):
    return a + b

result = add(5, 3)
\`\`\`
`
    },
    {
      id: 'strings',
      title: 'Strings',
      titleRu: 'Строки',
      description: 'Learn about string operations',
      descriptionRu: 'Изучение операций со строками',
      order: 7,
      icon: 'Type',
      color: 'cyan',
      grades: [9, 10],
      problemIds: ['str-1', 'str-2'],
      documentation: `# Строки в Python

## Методы строк

\`\`\`python
text = "  Привет, Python!  "
print(text.upper())      # ПРИВЕТ, PYTHON!
print(text.lower())      # привет, python!
print(text.strip())      # Привет, Python!
print(text.replace("Python", "Мир"))
\`\`\`

## Срезы строк

\`\`\`python
text = "Python"
print(text[0])      # P
print(text[-1])     # n
print(text[0:3])    # Pyt
print(text[::-1])   # nohtyP
\`\`\`
`
    },
    {
      id: 'dictionaries',
      title: 'Dictionaries',
      titleRu: 'Словари',
      description: 'Learn about dictionaries',
      descriptionRu: 'Изучение словарей',
      order: 8,
      icon: 'Book',
      color: 'red',
      grades: [9, 10],
      problemIds: ['dict-1'],
      documentation: `# Словари в Python

## Создание словаря

\`\`\`python
student = {
    "name": "Иван",
    "age": 15,
    "grade": 9
}
\`\`\`

## Работа со словарём

\`\`\`python
print(student["name"])      # Иван
student["city"] = "Москва"  # Добавить
del student["age"]          # Удалить
\`\`\`
`
    },
    {
      id: 'classes',
      title: 'Classes',
      titleRu: 'Классы',
      description: 'Learn about OOP and classes',
      descriptionRu: 'Изучение ООП и классов',
      order: 9,
      icon: 'Box',
      color: 'indigo',
      grades: [10],
      problemIds: ['class-1'],
      documentation: `# Классы в Python

## Создание класса

\`\`\`python
class Student:
    def __init__(self, name, grade):
        self.name = name
        self.grade = grade

    def introduce(self):
        return f"Я {self.name}, {self.grade} класс"

student = Student("Иван", 10)
print(student.introduce())
\`\`\`
`
    },
  ];
}

function getDefaultProblems(): Problem[] {
  return [
    // Variables
    {
      id: 'var-1',
      topicId: 'variables',
      title: 'First Variable',
      titleRu: 'Первая переменная',
      description: 'Create a variable',
      descriptionRu: 'Создайте переменную name со своим именем и выведите её.',
      difficulty: 'easy',
      points: 10,
      order: 1,
      grades: [7, 8, 9, 10],
      starterCode: '# Создайте переменную name и выведите её\n',
      solution: 'name = "Иван"\nprint(name)',
      hints: ['Используйте знак = для присваивания', 'Строки пишутся в кавычках'],
      testCases: [
        { id: 'tc1', input: '', expectedOutput: '', isHidden: false, description: 'Программа должна что-то вывести' }
      ]
    },
    {
      id: 'var-2',
      topicId: 'variables',
      title: 'Sum of Numbers',
      titleRu: 'Сумма чисел',
      description: 'Calculate sum',
      descriptionRu: 'Создайте две переменные a=5 и b=3, выведите их сумму.',
      difficulty: 'easy',
      points: 10,
      order: 2,
      grades: [7, 8, 9, 10],
      starterCode: '# Создайте переменные a и b, выведите их сумму\n',
      solution: 'a = 5\nb = 3\nprint(a + b)',
      hints: ['a + b даст сумму'],
      testCases: [
        { id: 'tc1', input: '', expectedOutput: '8', isHidden: false, description: 'Должно вывести 8' }
      ]
    },
    {
      id: 'var-3',
      topicId: 'variables',
      title: 'Data Types',
      titleRu: 'Типы данных',
      description: 'Work with different types',
      descriptionRu: 'Создайте переменные: age (целое число 15), height (дробное 1.75), name (строка). Выведите их типы.',
      difficulty: 'medium',
      points: 15,
      order: 3,
      grades: [7, 8, 9, 10],
      starterCode: '# Создайте переменные и выведите их типы с помощью type()\n',
      solution: 'age = 15\nheight = 1.75\nname = "Иван"\nprint(type(age))\nprint(type(height))\nprint(type(name))',
      hints: ['Функция type() возвращает тип переменной'],
      testCases: [
        { id: 'tc1', input: '', expectedOutput: "<class 'int'>\n<class 'float'>\n<class 'str'>", isHidden: false }
      ]
    },
    // Input/Output
    {
      id: 'io-1',
      topicId: 'input-output',
      title: 'Hello User',
      titleRu: 'Привет, пользователь',
      description: 'Greet the user',
      descriptionRu: 'Считайте имя пользователя и выведите "Привет, {имя}!"',
      difficulty: 'easy',
      points: 10,
      order: 1,
      grades: [7, 8, 9, 10],
      starterCode: '# Считайте имя и поприветствуйте\nname = input()\n',
      solution: 'name = input()\nprint(f"Привет, {name}!")',
      hints: ['Используйте f-строку или конкатенацию'],
      testCases: [
        { id: 'tc1', input: 'Иван', expectedOutput: 'Привет, Иван!', isHidden: false },
        { id: 'tc2', input: 'Мария', expectedOutput: 'Привет, Мария!', isHidden: false }
      ]
    },
    {
      id: 'io-2',
      topicId: 'input-output',
      title: 'Sum Input',
      titleRu: 'Сумма введённых чисел',
      description: 'Sum two input numbers',
      descriptionRu: 'Считайте два числа и выведите их сумму.',
      difficulty: 'easy',
      points: 10,
      order: 2,
      grades: [7, 8, 9, 10],
      starterCode: '# Считайте два числа и выведите сумму\n',
      solution: 'a = int(input())\nb = int(input())\nprint(a + b)',
      hints: ['Не забудьте преобразовать в int()'],
      testCases: [
        { id: 'tc1', input: '5\n3', expectedOutput: '8', isHidden: false },
        { id: 'tc2', input: '10\n20', expectedOutput: '30', isHidden: false }
      ]
    },
    // Conditions
    {
      id: 'cond-1',
      topicId: 'conditions',
      title: 'Even or Odd',
      titleRu: 'Чётное или нечётное',
      description: 'Check if number is even',
      descriptionRu: 'Считайте число и выведите "Чётное" или "Нечётное".',
      difficulty: 'easy',
      points: 10,
      order: 1,
      grades: [7, 8, 9, 10],
      starterCode: '# Определите чётность числа\nn = int(input())\n',
      solution: 'n = int(input())\nif n % 2 == 0:\n    print("Чётное")\nelse:\n    print("Нечётное")',
      hints: ['Используйте оператор % (остаток от деления)'],
      testCases: [
        { id: 'tc1', input: '4', expectedOutput: 'Чётное', isHidden: false },
        { id: 'tc2', input: '7', expectedOutput: 'Нечётное', isHidden: false }
      ]
    },
    {
      id: 'cond-2',
      topicId: 'conditions',
      title: 'Max of Three',
      titleRu: 'Максимум из трёх',
      description: 'Find maximum of three numbers',
      descriptionRu: 'Считайте три числа и выведите наибольшее.',
      difficulty: 'medium',
      points: 15,
      order: 2,
      grades: [7, 8, 9, 10],
      starterCode: '# Найдите максимум из трёх чисел\n',
      solution: 'a = int(input())\nb = int(input())\nc = int(input())\nprint(max(a, b, c))',
      hints: ['Можно использовать функцию max()'],
      testCases: [
        { id: 'tc1', input: '1\n5\n3', expectedOutput: '5', isHidden: false },
        { id: 'tc2', input: '10\n10\n5', expectedOutput: '10', isHidden: false }
      ]
    },
    // Loops
    {
      id: 'loop-1',
      topicId: 'loops',
      title: 'Count to N',
      titleRu: 'Счёт до N',
      description: 'Count from 1 to N',
      descriptionRu: 'Считайте число N и выведите числа от 1 до N через пробел.',
      difficulty: 'easy',
      points: 10,
      order: 1,
      grades: [7, 8, 9, 10],
      starterCode: '# Выведите числа от 1 до N\nn = int(input())\n',
      solution: 'n = int(input())\nprint(" ".join(str(i) for i in range(1, n + 1)))',
      hints: ['range(1, n+1) даёт числа от 1 до n'],
      testCases: [
        { id: 'tc1', input: '5', expectedOutput: '1 2 3 4 5', isHidden: false },
        { id: 'tc2', input: '3', expectedOutput: '1 2 3', isHidden: false }
      ]
    },
    {
      id: 'loop-2',
      topicId: 'loops',
      title: 'Sum 1 to N',
      titleRu: 'Сумма от 1 до N',
      description: 'Sum numbers from 1 to N',
      descriptionRu: 'Считайте число N и выведите сумму чисел от 1 до N.',
      difficulty: 'easy',
      points: 10,
      order: 2,
      grades: [7, 8, 9, 10],
      starterCode: '# Найдите сумму от 1 до N\nn = int(input())\n',
      solution: 'n = int(input())\nprint(sum(range(1, n + 1)))',
      hints: ['Можно использовать цикл for или формулу n*(n+1)/2'],
      testCases: [
        { id: 'tc1', input: '5', expectedOutput: '15', isHidden: false },
        { id: 'tc2', input: '10', expectedOutput: '55', isHidden: false }
      ]
    },
    // Lists
    {
      id: 'list-1',
      topicId: 'lists',
      title: 'List Sum',
      titleRu: 'Сумма списка',
      description: 'Sum of list elements',
      descriptionRu: 'Считайте N чисел и выведите их сумму.',
      difficulty: 'easy',
      points: 10,
      order: 1,
      grades: [8, 9, 10],
      starterCode: '# Считайте числа и найдите сумму\nn = int(input())\n',
      solution: 'n = int(input())\nnumbers = [int(input()) for _ in range(n)]\nprint(sum(numbers))',
      hints: ['Можно использовать list comprehension'],
      testCases: [
        { id: 'tc1', input: '3\n1\n2\n3', expectedOutput: '6', isHidden: false },
        { id: 'tc2', input: '4\n10\n20\n30\n40', expectedOutput: '100', isHidden: false }
      ]
    },
    {
      id: 'list-2',
      topicId: 'lists',
      title: 'List Reverse',
      titleRu: 'Разворот списка',
      description: 'Reverse a list',
      descriptionRu: 'Считайте N чисел и выведите их в обратном порядке.',
      difficulty: 'medium',
      points: 15,
      order: 2,
      grades: [8, 9, 10],
      starterCode: '# Считайте числа и выведите в обратном порядке\n',
      solution: 'n = int(input())\nnumbers = [int(input()) for _ in range(n)]\nprint(" ".join(map(str, numbers[::-1])))',
      hints: ['[::-1] разворачивает список'],
      testCases: [
        { id: 'tc1', input: '3\n1\n2\n3', expectedOutput: '3 2 1', isHidden: false }
      ]
    },
    // Functions
    {
      id: 'func-1',
      topicId: 'functions',
      title: 'Square Function',
      titleRu: 'Функция квадрата',
      description: 'Create a square function',
      descriptionRu: 'Создайте функцию square(n), которая возвращает квадрат числа. Считайте число и выведите его квадрат.',
      difficulty: 'easy',
      points: 10,
      order: 1,
      grades: [8, 9, 10],
      starterCode: '# Создайте функцию square\ndef square(n):\n    pass  # ваш код\n\nn = int(input())\nprint(square(n))',
      solution: 'def square(n):\n    return n * n\n\nn = int(input())\nprint(square(n))',
      hints: ['return возвращает значение из функции'],
      testCases: [
        { id: 'tc1', input: '5', expectedOutput: '25', isHidden: false },
        { id: 'tc2', input: '3', expectedOutput: '9', isHidden: false }
      ]
    },
    {
      id: 'func-2',
      topicId: 'functions',
      title: 'Factorial',
      titleRu: 'Факториал',
      description: 'Calculate factorial',
      descriptionRu: 'Создайте функцию factorial(n), которая вычисляет факториал. Выведите factorial(n).',
      difficulty: 'medium',
      points: 20,
      order: 2,
      grades: [8, 9, 10],
      starterCode: '# Создайте функцию factorial\ndef factorial(n):\n    pass  # ваш код\n\nn = int(input())\nprint(factorial(n))',
      solution: 'def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\nn = int(input())\nprint(factorial(n))',
      hints: ['Факториал: n! = n * (n-1) * ... * 1', '0! = 1'],
      testCases: [
        { id: 'tc1', input: '5', expectedOutput: '120', isHidden: false },
        { id: 'tc2', input: '0', expectedOutput: '1', isHidden: false }
      ]
    },
    // Strings
    {
      id: 'str-1',
      topicId: 'strings',
      title: 'Palindrome',
      titleRu: 'Палиндром',
      description: 'Check if string is palindrome',
      descriptionRu: 'Проверьте, является ли строка палиндромом. Выведите "YES" или "NO".',
      difficulty: 'medium',
      points: 15,
      order: 1,
      grades: [9, 10],
      starterCode: '# Проверьте палиндром\ns = input()\n',
      solution: 's = input()\nprint("YES" if s == s[::-1] else "NO")',
      hints: ['Палиндром читается одинаково слева направо и справа налево'],
      testCases: [
        { id: 'tc1', input: 'abcba', expectedOutput: 'YES', isHidden: false },
        { id: 'tc2', input: 'hello', expectedOutput: 'NO', isHidden: false }
      ]
    },
    {
      id: 'str-2',
      topicId: 'strings',
      title: 'Word Count',
      titleRu: 'Количество слов',
      description: 'Count words in string',
      descriptionRu: 'Посчитайте количество слов в строке.',
      difficulty: 'easy',
      points: 10,
      order: 2,
      grades: [9, 10],
      starterCode: '# Посчитайте слова\ns = input()\n',
      solution: 's = input()\nprint(len(s.split()))',
      hints: ['split() разбивает строку по пробелам'],
      testCases: [
        { id: 'tc1', input: 'Привет мир', expectedOutput: '2', isHidden: false },
        { id: 'tc2', input: 'Один', expectedOutput: '1', isHidden: false }
      ]
    },
    // Dictionaries
    {
      id: 'dict-1',
      topicId: 'dictionaries',
      title: 'Word Frequency',
      titleRu: 'Частота слов',
      description: 'Count word frequency',
      descriptionRu: 'Посчитайте, сколько раз встречается каждое слово. Выведите в формате "слово: количество".',
      difficulty: 'hard',
      points: 25,
      order: 1,
      grades: [9, 10],
      starterCode: '# Посчитайте частоту слов\ntext = input()\n',
      solution: 'text = input()\nwords = text.split()\nfreq = {}\nfor word in words:\n    freq[word] = freq.get(word, 0) + 1\nfor word, count in sorted(freq.items()):\n    print(f"{word}: {count}")',
      hints: ['dict.get(key, default) возвращает значение или default'],
      testCases: [
        { id: 'tc1', input: 'a b a', expectedOutput: 'a: 2\nb: 1', isHidden: false }
      ]
    },
    // Classes
    {
      id: 'class-1',
      topicId: 'classes',
      title: 'Rectangle Class',
      titleRu: 'Класс Прямоугольник',
      description: 'Create Rectangle class',
      descriptionRu: 'Создайте класс Rectangle с методами area() и perimeter(). Считайте ширину и высоту, выведите площадь и периметр.',
      difficulty: 'hard',
      points: 30,
      order: 1,
      grades: [10],
      starterCode: '# Создайте класс Rectangle\nclass Rectangle:\n    pass  # ваш код\n\nw = int(input())\nh = int(input())\nrect = Rectangle(w, h)\nprint(rect.area())\nprint(rect.perimeter())',
      solution: 'class Rectangle:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n    \n    def area(self):\n        return self.width * self.height\n    \n    def perimeter(self):\n        return 2 * (self.width + self.height)\n\nw = int(input())\nh = int(input())\nrect = Rectangle(w, h)\nprint(rect.area())\nprint(rect.perimeter())',
      hints: ['__init__ - конструктор класса', 'self - ссылка на экземпляр'],
      testCases: [
        { id: 'tc1', input: '5\n3', expectedOutput: '15\n16', isHidden: false },
        { id: 'tc2', input: '4\n4', expectedOutput: '16\n16', isHidden: false }
      ]
    }
  ];
}
