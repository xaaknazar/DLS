import { NextResponse } from 'next/server';
import Redis from 'ioredis';

// Real students data - same as in db.ts
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

export async function POST() {
  try {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      return NextResponse.json({ error: 'Redis not configured' }, { status: 400 });
    }

    const client = new Redis(redisUrl);

    // Create teacher
    const teacher = {
      id: 'teacher-1',
      name: 'Aknazar Arturovich',
      email: 'teacher@school.edu',
      password: 'teacher123',
      role: 'teacher',
      classes: [7, 8, 9, 10],
      createdAt: new Date().toISOString(),
    };

    // Create students
    const students = studentsData.map((s, i) => ({
      id: `student-${s.grade}-${i + 1}`,
      name: s.name,
      email: s.email,
      password: s.password,
      role: 'student',
      grade: s.grade,
      completedProblems: [],
      points: 0,
      achievements: [],
      streakDays: 0,
      lastActiveAt: new Date().toISOString(),
      createdAt: new Date('2024-09-01').toISOString(),
      purchasedItems: [],
      equippedAvatar: null,
      equippedFrame: null,
    }));

    // Save all users (replacing old data)
    const allUsers = [teacher, ...students];
    await client.set('dls:users', JSON.stringify(allUsers));
    await client.quit();

    return NextResponse.json({
      success: true,
      message: `База обновлена! Добавлено ${students.length} учеников + 1 учитель`,
      totalUsers: allUsers.length,
      studentsByGrade: {
        '7 класс': students.filter(s => s.grade === 7).length,
        '8 класс': students.filter(s => s.grade === 8).length,
        '9 класс': students.filter(s => s.grade === 9).length,
        '10 класс': students.filter(s => s.grade === 10).length,
      }
    });
  } catch (error: any) {
    console.error('Cleanup error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
