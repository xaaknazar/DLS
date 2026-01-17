import { Topic } from '@/types';

export const topics: Topic[] = [
  // 7 класс - Основы
  {
    id: 'variables-7',
    title: 'Variables',
    titleRu: 'Переменные',
    description: 'Learn about storing and manipulating data',
    descriptionRu: 'Изучаем хранение и манипуляцию данными',
    order: 1,
    icon: 'Variable',
    color: 'blue',
    grades: [7, 8, 9, 10],
    problemIds: ['var-1', 'var-2', 'var-3', 'var-4', 'var-5', 'var-6', 'var-7', 'var-8', 'var-9', 'var-10'],
    documentation: `
# Переменные в Python

## Что такое переменная?

Переменная — это именованное место в памяти компьютера, где хранятся данные. Представьте переменную как коробку с наклейкой (именем), в которую можно положить что-то (значение).

## Создание переменных

В Python создание переменной очень просто:

\`\`\`python
name = "Алексей"      # строковая переменная
age = 15              # целочисленная переменная
height = 1.75         # переменная с плавающей точкой
is_student = True     # логическая переменная
\`\`\`

## Правила именования

1. Имя может содержать буквы, цифры и символ подчёркивания
2. Имя не может начинаться с цифры
3. Имя чувствительно к регистру (Name и name — разные переменные)
4. Нельзя использовать зарезервированные слова Python

### Хорошие имена переменных:
\`\`\`python
student_name = "Мария"
total_score = 100
user_age = 14
\`\`\`

### Плохие имена переменных:
\`\`\`python
# 2name = "Ошибка"  # начинается с цифры
# my-name = "Ошибка"  # содержит дефис
\`\`\`

## Типы данных

| Тип | Описание | Пример |
|-----|----------|--------|
| \`int\` | Целые числа | \`42\`, \`-10\`, \`0\` |
| \`float\` | Дробные числа | \`3.14\`, \`-0.5\` |
| \`str\` | Строки (текст) | \`"Привет"\`, \`'Python'\` |
| \`bool\` | Логические значения | \`True\`, \`False\` |

## Проверка типа

Используйте функцию \`type()\`:

\`\`\`python
x = 42
print(type(x))  # <class 'int'>

y = "Hello"
print(type(y))  # <class 'str'>
\`\`\`

## Изменение значения

Переменные можно перезаписывать:

\`\`\`python
score = 0
print(score)  # 0

score = 100
print(score)  # 100

score = score + 50
print(score)  # 150
\`\`\`

## Множественное присваивание

\`\`\`python
# Присваивание нескольким переменным одновременно
x, y, z = 1, 2, 3

# Одно значение нескольким переменным
a = b = c = 0
\`\`\`
`
  },
  {
    id: 'data-types-7',
    title: 'Data Types',
    titleRu: 'Типы данных',
    description: 'Understanding different types of data in Python',
    descriptionRu: 'Понимание различных типов данных в Python',
    order: 2,
    icon: 'Database',
    color: 'green',
    grades: [7, 8, 9, 10],
    problemIds: ['dt-1', 'dt-2', 'dt-3', 'dt-4', 'dt-5', 'dt-6', 'dt-7', 'dt-8', 'dt-9', 'dt-10'],
    documentation: `
# Типы данных в Python

## Числовые типы

### Целые числа (int)
\`\`\`python
age = 15
temperature = -10
big_number = 1_000_000  # подчёркивания для читаемости
\`\`\`

### Дробные числа (float)
\`\`\`python
pi = 3.14159
price = 99.99
scientific = 2.5e10  # научная нотация: 2.5 × 10¹⁰
\`\`\`

## Строки (str)

Строки — это последовательности символов:

\`\`\`python
name = "Иван"
message = 'Привет, мир!'
multiline = """Это многострочная
строка в Python"""
\`\`\`

### Операции со строками

\`\`\`python
first = "Привет"
second = "мир"

# Конкатенация (объединение)
greeting = first + ", " + second + "!"
print(greeting)  # Привет, мир!

# Повторение
line = "-" * 20
print(line)  # --------------------

# Длина строки
print(len(greeting))  # 13
\`\`\`

## Логический тип (bool)

Только два значения: \`True\` (истина) и \`False\` (ложь)

\`\`\`python
is_raining = True
is_sunny = False

# Результат сравнений — булево значение
print(5 > 3)   # True
print(10 == 5) # False
\`\`\`

## Преобразование типов

\`\`\`python
# Строка в число
age_str = "15"
age_int = int(age_str)

# Число в строку
number = 42
text = str(number)

# Целое в дробное
x = float(10)  # 10.0

# Дробное в целое (отбрасывает дробную часть)
y = int(3.7)   # 3
\`\`\`

## Проверка типа

\`\`\`python
x = 42
print(type(x))         # <class 'int'>
print(isinstance(x, int))  # True
\`\`\`
`
  },
  {
    id: 'input-output-7',
    title: 'Input/Output',
    titleRu: 'Ввод и вывод',
    description: 'Learn to interact with users through input and output',
    descriptionRu: 'Учимся взаимодействовать с пользователем',
    order: 3,
    icon: 'MessageSquare',
    color: 'purple',
    grades: [7, 8, 9, 10],
    problemIds: ['io-1', 'io-2', 'io-3', 'io-4', 'io-5', 'io-6', 'io-7', 'io-8', 'io-9', 'io-10'],
    documentation: `
# Ввод и вывод в Python

## Функция print()

Выводит информацию на экран:

\`\`\`python
print("Привет, мир!")
print(42)
print(3.14)
\`\`\`

### Вывод нескольких значений

\`\`\`python
name = "Алексей"
age = 15

print("Имя:", name)
print("Имя:", name, "Возраст:", age)
\`\`\`

### Параметры print()

\`\`\`python
# sep — разделитель между аргументами
print("один", "два", "три", sep="-")  # один-два-три

# end — что добавить в конце (по умолчанию перенос строки)
print("Привет", end=" ")
print("мир!")  # Привет мир!
\`\`\`

## Форматирование строк

### f-строки (рекомендуется)
\`\`\`python
name = "Мария"
age = 14
print(f"Меня зовут {name}, мне {age} лет")
\`\`\`

### Метод format()
\`\`\`python
print("Меня зовут {}, мне {} лет".format(name, age))
\`\`\`

## Функция input()

Получает данные от пользователя:

\`\`\`python
name = input("Как тебя зовут? ")
print(f"Привет, {name}!")
\`\`\`

### Важно: input() всегда возвращает строку!

\`\`\`python
age = input("Сколько тебе лет? ")
print(type(age))  # <class 'str'>

# Для работы с числами нужно преобразование
age = int(input("Сколько тебе лет? "))
print(type(age))  # <class 'int'>
\`\`\`

### Ввод нескольких значений

\`\`\`python
# Ввод через пробел
a, b = input("Введите два числа: ").split()
a = int(a)
b = int(b)

# Или в одну строку с map
a, b = map(int, input("Введите два числа: ").split())
\`\`\`
`
  },
  {
    id: 'operators-7',
    title: 'Operators',
    titleRu: 'Операторы',
    description: 'Mathematical and logical operators',
    descriptionRu: 'Математические и логические операторы',
    order: 4,
    icon: 'Calculator',
    color: 'orange',
    grades: [7, 8, 9, 10],
    problemIds: ['op-1', 'op-2', 'op-3', 'op-4', 'op-5', 'op-6', 'op-7', 'op-8', 'op-9', 'op-10'],
    documentation: `
# Операторы в Python

## Арифметические операторы

| Оператор | Описание | Пример | Результат |
|----------|----------|--------|-----------|
| \`+\` | Сложение | \`5 + 3\` | \`8\` |
| \`-\` | Вычитание | \`5 - 3\` | \`2\` |
| \`*\` | Умножение | \`5 * 3\` | \`15\` |
| \`/\` | Деление | \`7 / 2\` | \`3.5\` |
| \`//\` | Целочисленное деление | \`7 // 2\` | \`3\` |
| \`%\` | Остаток от деления | \`7 % 2\` | \`1\` |
| \`**\` | Возведение в степень | \`2 ** 3\` | \`8\` |

## Операторы сравнения

| Оператор | Описание | Пример | Результат |
|----------|----------|--------|-----------|
| \`==\` | Равно | \`5 == 5\` | \`True\` |
| \`!=\` | Не равно | \`5 != 3\` | \`True\` |
| \`>\` | Больше | \`5 > 3\` | \`True\` |
| \`<\` | Меньше | \`5 < 3\` | \`False\` |
| \`>=\` | Больше или равно | \`5 >= 5\` | \`True\` |
| \`<=\` | Меньше или равно | \`5 <= 3\` | \`False\` |

## Логические операторы

\`\`\`python
a = True
b = False

print(a and b)  # False — оба должны быть True
print(a or b)   # True — хотя бы один True
print(not a)    # False — инвертирует значение
\`\`\`

## Операторы присваивания

\`\`\`python
x = 10
x += 5   # x = x + 5, теперь x = 15
x -= 3   # x = x - 3, теперь x = 12
x *= 2   # x = x * 2, теперь x = 24
x /= 4   # x = x / 4, теперь x = 6.0
x //= 2  # x = x // 2, теперь x = 3.0
x %= 2   # x = x % 2, теперь x = 1.0
x **= 3  # x = x ** 3, теперь x = 1.0
\`\`\`

## Приоритет операторов

1. \`**\` — возведение в степень
2. \`*\`, \`/\`, \`//\`, \`%\` — умножение и деление
3. \`+\`, \`-\` — сложение и вычитание
4. Операторы сравнения
5. \`not\`
6. \`and\`
7. \`or\`

Используйте скобки для явного указания порядка:
\`\`\`python
result = (5 + 3) * 2  # 16, а не 11
\`\`\`
`
  },

  // 8 класс - Управляющие конструкции
  {
    id: 'conditions-8',
    title: 'Conditions',
    titleRu: 'Условия',
    description: 'Making decisions with if, elif, else',
    descriptionRu: 'Принятие решений с if, elif, else',
    order: 1,
    icon: 'GitBranch',
    color: 'blue',
    grades: [7, 8, 9, 10],
    problemIds: ['cond-1', 'cond-2', 'cond-3', 'cond-4', 'cond-5', 'cond-6', 'cond-7', 'cond-8', 'cond-9', 'cond-10'],
    documentation: `
# Условные операторы в Python

## Оператор if

Выполняет код только если условие истинно:

\`\`\`python
age = 16

if age >= 18:
    print("Вы совершеннолетний")
\`\`\`

## Оператор if-else

Выбор между двумя вариантами:

\`\`\`python
age = 16

if age >= 18:
    print("Вы совершеннолетний")
else:
    print("Вы несовершеннолетний")
\`\`\`

## Оператор if-elif-else

Множественный выбор:

\`\`\`python
score = 85

if score >= 90:
    grade = "Отлично"
elif score >= 75:
    grade = "Хорошо"
elif score >= 60:
    grade = "Удовлетворительно"
else:
    grade = "Неудовлетворительно"

print(f"Оценка: {grade}")
\`\`\`

## Вложенные условия

\`\`\`python
age = 16
has_permission = True

if age >= 18:
    print("Доступ разрешён")
else:
    if has_permission:
        print("Доступ разрешён с согласия родителей")
    else:
        print("Доступ запрещён")
\`\`\`

## Тернарный оператор

Краткая форма if-else в одну строку:

\`\`\`python
age = 20
status = "совершеннолетний" if age >= 18 else "несовершеннолетний"
print(status)
\`\`\`

## Проверка нескольких условий

\`\`\`python
age = 25
has_license = True

# and — оба условия должны быть True
if age >= 18 and has_license:
    print("Можете водить машину")

# or — хотя бы одно условие True
if age < 7 or age > 65:
    print("Бесплатный проезд")
\`\`\`

## Проверка принадлежности

\`\`\`python
fruits = ["яблоко", "банан", "апельсин"]

if "яблоко" in fruits:
    print("Яблоко есть в списке")

name = "Python"
if "th" in name:
    print("Содержит 'th'")
\`\`\`
`
  },
  {
    id: 'loops-for-8',
    title: 'For Loops',
    titleRu: 'Цикл for',
    description: 'Iterating over sequences with for loops',
    descriptionRu: 'Перебор элементов с помощью цикла for',
    order: 2,
    icon: 'Repeat',
    color: 'green',
    grades: [7, 8, 9, 10],
    problemIds: ['for-1', 'for-2', 'for-3', 'for-4', 'for-5', 'for-6', 'for-7', 'for-8', 'for-9', 'for-10'],
    documentation: `
# Цикл for в Python

## Базовый синтаксис

\`\`\`python
for элемент in последовательность:
    # код, который выполняется для каждого элемента
\`\`\`

## Перебор списка

\`\`\`python
fruits = ["яблоко", "банан", "апельсин"]

for fruit in fruits:
    print(fruit)
\`\`\`

## Функция range()

Генерирует последовательность чисел:

\`\`\`python
# range(stop) — от 0 до stop-1
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

# range(start, stop) — от start до stop-1
for i in range(2, 6):
    print(i)  # 2, 3, 4, 5

# range(start, stop, step) — с шагом
for i in range(0, 10, 2):
    print(i)  # 0, 2, 4, 6, 8

# Обратный отсчёт
for i in range(5, 0, -1):
    print(i)  # 5, 4, 3, 2, 1
\`\`\`

## Перебор строки

\`\`\`python
word = "Python"
for char in word:
    print(char)
\`\`\`

## Функция enumerate()

Получение индекса и значения:

\`\`\`python
colors = ["красный", "зелёный", "синий"]

for index, color in enumerate(colors):
    print(f"{index}: {color}")
# 0: красный
# 1: зелёный
# 2: синий
\`\`\`

## Вложенные циклы

\`\`\`python
for i in range(3):
    for j in range(3):
        print(f"({i}, {j})", end=" ")
    print()  # переход на новую строку
\`\`\`

## break и continue

\`\`\`python
# break — выход из цикла
for i in range(10):
    if i == 5:
        break
    print(i)  # 0, 1, 2, 3, 4

# continue — пропуск итерации
for i in range(5):
    if i == 2:
        continue
    print(i)  # 0, 1, 3, 4
\`\`\`

## else в цикле

Выполняется, если цикл завершился без break:

\`\`\`python
for i in range(5):
    print(i)
else:
    print("Цикл завершён нормально")
\`\`\`
`
  },
  {
    id: 'loops-while-8',
    title: 'While Loops',
    titleRu: 'Цикл while',
    description: 'Repeating code while a condition is true',
    descriptionRu: 'Повторение кода пока условие истинно',
    order: 3,
    icon: 'RotateCcw',
    color: 'purple',
    grades: [7, 8, 9, 10],
    problemIds: ['while-1', 'while-2', 'while-3', 'while-4', 'while-5', 'while-6', 'while-7', 'while-8', 'while-9', 'while-10'],
    documentation: `
# Цикл while в Python

## Базовый синтаксис

\`\`\`python
while условие:
    # код, который выполняется пока условие True
\`\`\`

## Пример использования

\`\`\`python
count = 0

while count < 5:
    print(count)
    count += 1  # важно! иначе бесконечный цикл

# Вывод: 0, 1, 2, 3, 4
\`\`\`

## Бесконечный цикл с break

\`\`\`python
while True:
    answer = input("Введите 'выход' для завершения: ")
    if answer == "выход":
        break
    print(f"Вы ввели: {answer}")
\`\`\`

## Подсчёт суммы

\`\`\`python
total = 0
while True:
    num = int(input("Введите число (0 для выхода): "))
    if num == 0:
        break
    total += num

print(f"Сумма: {total}")
\`\`\`

## Угадай число

\`\`\`python
import random

secret = random.randint(1, 100)
attempts = 0

while True:
    guess = int(input("Угадай число от 1 до 100: "))
    attempts += 1

    if guess < secret:
        print("Больше!")
    elif guess > secret:
        print("Меньше!")
    else:
        print(f"Угадал за {attempts} попыток!")
        break
\`\`\`

## while с else

\`\`\`python
count = 0

while count < 3:
    print(count)
    count += 1
else:
    print("Цикл завершён без break")
\`\`\`

## Обработка ввода

\`\`\`python
while True:
    try:
        age = int(input("Введите ваш возраст: "))
        if age > 0:
            break
        print("Возраст должен быть положительным!")
    except ValueError:
        print("Введите число!")
\`\`\`

## while vs for

- **for** — когда известно количество итераций
- **while** — когда количество итераций заранее неизвестно
`
  },
  {
    id: 'strings-8',
    title: 'Strings',
    titleRu: 'Строки',
    description: 'Working with text in Python',
    descriptionRu: 'Работа с текстом в Python',
    order: 4,
    icon: 'Type',
    color: 'orange',
    grades: [7, 8, 9, 10],
    problemIds: ['str-1', 'str-2', 'str-3', 'str-4', 'str-5', 'str-6', 'str-7', 'str-8', 'str-9', 'str-10'],
    documentation: `
# Строки в Python

## Создание строк

\`\`\`python
s1 = "Привет"
s2 = 'Мир'
s3 = """Многострочная
строка"""
\`\`\`

## Индексация и срезы

\`\`\`python
text = "Python"

# Индексация (нумерация с 0)
print(text[0])   # P
print(text[-1])  # n (с конца)

# Срезы [start:stop:step]
print(text[0:3])   # Pyt
print(text[2:])    # thon
print(text[:3])    # Pyt
print(text[::2])   # Pto (каждый второй)
print(text[::-1])  # nohtyP (разворот)
\`\`\`

## Основные методы строк

\`\`\`python
text = "  Hello, World!  "

# Регистр
print(text.upper())       # "  HELLO, WORLD!  "
print(text.lower())       # "  hello, world!  "
print(text.capitalize())  # "  hello, world!  "
print(text.title())       # "  Hello, World!  "

# Удаление пробелов
print(text.strip())   # "Hello, World!"
print(text.lstrip())  # "Hello, World!  "
print(text.rstrip())  # "  Hello, World!"

# Поиск
print(text.find("World"))     # 9
print(text.count("l"))        # 3
print(text.startswith("  H")) # True
print(text.endswith("!  "))   # True

# Замена
print(text.replace("World", "Python"))  # "  Hello, Python!  "
\`\`\`

## Разделение и объединение

\`\`\`python
# split() — разделяет строку на список
sentence = "один два три"
words = sentence.split()  # ["один", "два", "три"]

data = "a,b,c"
items = data.split(",")  # ["a", "b", "c"]

# join() — объединяет список в строку
words = ["Привет", "мир"]
text = " ".join(words)  # "Привет мир"
\`\`\`

## Проверки

\`\`\`python
"123".isdigit()    # True — только цифры
"abc".isalpha()    # True — только буквы
"abc123".isalnum() # True — буквы и цифры
"   ".isspace()    # True — только пробелы
\`\`\`

## Форматирование

\`\`\`python
name = "Алексей"
age = 15

# f-строки (рекомендуется)
print(f"Имя: {name}, возраст: {age}")

# Форматирование чисел
pi = 3.14159
print(f"Пи = {pi:.2f}")  # Пи = 3.14
\`\`\`
`
  },

  // 9 класс - Структуры данных
  {
    id: 'lists-9',
    title: 'Lists',
    titleRu: 'Списки',
    description: 'Working with ordered collections',
    descriptionRu: 'Работа с упорядоченными коллекциями',
    order: 1,
    icon: 'List',
    color: 'blue',
    grades: [7, 8, 9, 10],
    problemIds: ['list-1', 'list-2', 'list-3', 'list-4', 'list-5', 'list-6', 'list-7', 'list-8', 'list-9', 'list-10'],
    documentation: `
# Списки в Python

## Создание списков

\`\`\`python
# Пустой список
empty = []
empty = list()

# Список с элементами
numbers = [1, 2, 3, 4, 5]
mixed = [1, "два", 3.0, True]

# Список из range
nums = list(range(5))  # [0, 1, 2, 3, 4]
\`\`\`

## Доступ к элементам

\`\`\`python
fruits = ["яблоко", "банан", "апельсин"]

print(fruits[0])   # яблоко
print(fruits[-1])  # апельсин (последний)
print(fruits[1:3]) # ['банан', 'апельсин']
\`\`\`

## Изменение списка

\`\`\`python
nums = [1, 2, 3]

# Добавление элементов
nums.append(4)        # [1, 2, 3, 4]
nums.insert(0, 0)     # [0, 1, 2, 3, 4]
nums.extend([5, 6])   # [0, 1, 2, 3, 4, 5, 6]

# Изменение по индексу
nums[0] = 10          # [10, 1, 2, 3, 4, 5, 6]

# Удаление элементов
nums.remove(10)       # Удаляет первое вхождение
nums.pop()            # Удаляет и возвращает последний
nums.pop(0)           # Удаляет по индексу
del nums[0]           # Удаляет по индексу
nums.clear()          # Очищает весь список
\`\`\`

## Полезные методы

\`\`\`python
nums = [3, 1, 4, 1, 5, 9, 2, 6]

print(len(nums))       # 8 — длина
print(nums.count(1))   # 2 — количество единиц
print(nums.index(4))   # 2 — индекс элемента 4
print(min(nums))       # 1
print(max(nums))       # 9
print(sum(nums))       # 31

# Сортировка
nums.sort()            # Сортирует на месте
nums.sort(reverse=True) # По убыванию
sorted_nums = sorted(nums)  # Возвращает новый список

# Разворот
nums.reverse()         # На месте
reversed_nums = nums[::-1]  # Новый список
\`\`\`

## List Comprehension

Создание списков одной строкой:

\`\`\`python
# Квадраты чисел от 0 до 9
squares = [x**2 for x in range(10)]

# Чётные числа
evens = [x for x in range(20) if x % 2 == 0]

# Преобразование
words = ["hello", "world"]
upper_words = [w.upper() for w in words]
\`\`\`

## Копирование списков

\`\`\`python
original = [1, 2, 3]

# Правильное копирование
copy1 = original.copy()
copy2 = original[:]
copy3 = list(original)

# Неправильно! Это не копия, а ссылка:
not_copy = original
\`\`\`
`
  },
  {
    id: 'tuples-9',
    title: 'Tuples',
    titleRu: 'Кортежи',
    description: 'Immutable sequences in Python',
    descriptionRu: 'Неизменяемые последовательности',
    order: 2,
    icon: 'Lock',
    color: 'green',
    grades: [7, 8, 9, 10],
    problemIds: ['tuple-1', 'tuple-2', 'tuple-3', 'tuple-4', 'tuple-5', 'tuple-6', 'tuple-7', 'tuple-8', 'tuple-9', 'tuple-10'],
    documentation: `
# Кортежи в Python

## Что такое кортеж?

Кортеж — это неизменяемый (immutable) упорядоченный набор элементов. После создания его нельзя изменить.

## Создание кортежей

\`\`\`python
# Пустой кортеж
empty = ()
empty = tuple()

# Кортеж с элементами
point = (3, 4)
colors = ("красный", "зелёный", "синий")

# Кортеж из одного элемента (обязательна запятая!)
single = (42,)

# Без скобок тоже работает
coordinates = 10, 20, 30
\`\`\`

## Доступ к элементам

\`\`\`python
t = (1, 2, 3, 4, 5)

print(t[0])    # 1
print(t[-1])   # 5
print(t[1:3])  # (2, 3)
\`\`\`

## Распаковка кортежей

\`\`\`python
point = (3, 4)
x, y = point
print(x, y)  # 3 4

# Обмен переменных
a, b = 1, 2
a, b = b, a  # теперь a=2, b=1

# С _ для игнорирования
data = ("Иван", 25, "Москва")
name, _, city = data
\`\`\`

## Методы кортежей

\`\`\`python
t = (1, 2, 2, 3, 2, 4)

print(t.count(2))  # 3 — сколько раз встречается 2
print(t.index(3))  # 3 — индекс первого вхождения 3
print(len(t))      # 6
\`\`\`

## Когда использовать кортежи?

1. **Неизменяемые данные**: координаты, RGB цвета
2. **Ключи словаря**: кортежи можно использовать как ключи
3. **Множественный возврат из функции**

\`\`\`python
def get_user():
    return "Иван", 25  # возвращает кортеж

name, age = get_user()
\`\`\`

## Кортеж vs Список

| Кортеж | Список |
|--------|--------|
| Неизменяемый | Изменяемый |
| Быстрее | Медленнее |
| Меньше памяти | Больше памяти |
| Можно использовать как ключ словаря | Нельзя |
`
  },
  {
    id: 'dictionaries-9',
    title: 'Dictionaries',
    titleRu: 'Словари',
    description: 'Key-value pair collections',
    descriptionRu: 'Коллекции пар ключ-значение',
    order: 3,
    icon: 'Book',
    color: 'purple',
    grades: [7, 8, 9, 10],
    problemIds: ['dict-1', 'dict-2', 'dict-3', 'dict-4', 'dict-5', 'dict-6', 'dict-7', 'dict-8', 'dict-9', 'dict-10'],
    documentation: `
# Словари в Python

## Создание словарей

\`\`\`python
# Пустой словарь
empty = {}
empty = dict()

# Словарь с данными
person = {
    "name": "Алексей",
    "age": 15,
    "city": "Москва"
}

# Из списка кортежей
pairs = [("a", 1), ("b", 2)]
d = dict(pairs)
\`\`\`

## Доступ к элементам

\`\`\`python
person = {"name": "Иван", "age": 25}

# По ключу
print(person["name"])  # Иван

# Безопасный доступ с get()
print(person.get("name"))         # Иван
print(person.get("phone"))        # None
print(person.get("phone", "Нет")) # Нет (значение по умолчанию)
\`\`\`

## Изменение словаря

\`\`\`python
person = {"name": "Иван"}

# Добавление/изменение
person["age"] = 25           # добавление
person["name"] = "Пётр"      # изменение
person.update({"city": "Москва", "age": 30})

# Удаление
del person["age"]
removed = person.pop("city")  # удаляет и возвращает
person.clear()  # очищает словарь
\`\`\`

## Методы словарей

\`\`\`python
d = {"a": 1, "b": 2, "c": 3}

print(d.keys())    # dict_keys(['a', 'b', 'c'])
print(d.values())  # dict_values([1, 2, 3])
print(d.items())   # dict_items([('a', 1), ('b', 2), ('c', 3)])

print("a" in d)    # True — проверка ключа
print(len(d))      # 3
\`\`\`

## Перебор словаря

\`\`\`python
person = {"name": "Иван", "age": 25, "city": "Москва"}

# Перебор ключей
for key in person:
    print(key)

# Перебор значений
for value in person.values():
    print(value)

# Перебор пар
for key, value in person.items():
    print(f"{key}: {value}")
\`\`\`

## Dictionary Comprehension

\`\`\`python
# Квадраты чисел
squares = {x: x**2 for x in range(5)}
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# Фильтрация
d = {"a": 1, "b": 2, "c": 3}
filtered = {k: v for k, v in d.items() if v > 1}
# {'b': 2, 'c': 3}
\`\`\`

## Вложенные словари

\`\`\`python
students = {
    "student1": {"name": "Иван", "grade": 9},
    "student2": {"name": "Мария", "grade": 10}
}

print(students["student1"]["name"])  # Иван
\`\`\`
`
  },
  {
    id: 'functions-9',
    title: 'Functions',
    titleRu: 'Функции',
    description: 'Creating reusable blocks of code',
    descriptionRu: 'Создание переиспользуемых блоков кода',
    order: 4,
    icon: 'Function',
    color: 'orange',
    grades: [7, 8, 9, 10],
    problemIds: ['func-1', 'func-2', 'func-3', 'func-4', 'func-5', 'func-6', 'func-7', 'func-8', 'func-9', 'func-10'],
    documentation: `
# Функции в Python

## Определение функции

\`\`\`python
def greet():
    print("Привет!")

# Вызов функции
greet()
\`\`\`

## Параметры и аргументы

\`\`\`python
def greet(name):
    print(f"Привет, {name}!")

greet("Алексей")  # Привет, Алексей!
\`\`\`

## Возврат значения

\`\`\`python
def add(a, b):
    return a + b

result = add(3, 5)  # 8
\`\`\`

## Значения по умолчанию

\`\`\`python
def greet(name, greeting="Привет"):
    return f"{greeting}, {name}!"

print(greet("Иван"))           # Привет, Иван!
print(greet("Иван", "Здравствуй"))  # Здравствуй, Иван!
\`\`\`

## Именованные аргументы

\`\`\`python
def create_user(name, age, city):
    return {"name": name, "age": age, "city": city}

# Можно передавать в любом порядке
user = create_user(age=25, city="Москва", name="Иван")
\`\`\`

## *args и **kwargs

\`\`\`python
# *args — произвольное число позиционных аргументов
def sum_all(*args):
    return sum(args)

print(sum_all(1, 2, 3, 4, 5))  # 15

# **kwargs — произвольное число именованных аргументов
def print_info(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

print_info(name="Иван", age=25)
\`\`\`

## Множественный возврат

\`\`\`python
def get_stats(numbers):
    return min(numbers), max(numbers), sum(numbers)

minimum, maximum, total = get_stats([1, 2, 3, 4, 5])
\`\`\`

## Область видимости

\`\`\`python
x = 10  # глобальная переменная

def my_func():
    x = 5  # локальная переменная
    print(x)  # 5

my_func()
print(x)  # 10 — глобальная не изменилась

# Использование global
def change_global():
    global x
    x = 20

change_global()
print(x)  # 20
\`\`\`

## Lambda-функции

Анонимные однострочные функции:

\`\`\`python
# Обычная функция
def square(x):
    return x ** 2

# Lambda-эквивалент
square = lambda x: x ** 2

# Часто используется с map, filter, sorted
numbers = [3, 1, 4, 1, 5]
sorted_nums = sorted(numbers, key=lambda x: -x)  # [5, 4, 3, 1, 1]
\`\`\`
`
  },

  // 10 класс - Продвинутые темы
  {
    id: 'files-10',
    title: 'File Handling',
    titleRu: 'Работа с файлами',
    description: 'Reading and writing files',
    descriptionRu: 'Чтение и запись файлов',
    order: 1,
    icon: 'FileText',
    color: 'blue',
    grades: [7, 8, 9, 10],
    problemIds: ['file-1', 'file-2', 'file-3', 'file-4', 'file-5', 'file-6', 'file-7', 'file-8', 'file-9', 'file-10'],
    documentation: `
# Работа с файлами в Python

## Открытие файла

\`\`\`python
# Режимы открытия:
# 'r' — чтение (по умолчанию)
# 'w' — запись (перезаписывает файл)
# 'a' — добавление в конец
# 'r+' — чтение и запись
# 'b' — бинарный режим

file = open("example.txt", "r")
# работа с файлом
file.close()
\`\`\`

## Менеджер контекста (рекомендуется)

\`\`\`python
with open("example.txt", "r") as file:
    content = file.read()
# файл автоматически закрывается
\`\`\`

## Чтение файла

\`\`\`python
with open("example.txt", "r", encoding="utf-8") as file:
    # Прочитать весь файл
    content = file.read()

    # Прочитать построчно в список
    lines = file.readlines()

    # Прочитать одну строку
    line = file.readline()

    # Итерация по строкам (эффективно для больших файлов)
    for line in file:
        print(line.strip())
\`\`\`

## Запись в файл

\`\`\`python
with open("output.txt", "w", encoding="utf-8") as file:
    file.write("Первая строка\\n")
    file.write("Вторая строка\\n")

    # Записать несколько строк
    lines = ["Строка 1\\n", "Строка 2\\n", "Строка 3\\n"]
    file.writelines(lines)
\`\`\`

## Добавление в файл

\`\`\`python
with open("log.txt", "a", encoding="utf-8") as file:
    file.write("Новая запись в лог\\n")
\`\`\`

## Работа с путями

\`\`\`python
import os

# Текущая директория
print(os.getcwd())

# Проверка существования
print(os.path.exists("file.txt"))

# Объединение путей
path = os.path.join("folder", "subfolder", "file.txt")
\`\`\`

## Обработка ошибок

\`\`\`python
try:
    with open("file.txt", "r") as file:
        content = file.read()
except FileNotFoundError:
    print("Файл не найден!")
except PermissionError:
    print("Нет доступа к файлу!")
\`\`\`

## Работа с CSV

\`\`\`python
import csv

# Чтение CSV
with open("data.csv", "r") as file:
    reader = csv.reader(file)
    for row in reader:
        print(row)

# Запись CSV
with open("output.csv", "w", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(["Name", "Age"])
    writer.writerow(["Иван", 25])
\`\`\`

## Работа с JSON

\`\`\`python
import json

# Чтение JSON
with open("data.json", "r") as file:
    data = json.load(file)

# Запись JSON
with open("output.json", "w") as file:
    json.dump(data, file, ensure_ascii=False, indent=2)
\`\`\`
`
  },
  {
    id: 'exceptions-10',
    title: 'Exceptions',
    titleRu: 'Исключения',
    description: 'Handling errors gracefully',
    descriptionRu: 'Элегантная обработка ошибок',
    order: 2,
    icon: 'AlertTriangle',
    color: 'red',
    grades: [7, 8, 9, 10],
    problemIds: ['exc-1', 'exc-2', 'exc-3', 'exc-4', 'exc-5', 'exc-6', 'exc-7', 'exc-8', 'exc-9', 'exc-10'],
    documentation: `
# Исключения в Python

## Что такое исключения?

Исключения — это ошибки, которые возникают во время выполнения программы.

## Базовая обработка

\`\`\`python
try:
    number = int(input("Введите число: "))
    result = 10 / number
    print(result)
except:
    print("Произошла ошибка!")
\`\`\`

## Обработка конкретных исключений

\`\`\`python
try:
    number = int(input("Введите число: "))
    result = 10 / number
except ValueError:
    print("Это не число!")
except ZeroDivisionError:
    print("На ноль делить нельзя!")
\`\`\`

## Несколько исключений

\`\`\`python
try:
    # код
    pass
except (ValueError, TypeError) as e:
    print(f"Ошибка: {e}")
\`\`\`

## Получение информации об ошибке

\`\`\`python
try:
    x = 1 / 0
except ZeroDivisionError as e:
    print(f"Ошибка: {e}")  # division by zero
\`\`\`

## Блоки else и finally

\`\`\`python
try:
    number = int(input("Число: "))
except ValueError:
    print("Ошибка ввода")
else:
    # Выполняется, если НЕ было исключений
    print(f"Вы ввели: {number}")
finally:
    # Выполняется ВСЕГДА
    print("Программа завершена")
\`\`\`

## Распространённые исключения

| Исключение | Когда возникает |
|------------|-----------------|
| \`ValueError\` | Неверное значение |
| \`TypeError\` | Неверный тип |
| \`ZeroDivisionError\` | Деление на ноль |
| \`IndexError\` | Индекс за пределами |
| \`KeyError\` | Ключ не найден |
| \`FileNotFoundError\` | Файл не найден |
| \`AttributeError\` | Атрибут не существует |

## Генерация исключений

\`\`\`python
def set_age(age):
    if age < 0:
        raise ValueError("Возраст не может быть отрицательным")
    return age

try:
    set_age(-5)
except ValueError as e:
    print(e)
\`\`\`

## Создание собственных исключений

\`\`\`python
class AgeError(Exception):
    def __init__(self, age, message="Некорректный возраст"):
        self.age = age
        self.message = message
        super().__init__(self.message)

def check_age(age):
    if age < 0 or age > 150:
        raise AgeError(age)
    return True

try:
    check_age(200)
except AgeError as e:
    print(f"{e.message}: {e.age}")
\`\`\`
`
  },
  {
    id: 'oop-basics-10',
    title: 'OOP Basics',
    titleRu: 'Основы ООП',
    description: 'Classes and objects fundamentals',
    descriptionRu: 'Основы классов и объектов',
    order: 3,
    icon: 'Box',
    color: 'purple',
    grades: [7, 8, 9, 10],
    problemIds: ['oop-1', 'oop-2', 'oop-3', 'oop-4', 'oop-5', 'oop-6', 'oop-7', 'oop-8', 'oop-9', 'oop-10'],
    documentation: `
# Основы ООП в Python

## Что такое ООП?

Объектно-ориентированное программирование — это подход, в котором программа строится вокруг объектов, сочетающих данные и методы.

## Создание класса

\`\`\`python
class Dog:
    # Атрибут класса (общий для всех)
    species = "Canis familiaris"

    # Конструктор (метод инициализации)
    def __init__(self, name, age):
        # Атрибуты экземпляра (уникальные для каждого)
        self.name = name
        self.age = age

    # Метод
    def bark(self):
        return f"{self.name} говорит: Гав!"

    def get_info(self):
        return f"{self.name}, {self.age} лет"
\`\`\`

## Создание объектов

\`\`\`python
dog1 = Dog("Бобик", 3)
dog2 = Dog("Шарик", 5)

print(dog1.name)        # Бобик
print(dog1.bark())      # Бобик говорит: Гав!
print(Dog.species)      # Canis familiaris
\`\`\`

## Наследование

\`\`\`python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        pass

class Dog(Animal):
    def speak(self):
        return f"{self.name}: Гав!"

class Cat(Animal):
    def speak(self):
        return f"{self.name}: Мяу!"

dog = Dog("Бобик")
cat = Cat("Мурка")
print(dog.speak())  # Бобик: Гав!
print(cat.speak())  # Мурка: Мяу!
\`\`\`

## super()

\`\`\`python
class Animal:
    def __init__(self, name):
        self.name = name

class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)  # вызов родительского __init__
        self.breed = breed

dog = Dog("Бобик", "Лабрадор")
print(dog.name, dog.breed)  # Бобик Лабрадор
\`\`\`

## Инкапсуляция

\`\`\`python
class BankAccount:
    def __init__(self, balance):
        self.__balance = balance  # приватный атрибут

    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount

    def get_balance(self):
        return self.__balance

account = BankAccount(1000)
account.deposit(500)
print(account.get_balance())  # 1500
# print(account.__balance)    # Ошибка!
\`\`\`

## Специальные методы

\`\`\`python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        return f"Point({self.x}, {self.y})"

    def __repr__(self):
        return f"Point({self.x}, {self.y})"

    def __add__(self, other):
        return Point(self.x + other.x, self.y + other.y)

p1 = Point(1, 2)
p2 = Point(3, 4)
print(p1)        # Point(1, 2)
print(p1 + p2)   # Point(4, 6)
\`\`\`
`
  },
  {
    id: 'oop-advanced-10',
    title: 'Advanced OOP',
    titleRu: 'Продвинутое ООП',
    description: 'Advanced object-oriented concepts',
    descriptionRu: 'Продвинутые концепции ООП',
    order: 4,
    icon: 'Layers',
    color: 'orange',
    grades: [7, 8, 9, 10],
    problemIds: ['oopa-1', 'oopa-2', 'oopa-3', 'oopa-4', 'oopa-5', 'oopa-6', 'oopa-7', 'oopa-8', 'oopa-9', 'oopa-10'],
    documentation: `
# Продвинутое ООП в Python

## Декораторы @property

\`\`\`python
class Circle:
    def __init__(self, radius):
        self._radius = radius

    @property
    def radius(self):
        return self._radius

    @radius.setter
    def radius(self, value):
        if value > 0:
            self._radius = value
        else:
            raise ValueError("Радиус должен быть положительным")

    @property
    def area(self):
        return 3.14159 * self._radius ** 2

circle = Circle(5)
print(circle.area)    # 78.53975
circle.radius = 10    # использует setter
print(circle.area)    # 314.159
\`\`\`

## Статические методы и методы класса

\`\`\`python
class MathUtils:
    pi = 3.14159

    @staticmethod
    def add(a, b):
        return a + b

    @classmethod
    def circle_area(cls, radius):
        return cls.pi * radius ** 2

print(MathUtils.add(5, 3))          # 8
print(MathUtils.circle_area(5))     # 78.53975
\`\`\`

## Множественное наследование

\`\`\`python
class Flying:
    def fly(self):
        return "Я летаю!"

class Swimming:
    def swim(self):
        return "Я плаваю!"

class Duck(Flying, Swimming):
    def quack(self):
        return "Кря-кря!"

duck = Duck()
print(duck.fly())    # Я летаю!
print(duck.swim())   # Я плаваю!
print(duck.quack())  # Кря-кря!
\`\`\`

## Абстрактные классы

\`\`\`python
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

    @abstractmethod
    def perimeter(self):
        pass

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)

# shape = Shape()  # Ошибка! Нельзя создать экземпляр
rect = Rectangle(5, 3)
print(rect.area())  # 15
\`\`\`

## Полиморфизм

\`\`\`python
class Animal:
    def speak(self):
        pass

class Dog(Animal):
    def speak(self):
        return "Гав!"

class Cat(Animal):
    def speak(self):
        return "Мяу!"

class Cow(Animal):
    def speak(self):
        return "Муу!"

def animal_sound(animal):
    print(animal.speak())

# Полиморфизм в действии
animals = [Dog(), Cat(), Cow()]
for animal in animals:
    animal_sound(animal)
\`\`\`

## Композиция vs Наследование

\`\`\`python
# Композиция — "имеет" (has-a)
class Engine:
    def start(self):
        return "Двигатель запущен"

class Car:
    def __init__(self):
        self.engine = Engine()  # Car "имеет" Engine

    def start(self):
        return self.engine.start()

# Наследование — "является" (is-a)
class Vehicle:
    def move(self):
        return "Движение"

class Car(Vehicle):  # Car "является" Vehicle
    pass
\`\`\`
`
  }
];

export const getTopicsByGrade = (grade: number): Topic[] => {
  return topics.filter(topic => topic.grades.includes(grade)).sort((a, b) => a.order - b.order);
};

export const getTopicById = (id: string): Topic | undefined => {
  return topics.find(topic => topic.id === id);
};
