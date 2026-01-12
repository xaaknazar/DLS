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
    grade: 7,
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
    grade: 7,
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
    grade: 7,
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
    grade: 7,
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
    descriptionRu: 'Преобразуйте температуру из Цельсия в Фаренгейт',
    difficulty: 'medium',
    points: 20,
    order: 5,
    grade: 7,
    starterCode: '# F = C * 9/5 + 32\n# Прочитайте температуру в Цельсиях, выведите в Фаренгейтах\n',
    solution: 'c = float(input())\nf = c * 9/5 + 32\nprint(f)',
    hints: ['Формула: F = C × 9/5 + 32', 'Используйте float для дробных чисел'],
    testCases: [
      { id: 'tc1', input: '0', expectedOutput: '32.0', isHidden: false },
      { id: 'tc2', input: '100', expectedOutput: '212.0', isHidden: false },
      { id: 'tc3', input: '-40', expectedOutput: '-40.0', isHidden: true }
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
    grade: 7,
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
    descriptionRu: 'Найдите сумму цифр двузначного числа',
    difficulty: 'medium',
    points: 20,
    order: 7,
    grade: 7,
    starterCode: '# Прочитайте двузначное число, выведите сумму его цифр\n',
    solution: 'n = int(input())\nprint(n // 10 + n % 10)',
    hints: ['// даёт целую часть от деления', '% даёт остаток от деления'],
    testCases: [
      { id: 'tc1', input: '23', expectedOutput: '5', isHidden: false },
      { id: 'tc2', input: '99', expectedOutput: '18', isHidden: false },
      { id: 'tc3', input: '10', expectedOutput: '1', isHidden: true }
    ]
  },
  {
    id: 'var-8',
    topicId: 'variables-7',
    title: 'Time Conversion',
    titleRu: 'Преобразование времени',
    description: 'Convert seconds to hours, minutes and seconds',
    descriptionRu: 'Преобразуйте секунды в часы, минуты и секунды',
    difficulty: 'medium',
    points: 25,
    order: 8,
    grade: 7,
    starterCode: '# Прочитайте количество секунд\n# Выведите в формате: H:M:S\n',
    solution: 's = int(input())\nh = s // 3600\nm = (s % 3600) // 60\nsec = s % 60\nprint(f"{h}:{m}:{sec}")',
    hints: ['В часе 3600 секунд', 'В минуте 60 секунд'],
    testCases: [
      { id: 'tc1', input: '3661', expectedOutput: '1:1:1', isHidden: false },
      { id: 'tc2', input: '7200', expectedOutput: '2:0:0', isHidden: false },
      { id: 'tc3', input: '90', expectedOutput: '0:1:30', isHidden: true }
    ]
  },
  {
    id: 'var-9',
    topicId: 'variables-7',
    title: 'Circle Calculations',
    titleRu: 'Вычисления круга',
    description: 'Calculate circle area and circumference',
    descriptionRu: 'Вычислите площадь и длину окружности',
    difficulty: 'medium',
    points: 25,
    order: 9,
    grade: 7,
    starterCode: '# Прочитайте радиус, выведите площадь и длину окружности\n# Используйте pi = 3.14159\n',
    solution: 'r = float(input())\npi = 3.14159\narea = pi * r ** 2\ncirc = 2 * pi * r\nprint(round(area, 2))\nprint(round(circ, 2))',
    hints: ['Площадь = π × r²', 'Длина окружности = 2 × π × r'],
    testCases: [
      { id: 'tc1', input: '1', expectedOutput: '3.14\n6.28', isHidden: false },
      { id: 'tc2', input: '5', expectedOutput: '78.54\n31.42', isHidden: false }
    ]
  },
  {
    id: 'var-10',
    topicId: 'variables-7',
    title: 'BMI Calculator',
    titleRu: 'Калькулятор ИМТ',
    description: 'Calculate Body Mass Index',
    descriptionRu: 'Вычислите индекс массы тела',
    difficulty: 'hard',
    points: 30,
    order: 10,
    grade: 7,
    starterCode: '# Прочитайте вес (кг) и рост (м)\n# Выведите ИМТ округлённый до 1 знака\n# ИМТ = вес / рост²\n',
    solution: 'weight = float(input())\nheight = float(input())\nbmi = weight / (height ** 2)\nprint(round(bmi, 1))',
    hints: ['ИМТ = вес / рост²', 'Используйте round(x, 1) для округления'],
    testCases: [
      { id: 'tc1', input: '70\n1.75', expectedOutput: '22.9', isHidden: false },
      { id: 'tc2', input: '80\n1.8', expectedOutput: '24.7', isHidden: false }
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
    grade: 8,
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
    grade: 8,
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
    descriptionRu: 'Преобразуйте баллы в оценку (A/B/C/D/F)',
    difficulty: 'medium',
    points: 20,
    order: 3,
    grade: 8,
    starterCode: '# 90-100: A, 80-89: B, 70-79: C, 60-69: D, <60: F\n',
    solution: 'score = int(input())\nif score >= 90:\n    print("A")\nelif score >= 80:\n    print("B")\nelif score >= 70:\n    print("C")\nelif score >= 60:\n    print("D")\nelse:\n    print("F")',
    hints: ['Используйте elif для множественных условий'],
    testCases: [
      { id: 'tc1', input: '95', expectedOutput: 'A', isHidden: false },
      { id: 'tc2', input: '73', expectedOutput: 'C', isHidden: false },
      { id: 'tc3', input: '59', expectedOutput: 'F', isHidden: true }
    ]
  },
  {
    id: 'cond-4',
    topicId: 'conditions-8',
    title: 'Leap Year',
    titleRu: 'Високосный год',
    description: 'Check if a year is a leap year',
    descriptionRu: 'Проверьте, является ли год високосным',
    difficulty: 'medium',
    points: 25,
    order: 4,
    grade: 8,
    starterCode: '# Год високосный если:\n# делится на 4, но не на 100\n# ИЛИ делится на 400\n',
    solution: 'year = int(input())\nif (year % 4 == 0 and year % 100 != 0) or year % 400 == 0:\n    print("yes")\nelse:\n    print("no")',
    hints: ['Используйте and и or для сложных условий'],
    testCases: [
      { id: 'tc1', input: '2000', expectedOutput: 'yes', isHidden: false },
      { id: 'tc2', input: '1900', expectedOutput: 'no', isHidden: false },
      { id: 'tc3', input: '2024', expectedOutput: 'yes', isHidden: true }
    ]
  },
  {
    id: 'cond-5',
    topicId: 'conditions-8',
    title: 'Triangle Check',
    titleRu: 'Проверка треугольника',
    description: 'Check if three sides can form a triangle',
    descriptionRu: 'Проверьте, могут ли три стороны образовать треугольник',
    difficulty: 'medium',
    points: 25,
    order: 5,
    grade: 8,
    starterCode: '# Прочитайте три стороны\n# Выведите "yes" или "no"\n',
    solution: 'a = int(input())\nb = int(input())\nc = int(input())\nif a + b > c and b + c > a and a + c > b:\n    print("yes")\nelse:\n    print("no")',
    hints: ['Сумма любых двух сторон должна быть больше третьей'],
    testCases: [
      { id: 'tc1', input: '3\n4\n5', expectedOutput: 'yes', isHidden: false },
      { id: 'tc2', input: '1\n2\n10', expectedOutput: 'no', isHidden: false }
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
    grade: 8,
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
    descriptionRu: 'Вычислите цену билета по возрасту',
    difficulty: 'medium',
    points: 20,
    order: 7,
    grade: 8,
    starterCode: '# <7: бесплатно, 7-18: 50, 18-65: 100, >65: 50\n',
    solution: 'age = int(input())\nif age < 7:\n    print(0)\nelif age < 18:\n    print(50)\nelif age < 65:\n    print(100)\nelse:\n    print(50)',
    hints: ['Проверяйте возрастные границы последовательно'],
    testCases: [
      { id: 'tc1', input: '5', expectedOutput: '0', isHidden: false },
      { id: 'tc2', input: '25', expectedOutput: '100', isHidden: false },
      { id: 'tc3', input: '70', expectedOutput: '50', isHidden: true }
    ]
  },
  {
    id: 'cond-8',
    topicId: 'conditions-8',
    title: 'Quadrant',
    titleRu: 'Квадрант',
    description: 'Determine which quadrant a point is in',
    descriptionRu: 'Определите, в каком квадранте находится точка',
    difficulty: 'medium',
    points: 20,
    order: 8,
    grade: 8,
    starterCode: '# Прочитайте x и y\n# Выведите номер квадранта (1-4) или 0 если на оси\n',
    solution: 'x = int(input())\ny = int(input())\nif x > 0 and y > 0:\n    print(1)\nelif x < 0 and y > 0:\n    print(2)\nelif x < 0 and y < 0:\n    print(3)\nelif x > 0 and y < 0:\n    print(4)\nelse:\n    print(0)',
    hints: ['Квадранты нумеруются против часовой стрелки'],
    testCases: [
      { id: 'tc1', input: '5\n5', expectedOutput: '1', isHidden: false },
      { id: 'tc2', input: '-3\n-3', expectedOutput: '3', isHidden: false },
      { id: 'tc3', input: '0\n5', expectedOutput: '0', isHidden: true }
    ]
  },
  {
    id: 'cond-9',
    topicId: 'conditions-8',
    title: 'Sort Three',
    titleRu: 'Сортировка трёх',
    description: 'Sort three numbers in ascending order',
    descriptionRu: 'Отсортируйте три числа по возрастанию',
    difficulty: 'hard',
    points: 30,
    order: 9,
    grade: 8,
    starterCode: '# Прочитайте три числа, выведите отсортированные\n',
    solution: 'a = int(input())\nb = int(input())\nc = int(input())\nif a > b:\n    a, b = b, a\nif b > c:\n    b, c = c, b\nif a > b:\n    a, b = b, a\nprint(a, b, c)',
    hints: ['Используйте пузырьковую сортировку'],
    testCases: [
      { id: 'tc1', input: '3\n1\n2', expectedOutput: '1 2 3', isHidden: false },
      { id: 'tc2', input: '5\n5\n5', expectedOutput: '5 5 5', isHidden: false }
    ]
  },
  {
    id: 'cond-10',
    topicId: 'conditions-8',
    title: 'Date Validator',
    titleRu: 'Проверка даты',
    description: 'Check if a date is valid',
    descriptionRu: 'Проверьте, является ли дата корректной',
    difficulty: 'hard',
    points: 35,
    order: 10,
    grade: 8,
    starterCode: '# Прочитайте день, месяц, год\n# Выведите "valid" или "invalid"\n',
    solution: 'day = int(input())\nmonth = int(input())\nyear = int(input())\ndays_in_month = [31,28,31,30,31,30,31,31,30,31,30,31]\nif (year % 4 == 0 and year % 100 != 0) or year % 400 == 0:\n    days_in_month[1] = 29\nif 1 <= month <= 12 and 1 <= day <= days_in_month[month-1]:\n    print("valid")\nelse:\n    print("invalid")',
    hints: ['Учтите високосные годы для февраля'],
    testCases: [
      { id: 'tc1', input: '29\n2\n2000', expectedOutput: 'valid', isHidden: false },
      { id: 'tc2', input: '31\n4\n2023', expectedOutput: 'invalid', isHidden: false }
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
    grade: 8,
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
    grade: 8,
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
    descriptionRu: 'Вычислите факториал числа N',
    difficulty: 'medium',
    points: 20,
    order: 3,
    grade: 8,
    starterCode: '# N! = 1 * 2 * 3 * ... * N\n',
    solution: 'n = int(input())\nresult = 1\nfor i in range(1, n + 1):\n    result *= i\nprint(result)',
    hints: ['Факториал - произведение всех чисел от 1 до N'],
    testCases: [
      { id: 'tc1', input: '5', expectedOutput: '120', isHidden: false },
      { id: 'tc2', input: '0', expectedOutput: '1', isHidden: false }
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
    grade: 8,
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
    descriptionRu: 'Вычислите сумму цифр числа',
    difficulty: 'medium',
    points: 20,
    order: 5,
    grade: 8,
    starterCode: '# Прочитайте число, выведите сумму его цифр\n',
    solution: 'n = input()\ntotal = 0\nfor digit in n:\n    total += int(digit)\nprint(total)',
    hints: ['Можно перебрать строку посимвольно'],
    testCases: [
      { id: 'tc1', input: '123', expectedOutput: '6', isHidden: false },
      { id: 'tc2', input: '9999', expectedOutput: '36', isHidden: false }
    ]
  },
  {
    id: 'for-6',
    topicId: 'loops-for-8',
    title: 'Power',
    titleRu: 'Степень',
    description: 'Calculate a^b without using **',
    descriptionRu: 'Вычислите a^b без использования **',
    difficulty: 'medium',
    points: 20,
    order: 6,
    grade: 8,
    starterCode: '# Прочитайте a и b, выведите a в степени b\n',
    solution: 'a = int(input())\nb = int(input())\nresult = 1\nfor _ in range(b):\n    result *= a\nprint(result)',
    hints: ['Умножьте a на себя b раз'],
    testCases: [
      { id: 'tc1', input: '2\n10', expectedOutput: '1024', isHidden: false },
      { id: 'tc2', input: '5\n3', expectedOutput: '125', isHidden: false }
    ]
  },
  {
    id: 'for-7',
    topicId: 'loops-for-8',
    title: 'Reverse Number',
    titleRu: 'Переворот числа',
    description: 'Reverse digits of a number',
    descriptionRu: 'Переверните цифры числа',
    difficulty: 'medium',
    points: 25,
    order: 7,
    grade: 8,
    starterCode: '# 123 -> 321\n',
    solution: 'n = input()\nresult = ""\nfor char in n:\n    result = char + result\nprint(result)',
    hints: ['Добавляйте каждую цифру в начало результата'],
    testCases: [
      { id: 'tc1', input: '123', expectedOutput: '321', isHidden: false },
      { id: 'tc2', input: '1000', expectedOutput: '0001', isHidden: false }
    ]
  },
  {
    id: 'for-8',
    topicId: 'loops-for-8',
    title: 'Prime Check',
    titleRu: 'Проверка простоты',
    description: 'Check if a number is prime',
    descriptionRu: 'Проверьте, является ли число простым',
    difficulty: 'hard',
    points: 30,
    order: 8,
    grade: 8,
    starterCode: '# Простое число делится только на 1 и себя\n',
    solution: 'n = int(input())\nif n < 2:\n    print("no")\nelse:\n    is_prime = True\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            is_prime = False\n            break\n    print("yes" if is_prime else "no")',
    hints: ['Достаточно проверить делители до корня из n'],
    testCases: [
      { id: 'tc1', input: '7', expectedOutput: 'yes', isHidden: false },
      { id: 'tc2', input: '10', expectedOutput: 'no', isHidden: false },
      { id: 'tc3', input: '1', expectedOutput: 'no', isHidden: true }
    ]
  },
  {
    id: 'for-9',
    topicId: 'loops-for-8',
    title: 'Fibonacci',
    titleRu: 'Фибоначчи',
    description: 'Print first N Fibonacci numbers',
    descriptionRu: 'Выведите первые N чисел Фибоначчи',
    difficulty: 'hard',
    points: 30,
    order: 9,
    grade: 8,
    starterCode: '# 1, 1, 2, 3, 5, 8, 13, ...\n',
    solution: 'n = int(input())\na, b = 1, 1\nfor i in range(n):\n    print(a)\n    a, b = b, a + b',
    hints: ['Каждое число - сумма двух предыдущих'],
    testCases: [
      { id: 'tc1', input: '5', expectedOutput: '1\n1\n2\n3\n5', isHidden: false },
      { id: 'tc2', input: '8', expectedOutput: '1\n1\n2\n3\n5\n8\n13\n21', isHidden: false }
    ]
  },
  {
    id: 'for-10',
    topicId: 'loops-for-8',
    title: 'Triangle Pattern',
    titleRu: 'Треугольник из звёзд',
    description: 'Print a triangle pattern',
    descriptionRu: 'Выведите треугольник из звёздочек',
    difficulty: 'medium',
    points: 25,
    order: 10,
    grade: 8,
    starterCode: '# N=3:\n# *\n# **\n# ***\n',
    solution: 'n = int(input())\nfor i in range(1, n + 1):\n    print("*" * i)',
    hints: ['Умножение строки на число повторяет её'],
    testCases: [
      { id: 'tc1', input: '3', expectedOutput: '*\n**\n***', isHidden: false },
      { id: 'tc2', input: '5', expectedOutput: '*\n**\n***\n****\n*****', isHidden: false }
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
    grade: 9,
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
    grade: 9,
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
    descriptionRu: 'Переверните список без reverse()',
    difficulty: 'medium',
    points: 20,
    order: 3,
    grade: 9,
    starterCode: '# Выведите элементы в обратном порядке\n',
    solution: 'nums = input().split()\nresult = []\nfor item in nums:\n    result.insert(0, item)\nprint(" ".join(result))',
    hints: ['insert(0, x) вставляет элемент в начало'],
    testCases: [
      { id: 'tc1', input: '1 2 3 4 5', expectedOutput: '5 4 3 2 1', isHidden: false },
      { id: 'tc2', input: 'a b c', expectedOutput: 'c b a', isHidden: false }
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
    grade: 9,
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
    descriptionRu: 'Удалите повторяющиеся элементы',
    difficulty: 'medium',
    points: 20,
    order: 5,
    grade: 9,
    starterCode: '# Сохраните порядок первого появления\n',
    solution: 'nums = input().split()\nresult = []\nfor n in nums:\n    if n not in result:\n        result.append(n)\nprint(" ".join(result))',
    hints: ['Проверяйте наличие перед добавлением'],
    testCases: [
      { id: 'tc1', input: '1 2 2 3 1 4', expectedOutput: '1 2 3 4', isHidden: false },
      { id: 'tc2', input: 'a a a', expectedOutput: 'a', isHidden: false }
    ]
  },
  {
    id: 'list-6',
    topicId: 'lists-9',
    title: 'List Intersection',
    titleRu: 'Пересечение списков',
    description: 'Find common elements in two lists',
    descriptionRu: 'Найдите общие элементы двух списков',
    difficulty: 'medium',
    points: 25,
    order: 6,
    grade: 9,
    starterCode: '# Две строки с числами через пробел\n',
    solution: 'list1 = input().split()\nlist2 = input().split()\nresult = []\nfor item in list1:\n    if item in list2 and item not in result:\n        result.append(item)\nprint(" ".join(result))',
    hints: ['Проверяйте наличие в обоих списках'],
    testCases: [
      { id: 'tc1', input: '1 2 3 4\n3 4 5 6', expectedOutput: '3 4', isHidden: false },
      { id: 'tc2', input: '1 2\n3 4', expectedOutput: '', isHidden: false }
    ]
  },
  {
    id: 'list-7',
    topicId: 'lists-9',
    title: 'Second Largest',
    titleRu: 'Второй максимум',
    description: 'Find the second largest element',
    descriptionRu: 'Найдите второй по величине элемент',
    difficulty: 'medium',
    points: 25,
    order: 7,
    grade: 9,
    starterCode: '# Все элементы уникальны\n',
    solution: 'nums = list(map(int, input().split()))\nfirst = second = float("-inf")\nfor n in nums:\n    if n > first:\n        second = first\n        first = n\n    elif n > second:\n        second = n\nprint(second)',
    hints: ['Отслеживайте два максимума'],
    testCases: [
      { id: 'tc1', input: '1 5 3 9 2', expectedOutput: '5', isHidden: false },
      { id: 'tc2', input: '10 20', expectedOutput: '10', isHidden: false }
    ]
  },
  {
    id: 'list-8',
    topicId: 'lists-9',
    title: 'Rotate List',
    titleRu: 'Поворот списка',
    description: 'Rotate list by k positions',
    descriptionRu: 'Сдвиньте список на k позиций вправо',
    difficulty: 'hard',
    points: 30,
    order: 8,
    grade: 9,
    starterCode: '# Строка 1: элементы\n# Строка 2: k\n',
    solution: 'nums = input().split()\nk = int(input())\nk = k % len(nums)\nresult = nums[-k:] + nums[:-k]\nprint(" ".join(result))',
    hints: ['Используйте срезы списка'],
    testCases: [
      { id: 'tc1', input: '1 2 3 4 5\n2', expectedOutput: '4 5 1 2 3', isHidden: false },
      { id: 'tc2', input: 'a b c d\n1', expectedOutput: 'd a b c', isHidden: false }
    ]
  },
  {
    id: 'list-9',
    topicId: 'lists-9',
    title: 'Merge Sorted Lists',
    titleRu: 'Слияние списков',
    description: 'Merge two sorted lists into one sorted list',
    descriptionRu: 'Объедините два отсортированных списка',
    difficulty: 'hard',
    points: 35,
    order: 9,
    grade: 9,
    starterCode: '# Два отсортированных списка\n',
    solution: 'list1 = list(map(int, input().split()))\nlist2 = list(map(int, input().split()))\nresult = []\ni = j = 0\nwhile i < len(list1) and j < len(list2):\n    if list1[i] <= list2[j]:\n        result.append(list1[i])\n        i += 1\n    else:\n        result.append(list2[j])\n        j += 1\nresult.extend(list1[i:])\nresult.extend(list2[j:])\nprint(" ".join(map(str, result)))',
    hints: ['Используйте два указателя'],
    testCases: [
      { id: 'tc1', input: '1 3 5\n2 4 6', expectedOutput: '1 2 3 4 5 6', isHidden: false },
      { id: 'tc2', input: '1 2 3\n4 5 6', expectedOutput: '1 2 3 4 5 6', isHidden: false }
    ]
  },
  {
    id: 'list-10',
    topicId: 'lists-9',
    title: 'List Comprehension',
    titleRu: 'Генератор списка',
    description: 'Use list comprehension to filter even squares',
    descriptionRu: 'Используйте генератор для фильтрации чётных квадратов',
    difficulty: 'medium',
    points: 25,
    order: 10,
    grade: 9,
    starterCode: '# Выведите квадраты чётных чисел от 1 до N\n',
    solution: 'n = int(input())\nresult = [x**2 for x in range(1, n+1) if x % 2 == 0]\nprint(" ".join(map(str, result)))',
    hints: ['[выражение for x in range if условие]'],
    testCases: [
      { id: 'tc1', input: '6', expectedOutput: '4 16 36', isHidden: false },
      { id: 'tc2', input: '10', expectedOutput: '4 16 36 64 100', isHidden: false }
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
    grade: 9,
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
    grade: 9,
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
    descriptionRu: 'Проверьте, является ли строка палиндромом',
    difficulty: 'medium',
    points: 20,
    order: 3,
    grade: 9,
    starterCode: '# Функция is_palindrome(s) -> bool\n',
    solution: 'def is_palindrome(s):\n    return s == s[::-1]\n\ns = input()\nprint("yes" if is_palindrome(s) else "no")',
    hints: ['Палиндром читается одинаково в обе стороны'],
    testCases: [
      { id: 'tc1', input: 'radar', expectedOutput: 'yes', isHidden: false },
      { id: 'tc2', input: 'hello', expectedOutput: 'no', isHidden: false }
    ]
  },
  {
    id: 'func-4',
    topicId: 'functions-9',
    title: 'GCD Function',
    titleRu: 'НОД',
    description: 'Calculate GCD of two numbers',
    descriptionRu: 'Вычислите НОД двух чисел',
    difficulty: 'medium',
    points: 25,
    order: 4,
    grade: 9,
    starterCode: '# Функция gcd(a, b) - алгоритм Евклида\n',
    solution: 'def gcd(a, b):\n    while b:\n        a, b = b, a % b\n    return a\n\na, b = map(int, input().split())\nprint(gcd(a, b))',
    hints: ['Алгоритм Евклида: gcd(a, b) = gcd(b, a%b)'],
    testCases: [
      { id: 'tc1', input: '12 8', expectedOutput: '4', isHidden: false },
      { id: 'tc2', input: '17 5', expectedOutput: '1', isHidden: false }
    ]
  },
  {
    id: 'func-5',
    topicId: 'functions-9',
    title: 'Recursive Factorial',
    titleRu: 'Рекурсивный факториал',
    description: 'Calculate factorial using recursion',
    descriptionRu: 'Вычислите факториал рекурсивно',
    difficulty: 'medium',
    points: 25,
    order: 5,
    grade: 9,
    starterCode: '# Рекурсивная функция factorial(n)\n',
    solution: 'def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\nn = int(input())\nprint(factorial(n))',
    hints: ['Базовый случай: factorial(0) = factorial(1) = 1'],
    testCases: [
      { id: 'tc1', input: '5', expectedOutput: '120', isHidden: false },
      { id: 'tc2', input: '0', expectedOutput: '1', isHidden: false }
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
    grade: 9,
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
    descriptionRu: 'Просуммируйте переменное число аргументов',
    difficulty: 'medium',
    points: 20,
    order: 7,
    grade: 9,
    starterCode: '# sum_all(*args) - принимает любое количество чисел\n',
    solution: 'def sum_all(*args):\n    return sum(args)\n\nnums = list(map(int, input().split()))\nprint(sum_all(*nums))',
    hints: ['*args собирает все позиционные аргументы в кортеж'],
    testCases: [
      { id: 'tc1', input: '1 2 3 4 5', expectedOutput: '15', isHidden: false },
      { id: 'tc2', input: '10', expectedOutput: '10', isHidden: false }
    ]
  },
  {
    id: 'func-8',
    topicId: 'functions-9',
    title: 'Lambda Filter',
    titleRu: 'Лямбда-фильтр',
    description: 'Filter list using lambda',
    descriptionRu: 'Отфильтруйте список с помощью lambda',
    difficulty: 'medium',
    points: 25,
    order: 8,
    grade: 9,
    starterCode: '# Оставьте только положительные числа\n',
    solution: 'nums = list(map(int, input().split()))\nresult = list(filter(lambda x: x > 0, nums))\nprint(" ".join(map(str, result)))',
    hints: ['filter(функция, список) оставляет элементы, для которых функция возвращает True'],
    testCases: [
      { id: 'tc1', input: '-1 2 -3 4 -5', expectedOutput: '2 4', isHidden: false },
      { id: 'tc2', input: '1 2 3', expectedOutput: '1 2 3', isHidden: false }
    ]
  },
  {
    id: 'func-9',
    topicId: 'functions-9',
    title: 'Map Function',
    titleRu: 'Функция map',
    description: 'Square all elements using map',
    descriptionRu: 'Возведите все элементы в квадрат с помощью map',
    difficulty: 'medium',
    points: 20,
    order: 9,
    grade: 9,
    starterCode: '# Используйте map и lambda\n',
    solution: 'nums = list(map(int, input().split()))\nresult = list(map(lambda x: x**2, nums))\nprint(" ".join(map(str, result)))',
    hints: ['map(функция, список) применяет функцию к каждому элементу'],
    testCases: [
      { id: 'tc1', input: '1 2 3 4', expectedOutput: '1 4 9 16', isHidden: false },
      { id: 'tc2', input: '-2 0 2', expectedOutput: '4 0 4', isHidden: false }
    ]
  },
  {
    id: 'func-10',
    topicId: 'functions-9',
    title: 'Decorator',
    titleRu: 'Декоратор',
    description: 'Create a simple timer decorator',
    descriptionRu: 'Создайте простой декоратор-таймер',
    difficulty: 'hard',
    points: 35,
    order: 10,
    grade: 9,
    starterCode: '# Создайте декоратор, который печатает "start" перед\n# и "end" после вызова функции\n',
    solution: 'def timer(func):\n    def wrapper(*args, **kwargs):\n        print("start")\n        result = func(*args, **kwargs)\n        print("end")\n        return result\n    return wrapper\n\n@timer\ndef say_hello():\n    print("hello")\n\nsay_hello()',
    hints: ['Декоратор - функция, которая принимает функцию и возвращает функцию'],
    testCases: [
      { id: 'tc1', input: '', expectedOutput: 'start\nhello\nend', isHidden: false }
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
    grade: 10,
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
    grade: 10,
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
    descriptionRu: 'Создайте класс BankAccount',
    difficulty: 'medium',
    points: 25,
    order: 3,
    grade: 10,
    starterCode: '# BankAccount(balance)\n# deposit(amount), withdraw(amount), get_balance()\n',
    solution: 'class BankAccount:\n    def __init__(self, balance=0):\n        self.balance = balance\n    \n    def deposit(self, amount):\n        self.balance += amount\n    \n    def withdraw(self, amount):\n        if amount <= self.balance:\n            self.balance -= amount\n            return True\n        return False\n    \n    def get_balance(self):\n        return self.balance\n\nacc = BankAccount(100)\nacc.deposit(50)\nacc.withdraw(30)\nprint(acc.get_balance())',
    hints: ['Проверяйте достаточность средств при снятии'],
    testCases: [
      { id: 'tc1', input: '', expectedOutput: '120', isHidden: false }
    ]
  },
  {
    id: 'oop-4',
    topicId: 'oop-basics-10',
    title: 'Inheritance',
    titleRu: 'Наследование',
    description: 'Create Animal and Dog classes',
    descriptionRu: 'Создайте классы Animal и Dog',
    difficulty: 'medium',
    points: 25,
    order: 4,
    grade: 10,
    starterCode: '# Animal(name) с методом speak()\n# Dog(name) наследует Animal, speak() возвращает "Woof!"\n',
    solution: 'class Animal:\n    def __init__(self, name):\n        self.name = name\n    \n    def speak(self):\n        return "Some sound"\n\nclass Dog(Animal):\n    def speak(self):\n        return "Woof!"\n\nname = input()\ndog = Dog(name)\nprint(f"{dog.name} says {dog.speak()}")',
    hints: ['class Dog(Animal) - Dog наследует Animal'],
    testCases: [
      { id: 'tc1', input: 'Buddy', expectedOutput: 'Buddy says Woof!', isHidden: false }
    ]
  },
  {
    id: 'oop-5',
    topicId: 'oop-basics-10',
    title: 'Counter Class',
    titleRu: 'Класс счётчик',
    description: 'Create a Counter with class variable',
    descriptionRu: 'Создайте Counter с переменной класса',
    difficulty: 'medium',
    points: 20,
    order: 5,
    grade: 10,
    starterCode: '# Counter() подсчитывает количество созданных экземпляров\n',
    solution: 'class Counter:\n    count = 0\n    \n    def __init__(self):\n        Counter.count += 1\n    \n    @classmethod\n    def get_count(cls):\n        return cls.count\n\nc1 = Counter()\nc2 = Counter()\nc3 = Counter()\nprint(Counter.get_count())',
    hints: ['Переменная класса определяется вне __init__'],
    testCases: [
      { id: 'tc1', input: '', expectedOutput: '3', isHidden: false }
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
    grade: 10,
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
    descriptionRu: 'Реализуйте структуру данных стек',
    difficulty: 'hard',
    points: 30,
    order: 7,
    grade: 10,
    starterCode: '# Stack с методами push(), pop(), peek(), is_empty()\n',
    solution: 'class Stack:\n    def __init__(self):\n        self.items = []\n    \n    def push(self, item):\n        self.items.append(item)\n    \n    def pop(self):\n        if not self.is_empty():\n            return self.items.pop()\n        return None\n    \n    def peek(self):\n        if not self.is_empty():\n            return self.items[-1]\n        return None\n    \n    def is_empty(self):\n        return len(self.items) == 0\n\ns = Stack()\ns.push(1)\ns.push(2)\ns.push(3)\nprint(s.pop())\nprint(s.peek())',
    hints: ['LIFO - последний вошёл, первый вышел'],
    testCases: [
      { id: 'tc1', input: '', expectedOutput: '3\n2', isHidden: false }
    ]
  },
  {
    id: 'oop-8',
    topicId: 'oop-basics-10',
    title: 'Operator Overloading',
    titleRu: 'Перегрузка операторов',
    description: 'Overload + operator for Vector class',
    descriptionRu: 'Перегрузите оператор + для класса Vector',
    difficulty: 'hard',
    points: 30,
    order: 8,
    grade: 10,
    starterCode: '# Vector(x, y) с __add__ для сложения векторов\n',
    solution: 'class Vector:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n    \n    def __add__(self, other):\n        return Vector(self.x + other.x, self.y + other.y)\n    \n    def __str__(self):\n        return f"({self.x}, {self.y})"\n\nv1 = Vector(1, 2)\nv2 = Vector(3, 4)\nv3 = v1 + v2\nprint(v3)',
    hints: ['__add__ определяет поведение оператора +'],
    testCases: [
      { id: 'tc1', input: '', expectedOutput: '(4, 6)', isHidden: false }
    ]
  },
  {
    id: 'oop-9',
    topicId: 'oop-basics-10',
    title: 'Property Decorator',
    titleRu: 'Декоратор property',
    description: 'Use @property decorator',
    descriptionRu: 'Используйте декоратор @property',
    difficulty: 'hard',
    points: 30,
    order: 9,
    grade: 10,
    starterCode: '# Circle(radius) с property area (только чтение)\n',
    solution: 'class Circle:\n    def __init__(self, radius):\n        self._radius = radius\n    \n    @property\n    def radius(self):\n        return self._radius\n    \n    @radius.setter\n    def radius(self, value):\n        if value > 0:\n            self._radius = value\n    \n    @property\n    def area(self):\n        return 3.14159 * self._radius ** 2\n\nc = Circle(5)\nprint(round(c.area, 2))',
    hints: ['@property превращает метод в атрибут'],
    testCases: [
      { id: 'tc1', input: '', expectedOutput: '78.54', isHidden: false }
    ]
  },
  {
    id: 'oop-10',
    topicId: 'oop-basics-10',
    title: 'Abstract Class',
    titleRu: 'Абстрактный класс',
    description: 'Create an abstract Shape class',
    descriptionRu: 'Создайте абстрактный класс Shape',
    difficulty: 'hard',
    points: 35,
    order: 10,
    grade: 10,
    starterCode: '# Абстрактный Shape с методом area()\n# Конкретные Circle и Square\n',
    solution: 'from abc import ABC, abstractmethod\n\nclass Shape(ABC):\n    @abstractmethod\n    def area(self):\n        pass\n\nclass Circle(Shape):\n    def __init__(self, radius):\n        self.radius = radius\n    \n    def area(self):\n        return 3.14 * self.radius ** 2\n\nclass Square(Shape):\n    def __init__(self, side):\n        self.side = side\n    \n    def area(self):\n        return self.side ** 2\n\nc = Circle(5)\ns = Square(4)\nprint(c.area())\nprint(s.area())',
    hints: ['Используйте ABC из модуля abc'],
    testCases: [
      { id: 'tc1', input: '', expectedOutput: '78.5\n16', isHidden: false }
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
  return problems.filter(p => p.grade === grade);
};
