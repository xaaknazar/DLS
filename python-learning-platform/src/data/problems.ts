import { Problem } from '@/types';

export const problems: Problem[] = [
  // Переменные - 7 класс
  {
    id: 'var-1',
    topicId: 'variables-7',
    title: 'Hello Variable',
    titleRu: 'Привет, переменная',
    description: 'Create a variable called `message` with value "Hello, World!" and print it',
    descriptionRu: 'Создайте переменную `message` со значением "Hello, World!" и выведите её',
    difficulty: 'easy',
    points: 10,
    order: 1,
    grades: [7],
    starterCode: '# Создайте переменную message и выведите её\n',
    solution: 'message = "Hello, World!"\nprint(message)',
    hints: ['Используйте оператор = для присваивания', 'Строки заключаются в кавычки'],
    testCases: [
      { id: 'tc1', input: '', expectedOutput: 'Hello, World!', isHidden: false, description: 'Вывод Hello, World!' }
    ]
  },
  {
    id: 'var-2',
    topicId: 'variables-7',
    title: 'Sum Two Numbers',
    titleRu: 'Сумма двух чисел',
    description: 'Read two numbers and print their sum',
    descriptionRu: 'Прочитайте два числа и выведите их сумму',
    difficulty: 'easy',
    points: 10,
    order: 2,
    grades: [7],
    starterCode: '# Прочитайте два числа a и b, выведите их сумму\n',
    solution: 'a = int(input())\nb = int(input())\nprint(a + b)',
    hints: ['input() возвращает строку', 'Используйте int() для преобразования'],
    testCases: [
      { id: 'tc1', input: '5\n3', expectedOutput: '8', isHidden: false },
      { id: 'tc2', input: '10\n20', expectedOutput: '30', isHidden: false },
      { id: 'tc3', input: '-5\n5', expectedOutput: '0', isHidden: true }
    ]
  },
  {
    id: 'var-3',
    topicId: 'variables-7',
    title: 'Swap Variables',
    titleRu: 'Обмен переменных',
    description: 'Read two values and print them in reverse order',
    descriptionRu: 'Прочитайте два значения и выведите их в обратном порядке',
    difficulty: 'easy',
    points: 15,
    order: 3,
    grades: [7],
    starterCode: '# Прочитайте a и b, выведите сначала b, потом a\n',
    solution: 'a = input()\nb = input()\nprint(b)\nprint(a)',
    hints: ['Можно просто вывести в нужном порядке', 'Или использовать обмен: a, b = b, a'],
    testCases: [
      { id: 'tc1', input: 'hello\nworld', expectedOutput: 'world\nhello', isHidden: false },
      { id: 'tc2', input: '1\n2', expectedOutput: '2\n1', isHidden: false }
    ]
  },
  {
    id: 'var-4',
    topicId: 'variables-7',
    title: 'Rectangle Area',
    titleRu: 'Площадь прямоугольника',
    description: 'Calculate rectangle area given width and height',
    descriptionRu: 'Вычислите площадь прямоугольника по ширине и высоте',
    difficulty: 'easy',
    points: 15,
    order: 4,
    grades: [7],
    starterCode: '# Прочитайте ширину и высоту, выведите площадь\n',
    solution: 'width = int(input())\nheight = int(input())\narea = width * height\nprint(area)',
    hints: ['Площадь = ширина × высота'],
    testCases: [
      { id: 'tc1', input: '5\n3', expectedOutput: '15', isHidden: false },
      { id: 'tc2', input: '10\n10', expectedOutput: '100', isHidden: false },
      { id: 'tc3', input: '7\n8', expectedOutput: '56', isHidden: true }
    ]
  },
  {
    id: 'var-5',
    topicId: 'variables-7',
    title: 'Celsius to Fahrenheit',
    titleRu: 'Цельсий в Фаренгейт',
    description: 'Convert temperature from Celsius to Fahrenheit',
    descriptionRu: 'Напишите программу, которая переводит температуру из градусов Цельсия в градусы Фаренгейта. Формула перевода: F = C × 9/5 + 32. Например, 0°C = 32°F, а 100°C = 212°F.',
    difficulty: 'medium',
    points: 50,
    order: 5,
    grades: [7],
    starterCode: '# F = C * 9/5 + 32\n# Прочитайте температуру в Цельсиях, выведите в Фаренгейтах\n',
    solution: 'c = float(input())\nf = c * 9/5 + 32\nprint(f)',
    hints: ['Формула: F = C × 9/5 + 32', 'Используйте float для дробных чисел'],
    testCases: [
      { id: 'tc1', input: '0', expectedOutput: '32.0', isHidden: false, description: 'Точка замерзания воды' },
      { id: 'tc2', input: '100', expectedOutput: '212.0', isHidden: false, description: 'Точка кипения воды' },
      { id: 'tc3', input: '-40', expectedOutput: '-40.0', isHidden: true, description: 'Точка совпадения шкал' },
      { id: 'tc4', input: '37', expectedOutput: '98.6', isHidden: true, description: 'Температура тела' },
      { id: 'tc5', input: '25', expectedOutput: '77.0', isHidden: true, description: 'Комнатная температура' }
    ]
  },
  {
    id: 'var-6',
    topicId: 'variables-7',
    title: 'Last Digit',
    titleRu: 'Последняя цифра',
    description: 'Find the last digit of a number',
    descriptionRu: 'Найдите последнюю цифру числа',
    difficulty: 'easy',
    points: 15,
    order: 6,
    grades: [7],
    starterCode: '# Прочитайте число, выведите его последнюю цифру\n',
    solution: 'n = int(input())\nprint(n % 10)',
    hints: ['Остаток от деления на 10 даёт последнюю цифру'],
    testCases: [
      { id: 'tc1', input: '123', expectedOutput: '3', isHidden: false },
      { id: 'tc2', input: '7890', expectedOutput: '0', isHidden: false },
      { id: 'tc3', input: '5', expectedOutput: '5', isHidden: true }
    ]
  },
  {
    id: 'var-7',
    topicId: 'variables-7',
    title: 'Digit Sum',
    titleRu: 'Сумма цифр двузначного',
    description: 'Find sum of digits of a two-digit number',
    descriptionRu: 'Дано двузначное число (от 10 до 99). Найдите сумму его цифр. Например, для числа 23 ответ будет 2 + 3 = 5. Подсказка: чтобы получить первую цифру, разделите число на 10 нацело (//), а чтобы получить вторую — возьмите остаток от деления на 10 (%).',
    difficulty: 'medium',
    points: 50,
    order: 7,
    grades: [7],
    starterCode: '# Прочитайте двузначное число, выведите сумму его цифр\n',
    solution: 'n = int(input())\nprint(n // 10 + n % 10)',
    hints: ['// даёт целую часть от деления', '% даёт остаток от деления'],
    testCases: [
      { id: 'tc1', input: '23', expectedOutput: '5', isHidden: false, description: 'Обычное число' },
      { id: 'tc2', input: '99', expectedOutput: '18', isHidden: false, description: 'Максимальная сумма' },
      { id: 'tc3', input: '10', expectedOutput: '1', isHidden: true, description: 'Минимальное двузначное' },
      { id: 'tc4', input: '55', expectedOutput: '10', isHidden: true, description: 'Одинаковые цифры' },
      { id: 'tc5', input: '48', expectedOutput: '12', isHidden: true, description: 'Случайное число' }
    ]
  },
  {
    id: 'var-8',
    topicId: 'variables-7',
    title: 'Time Conversion',
    titleRu: 'Преобразование времени',
    description: 'Convert seconds to hours, minutes and seconds',
    descriptionRu: 'Дано количество секунд. Переведите его в часы, минуты и секунды. Выведите результат в формате Ч:М:С. Например, 3661 секунда = 1 час, 1 минута и 1 секунда, то есть 1:1:1. Помните: в 1 часе 3600 секунд, в 1 минуте 60 секунд.',
    difficulty: 'medium',
    points: 50,
    order: 8,
    grades: [7],
    starterCode: '# Прочитайте количество секунд\n# Выведите в формате: H:M:S\n',
    solution: 's = int(input())\nh = s // 3600\nm = (s % 3600) // 60\nsec = s % 60\nprint(f"{h}:{m}:{sec}")',
    hints: ['В часе 3600 секунд', 'В минуте 60 секунд'],
    testCases: [
      { id: 'tc1', input: '3661', expectedOutput: '1:1:1', isHidden: false, description: '1 час 1 мин 1 сек' },
      { id: 'tc2', input: '7200', expectedOutput: '2:0:0', isHidden: false, description: 'Ровно 2 часа' },
      { id: 'tc3', input: '90', expectedOutput: '0:1:30', isHidden: true, description: 'Полторы минуты' },
      { id: 'tc4', input: '0', expectedOutput: '0:0:0', isHidden: true, description: 'Ноль секунд' },
      { id: 'tc5', input: '86399', expectedOutput: '23:59:59', isHidden: true, description: 'Почти сутки' }
    ]
  },
  {
    id: 'var-9',
    topicId: 'variables-7',
    title: 'Circle Calculations',
    titleRu: 'Вычисления круга',
    description: 'Calculate circle area and circumference',
    descriptionRu: 'Дан радиус круга. Вычислите его площадь и длину окружности. Используйте π = 3.14159. Формулы: Площадь = π × r², Длина окружности = 2 × π × r. Результаты округлите до 2 знаков после запятой с помощью round(число, 2).',
    difficulty: 'medium',
    points: 50,
    order: 9,
    grades: [7],
    starterCode: '# Прочитайте радиус, выведите площадь и длину окружности\n# Используйте pi = 3.14159\n',
    solution: 'r = float(input())\npi = 3.14159\narea = pi * r ** 2\ncirc = 2 * pi * r\nprint(round(area, 2))\nprint(round(circ, 2))',
    hints: ['Площадь = π × r²', 'Длина окружности = 2 × π × r'],
    testCases: [
      { id: 'tc1', input: '1', expectedOutput: '3.14\n6.28', isHidden: false, description: 'Единичный радиус' },
      { id: 'tc2', input: '5', expectedOutput: '78.54\n31.42', isHidden: false, description: 'Радиус 5' },
      { id: 'tc3', input: '10', expectedOutput: '314.16\n62.83', isHidden: true, description: 'Радиус 10' },
      { id: 'tc4', input: '2.5', expectedOutput: '19.63\n15.71', isHidden: true, description: 'Дробный радиус' }
    ]
  },
  {
    id: 'var-10',
    topicId: 'variables-7',
    title: 'BMI Calculator',
    titleRu: 'Калькулятор ИМТ',
    description: 'Calculate Body Mass Index',
    descriptionRu: 'Индекс массы тела (ИМТ) помогает определить, соответствует ли вес человека его росту. Формула: ИМТ = вес (кг) / рост² (м²). Напишите программу, которая читает вес и рост, а затем выводит ИМТ, округлённый до 1 знака после запятой. Нормальный ИМТ: 18.5-25.',
    difficulty: 'hard',
    points: 100,
    order: 10,
    grades: [7],
    starterCode: '# Прочитайте вес (кг) и рост (м)\n# Выведите ИМТ округлённый до 1 знака\n# ИМТ = вес / рост²\n',
    solution: 'weight = float(input())\nheight = float(input())\nbmi = weight / (height ** 2)\nprint(round(bmi, 1))',
    hints: ['ИМТ = вес / рост²', 'Используйте round(x, 1) для округления'],
    testCases: [
      { id: 'tc1', input: '70\n1.75', expectedOutput: '22.9', isHidden: false, description: 'Нормальный вес' },
      { id: 'tc2', input: '80\n1.8', expectedOutput: '24.7', isHidden: false, description: 'Верхняя граница нормы' },
      { id: 'tc3', input: '50\n1.6', expectedOutput: '19.5', isHidden: true, description: 'Худощавый человек' },
      { id: 'tc4', input: '100\n1.9', expectedOutput: '27.7', isHidden: true, description: 'Избыточный вес' },
      { id: 'tc5', input: '60\n1.7', expectedOutput: '20.8', isHidden: true, description: 'Средние значения' }
    ]
  },

  // Условия - 8 класс
  {
    id: 'cond-1',
    topicId: 'conditions-8',
    title: 'Even or Odd',
    titleRu: 'Чётное или нечётное',
    description: 'Check if a number is even or odd',
    descriptionRu: 'Проверьте, является ли число чётным или нечётным',
    difficulty: 'easy',
    points: 10,
    order: 1,
    grades: [8],
    starterCode: '# Прочитайте число\n# Выведите "even" если чётное, "odd" если нечётное\n',
    solution: 'n = int(input())\nif n % 2 == 0:\n    print("even")\nelse:\n    print("odd")',
    hints: ['Чётное число делится на 2 без остатка'],
    testCases: [
      { id: 'tc1', input: '4', expectedOutput: 'even', isHidden: false },
      { id: 'tc2', input: '7', expectedOutput: 'odd', isHidden: false },
      { id: 'tc3', input: '0', expectedOutput: 'even', isHidden: true }
    ]
  },
  {
    id: 'cond-2',
    topicId: 'conditions-8',
    title: 'Maximum of Two',
    titleRu: 'Максимум из двух',
    description: 'Find the maximum of two numbers',
    descriptionRu: 'Найдите максимум из двух чисел',
    difficulty: 'easy',
    points: 10,
    order: 2,
    grades: [8],
    starterCode: '# Прочитайте два числа, выведите большее\n',
    solution: 'a = int(input())\nb = int(input())\nif a > b:\n    print(a)\nelse:\n    print(b)',
    hints: ['Сравните числа с помощью >'],
    testCases: [
      { id: 'tc1', input: '5\n3', expectedOutput: '5', isHidden: false },
      { id: 'tc2', input: '10\n20', expectedOutput: '20', isHidden: false },
      { id: 'tc3', input: '7\n7', expectedOutput: '7', isHidden: true }
    ]
  },
  {
    id: 'cond-3',
    topicId: 'conditions-8',
    title: 'Grade Calculator',
    titleRu: 'Калькулятор оценок',
    description: 'Convert score to grade (A/B/C/D/F)',
    descriptionRu: 'Дан балл от 0 до 100. Определите оценку по американской системе: A (90-100 баллов) - отлично, B (80-89) - хорошо, C (70-79) - удовлетворительно, D (60-69) - плохо, F (менее 60) - неудовлетворительно. Используйте конструкцию if-elif-else.',
    difficulty: 'medium',
    points: 50,
    order: 3,
    grades: [8],
    starterCode: '# 90-100: A, 80-89: B, 70-79: C, 60-69: D, <60: F\n',
    solution: 'score = int(input())\nif score >= 90:\n    print("A")\nelif score >= 80:\n    print("B")\nelif score >= 70:\n    print("C")\nelif score >= 60:\n    print("D")\nelse:\n    print("F")',
    hints: ['Используйте elif для множественных условий'],
    testCases: [
      { id: 'tc1', input: '95', expectedOutput: 'A', isHidden: false, description: 'Отлично' },
      { id: 'tc2', input: '73', expectedOutput: 'C', isHidden: false, description: 'Удовлетворительно' },
      { id: 'tc3', input: '59', expectedOutput: 'F', isHidden: true, description: 'Не сдал' },
      { id: 'tc4', input: '90', expectedOutput: 'A', isHidden: true, description: 'Граница A' },
      { id: 'tc5', input: '80', expectedOutput: 'B', isHidden: true, description: 'Граница B' },
      { id: 'tc6', input: '0', expectedOutput: 'F', isHidden: true, description: 'Ноль баллов' }
    ]
  },
  {
    id: 'cond-4',
    topicId: 'conditions-8',
    title: 'Leap Year',
    titleRu: 'Високосный год',
    description: 'Check if a year is a leap year',
    descriptionRu: 'Год является високосным, если он: 1) делится на 4, но НЕ делится на 100, ИЛИ 2) делится на 400. Например: 2000 — високосный (делится на 400), 1900 — не високосный (делится на 100, но не на 400), 2024 — високосный (делится на 4, но не на 100). Выведите "yes" или "no".',
    difficulty: 'medium',
    points: 50,
    order: 4,
    grades: [8],
    starterCode: '# Год високосный если:\n# делится на 4, но не на 100\n# ИЛИ делится на 400\n',
    solution: 'year = int(input())\nif (year % 4 == 0 and year % 100 != 0) or year % 400 == 0:\n    print("yes")\nelse:\n    print("no")',
    hints: ['Используйте and и or для сложных условий'],
    testCases: [
      { id: 'tc1', input: '2000', expectedOutput: 'yes', isHidden: false, description: 'Делится на 400' },
      { id: 'tc2', input: '1900', expectedOutput: 'no', isHidden: false, description: 'Делится на 100, но не на 400' },
      { id: 'tc3', input: '2024', expectedOutput: 'yes', isHidden: true, description: 'Обычный високосный' },
      { id: 'tc4', input: '2023', expectedOutput: 'no', isHidden: true, description: 'Не делится на 4' },
      { id: 'tc5', input: '2100', expectedOutput: 'no', isHidden: true, description: 'Делится на 100' },
      { id: 'tc6', input: '2400', expectedOutput: 'yes', isHidden: true, description: 'Делится на 400' }
    ]
  },
  {
    id: 'cond-5',
    topicId: 'conditions-8',
    title: 'Triangle Check',
    titleRu: 'Проверка треугольника',
    description: 'Check if three sides can form a triangle',
    descriptionRu: 'Даны три числа — длины сторон. Определите, можно ли из них построить треугольник. По правилу треугольника: сумма любых двух сторон должна быть БОЛЬШЕ третьей стороны. Нужно проверить все три комбинации: a+b>c, b+c>a, a+c>b. Выведите "yes" или "no".',
    difficulty: 'medium',
    points: 50,
    order: 5,
    grades: [8],
    starterCode: '# Прочитайте три стороны\n# Выведите "yes" или "no"\n',
    solution: 'a = int(input())\nb = int(input())\nc = int(input())\nif a + b > c and b + c > a and a + c > b:\n    print("yes")\nelse:\n    print("no")',
    hints: ['Сумма любых двух сторон должна быть больше третьей'],
    testCases: [
      { id: 'tc1', input: '3\n4\n5', expectedOutput: 'yes', isHidden: false, description: 'Египетский треугольник' },
      { id: 'tc2', input: '1\n2\n10', expectedOutput: 'no', isHidden: false, description: 'Невозможный треугольник' },
      { id: 'tc3', input: '5\n5\n5', expectedOutput: 'yes', isHidden: true, description: 'Равносторонний' },
      { id: 'tc4', input: '1\n1\n2', expectedOutput: 'no', isHidden: true, description: 'Вырожденный' },
      { id: 'tc5', input: '7\n10\n5', expectedOutput: 'yes', isHidden: true, description: 'Обычный треугольник' }
    ]
  },
  {
    id: 'cond-6',
    topicId: 'conditions-8',
    title: 'Number Sign',
    titleRu: 'Знак числа',
    description: 'Determine if number is positive, negative or zero',
    descriptionRu: 'Определите, положительное, отрицательное или ноль',
    difficulty: 'easy',
    points: 10,
    order: 6,
    grades: [8],
    starterCode: '# Выведите "positive", "negative" или "zero"\n',
    solution: 'n = int(input())\nif n > 0:\n    print("positive")\nelif n < 0:\n    print("negative")\nelse:\n    print("zero")',
    hints: ['Используйте elif для проверки всех случаев'],
    testCases: [
      { id: 'tc1', input: '5', expectedOutput: 'positive', isHidden: false },
      { id: 'tc2', input: '-3', expectedOutput: 'negative', isHidden: false },
      { id: 'tc3', input: '0', expectedOutput: 'zero', isHidden: true }
    ]
  },
  {
    id: 'cond-7',
    topicId: 'conditions-8',
    title: 'Ticket Price',
    titleRu: 'Цена билета',
    description: 'Calculate ticket price based on age',
    descriptionRu: 'В кинотеатре действуют скидки по возрасту: дети до 7 лет — бесплатно (0), школьники 7-17 лет — 50 рублей, взрослые 18-64 лет — 100 рублей (полная цена), пенсионеры от 65 лет — 50 рублей. Определите стоимость билета по возрасту посетителя.',
    difficulty: 'medium',
    points: 50,
    order: 7,
    grades: [8],
    starterCode: '# <7: бесплатно, 7-18: 50, 18-65: 100, >65: 50\n',
    solution: 'age = int(input())\nif age < 7:\n    print(0)\nelif age < 18:\n    print(50)\nelif age < 65:\n    print(100)\nelse:\n    print(50)',
    hints: ['Проверяйте возрастные границы последовательно'],
    testCases: [
      { id: 'tc1', input: '5', expectedOutput: '0', isHidden: false, description: 'Ребёнок бесплатно' },
      { id: 'tc2', input: '25', expectedOutput: '100', isHidden: false, description: 'Взрослый' },
      { id: 'tc3', input: '70', expectedOutput: '50', isHidden: true, description: 'Пенсионер' },
      { id: 'tc4', input: '7', expectedOutput: '50', isHidden: true, description: 'Граница школьник' },
      { id: 'tc5', input: '17', expectedOutput: '50', isHidden: true, description: 'Старший школьник' },
      { id: 'tc6', input: '65', expectedOutput: '50', isHidden: true, description: 'Граница пенсионер' }
    ]
  },
  {
    id: 'cond-8',
    topicId: 'conditions-8',
    title: 'Quadrant',
    titleRu: 'Квадрант',
    description: 'Determine which quadrant a point is in',
    descriptionRu: 'Координатная плоскость делится на 4 квадранта: I (x>0, y>0) — правый верхний, II (x<0, y>0) — левый верхний, III (x<0, y<0) — левый нижний, IV (x>0, y<0) — правый нижний. Если точка лежит на оси (x=0 или y=0), выведите 0. Иначе выведите номер квадранта.',
    difficulty: 'medium',
    points: 50,
    order: 8,
    grades: [8],
    starterCode: '# Прочитайте x и y\n# Выведите номер квадранта (1-4) или 0 если на оси\n',
    solution: 'x = int(input())\ny = int(input())\nif x > 0 and y > 0:\n    print(1)\nelif x < 0 and y > 0:\n    print(2)\nelif x < 0 and y < 0:\n    print(3)\nelif x > 0 and y < 0:\n    print(4)\nelse:\n    print(0)',
    hints: ['Квадранты нумеруются против часовой стрелки'],
    testCases: [
      { id: 'tc1', input: '5\n5', expectedOutput: '1', isHidden: false, description: 'I квадрант' },
      { id: 'tc2', input: '-3\n-3', expectedOutput: '3', isHidden: false, description: 'III квадрант' },
      { id: 'tc3', input: '0\n5', expectedOutput: '0', isHidden: true, description: 'На оси Y' },
      { id: 'tc4', input: '-5\n3', expectedOutput: '2', isHidden: true, description: 'II квадрант' },
      { id: 'tc5', input: '7\n-2', expectedOutput: '4', isHidden: true, description: 'IV квадрант' },
      { id: 'tc6', input: '0\n0', expectedOutput: '0', isHidden: true, description: 'Начало координат' }
    ]
  },
  {
    id: 'cond-9',
    topicId: 'conditions-8',
    title: 'Sort Three',
    titleRu: 'Сортировка трёх',
    description: 'Sort three numbers in ascending order',
    descriptionRu: 'Даны три числа. Выведите их в порядке возрастания (от меньшего к большему) через пробел. Используйте обмен переменных: если a > b, то поменяйте их местами командой a, b = b, a. Сделайте это для всех пар, чтобы отсортировать числа.',
    difficulty: 'hard',
    points: 100,
    order: 9,
    grades: [8],
    starterCode: '# Прочитайте три числа, выведите отсортированные\n',
    solution: 'a = int(input())\nb = int(input())\nc = int(input())\nif a > b:\n    a, b = b, a\nif b > c:\n    b, c = c, b\nif a > b:\n    a, b = b, a\nprint(a, b, c)',
    hints: ['Используйте пузырьковую сортировку'],
    testCases: [
      { id: 'tc1', input: '3\n1\n2', expectedOutput: '1 2 3', isHidden: false, description: 'Обычный случай' },
      { id: 'tc2', input: '5\n5\n5', expectedOutput: '5 5 5', isHidden: false, description: 'Все равны' },
      { id: 'tc3', input: '1\n2\n3', expectedOutput: '1 2 3', isHidden: true, description: 'Уже отсортировано' },
      { id: 'tc4', input: '3\n2\n1', expectedOutput: '1 2 3', isHidden: true, description: 'Обратный порядок' },
      { id: 'tc5', input: '-5\n0\n5', expectedOutput: '-5 0 5', isHidden: true, description: 'С отрицательным' },
      { id: 'tc6', input: '10\n10\n5', expectedOutput: '5 10 10', isHidden: true, description: 'Два одинаковых' }
    ]
  },
  {
    id: 'cond-10',
    topicId: 'conditions-8',
    title: 'Date Validator',
    titleRu: 'Проверка даты',
    description: 'Check if a date is valid',
    descriptionRu: 'Проверьте, существует ли такая дата. Учитывайте: 1) месяц должен быть от 1 до 12, 2) количество дней в месяце (в апреле 30 дней, в феврале 28 или 29), 3) в високосный год в феврале 29 дней. Високосный год: делится на 4, но не на 100, ИЛИ делится на 400. Выведите "valid" или "invalid".',
    difficulty: 'hard',
    points: 100,
    order: 10,
    grades: [8],
    starterCode: '# Прочитайте день, месяц, год\n# Выведите "valid" или "invalid"\n',
    solution: 'day = int(input())\nmonth = int(input())\nyear = int(input())\ndays_in_month = [31,28,31,30,31,30,31,31,30,31,30,31]\nif (year % 4 == 0 and year % 100 != 0) or year % 400 == 0:\n    days_in_month[1] = 29\nif 1 <= month <= 12 and 1 <= day <= days_in_month[month-1]:\n    print("valid")\nelse:\n    print("invalid")',
    hints: ['Учтите високосные годы для февраля'],
    testCases: [
      { id: 'tc1', input: '29\n2\n2000', expectedOutput: 'valid', isHidden: false, description: '29 февраля високосного' },
      { id: 'tc2', input: '31\n4\n2023', expectedOutput: 'invalid', isHidden: false, description: 'В апреле 30 дней' },
      { id: 'tc3', input: '29\n2\n1900', expectedOutput: 'invalid', isHidden: true, description: '1900 не високосный' },
      { id: 'tc4', input: '31\n12\n2023', expectedOutput: 'valid', isHidden: true, description: '31 декабря' },
      { id: 'tc5', input: '0\n1\n2023', expectedOutput: 'invalid', isHidden: true, description: 'День 0' },
      { id: 'tc6', input: '15\n13\n2023', expectedOutput: 'invalid', isHidden: true, description: 'Месяц 13' }
    ]
  },
  {
    id: 'cond-11',
    topicId: 'conditions-8',
    title: 'Absolute Value',
    titleRu: 'Модуль числа',
    description: 'Calculate absolute value without abs()',
    descriptionRu: 'Вычислите модуль числа без использования abs()',
    difficulty: 'easy',
    points: 10,
    order: 11,
    grades: [8],
    starterCode: '# Прочитайте число, выведите его модуль\n# Не используйте функцию abs()\n',
    solution: 'n = int(input())\nif n < 0:\n    print(-n)\nelse:\n    print(n)',
    hints: ['Если число отрицательное, умножьте на -1'],
    testCases: [
      { id: 'tc1', input: '-5', expectedOutput: '5', isHidden: false },
      { id: 'tc2', input: '7', expectedOutput: '7', isHidden: false },
      { id: 'tc3', input: '0', expectedOutput: '0', isHidden: true }
    ]
  },
  {
    id: 'cond-12',
    topicId: 'conditions-8',
    title: 'Time of Day',
    titleRu: 'Время суток',
    description: 'Determine time of day by hour',
    descriptionRu: 'Определите время суток по часу',
    difficulty: 'easy',
    points: 15,
    order: 12,
    grades: [8],
    starterCode: '# Прочитайте час (0-23)\n# Выведите: night (0-5), morning (6-11), afternoon (12-17), evening (18-23)\n',
    solution: 'hour = int(input())\nif hour < 6:\n    print("night")\nelif hour < 12:\n    print("morning")\nelif hour < 18:\n    print("afternoon")\nelse:\n    print("evening")',
    hints: ['Используйте elif для проверки диапазонов'],
    testCases: [
      { id: 'tc1', input: '3', expectedOutput: 'night', isHidden: false },
      { id: 'tc2', input: '10', expectedOutput: 'morning', isHidden: false },
      { id: 'tc3', input: '15', expectedOutput: 'afternoon', isHidden: false },
      { id: 'tc4', input: '21', expectedOutput: 'evening', isHidden: true }
    ]
  },
  {
    id: 'cond-13',
    topicId: 'conditions-8',
    title: 'Simple Calculator',
    titleRu: 'Простой калькулятор',
    description: 'Create a simple calculator',
    descriptionRu: 'Создайте простой калькулятор. На вход подаются: первое число, знак операции (+, -, *, /), второе число — каждое на отдельной строке. Выведите результат операции. Важно: при делении на 0 выведите "error". Используйте float для работы с дробными числами.',
    difficulty: 'medium',
    points: 50,
    order: 13,
    grades: [8],
    starterCode: '# Прочитайте: число1, операция (+,-,*,/), число2\n# Выведите результат или "error" при делении на 0\n',
    solution: 'a = float(input())\nop = input()\nb = float(input())\nif op == "+":\n    print(a + b)\nelif op == "-":\n    print(a - b)\nelif op == "*":\n    print(a * b)\nelif op == "/":\n    if b == 0:\n        print("error")\n    else:\n        print(a / b)',
    hints: ['Проверьте деление на ноль отдельно'],
    testCases: [
      { id: 'tc1', input: '10\n+\n5', expectedOutput: '15.0', isHidden: false, description: 'Сложение' },
      { id: 'tc2', input: '10\n/\n0', expectedOutput: 'error', isHidden: false, description: 'Деление на 0' },
      { id: 'tc3', input: '8\n*\n3', expectedOutput: '24.0', isHidden: true, description: 'Умножение' },
      { id: 'tc4', input: '15\n-\n7', expectedOutput: '8.0', isHidden: true, description: 'Вычитание' },
      { id: 'tc5', input: '10\n/\n4', expectedOutput: '2.5', isHidden: true, description: 'Деление с остатком' }
    ]
  },
  {
    id: 'cond-14',
    topicId: 'conditions-8',
    title: 'Divisibility Check',
    titleRu: 'Проверка делимости',
    description: 'Check divisibility by 3 and 5',
    descriptionRu: 'Это классическая задача FizzBuzz! Дано число. Если оно делится на 3 И на 5 — выведите "FizzBuzz". Если только на 3 — выведите "Fizz". Если только на 5 — выведите "Buzz". Иначе выведите само число. Важно: сначала проверяйте делимость на оба числа!',
    difficulty: 'medium',
    points: 50,
    order: 14,
    grades: [8],
    starterCode: '# Прочитайте число\n# Выведите: FizzBuzz (делится на 3 и 5), Fizz (на 3), Buzz (на 5), число\n',
    solution: 'n = int(input())\nif n % 3 == 0 and n % 5 == 0:\n    print("FizzBuzz")\nelif n % 3 == 0:\n    print("Fizz")\nelif n % 5 == 0:\n    print("Buzz")\nelse:\n    print(n)',
    hints: ['Сначала проверьте делимость на оба числа'],
    testCases: [
      { id: 'tc1', input: '15', expectedOutput: 'FizzBuzz', isHidden: false, description: 'Делится на 3 и 5' },
      { id: 'tc2', input: '9', expectedOutput: 'Fizz', isHidden: false, description: 'Делится только на 3' },
      { id: 'tc3', input: '10', expectedOutput: 'Buzz', isHidden: false, description: 'Делится только на 5' },
      { id: 'tc4', input: '7', expectedOutput: '7', isHidden: true, description: 'Не делится' },
      { id: 'tc5', input: '30', expectedOutput: 'FizzBuzz', isHidden: true, description: 'Делится на 15' },
      { id: 'tc6', input: '1', expectedOutput: '1', isHidden: true, description: 'Единица' }
    ]
  },
  {
    id: 'cond-15',
    topicId: 'conditions-8',
    title: 'Password Validator',
    titleRu: 'Проверка пароля',
    description: 'Validate password strength',
    descriptionRu: 'Проверьте надёжность пароля. Пароль считается надёжным ("strong"), если выполняются ОБА условия: 1) длина не менее 8 символов, 2) содержит хотя бы одну цифру. Используйте len() для длины и метод isdigit() для проверки, является ли символ цифрой. Если пароль ненадёжный — выведите "weak".',
    difficulty: 'hard',
    points: 100,
    order: 15,
    grades: [8],
    starterCode: '# Пароль надёжный если:\n# - длина >= 8 символов\n# - содержит хотя бы одну цифру\n# Выведите "strong" или "weak"\n',
    solution: 'password = input()\nhas_digit = False\nfor char in password:\n    if char.isdigit():\n        has_digit = True\n        break\nif len(password) >= 8 and has_digit:\n    print("strong")\nelse:\n    print("weak")',
    hints: ['Используйте isdigit() для проверки цифры', 'len() возвращает длину строки'],
    testCases: [
      { id: 'tc1', input: 'password123', expectedOutput: 'strong', isHidden: false, description: 'Надёжный пароль' },
      { id: 'tc2', input: 'short1', expectedOutput: 'weak', isHidden: false, description: 'Слишком короткий' },
      { id: 'tc3', input: 'longenough', expectedOutput: 'weak', isHidden: false, description: 'Нет цифр' },
      { id: 'tc4', input: 'secure99', expectedOutput: 'strong', isHidden: true, description: 'Ровно 8 символов' },
      { id: 'tc5', input: '12345678', expectedOutput: 'strong', isHidden: true, description: 'Только цифры' },
      { id: 'tc6', input: 'ab1', expectedOutput: 'weak', isHidden: true, description: 'Очень короткий' }
    ]
  },

  // Цикл for - 8 класс
  {
    id: 'for-1',
    topicId: 'loops-for-8',
    title: 'Count to N',
    titleRu: 'Счёт до N',
    description: 'Print numbers from 1 to N',
    descriptionRu: 'Выведите числа от 1 до N',
    difficulty: 'easy',
    points: 10,
    order: 1,
    grades: [8],
    starterCode: '# Прочитайте N, выведите числа от 1 до N\n',
    solution: 'n = int(input())\nfor i in range(1, n + 1):\n    print(i)',
    hints: ['range(1, n+1) генерирует числа от 1 до n'],
    testCases: [
      { id: 'tc1', input: '5', expectedOutput: '1\n2\n3\n4\n5', isHidden: false },
      { id: 'tc2', input: '3', expectedOutput: '1\n2\n3', isHidden: false }
    ]
  },
  {
    id: 'for-2',
    topicId: 'loops-for-8',
    title: 'Sum 1 to N',
    titleRu: 'Сумма от 1 до N',
    description: 'Calculate sum of numbers from 1 to N',
    descriptionRu: 'Вычислите сумму чисел от 1 до N',
    difficulty: 'easy',
    points: 10,
    order: 2,
    grades: [8],
    starterCode: '# Прочитайте N, выведите сумму от 1 до N\n',
    solution: 'n = int(input())\ntotal = 0\nfor i in range(1, n + 1):\n    total += i\nprint(total)',
    hints: ['Накапливайте сумму в переменной'],
    testCases: [
      { id: 'tc1', input: '5', expectedOutput: '15', isHidden: false },
      { id: 'tc2', input: '10', expectedOutput: '55', isHidden: false }
    ]
  },
  {
    id: 'for-3',
    topicId: 'loops-for-8',
    title: 'Factorial',
    titleRu: 'Факториал',
    description: 'Calculate factorial of N',
    descriptionRu: 'Факториал числа N (обозначается N!) — это произведение всех целых чисел от 1 до N. Например: 5! = 1 × 2 × 3 × 4 × 5 = 120. Важно: 0! = 1 по определению. Используйте цикл for и переменную-накопитель для произведения.',
    difficulty: 'medium',
    points: 50,
    order: 3,
    grades: [8],
    starterCode: '# N! = 1 * 2 * 3 * ... * N\n',
    solution: 'n = int(input())\nresult = 1\nfor i in range(1, n + 1):\n    result *= i\nprint(result)',
    hints: ['Факториал - произведение всех чисел от 1 до N'],
    testCases: [
      { id: 'tc1', input: '5', expectedOutput: '120', isHidden: false, description: '5! = 120' },
      { id: 'tc2', input: '0', expectedOutput: '1', isHidden: false, description: '0! = 1' },
      { id: 'tc3', input: '1', expectedOutput: '1', isHidden: true, description: '1! = 1' },
      { id: 'tc4', input: '10', expectedOutput: '3628800', isHidden: true, description: '10!' },
      { id: 'tc5', input: '3', expectedOutput: '6', isHidden: true, description: '3! = 6' }
    ]
  },
  {
    id: 'for-4',
    topicId: 'loops-for-8',
    title: 'Multiplication Table',
    titleRu: 'Таблица умножения',
    description: 'Print multiplication table for N',
    descriptionRu: 'Выведите таблицу умножения для N',
    difficulty: 'easy',
    points: 15,
    order: 4,
    grades: [8],
    starterCode: '# Выведите N * 1 = ..., N * 2 = ..., до N * 10\n',
    solution: 'n = int(input())\nfor i in range(1, 11):\n    print(f"{n} * {i} = {n * i}")',
    hints: ['Используйте f-строки для форматирования'],
    testCases: [
      { id: 'tc1', input: '5', expectedOutput: '5 * 1 = 5\n5 * 2 = 10\n5 * 3 = 15\n5 * 4 = 20\n5 * 5 = 25\n5 * 6 = 30\n5 * 7 = 35\n5 * 8 = 40\n5 * 9 = 45\n5 * 10 = 50', isHidden: false }
    ]
  },
  {
    id: 'for-5',
    topicId: 'loops-for-8',
    title: 'Sum of Digits',
    titleRu: 'Сумма цифр',
    description: 'Calculate sum of digits of a number',
    descriptionRu: 'Дано целое число (любой длины). Найдите сумму всех его цифр. Например, для числа 123 ответ: 1 + 2 + 3 = 6. Подсказка: можно прочитать число как строку и перебрать каждый символ циклом for, преобразуя в int.',
    difficulty: 'medium',
    points: 50,
    order: 5,
    grades: [8],
    starterCode: '# Прочитайте число, выведите сумму его цифр\n',
    solution: 'n = input()\ntotal = 0\nfor digit in n:\n    total += int(digit)\nprint(total)',
    hints: ['Можно перебрать строку посимвольно'],
    testCases: [
      { id: 'tc1', input: '123', expectedOutput: '6', isHidden: false, description: '1+2+3=6' },
      { id: 'tc2', input: '9999', expectedOutput: '36', isHidden: false, description: '9+9+9+9=36' },
      { id: 'tc3', input: '0', expectedOutput: '0', isHidden: true, description: 'Ноль' },
      { id: 'tc4', input: '1000000', expectedOutput: '1', isHidden: true, description: 'Миллион' },
      { id: 'tc5', input: '555', expectedOutput: '15', isHidden: true, description: '5+5+5=15' }
    ]
  },
  {
    id: 'for-6',
    topicId: 'loops-for-8',
    title: 'Power',
    titleRu: 'Степень',
    description: 'Calculate a^b without using **',
    descriptionRu: 'Возведите число a в степень b БЕЗ использования оператора **. Идея: a^b — это a, умноженное на себя b раз. Например, 2^3 = 2 × 2 × 2 = 8. Используйте цикл for и переменную-накопитель (начальное значение = 1).',
    difficulty: 'medium',
    points: 50,
    order: 6,
    grades: [8],
    starterCode: '# Прочитайте a и b, выведите a в степени b\n',
    solution: 'a = int(input())\nb = int(input())\nresult = 1\nfor _ in range(b):\n    result *= a\nprint(result)',
    hints: ['Умножьте a на себя b раз'],
    testCases: [
      { id: 'tc1', input: '2\n10', expectedOutput: '1024', isHidden: false, description: '2^10 = 1024' },
      { id: 'tc2', input: '5\n3', expectedOutput: '125', isHidden: false, description: '5^3 = 125' },
      { id: 'tc3', input: '7\n0', expectedOutput: '1', isHidden: true, description: 'Любое число в степени 0' },
      { id: 'tc4', input: '10\n5', expectedOutput: '100000', isHidden: true, description: '10^5' },
      { id: 'tc5', input: '3\n4', expectedOutput: '81', isHidden: true, description: '3^4 = 81' }
    ]
  },
  {
    id: 'for-7',
    topicId: 'loops-for-8',
    title: 'Reverse Number',
    titleRu: 'Переворот числа',
    description: 'Reverse digits of a number',
    descriptionRu: 'Дано число (как строка). Выведите его цифры в обратном порядке. Например: 123 → 321, 1000 → 0001. Идея: перебирайте символы числа циклом и добавляйте каждый символ В НАЧАЛО результирующей строки.',
    difficulty: 'medium',
    points: 50,
    order: 7,
    grades: [8],
    starterCode: '# 123 -> 321\n',
    solution: 'n = input()\nresult = ""\nfor char in n:\n    result = char + result\nprint(result)',
    hints: ['Добавляйте каждую цифру в начало результата'],
    testCases: [
      { id: 'tc1', input: '123', expectedOutput: '321', isHidden: false, description: '123 → 321' },
      { id: 'tc2', input: '1000', expectedOutput: '0001', isHidden: false, description: 'С нулями' },
      { id: 'tc3', input: '5', expectedOutput: '5', isHidden: true, description: 'Одна цифра' },
      { id: 'tc4', input: '12321', expectedOutput: '12321', isHidden: true, description: 'Палиндром' },
      { id: 'tc5', input: '9876543210', expectedOutput: '0123456789', isHidden: true, description: 'Длинное число' }
    ]
  },
  {
    id: 'for-8',
    topicId: 'loops-for-8',
    title: 'Prime Check',
    titleRu: 'Проверка простоты',
    description: 'Check if a number is prime',
    descriptionRu: 'Простое число — это число, которое делится только на 1 и на себя. Примеры: 2, 3, 5, 7, 11, 13... Числа 0 и 1 НЕ являются простыми. Оптимизация: достаточно проверить делители от 2 до √n. Выведите "yes" если простое, "no" если нет.',
    difficulty: 'hard',
    points: 100,
    order: 8,
    grades: [8],
    starterCode: '# Простое число делится только на 1 и себя\n',
    solution: 'n = int(input())\nif n < 2:\n    print("no")\nelse:\n    is_prime = True\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            is_prime = False\n            break\n    print("yes" if is_prime else "no")',
    hints: ['Достаточно проверить делители до корня из n'],
    testCases: [
      { id: 'tc1', input: '7', expectedOutput: 'yes', isHidden: false, description: '7 - простое' },
      { id: 'tc2', input: '10', expectedOutput: 'no', isHidden: false, description: '10 = 2×5' },
      { id: 'tc3', input: '1', expectedOutput: 'no', isHidden: true, description: '1 не простое' },
      { id: 'tc4', input: '2', expectedOutput: 'yes', isHidden: true, description: 'Наименьшее простое' },
      { id: 'tc5', input: '97', expectedOutput: 'yes', isHidden: true, description: 'Большое простое' },
      { id: 'tc6', input: '100', expectedOutput: 'no', isHidden: true, description: '100 = 10×10' }
    ]
  },
  {
    id: 'for-9',
    topicId: 'loops-for-8',
    title: 'Fibonacci',
    titleRu: 'Фибоначчи',
    description: 'Print first N Fibonacci numbers',
    descriptionRu: 'Последовательность Фибоначчи: 1, 1, 2, 3, 5, 8, 13, 21... Каждое число — сумма двух предыдущих. Выведите первые N чисел этой последовательности (каждое на новой строке). Используйте две переменные a и b, и на каждом шаге делайте: a, b = b, a + b.',
    difficulty: 'hard',
    points: 100,
    order: 9,
    grades: [8],
    starterCode: '# 1, 1, 2, 3, 5, 8, 13, ...\n',
    solution: 'n = int(input())\na, b = 1, 1\nfor i in range(n):\n    print(a)\n    a, b = b, a + b',
    hints: ['Каждое число - сумма двух предыдущих'],
    testCases: [
      { id: 'tc1', input: '5', expectedOutput: '1\n1\n2\n3\n5', isHidden: false, description: 'Первые 5' },
      { id: 'tc2', input: '8', expectedOutput: '1\n1\n2\n3\n5\n8\n13\n21', isHidden: false, description: 'Первые 8' },
      { id: 'tc3', input: '1', expectedOutput: '1', isHidden: true, description: 'Только первое' },
      { id: 'tc4', input: '2', expectedOutput: '1\n1', isHidden: true, description: 'Два числа' },
      { id: 'tc5', input: '10', expectedOutput: '1\n1\n2\n3\n5\n8\n13\n21\n34\n55', isHidden: true, description: 'Первые 10' }
    ]
  },
  {
    id: 'for-10',
    topicId: 'loops-for-8',
    title: 'Triangle Pattern',
    titleRu: 'Треугольник из звёзд',
    description: 'Print a triangle pattern',
    descriptionRu: 'Выведите треугольник из звёздочек высотой N строк. В первой строке 1 звёздочка, во второй — 2, и так далее до N. Подсказка: умножение строки на число повторяет её. Например: "*" * 3 даёт "***".',
    difficulty: 'medium',
    points: 50,
    order: 10,
    grades: [8],
    starterCode: '# N=3:\n# *\n# **\n# ***\n',
    solution: 'n = int(input())\nfor i in range(1, n + 1):\n    print("*" * i)',
    hints: ['Умножение строки на число повторяет её'],
    testCases: [
      { id: 'tc1', input: '3', expectedOutput: '*\n**\n***', isHidden: false, description: 'Высота 3' },
      { id: 'tc2', input: '5', expectedOutput: '*\n**\n***\n****\n*****', isHidden: false, description: 'Высота 5' },
      { id: 'tc3', input: '1', expectedOutput: '*', isHidden: true, description: 'Одна строка' },
      { id: 'tc4', input: '7', expectedOutput: '*\n**\n***\n****\n*****\n******\n*******', isHidden: true, description: 'Высота 7' }
    ]
  },

  // Списки - 9 класс
  {
    id: 'list-1',
    topicId: 'lists-9',
    title: 'List Sum',
    titleRu: 'Сумма списка',
    description: 'Calculate sum of all elements in a list',
    descriptionRu: 'Вычислите сумму всех элементов списка',
    difficulty: 'easy',
    points: 10,
    order: 1,
    grades: [9],
    starterCode: '# Прочитайте числа через пробел, выведите их сумму\n',
    solution: 'nums = list(map(int, input().split()))\nprint(sum(nums))',
    hints: ['split() разделяет строку на список'],
    testCases: [
      { id: 'tc1', input: '1 2 3 4 5', expectedOutput: '15', isHidden: false },
      { id: 'tc2', input: '10 20 30', expectedOutput: '60', isHidden: false }
    ]
  },
  {
    id: 'list-2',
    topicId: 'lists-9',
    title: 'Find Maximum',
    titleRu: 'Найти максимум',
    description: 'Find the maximum element in a list',
    descriptionRu: 'Найдите максимальный элемент списка',
    difficulty: 'easy',
    points: 10,
    order: 2,
    grades: [9],
    starterCode: '# Найдите максимум без использования max()\n',
    solution: 'nums = list(map(int, input().split()))\nmaximum = nums[0]\nfor n in nums:\n    if n > maximum:\n        maximum = n\nprint(maximum)',
    hints: ['Сравнивайте каждый элемент с текущим максимумом'],
    testCases: [
      { id: 'tc1', input: '3 1 4 1 5 9', expectedOutput: '9', isHidden: false },
      { id: 'tc2', input: '-5 -2 -10', expectedOutput: '-2', isHidden: false }
    ]
  },
  {
    id: 'list-3',
    topicId: 'lists-9',
    title: 'Reverse List',
    titleRu: 'Перевернуть список',
    description: 'Reverse a list without using reverse()',
    descriptionRu: 'Переверните список БЕЗ использования встроенной функции reverse() или среза [::-1]. Идея: создайте пустой список и добавляйте каждый элемент в его НАЧАЛО с помощью insert(0, элемент). Выведите результат через пробел.',
    difficulty: 'medium',
    points: 50,
    order: 3,
    grades: [9],
    starterCode: '# Выведите элементы в обратном порядке\n',
    solution: 'nums = input().split()\nresult = []\nfor item in nums:\n    result.insert(0, item)\nprint(" ".join(result))',
    hints: ['insert(0, x) вставляет элемент в начало'],
    testCases: [
      { id: 'tc1', input: '1 2 3 4 5', expectedOutput: '5 4 3 2 1', isHidden: false, description: 'Числа' },
      { id: 'tc2', input: 'a b c', expectedOutput: 'c b a', isHidden: false, description: 'Буквы' },
      { id: 'tc3', input: 'x', expectedOutput: 'x', isHidden: true, description: 'Один элемент' },
      { id: 'tc4', input: '1 1 1 1', expectedOutput: '1 1 1 1', isHidden: true, description: 'Одинаковые' },
      { id: 'tc5', input: 'hello world', expectedOutput: 'world hello', isHidden: true, description: 'Слова' }
    ]
  },
  {
    id: 'list-4',
    topicId: 'lists-9',
    title: 'Count Occurrences',
    titleRu: 'Подсчёт вхождений',
    description: 'Count how many times an element appears',
    descriptionRu: 'Подсчитайте, сколько раз элемент встречается',
    difficulty: 'easy',
    points: 15,
    order: 4,
    grades: [9],
    starterCode: '# Строка 1: элементы через пробел\n# Строка 2: искомый элемент\n',
    solution: 'nums = input().split()\ntarget = input()\ncount = 0\nfor n in nums:\n    if n == target:\n        count += 1\nprint(count)',
    hints: ['Используйте счётчик'],
    testCases: [
      { id: 'tc1', input: '1 2 2 3 2 4\n2', expectedOutput: '3', isHidden: false },
      { id: 'tc2', input: 'a b a c a\na', expectedOutput: '3', isHidden: false }
    ]
  },
  {
    id: 'list-5',
    topicId: 'lists-9',
    title: 'Remove Duplicates',
    titleRu: 'Удалить дубликаты',
    description: 'Remove duplicate elements from list',
    descriptionRu: 'Удалите повторяющиеся элементы из списка, сохранив порядок ПЕРВОГО появления каждого элемента. Например: [1, 2, 2, 3, 1] → [1, 2, 3]. Идея: создайте пустой список и добавляйте элемент только если его там ещё нет (проверка: if x not in result).',
    difficulty: 'medium',
    points: 50,
    order: 5,
    grades: [9],
    starterCode: '# Сохраните порядок первого появления\n',
    solution: 'nums = input().split()\nresult = []\nfor n in nums:\n    if n not in result:\n        result.append(n)\nprint(" ".join(result))',
    hints: ['Проверяйте наличие перед добавлением'],
    testCases: [
      { id: 'tc1', input: '1 2 2 3 1 4', expectedOutput: '1 2 3 4', isHidden: false, description: 'С дубликатами' },
      { id: 'tc2', input: 'a a a', expectedOutput: 'a', isHidden: false, description: 'Все одинаковые' },
      { id: 'tc3', input: '1 2 3', expectedOutput: '1 2 3', isHidden: true, description: 'Без дубликатов' },
      { id: 'tc4', input: 'x y x z y', expectedOutput: 'x y z', isHidden: true, description: 'Буквы' },
      { id: 'tc5', input: '5', expectedOutput: '5', isHidden: true, description: 'Один элемент' }
    ]
  },
  {
    id: 'list-6',
    topicId: 'lists-9',
    title: 'List Intersection',
    titleRu: 'Пересечение списков',
    description: 'Find common elements in two lists',
    descriptionRu: 'Найдите общие элементы двух списков (пересечение). На вход подаются две строки с элементами через пробел. Выведите только те элементы, которые есть в ОБОИХ списках, без дубликатов. Если общих элементов нет — выведите пустую строку.',
    difficulty: 'medium',
    points: 50,
    order: 6,
    grades: [9],
    starterCode: '# Две строки с числами через пробел\n',
    solution: 'list1 = input().split()\nlist2 = input().split()\nresult = []\nfor item in list1:\n    if item in list2 and item not in result:\n        result.append(item)\nprint(" ".join(result))',
    hints: ['Проверяйте наличие в обоих списках'],
    testCases: [
      { id: 'tc1', input: '1 2 3 4\n3 4 5 6', expectedOutput: '3 4', isHidden: false, description: 'Есть общие' },
      { id: 'tc2', input: '1 2\n3 4', expectedOutput: '', isHidden: false, description: 'Нет общих' },
      { id: 'tc3', input: 'a b c\na b c', expectedOutput: 'a b c', isHidden: true, description: 'Одинаковые' },
      { id: 'tc4', input: '1 1 2 2\n2 2 3 3', expectedOutput: '2', isHidden: true, description: 'С дубликатами' },
      { id: 'tc5', input: 'x\nx', expectedOutput: 'x', isHidden: true, description: 'Один элемент' }
    ]
  },
  {
    id: 'list-7',
    topicId: 'lists-9',
    title: 'Second Largest',
    titleRu: 'Второй максимум',
    description: 'Find the second largest element',
    descriptionRu: 'Найдите второй по величине элемент в списке (все элементы уникальны). Идея: храните две переменные — для максимума и для второго максимума. Если новый элемент больше максимума, старый максимум становится вторым, а новый — первым.',
    difficulty: 'medium',
    points: 50,
    order: 7,
    grades: [9],
    starterCode: '# Все элементы уникальны\n',
    solution: 'nums = list(map(int, input().split()))\nfirst = second = float("-inf")\nfor n in nums:\n    if n > first:\n        second = first\n        first = n\n    elif n > second:\n        second = n\nprint(second)',
    hints: ['Отслеживайте два максимума'],
    testCases: [
      { id: 'tc1', input: '1 5 3 9 2', expectedOutput: '5', isHidden: false, description: 'Обычный список' },
      { id: 'tc2', input: '10 20', expectedOutput: '10', isHidden: false, description: 'Два элемента' },
      { id: 'tc3', input: '100 50 75 25', expectedOutput: '75', isHidden: true, description: 'Четыре элемента' },
      { id: 'tc4', input: '-5 -2 -10 -1', expectedOutput: '-2', isHidden: true, description: 'Отрицательные' },
      { id: 'tc5', input: '1 2 3 4 5', expectedOutput: '4', isHidden: true, description: 'По возрастанию' }
    ]
  },
  {
    id: 'list-8',
    topicId: 'lists-9',
    title: 'Rotate List',
    titleRu: 'Поворот списка',
    description: 'Rotate list by k positions',
    descriptionRu: 'Сдвиньте все элементы списка на k позиций ВПРАВО (циклически). Последние k элементов переходят в начало. Например: [1,2,3,4,5] сдвиг на 2 → [4,5,1,2,3]. Используйте срезы: nums[-k:] + nums[:-k]. Не забудьте k = k % len(nums) для случая k > длины.',
    difficulty: 'hard',
    points: 100,
    order: 8,
    grades: [9],
    starterCode: '# Строка 1: элементы\n# Строка 2: k\n',
    solution: 'nums = input().split()\nk = int(input())\nk = k % len(nums)\nresult = nums[-k:] + nums[:-k]\nprint(" ".join(result))',
    hints: ['Используйте срезы списка'],
    testCases: [
      { id: 'tc1', input: '1 2 3 4 5\n2', expectedOutput: '4 5 1 2 3', isHidden: false, description: 'Сдвиг на 2' },
      { id: 'tc2', input: 'a b c d\n1', expectedOutput: 'd a b c', isHidden: false, description: 'Сдвиг на 1' },
      { id: 'tc3', input: '1 2 3\n3', expectedOutput: '1 2 3', isHidden: true, description: 'Полный оборот' },
      { id: 'tc4', input: '1 2 3\n5', expectedOutput: '2 3 1', isHidden: true, description: 'k > длины' },
      { id: 'tc5', input: 'x\n10', expectedOutput: 'x', isHidden: true, description: 'Один элемент' }
    ]
  },
  {
    id: 'list-9',
    topicId: 'lists-9',
    title: 'Merge Sorted Lists',
    titleRu: 'Слияние списков',
    description: 'Merge two sorted lists into one sorted list',
    descriptionRu: 'Даны два ОТСОРТИРОВАННЫХ списка. Объедините их в один отсортированный список. Используйте метод двух указателей: сравнивайте текущие элементы обоих списков и добавляйте меньший в результат. Не забудьте добавить оставшиеся элементы в конце.',
    difficulty: 'hard',
    points: 100,
    order: 9,
    grades: [9],
    starterCode: '# Два отсортированных списка\n',
    solution: 'list1 = list(map(int, input().split()))\nlist2 = list(map(int, input().split()))\nresult = []\ni = j = 0\nwhile i < len(list1) and j < len(list2):\n    if list1[i] <= list2[j]:\n        result.append(list1[i])\n        i += 1\n    else:\n        result.append(list2[j])\n        j += 1\nresult.extend(list1[i:])\nresult.extend(list2[j:])\nprint(" ".join(map(str, result)))',
    hints: ['Используйте два указателя'],
    testCases: [
      { id: 'tc1', input: '1 3 5\n2 4 6', expectedOutput: '1 2 3 4 5 6', isHidden: false, description: 'Чередующиеся' },
      { id: 'tc2', input: '1 2 3\n4 5 6', expectedOutput: '1 2 3 4 5 6', isHidden: false, description: 'Без пересечений' },
      { id: 'tc3', input: '1 1 1\n1 1 1', expectedOutput: '1 1 1 1 1 1', isHidden: true, description: 'Одинаковые' },
      { id: 'tc4', input: '10 20 30\n5 15 25', expectedOutput: '5 10 15 20 25 30', isHidden: true, description: 'Смешанные' },
      { id: 'tc5', input: '1\n2 3 4', expectedOutput: '1 2 3 4', isHidden: true, description: 'Разной длины' }
    ]
  },
  {
    id: 'list-10',
    topicId: 'lists-9',
    title: 'List Comprehension',
    titleRu: 'Генератор списка',
    description: 'Use list comprehension to filter even squares',
    descriptionRu: 'Генератор списка (list comprehension) — мощный инструмент Python. Синтаксис: [выражение for x in range if условие]. Выведите квадраты только ЧЁТНЫХ чисел от 1 до N. Например, для N=6: чётные числа 2, 4, 6, их квадраты: 4, 16, 36.',
    difficulty: 'medium',
    points: 50,
    order: 10,
    grades: [9],
    starterCode: '# Выведите квадраты чётных чисел от 1 до N\n',
    solution: 'n = int(input())\nresult = [x**2 for x in range(1, n+1) if x % 2 == 0]\nprint(" ".join(map(str, result)))',
    hints: ['[выражение for x in range if условие]'],
    testCases: [
      { id: 'tc1', input: '6', expectedOutput: '4 16 36', isHidden: false, description: 'До 6' },
      { id: 'tc2', input: '10', expectedOutput: '4 16 36 64 100', isHidden: false, description: 'До 10' },
      { id: 'tc3', input: '1', expectedOutput: '', isHidden: true, description: 'Нет чётных' },
      { id: 'tc4', input: '2', expectedOutput: '4', isHidden: true, description: 'Только 2' },
      { id: 'tc5', input: '8', expectedOutput: '4 16 36 64', isHidden: true, description: 'До 8' }
    ]
  },

  // Функции - 9 класс
  {
    id: 'func-1',
    topicId: 'functions-9',
    title: 'Simple Function',
    titleRu: 'Простая функция',
    description: 'Create a function that doubles a number',
    descriptionRu: 'Создайте функцию, удваивающую число',
    difficulty: 'easy',
    points: 10,
    order: 1,
    grades: [9],
    starterCode: '# Создайте функцию double(n)\n# и вызовите её для введённого числа\n',
    solution: 'def double(n):\n    return n * 2\n\nn = int(input())\nprint(double(n))',
    hints: ['Используйте return для возврата значения'],
    testCases: [
      { id: 'tc1', input: '5', expectedOutput: '10', isHidden: false },
      { id: 'tc2', input: '0', expectedOutput: '0', isHidden: false }
    ]
  },
  {
    id: 'func-2',
    topicId: 'functions-9',
    title: 'Max of Three',
    titleRu: 'Максимум из трёх',
    description: 'Write a function to find max of 3 numbers',
    descriptionRu: 'Напишите функцию поиска максимума из 3 чисел',
    difficulty: 'easy',
    points: 15,
    order: 2,
    grades: [9],
    starterCode: '# Функция max_of_three(a, b, c)\n',
    solution: 'def max_of_three(a, b, c):\n    if a >= b and a >= c:\n        return a\n    elif b >= c:\n        return b\n    else:\n        return c\n\na, b, c = map(int, input().split())\nprint(max_of_three(a, b, c))',
    hints: ['Сравните все три числа'],
    testCases: [
      { id: 'tc1', input: '1 2 3', expectedOutput: '3', isHidden: false },
      { id: 'tc2', input: '5 5 5', expectedOutput: '5', isHidden: false }
    ]
  },
  {
    id: 'func-3',
    topicId: 'functions-9',
    title: 'Is Palindrome',
    titleRu: 'Палиндром',
    description: 'Check if a string is a palindrome',
    descriptionRu: 'Палиндром — это строка, которая читается одинаково слева направо и справа налево. Примеры: "radar", "level", "а роза упала на лапу азора". Напишите функцию is_palindrome(s), которая возвращает True/False. Подсказка: s[::-1] переворачивает строку.',
    difficulty: 'medium',
    points: 50,
    order: 3,
    grades: [9],
    starterCode: '# Функция is_palindrome(s) -> bool\n',
    solution: 'def is_palindrome(s):\n    return s == s[::-1]\n\ns = input()\nprint("yes" if is_palindrome(s) else "no")',
    hints: ['Палиндром читается одинаково в обе стороны'],
    testCases: [
      { id: 'tc1', input: 'radar', expectedOutput: 'yes', isHidden: false, description: 'Классический палиндром' },
      { id: 'tc2', input: 'hello', expectedOutput: 'no', isHidden: false, description: 'Не палиндром' },
      { id: 'tc3', input: 'a', expectedOutput: 'yes', isHidden: true, description: 'Один символ' },
      { id: 'tc4', input: 'abba', expectedOutput: 'yes', isHidden: true, description: 'Чётная длина' },
      { id: 'tc5', input: 'ab', expectedOutput: 'no', isHidden: true, description: 'Два разных символа' }
    ]
  },
  {
    id: 'func-4',
    topicId: 'functions-9',
    title: 'GCD Function',
    titleRu: 'НОД',
    description: 'Calculate GCD of two numbers',
    descriptionRu: 'НОД (наибольший общий делитель) — максимальное число, на которое делятся оба числа. Используйте алгоритм Евклида: пока b ≠ 0, заменяйте a на b, а b на a % b. Когда b = 0, ответ в a. Например: НОД(12, 8) = 4.',
    difficulty: 'medium',
    points: 50,
    order: 4,
    grades: [9],
    starterCode: '# Функция gcd(a, b) - алгоритм Евклида\n',
    solution: 'def gcd(a, b):\n    while b:\n        a, b = b, a % b\n    return a\n\na, b = map(int, input().split())\nprint(gcd(a, b))',
    hints: ['Алгоритм Евклида: gcd(a, b) = gcd(b, a%b)'],
    testCases: [
      { id: 'tc1', input: '12 8', expectedOutput: '4', isHidden: false, description: 'НОД(12,8)=4' },
      { id: 'tc2', input: '17 5', expectedOutput: '1', isHidden: false, description: 'Взаимно простые' },
      { id: 'tc3', input: '100 25', expectedOutput: '25', isHidden: true, description: 'Одно делит другое' },
      { id: 'tc4', input: '7 7', expectedOutput: '7', isHidden: true, description: 'Одинаковые числа' },
      { id: 'tc5', input: '48 18', expectedOutput: '6', isHidden: true, description: 'НОД(48,18)=6' }
    ]
  },
  {
    id: 'func-5',
    topicId: 'functions-9',
    title: 'Recursive Factorial',
    titleRu: 'Рекурсивный факториал',
    description: 'Calculate factorial using recursion',
    descriptionRu: 'Рекурсия — когда функция вызывает саму себя. Для факториала: n! = n × (n-1)!. Базовый случай: 0! = 1! = 1 (без него рекурсия будет бесконечной!). Напишите рекурсивную функцию factorial(n).',
    difficulty: 'medium',
    points: 50,
    order: 5,
    grades: [9],
    starterCode: '# Рекурсивная функция factorial(n)\n',
    solution: 'def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\nn = int(input())\nprint(factorial(n))',
    hints: ['Базовый случай: factorial(0) = factorial(1) = 1'],
    testCases: [
      { id: 'tc1', input: '5', expectedOutput: '120', isHidden: false, description: '5! = 120' },
      { id: 'tc2', input: '0', expectedOutput: '1', isHidden: false, description: '0! = 1' },
      { id: 'tc3', input: '1', expectedOutput: '1', isHidden: true, description: '1! = 1' },
      { id: 'tc4', input: '7', expectedOutput: '5040', isHidden: true, description: '7! = 5040' },
      { id: 'tc5', input: '10', expectedOutput: '3628800', isHidden: true, description: '10!' }
    ]
  },
  {
    id: 'func-6',
    topicId: 'functions-9',
    title: 'Default Arguments',
    titleRu: 'Аргументы по умолчанию',
    description: 'Create function with default arguments',
    descriptionRu: 'Создайте функцию с аргументами по умолчанию',
    difficulty: 'easy',
    points: 15,
    order: 6,
    grades: [9],
    starterCode: '# greet(name, greeting="Hello")\n# Прочитайте имя и выведите приветствие\n',
    solution: 'def greet(name, greeting="Hello"):\n    return f"{greeting}, {name}!"\n\nname = input()\nprint(greet(name))',
    hints: ['Значение по умолчанию задаётся через ='],
    testCases: [
      { id: 'tc1', input: 'World', expectedOutput: 'Hello, World!', isHidden: false },
      { id: 'tc2', input: 'Python', expectedOutput: 'Hello, Python!', isHidden: false }
    ]
  },
  {
    id: 'func-7',
    topicId: 'functions-9',
    title: 'Sum Args',
    titleRu: 'Сумма аргументов',
    description: 'Sum variable number of arguments',
    descriptionRu: 'В Python *args позволяет функции принимать ЛЮБОЕ количество аргументов. Они собираются в кортеж. Напишите функцию sum_all(*args), которая суммирует все переданные числа. Для вызова со списком используйте: sum_all(*список).',
    difficulty: 'medium',
    points: 50,
    order: 7,
    grades: [9],
    starterCode: '# sum_all(*args) - принимает любое количество чисел\n',
    solution: 'def sum_all(*args):\n    return sum(args)\n\nnums = list(map(int, input().split()))\nprint(sum_all(*nums))',
    hints: ['*args собирает все позиционные аргументы в кортеж'],
    testCases: [
      { id: 'tc1', input: '1 2 3 4 5', expectedOutput: '15', isHidden: false, description: 'Пять чисел' },
      { id: 'tc2', input: '10', expectedOutput: '10', isHidden: false, description: 'Одно число' },
      { id: 'tc3', input: '0 0 0', expectedOutput: '0', isHidden: true, description: 'Все нули' },
      { id: 'tc4', input: '-5 5', expectedOutput: '0', isHidden: true, description: 'В сумме ноль' },
      { id: 'tc5', input: '100 200 300', expectedOutput: '600', isHidden: true, description: 'Большие числа' }
    ]
  },
  {
    id: 'func-8',
    topicId: 'functions-9',
    title: 'Lambda Filter',
    titleRu: 'Лямбда-фильтр',
    description: 'Filter list using lambda',
    descriptionRu: 'Lambda — это анонимная (безымянная) функция: lambda x: x > 0. filter(функция, список) оставляет только элементы, для которых функция возвращает True. Отфильтруйте список, оставив только ПОЛОЖИТЕЛЬНЫЕ числа.',
    difficulty: 'medium',
    points: 50,
    order: 8,
    grades: [9],
    starterCode: '# Оставьте только положительные числа\n',
    solution: 'nums = list(map(int, input().split()))\nresult = list(filter(lambda x: x > 0, nums))\nprint(" ".join(map(str, result)))',
    hints: ['filter(функция, список) оставляет элементы, для которых функция возвращает True'],
    testCases: [
      { id: 'tc1', input: '-1 2 -3 4 -5', expectedOutput: '2 4', isHidden: false, description: 'Смешанные' },
      { id: 'tc2', input: '1 2 3', expectedOutput: '1 2 3', isHidden: false, description: 'Все положительные' },
      { id: 'tc3', input: '-1 -2 -3', expectedOutput: '', isHidden: true, description: 'Все отрицательные' },
      { id: 'tc4', input: '0 1 0 2', expectedOutput: '1 2', isHidden: true, description: 'С нулями' },
      { id: 'tc5', input: '5', expectedOutput: '5', isHidden: true, description: 'Один положительный' }
    ]
  },
  {
    id: 'func-9',
    topicId: 'functions-9',
    title: 'Map Function',
    titleRu: 'Функция map',
    description: 'Square all elements using map',
    descriptionRu: 'map(функция, список) применяет функцию к КАЖДОМУ элементу списка и возвращает новый список. Используйте map и lambda для возведения всех чисел в квадрат. Пример: map(lambda x: x*2, [1,2,3]) → [2,4,6].',
    difficulty: 'medium',
    points: 50,
    order: 9,
    grades: [9],
    starterCode: '# Используйте map и lambda\n',
    solution: 'nums = list(map(int, input().split()))\nresult = list(map(lambda x: x**2, nums))\nprint(" ".join(map(str, result)))',
    hints: ['map(функция, список) применяет функцию к каждому элементу'],
    testCases: [
      { id: 'tc1', input: '1 2 3 4', expectedOutput: '1 4 9 16', isHidden: false, description: 'Положительные' },
      { id: 'tc2', input: '-2 0 2', expectedOutput: '4 0 4', isHidden: false, description: 'С нулём и минусом' },
      { id: 'tc3', input: '5', expectedOutput: '25', isHidden: true, description: 'Одно число' },
      { id: 'tc4', input: '10 20 30', expectedOutput: '100 400 900', isHidden: true, description: 'Большие числа' },
      { id: 'tc5', input: '0 0 0', expectedOutput: '0 0 0', isHidden: true, description: 'Все нули' }
    ]
  },
  {
    id: 'func-10',
    topicId: 'functions-9',
    title: 'Decorator',
    titleRu: 'Декоратор',
    description: 'Create a simple timer decorator',
    descriptionRu: 'Декоратор — это функция, которая "оборачивает" другую функцию, добавляя ей новое поведение. Синтаксис: @decorator перед def. Создайте декоратор timer, который печатает "start" ПЕРЕД вызовом функции и "end" ПОСЛЕ. Декоратор принимает функцию и возвращает функцию-обёртку (wrapper).',
    difficulty: 'hard',
    points: 100,
    order: 10,
    grades: [9],
    starterCode: '# Создайте декоратор, который печатает "start" перед\n# и "end" после вызова функции\n',
    solution: 'def timer(func):\n    def wrapper(*args, **kwargs):\n        print("start")\n        result = func(*args, **kwargs)\n        print("end")\n        return result\n    return wrapper\n\n@timer\ndef say_hello():\n    print("hello")\n\nsay_hello()',
    hints: ['Декоратор - функция, которая принимает функцию и возвращает функцию'],
    testCases: [
      { id: 'tc1', input: '', expectedOutput: 'start\nhello\nend', isHidden: false, description: 'Основной тест' }
    ]
  },

  // ООП - 10 класс
  {
    id: 'oop-1',
    topicId: 'oop-basics-10',
    title: 'Simple Class',
    titleRu: 'Простой класс',
    description: 'Create a simple Person class',
    descriptionRu: 'Создайте простой класс Person',
    difficulty: 'easy',
    points: 15,
    order: 1,
    grades: [10],
    starterCode: '# Класс Person с атрибутами name и age\n# Метод greet() возвращает "Hello, I am {name}"\n',
    solution: 'class Person:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n    \n    def greet(self):\n        return f"Hello, I am {self.name}"\n\nname = input()\nage = int(input())\np = Person(name, age)\nprint(p.greet())',
    hints: ['__init__ - конструктор класса', 'self - ссылка на текущий объект'],
    testCases: [
      { id: 'tc1', input: 'Alice\n25', expectedOutput: 'Hello, I am Alice', isHidden: false },
      { id: 'tc2', input: 'Bob\n30', expectedOutput: 'Hello, I am Bob', isHidden: false }
    ]
  },
  {
    id: 'oop-2',
    topicId: 'oop-basics-10',
    title: 'Rectangle Class',
    titleRu: 'Класс Прямоугольник',
    description: 'Create a Rectangle class with area method',
    descriptionRu: 'Создайте класс Rectangle с методом area',
    difficulty: 'easy',
    points: 15,
    order: 2,
    grades: [10],
    starterCode: '# Rectangle(width, height) с методами area() и perimeter()\n',
    solution: 'class Rectangle:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n    \n    def area(self):\n        return self.width * self.height\n    \n    def perimeter(self):\n        return 2 * (self.width + self.height)\n\nw, h = map(int, input().split())\nr = Rectangle(w, h)\nprint(r.area())\nprint(r.perimeter())',
    hints: ['Площадь = ширина × высота'],
    testCases: [
      { id: 'tc1', input: '5 3', expectedOutput: '15\n16', isHidden: false },
      { id: 'tc2', input: '10 10', expectedOutput: '100\n40', isHidden: false }
    ]
  },
  {
    id: 'oop-3',
    topicId: 'oop-basics-10',
    title: 'Bank Account',
    titleRu: 'Банковский счёт',
    description: 'Create a BankAccount class',
    descriptionRu: 'Создайте класс BankAccount для работы с банковским счётом. Конструктор принимает начальный баланс (по умолчанию 0). Методы: deposit(сумма) — пополнение, withdraw(сумма) — снятие (проверьте, хватает ли денег!), get_balance() — текущий баланс.',
    difficulty: 'medium',
    points: 50,
    order: 3,
    grades: [10],
    starterCode: '# BankAccount(balance)\n# deposit(amount), withdraw(amount), get_balance()\n',
    solution: 'class BankAccount:\n    def __init__(self, balance=0):\n        self.balance = balance\n    \n    def deposit(self, amount):\n        self.balance += amount\n    \n    def withdraw(self, amount):\n        if amount <= self.balance:\n            self.balance -= amount\n            return True\n        return False\n    \n    def get_balance(self):\n        return self.balance\n\nacc = BankAccount(100)\nacc.deposit(50)\nacc.withdraw(30)\nprint(acc.get_balance())',
    hints: ['Проверяйте достаточность средств при снятии'],
    testCases: [
      { id: 'tc1', input: '', expectedOutput: '120', isHidden: false, description: '100+50-30=120' }
    ]
  },
  {
    id: 'oop-4',
    topicId: 'oop-basics-10',
    title: 'Inheritance',
    titleRu: 'Наследование',
    description: 'Create Animal and Dog classes',
    descriptionRu: 'Наследование позволяет создать класс на основе другого. Синтаксис: class Dog(Animal). Dog получает все атрибуты и методы Animal, но может переопределить их. Создайте Animal(name) с методом speak() и Dog, у которого speak() возвращает "Woof!".',
    difficulty: 'medium',
    points: 50,
    order: 4,
    grades: [10],
    starterCode: '# Animal(name) с методом speak()\n# Dog(name) наследует Animal, speak() возвращает "Woof!"\n',
    solution: 'class Animal:\n    def __init__(self, name):\n        self.name = name\n    \n    def speak(self):\n        return "Some sound"\n\nclass Dog(Animal):\n    def speak(self):\n        return "Woof!"\n\nname = input()\ndog = Dog(name)\nprint(f"{dog.name} says {dog.speak()}")',
    hints: ['class Dog(Animal) - Dog наследует Animal'],
    testCases: [
      { id: 'tc1', input: 'Buddy', expectedOutput: 'Buddy says Woof!', isHidden: false, description: 'Собака Buddy' },
      { id: 'tc2', input: 'Rex', expectedOutput: 'Rex says Woof!', isHidden: true, description: 'Собака Rex' },
      { id: 'tc3', input: 'Max', expectedOutput: 'Max says Woof!', isHidden: true, description: 'Собака Max' }
    ]
  },
  {
    id: 'oop-5',
    topicId: 'oop-basics-10',
    title: 'Counter Class',
    titleRu: 'Класс счётчик',
    description: 'Create a Counter with class variable',
    descriptionRu: 'Переменная КЛАССА (не экземпляра) — общая для всех объектов. Определяется ВНЕ __init__. Создайте класс Counter, который считает количество созданных экземпляров. При каждом создании объекта увеличивайте Counter.count на 1.',
    difficulty: 'medium',
    points: 50,
    order: 5,
    grades: [10],
    starterCode: '# Counter() подсчитывает количество созданных экземпляров\n',
    solution: 'class Counter:\n    count = 0\n    \n    def __init__(self):\n        Counter.count += 1\n    \n    @classmethod\n    def get_count(cls):\n        return cls.count\n\nc1 = Counter()\nc2 = Counter()\nc3 = Counter()\nprint(Counter.get_count())',
    hints: ['Переменная класса определяется вне __init__'],
    testCases: [
      { id: 'tc1', input: '', expectedOutput: '3', isHidden: false, description: 'Три экземпляра' }
    ]
  },
  {
    id: 'oop-6',
    topicId: 'oop-basics-10',
    title: '__str__ Method',
    titleRu: 'Метод __str__',
    description: 'Implement __str__ for a class',
    descriptionRu: 'Реализуйте __str__ для класса',
    difficulty: 'easy',
    points: 15,
    order: 6,
    grades: [10],
    starterCode: '# Book(title, author) с __str__: "title by author"\n',
    solution: 'class Book:\n    def __init__(self, title, author):\n        self.title = title\n        self.author = author\n    \n    def __str__(self):\n        return f"{self.title} by {self.author}"\n\ntitle = input()\nauthor = input()\nbook = Book(title, author)\nprint(book)',
    hints: ['__str__ вызывается при print(объект)'],
    testCases: [
      { id: 'tc1', input: 'Python\nGuido', expectedOutput: 'Python by Guido', isHidden: false }
    ]
  },
  {
    id: 'oop-7',
    topicId: 'oop-basics-10',
    title: 'Stack Class',
    titleRu: 'Класс стек',
    description: 'Implement a Stack data structure',
    descriptionRu: 'Стек — структура данных LIFO (Last In, First Out): последний добавленный элемент извлекается первым. Как стопка тарелок! Методы: push(элемент) — добавить на вершину, pop() — извлечь с вершины, peek() — посмотреть вершину без удаления, is_empty() — проверка на пустоту.',
    difficulty: 'hard',
    points: 100,
    order: 7,
    grades: [10],
    starterCode: '# Stack с методами push(), pop(), peek(), is_empty()\n',
    solution: 'class Stack:\n    def __init__(self):\n        self.items = []\n    \n    def push(self, item):\n        self.items.append(item)\n    \n    def pop(self):\n        if not self.is_empty():\n            return self.items.pop()\n        return None\n    \n    def peek(self):\n        if not self.is_empty():\n            return self.items[-1]\n        return None\n    \n    def is_empty(self):\n        return len(self.items) == 0\n\ns = Stack()\ns.push(1)\ns.push(2)\ns.push(3)\nprint(s.pop())\nprint(s.peek())',
    hints: ['LIFO - последний вошёл, первый вышел'],
    testCases: [
      { id: 'tc1', input: '', expectedOutput: '3\n2', isHidden: false, description: 'push 1,2,3 затем pop и peek' }
    ]
  },
  {
    id: 'oop-8',
    topicId: 'oop-basics-10',
    title: 'Operator Overloading',
    titleRu: 'Перегрузка операторов',
    description: 'Overload + operator for Vector class',
    descriptionRu: 'Перегрузка операторов позволяет использовать +, -, * с вашими классами. Метод __add__(self, other) вызывается при v1 + v2. Создайте класс Vector(x, y) с перегруженным +, который складывает соответствующие координаты: (1,2) + (3,4) = (4,6).',
    difficulty: 'hard',
    points: 100,
    order: 8,
    grades: [10],
    starterCode: '# Vector(x, y) с __add__ для сложения векторов\n',
    solution: 'class Vector:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n    \n    def __add__(self, other):\n        return Vector(self.x + other.x, self.y + other.y)\n    \n    def __str__(self):\n        return f"({self.x}, {self.y})"\n\nv1 = Vector(1, 2)\nv2 = Vector(3, 4)\nv3 = v1 + v2\nprint(v3)',
    hints: ['__add__ определяет поведение оператора +'],
    testCases: [
      { id: 'tc1', input: '', expectedOutput: '(4, 6)', isHidden: false, description: '(1,2)+(3,4)=(4,6)' }
    ]
  },
  {
    id: 'oop-9',
    topicId: 'oop-basics-10',
    title: 'Property Decorator',
    titleRu: 'Декоратор property',
    description: 'Use @property decorator',
    descriptionRu: '@property превращает метод в атрибут — можно писать c.area вместо c.area(). Это удобно для вычисляемых свойств. Создайте Circle(radius) с property area, которое вычисляет площадь (π × r²). Атрибут _radius (с подчёркиванием) — "приватный".',
    difficulty: 'hard',
    points: 100,
    order: 9,
    grades: [10],
    starterCode: '# Circle(radius) с property area (только чтение)\n',
    solution: 'class Circle:\n    def __init__(self, radius):\n        self._radius = radius\n    \n    @property\n    def radius(self):\n        return self._radius\n    \n    @radius.setter\n    def radius(self, value):\n        if value > 0:\n            self._radius = value\n    \n    @property\n    def area(self):\n        return 3.14159 * self._radius ** 2\n\nc = Circle(5)\nprint(round(c.area, 2))',
    hints: ['@property превращает метод в атрибут'],
    testCases: [
      { id: 'tc1', input: '', expectedOutput: '78.54', isHidden: false, description: 'Площадь круга r=5' }
    ]
  },
  {
    id: 'oop-10',
    topicId: 'oop-basics-10',
    title: 'Abstract Class',
    titleRu: 'Абстрактный класс',
    description: 'Create an abstract Shape class',
    descriptionRu: 'Абстрактный класс — шаблон, от которого нельзя создать объект напрямую. Используется для определения интерфейса. Создайте абстрактный Shape с методом area() и конкретные классы Circle и Square, которые его реализуют. Импортируйте ABC и abstractmethod из модуля abc.',
    difficulty: 'hard',
    points: 100,
    order: 10,
    grades: [10],
    starterCode: '# Абстрактный Shape с методом area()\n# Конкретные Circle и Square\n',
    solution: 'from abc import ABC, abstractmethod\n\nclass Shape(ABC):\n    @abstractmethod\n    def area(self):\n        pass\n\nclass Circle(Shape):\n    def __init__(self, radius):\n        self.radius = radius\n    \n    def area(self):\n        return 3.14 * self.radius ** 2\n\nclass Square(Shape):\n    def __init__(self, side):\n        self.side = side\n    \n    def area(self):\n        return self.side ** 2\n\nc = Circle(5)\ns = Square(4)\nprint(c.area())\nprint(s.area())',
    hints: ['Используйте ABC из модуля abc'],
    testCases: [
      { id: 'tc1', input: '', expectedOutput: '78.5\n16', isHidden: false, description: 'Круг r=5 и квадрат 4×4' }
    ]
  }
];

export const getProblemsByTopic = (topicId: string): Problem[] => {
  return problems.filter(p => p.topicId === topicId).sort((a, b) => a.order - b.order);
};

export const getProblemById = (id: string): Problem | undefined => {
  return problems.find(p => p.id === id);
};

export const getProblemsByGrade = (grade: number): Problem[] => {
  return problems.filter(p => p.grades.includes(grade));
};
