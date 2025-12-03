import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Get current date for calculating past/future events
const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

// Helper to create dates - up to 15 past events in 2025, rest future
function createEventDate(index: number): Date {
    const date = new Date();
    
    // For first 15 events, make them past (in 2025, before today)
    if (index < 15) {
        // Start from January 1, 2025 and go forward, but ensure they're before today
        const startDate = new Date(2025, 0, 1); // January 1, 2025
        const daysOffset = index * 2; // Spread events 2 days apart
        date.setTime(startDate.getTime() + daysOffset * 24 * 60 * 60 * 1000);
        
        // If the calculated date is after today, make it before today
        if (date >= today) {
            const daysBeforeToday = (15 - index) * 2;
            date.setTime(today.getTime() - daysBeforeToday * 24 * 60 * 60 * 1000);
        }
        
        // Set a reasonable time (evening)
        date.setHours(19, 0, 0, 0);
        return date;
    }
    
    // Rest are future events (starting from tomorrow, spread out)
    const daysAhead = (index - 14) * 2; // Spread events 2 days apart
    date.setTime(today.getTime() + daysAhead * 24 * 60 * 60 * 1000);
    // Add some hours to make it a proper event time (evening events)
    date.setHours(19 + (index % 3), 0, 0, 0);
    return date;
}

const mockEvents = [
    // Football - National Team
    { sport: 'Football / Футбол', team: 'Kazakhstan National Team / Қазақстан Ұлттық құрамасы', opponent: 'Uzbekistan / Өзбекстан', date: createEventDate(0), location: 'Almaty, Kazakhstan / Алматы, Қазақстан', venue: 'Almaty Central Stadium / Алматы Орталық стадионы', imageUrl: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Football / Футбол', team: 'Kazakhstan National Team / Қазақстан Ұлттық құрамасы', opponent: 'Kyrgyzstan / Қырғызстан', date: createEventDate(1), location: 'Bishkek, Kyrgyzstan / Бишкек, Қырғызстан', venue: 'Dolen Omurzakov Stadium', imageUrl: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Football / Футбол', team: 'Kazakhstan National Team / Қазақстан Ұлттық құрамасы', opponent: 'Azerbaijan / Әзірбайжан', date: createEventDate(2), location: 'Astana, Kazakhstan / Астана, Қазақстан', venue: 'Astana Arena / Астана Арена', imageUrl: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Football / Футбол', team: 'Kazakhstan National Team / Қазақстан Ұлттық құрамасы', opponent: 'Turkey / Түркия', date: createEventDate(3), location: 'Istanbul, Turkey / Стамбул, Түркия', venue: 'Türk Telekom Stadium', imageUrl: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Football / Футбол', team: 'FC Astana / Астана ФК', opponent: 'FC Aktobe / Ақтөбе ФК', date: createEventDate(4), location: 'Astana, Kazakhstan / Астана, Қазақстан', venue: 'Astana Arena / Астана Арена', imageUrl: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Football / Футбол', team: 'FC Kairat / Қайрат ФК', opponent: 'FC Tobol / Тобыл ФК', date: createEventDate(5), location: 'Almaty, Kazakhstan / Алматы, Қазақстан', venue: 'Almaty Central Stadium / Алматы Орталық стадионы', imageUrl: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Football / Футбол', team: 'FC Ordabasy / Ордабасы ФК', opponent: 'FC Shakhter / Шахтер ФК', date: createEventDate(6), location: 'Shymkent, Kazakhstan / Шымкент, Қазақстан', venue: 'Kazhymukan Munaitpasov Stadium', imageUrl: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=800&auto=format&fit=crop&q=60' },
    
    // Tennis - Elena Rybakina
    { sport: 'Tennis / Теннис', team: 'Elena Rybakina / Елена Рыбакина', opponent: 'Aryna Sabalenka', date: createEventDate(7), location: 'Melbourne, Australia / Мельбурн, Австралия', venue: 'Rod Laver Arena', imageUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Tennis / Теннис', team: 'Elena Rybakina / Елена Рыбакина', opponent: 'Iga Swiatek', date: createEventDate(8), location: 'Paris, France / Париж, Франция', venue: 'Roland Garros', imageUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Tennis / Теннис', team: 'Elena Rybakina / Елена Рыбакина', opponent: 'Coco Gauff', date: createEventDate(9), location: 'London, UK / Лондон, Ұлыбритания', venue: 'Wimbledon', imageUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Tennis / Теннис', team: 'Elena Rybakina / Елена Рыбакина', opponent: 'Jessica Pegula', date: createEventDate(10), location: 'New York, USA / Нью-Йорк, АҚШ', venue: 'Arthur Ashe Stadium', imageUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Tennis / Теннис', team: 'Elena Rybakina / Елена Рыбакина', opponent: 'Maria Sakkari', date: createEventDate(11), location: 'Dubai, UAE / Дубай, БАӘ', venue: 'Dubai Duty Free Tennis Stadium', imageUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Tennis / Теннис', team: 'Elena Rybakina / Елена Рыбакина', opponent: 'Ons Jabeur', date: createEventDate(12), location: 'Doha, Qatar / Доха, Катар', venue: 'Khalifa International Tennis Centre', imageUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&auto=format&fit=crop&q=60' },
    
    // Tennis - Alexander Bublik
    { sport: 'Tennis / Теннис', team: 'Alexander Bublik / Александр Бублик', opponent: 'Daniil Medvedev', date: createEventDate(13), location: 'Monte Carlo, Monaco / Монте-Карло, Монако', venue: 'Monte-Carlo Country Club', imageUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Tennis / Теннис', team: 'Alexander Bublik / Александр Бублик', opponent: 'Andrey Rublev', date: createEventDate(14), location: 'Madrid, Spain / Мадрид, Испания', venue: 'Caja Mágica', imageUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Tennis / Теннис', team: 'Alexander Bublik / Александр Бублик', opponent: 'Karen Khachanov', date: createEventDate(15), location: 'Rome, Italy / Рим, Италия', venue: 'Foro Italico', imageUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Tennis / Теннис', team: 'Alexander Bublik / Александр Бублик', opponent: 'Casper Ruud', date: createEventDate(16), location: 'Hamburg, Germany / Гамбург, Германия', venue: 'Am Rothenbaum', imageUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Tennis / Теннис', team: 'Alexander Bublik / Александр Бублик', opponent: 'Hubert Hurkacz', date: createEventDate(17), location: 'Vienna, Austria / Вена, Австрия', venue: 'Wiener Stadthalle', imageUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&auto=format&fit=crop&q=60' },
    
    // Boxing - Janibek Alimkhanuly
    { sport: 'Boxing / Бокс', team: 'Janibek Alimkhanuly / Жәнібек Әлімханұлы', opponent: 'Jaime Munguia', date: createEventDate(18), location: 'Las Vegas, USA / Лас-Вегас, АҚШ', venue: 'T-Mobile Arena', imageUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Boxing / Бокс', team: 'Janibek Alimkhanuly / Жәнібек Әлімханұлы', opponent: 'Chris Eubank Jr.', date: createEventDate(19), location: 'London, UK / Лондон, Ұлыбритания', venue: 'O2 Arena', imageUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Boxing / Бокс', team: 'Janibek Alimkhanuly / Жәнібек Әлімханұлы', opponent: 'Demetrius Andrade', date: createEventDate(20), location: 'New York, USA / Нью-Йорк, АҚШ', venue: 'Madison Square Garden', imageUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Boxing / Бокс', team: 'Gennady Golovkin / Геннадий Головкин', opponent: 'Canelo Alvarez', date: createEventDate(21), location: 'Las Vegas, USA / Лас-Вегас, АҚШ', venue: 'MGM Grand Garden Arena', imageUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Boxing / Бокс', team: 'Gennady Golovkin / Геннадий Головкин', opponent: 'Jermall Charlo', date: createEventDate(22), location: 'Los Angeles, USA / Лос-Анджелес, АҚШ', venue: 'Staples Center', imageUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Boxing / Бокс', team: 'Beibut Shumenov / Бейбіт Шүменов', opponent: 'Dmitry Bivol', date: createEventDate(23), location: 'Monaco / Монако', venue: 'Salle des Étoiles', imageUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=60' },
    
    // Hockey - Barys Astana
    { sport: 'Hockey / Хоккей', team: 'Barys Astana / Барыс Астана', opponent: 'Avangard Omsk / Авангард Омск', date: createEventDate(24), location: 'Astana, Kazakhstan / Астана, Қазақстан', venue: 'Barys Arena / Барыс Арена', imageUrl: 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Hockey / Хоккей', team: 'Barys Astana / Барыс Астана', opponent: 'SKA Saint Petersburg / СКА Санкт-Петербург', date: createEventDate(25), location: 'Saint Petersburg, Russia / Санкт-Петербург, Ресей', venue: 'Ice Palace', imageUrl: 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Hockey / Хоккей', team: 'Barys Astana / Барыс Астана', opponent: 'CSKA Moscow / ЦСКА Мәскеу', date: createEventDate(26), location: 'Moscow, Russia / Мәскеу, Ресей', venue: 'CSKA Arena', imageUrl: 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Hockey / Хоккей', team: 'Barys Astana / Барыс Астана', opponent: 'Metallurg Magnitogorsk / Металлург Магнитогорск', date: createEventDate(27), location: 'Magnitogorsk, Russia / Магнитогорск, Ресей', venue: 'Arena Metallurg', imageUrl: 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Hockey / Хоккей', team: 'Barys Astana / Барыс Астана', opponent: 'Ak Bars Kazan / Ак Барс Қазан', date: createEventDate(28), location: 'Kazan, Russia / Қазан, Ресей', venue: 'Tatneft Arena', imageUrl: 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Hockey / Хоккей', team: 'Barys Astana / Барыс Астана', opponent: 'Traktor Chelyabinsk / Трактор Челябинск', date: createEventDate(29), location: 'Chelyabinsk, Russia / Челябинск, Ресей', venue: 'Traktor Ice Arena', imageUrl: 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800&auto=format&fit=crop&q=60' },
    
    // Futsal
    { sport: 'Futsal / Футзал', team: 'Kazakhstan Futsal Team / Қазақстан Футзал құрамасы', opponent: 'Russia / Ресей', date: createEventDate(30), location: 'Almaty, Kazakhstan / Алматы, Қазақстан', venue: 'Almaty Arena / Алматы Арена', imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Futsal / Футзал', team: 'Kazakhstan Futsal Team / Қазақстан Футзал құрамасы', opponent: 'Uzbekistan / Өзбекстан', date: createEventDate(31), location: 'Tashkent, Uzbekistan / Ташкент, Өзбекстан', venue: 'Humo Arena', imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Futsal / Футзал', team: 'Kazakhstan Futsal Team / Қазақстан Футзал құрамасы', opponent: 'Iran / Иран', date: createEventDate(32), location: 'Tehran, Iran / Тегеран, Иран', venue: 'Azadi Indoor Stadium', imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Futsal / Футзал', team: 'Kazakhstan Futsal Team / Қазақстан Футзал құрамасы', opponent: 'Spain / Испания', date: createEventDate(33), location: 'Barcelona, Spain / Барселона, Испания', venue: 'Palau Blaugrana', imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=60' },
    
    // Wrestling
    { sport: 'Wrestling / Күрес', team: 'Nurislam Sanayev / Нұрислам Санаев', opponent: 'Takuto Otoguro', date: createEventDate(34), location: 'Tokyo, Japan / Токио, Жапония', venue: 'Nippon Budokan', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Wrestling / Күрес', team: 'Meirambek Ainagulov / Мейірамбек Айнағұлов', opponent: 'Hassan Yazdani', date: createEventDate(35), location: 'Tehran, Iran / Тегеран, Иран', venue: 'Azadi Wrestling Hall', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Wrestling / Күрес', team: 'Yerassyl Kazhybayev / Ерасыл Қажыбаев', opponent: 'Kyle Dake', date: createEventDate(36), location: 'Las Vegas, USA / Лас-Вегас, АҚШ', venue: 'Thomas & Mack Center', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Wrestling / Күрес', team: 'Nursultan Tursynov / Нұрсұлтан Тұрсынов', opponent: 'Jordan Burroughs', date: createEventDate(37), location: 'Istanbul, Turkey / Стамбул, Түркия', venue: 'Sinan Erdem Dome', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=60' },
    
    // Weightlifting
    { sport: 'Weightlifting / Ауыр атлетика', team: 'Ilya Ilyin / Илья Ильин', opponent: 'Competition', date: createEventDate(38), location: 'Paris, France / Париж, Франция', venue: 'Paris Expo Porte de Versailles', imageUrl: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Weightlifting / Ауыр атлетика', team: 'Zulfiya Chinshanlo / Зүлфия Чиншанло', opponent: 'Competition', date: createEventDate(39), location: 'Bangkok, Thailand / Бангкок, Таиланд', venue: 'Impact Arena', imageUrl: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Weightlifting / Ауыр атлетика', team: 'Svetlana Podobedova / Светлана Подобедова', opponent: 'Competition', date: createEventDate(40), location: 'Doha, Qatar / Доха, Катар', venue: 'Aspire Dome', imageUrl: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&auto=format&fit=crop&q=60' },
    
    // Cycling
    { sport: 'Cycling / Велоспорт', team: 'Alexey Lutsenko / Алексей Луценко', opponent: 'Tour de France', date: createEventDate(41), location: 'Paris, France / Париж, Франция', venue: 'Champs-Élysées', imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Cycling / Велоспорт', team: 'Alexey Lutsenko / Алексей Луценко', opponent: 'Giro d\'Italia', date: createEventDate(42), location: 'Rome, Italy / Рим, Италия', venue: 'Via dei Fori Imperiali', imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Cycling / Велоспорт', team: 'Yevgeniy Fedorov / Евгений Федоров', opponent: 'Vuelta a España', date: createEventDate(43), location: 'Madrid, Spain / Мадрид, Испания', venue: 'Plaza de Cibeles', imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&auto=format&fit=crop&q=60' },
    
    // Swimming
    { sport: 'Swimming / Жүзу', team: 'Adilbek Mussin / Әділбек Мұсин', opponent: 'World Championships', date: createEventDate(44), location: 'Doha, Qatar / Доха, Катар', venue: 'Aspire Dome Aquatic Centre', imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Swimming / Жүзу', team: 'Adilbek Mussin / Әділбек Мұсин', opponent: 'European Championships', date: createEventDate(45), location: 'Budapest, Hungary / Будапешт, Венгрия', venue: 'Duna Arena', imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop&q=60' },
    
    // Athletics
    { sport: 'Athletics / Жеңіл атлетика', team: 'Olga Rypakova / Ольга Рыпакова', opponent: 'World Championships', date: createEventDate(46), location: 'Eugene, USA / Юджин, АҚШ', venue: 'Hayward Field', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Athletics / Жеңіл атлетика', team: 'Dmitriy Karpov / Дмитрий Карпов', opponent: 'Decathlon Competition', date: createEventDate(47), location: 'Götzis, Austria / Гёцис, Австрия', venue: 'Mösle Stadium', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Athletics / Жеңіл атлетика', team: 'Dmitriy Karpov / Дмитрий Карпов', opponent: 'Olympic Games', date: createEventDate(48), location: 'Paris, France / Париж, Франция', venue: 'Stade de France', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=60' },
    
    // Basketball
    { sport: 'Basketball / Баскетбол', team: 'Kazakhstan National Team / Қазақстан Ұлттық құрамасы', opponent: 'China / Қытай', date: createEventDate(49), location: 'Astana, Kazakhstan / Астана, Қазақстан', venue: 'Saryarka Velodrome', imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Basketball / Баскетбол', team: 'Kazakhstan National Team / Қазақстан Ұлттық құрамасы', opponent: 'South Korea / Оңтүстік Корея', date: createEventDate(50), location: 'Seoul, South Korea / Сеул, Оңтүстік Корея', venue: 'Jamsil Arena', imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Basketball / Баскетбол', team: 'Kazakhstan National Team / Қазақстан Ұлттық құрамасы', opponent: 'Japan / Жапония', date: createEventDate(51), location: 'Tokyo, Japan / Токио, Жапония', venue: 'Ariake Arena', imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=60' },
    
    // Volleyball
    { sport: 'Volleyball / Волейбол', team: 'Kazakhstan National Team / Қазақстан Ұлттық құрамасы', opponent: 'Russia / Ресей', date: createEventDate(52), location: 'Almaty, Kazakhstan / Алматы, Қазақстан', venue: 'Baluan Sholak Sports Palace', imageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Volleyball / Волейбол', team: 'Kazakhstan National Team / Қазақстан Ұлттық құрамасы', opponent: 'Iran / Иран', date: createEventDate(53), location: 'Tehran, Iran / Тегеран, Иран', venue: 'Azadi Volleyball Hall', imageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&auto=format&fit=crop&q=60' },
    
    // More Tennis events
    { sport: 'Tennis / Теннис', team: 'Elena Rybakina / Елена Рыбакина', opponent: 'Petra Kvitova', date: createEventDate(54), location: 'Prague, Czech Republic / Прага, Чехия', venue: 'O2 Arena', imageUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Tennis / Теннис', team: 'Elena Rybakina / Елена Рыбакина', opponent: 'Barbora Krejcikova', date: createEventDate(55), location: 'Prague, Czech Republic / Прага, Чехия', venue: 'O2 Arena', imageUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Tennis / Теннис', team: 'Alexander Bublik / Александр Бублик', opponent: 'Lorenzo Musetti', date: createEventDate(56), location: 'Milan, Italy / Милан, Италия', venue: 'Allianz Cloud', imageUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Tennis / Теннис', team: 'Alexander Bublik / Александр Бублик', opponent: 'Jannik Sinner', date: createEventDate(57), location: 'Turin, Italy / Турин, Италия', venue: 'Pala Alpitour', imageUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&auto=format&fit=crop&q=60' },
    
    // More Football events
    { sport: 'Football / Футбол', team: 'Kazakhstan National Team / Қазақстан Ұлттық құрамасы', opponent: 'Slovakia / Словакия', date: createEventDate(58), location: 'Bratislava, Slovakia / Братислава, Словакия', venue: 'Tehelné pole', imageUrl: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Football / Футбол', team: 'Kazakhstan National Team / Қазақстан Ұлттық құрамасы', opponent: 'Luxembourg / Люксембург', date: createEventDate(59), location: 'Luxembourg City, Luxembourg / Люксембург қаласы, Люксембург', venue: 'Stade de Luxembourg', imageUrl: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Football / Футбол', team: 'FC Astana / Астана ФК', opponent: 'FC Kairat / Қайрат ФК', date: createEventDate(60), location: 'Astana, Kazakhstan / Астана, Қазақстан', venue: 'Astana Arena / Астана Арена', imageUrl: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Football / Футбол', team: 'FC Tobol / Тобыл ФК', opponent: 'FC Ordabasy / Ордабасы ФК', date: createEventDate(61), location: 'Kostanay, Kazakhstan / Қостанай, Қазақстан', venue: 'Central Stadium Kostanay', imageUrl: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=800&auto=format&fit=crop&q=60' },
    
    // More Boxing
    { sport: 'Boxing / Бокс', team: 'Janibek Alimkhanuly / Жәнібек Әлімханұлы', opponent: 'Carlos Adames', date: createEventDate(62), location: 'Las Vegas, USA / Лас-Вегас, АҚШ', venue: 'MGM Grand Garden Arena', imageUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Boxing / Бокс', team: 'Gennady Golovkin / Геннадий Головкин', opponent: 'Ryota Murata', date: createEventDate(63), location: 'Saitama, Japan / Сайтама, Жапония', venue: 'Saitama Super Arena', imageUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Boxing / Бокс', team: 'Beibut Shumenov / Бейбіт Шүменов', opponent: 'Jean Pascal', date: createEventDate(64), location: 'Monaco / Монако', venue: 'Salle des Étoiles', imageUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=60' },
    
    // More Hockey
    { sport: 'Hockey / Хоккей', team: 'Barys Astana / Барыс Астана', opponent: 'Dynamo Moscow / Динамо Мәскеу', date: createEventDate(65), location: 'Moscow, Russia / Мәскеу, Ресей', venue: 'VTB Arena', imageUrl: 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Hockey / Хоккей', team: 'Barys Astana / Барыс Астана', opponent: 'Salavat Yulaev Ufa / Салават Юлаев Ұфа', date: createEventDate(66), location: 'Ufa, Russia / Ұфа, Ресей', venue: 'Ufa Arena', imageUrl: 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Hockey / Хоккей', team: 'Barys Astana / Барыс Астана', opponent: 'Lokomotiv Yaroslavl / Локомотив Ярославль', date: createEventDate(67), location: 'Yaroslavl, Russia / Ярославль, Ресей', venue: 'Arena 2000', imageUrl: 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800&auto=format&fit=crop&q=60' },
    
    // More Wrestling
    { sport: 'Wrestling / Күрес', team: 'Nurislam Sanayev / Нұрислам Санаев', opponent: 'Yuki Takahashi', date: createEventDate(68), location: 'Osaka, Japan / Осака, Жапония', venue: 'Osaka Prefectural Gymnasium', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Wrestling / Күрес', team: 'Meirambek Ainagulov / Мейірамбек Айнағұлов', opponent: 'Kyle Snyder', date: createEventDate(69), location: 'Minneapolis, USA / Миннеаполис, АҚШ', venue: 'Target Center', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Wrestling / Күрес', team: 'Yerassyl Kazhybayev / Ерасыл Қажыбаев', opponent: 'Frank Chamizo', date: createEventDate(70), location: 'Madrid, Spain / Мадрид, Испания', venue: 'WiZink Center', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=60' },
    
    // More Weightlifting
    { sport: 'Weightlifting / Ауыр атлетика', team: 'Ilya Ilyin / Илья Ильин', opponent: 'World Championships', date: createEventDate(71), location: 'Riyadh, Saudi Arabia / Эр-Рияд, Сауд Арабиясы', venue: 'King Fahd International Stadium', imageUrl: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Weightlifting / Ауыр атлетика', team: 'Zulfiya Chinshanlo / Зүлфия Чиншанло', opponent: 'Asian Championships', date: createEventDate(72), location: 'Tashkent, Uzbekistan / Ташкент, Өзбекстан', venue: 'Uzbekistan Sports Complex', imageUrl: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&auto=format&fit=crop&q=60' },
    
    // More Cycling
    { sport: 'Cycling / Велоспорт', team: 'Alexey Lutsenko / Алексей Луценко', opponent: 'Tour of Almaty', date: createEventDate(73), location: 'Almaty, Kazakhstan / Алматы, Қазақстан', venue: 'Medeu / Медеу', imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Cycling / Велоспорт', team: 'Yevgeniy Fedorov / Евгений Федоров', opponent: 'Tour of Astana', date: createEventDate(74), location: 'Astana, Kazakhstan / Астана, Қазақстан', venue: 'Nur-Sultan Circuit', imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&auto=format&fit=crop&q=60' },
    
    // More Swimming
    { sport: 'Swimming / Жүзу', team: 'Adilbek Mussin / Әділбек Мұсин', opponent: 'Asian Games', date: createEventDate(75), location: 'Nagoya, Japan / Нагоя, Жапония', venue: 'Nagoya Swimming Pool', imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop&q=60' },
    
    // More Athletics
    { sport: 'Athletics / Жеңіл атлетика', team: 'Olga Rypakova / Ольга Рыпакова', opponent: 'Diamond League', date: createEventDate(76), location: 'Doha, Qatar / Доха, Катар', venue: 'Khalifa International Stadium', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Athletics / Жеңіл атлетика', team: 'Dmitriy Karpov / Дмитрий Карпов', opponent: 'European Championships', date: createEventDate(77), location: 'Rome, Italy / Рим, Италия', venue: 'Stadio Olimpico', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=60' },
    
    // More Basketball
    { sport: 'Basketball / Баскетбол', team: 'Kazakhstan National Team / Қазақстан Ұлттық құрамасы', opponent: 'Iran / Иран', date: createEventDate(78), location: 'Tehran, Iran / Тегеран, Иран', venue: 'Azadi Basketball Hall', imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Basketball / Баскетбол', team: 'Kazakhstan National Team / Қазақстан Ұлттық құрамасы', opponent: 'Philippines / Филиппин', date: createEventDate(79), location: 'Manila, Philippines / Манила, Филиппин', venue: 'Mall of Asia Arena', imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=60' },
    
    // More Volleyball
    { sport: 'Volleyball / Волейбол', team: 'Kazakhstan National Team / Қазақстан Ұлттық құрамасы', opponent: 'China / Қытай', date: createEventDate(80), location: 'Beijing, China / Пекин, Қытай', venue: 'Capital Indoor Stadium', imageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Volleyball / Волейбол', team: 'Kazakhstan National Team / Қазақстан Ұлттық құрамасы', opponent: 'Japan / Жапония', date: createEventDate(81), location: 'Tokyo, Japan / Токио, Жапония', venue: 'Ariake Arena', imageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&auto=format&fit=crop&q=60' },
    
    // Handball
    { sport: 'Handball / Қол добы', team: 'Kazakhstan National Team / Қазақстан Ұлттық құрамасы', opponent: 'Russia / Ресей', date: createEventDate(82), location: 'Almaty, Kazakhstan / Алматы, Қазақстан', venue: 'Baluan Sholak Sports Palace', imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Handball / Қол добы', team: 'Kazakhstan National Team / Қазақстан Ұлттық құрамасы', opponent: 'South Korea / Оңтүстік Корея', date: createEventDate(83), location: 'Seoul, South Korea / Сеул, Оңтүстік Корея', venue: 'SK Handball Arena', imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&auto=format&fit=crop&q=60' },
    
    // Judo
    { sport: 'Judo / Дзюдо', team: 'Yeldos Smetov / Елдос Сметов', opponent: 'World Championships', date: createEventDate(84), location: 'Abu Dhabi, UAE / Абу-Даби, БАӘ', venue: 'Abu Dhabi National Exhibition Centre', imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Judo / Дзюдо', team: 'Yeldos Smetov / Елдос Сметов', opponent: 'Grand Slam', date: createEventDate(85), location: 'Paris, France / Париж, Франция', venue: 'AccorHotels Arena', imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop&q=60' },
    
    // Taekwondo
    { sport: 'Taekwondo / Тхэквондо', team: 'Ruslan Zhaparov / Руслан Жапаров', opponent: 'World Championships', date: createEventDate(86), location: 'Manchester, UK / Манчестер, Ұлыбритания', venue: 'Manchester Arena', imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Taekwondo / Тхэквондо', team: 'Ruslan Zhaparov / Руслан Жапаров', opponent: 'Asian Championships', date: createEventDate(87), location: 'Ho Chi Minh City, Vietnam / Хошимин, Вьетнам', venue: 'Phu Tho Indoor Stadium', imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop&q=60' },
    
    // More Football
    { sport: 'Football / Футбол', team: 'Kazakhstan National Team / Қазақстан Ұлттық құрамасы', opponent: 'Norway / Норвегия', date: createEventDate(88), location: 'Oslo, Norway / Осло, Норвегия', venue: 'Ullevaal Stadion', imageUrl: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Football / Футбол', team: 'Kazakhstan National Team / Қазақстан Ұлттық құрамасы', opponent: 'Denmark / Дания', date: createEventDate(89), location: 'Copenhagen, Denmark / Копенгаген, Дания', venue: 'Parken Stadium', imageUrl: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Football / Футбол', team: 'FC Astana / Астана ФК', opponent: 'FC Ordabasy / Ордабасы ФК', date: createEventDate(90), location: 'Astana, Kazakhstan / Астана, Қазақстан', venue: 'Astana Arena / Астана Арена', imageUrl: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=800&auto=format&fit=crop&q=60' },
    
    // More Tennis
    { sport: 'Tennis / Теннис', team: 'Elena Rybakina / Елена Рыбакина', opponent: 'Naomi Osaka', date: createEventDate(91), location: 'Indian Wells, USA / Индиан-Уэллс, АҚШ', venue: 'Indian Wells Tennis Garden', imageUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Tennis / Теннис', team: 'Alexander Bublik / Александр Бублик', opponent: 'Felix Auger-Aliassime', date: createEventDate(92), location: 'Montreal, Canada / Монреаль, Канада', venue: 'IGA Stadium', imageUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&auto=format&fit=crop&q=60' },
    
    // More Boxing
    { sport: 'Boxing / Бокс', team: 'Janibek Alimkhanuly / Жәнібек Әлімханұлы', opponent: 'Erislandy Lara', date: createEventDate(93), location: 'Las Vegas, USA / Лас-Вегас, АҚШ', venue: 'T-Mobile Arena', imageUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Boxing / Бокс', team: 'Gennady Golovkin / Геннадий Головкин', opponent: 'Jermell Charlo', date: createEventDate(94), location: 'Las Vegas, USA / Лас-Вегас, АҚШ', venue: 'MGM Grand Garden Arena', imageUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=60' },
    
    // More Hockey
    { sport: 'Hockey / Хоккей', team: 'Barys Astana / Барыс Астана', opponent: 'Torpedo Nizhny Novgorod / Торпедо Нижний Новгород', date: createEventDate(95), location: 'Nizhny Novgorod, Russia / Нижний Новгород, Ресей', venue: 'Trade Union Sport Palace', imageUrl: 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Hockey / Хоккей', team: 'Barys Astana / Барыс Астана', opponent: 'Spartak Moscow / Спартак Мәскеу', date: createEventDate(96), location: 'Moscow, Russia / Мәскеу, Ресей', venue: 'Spartak Arena', imageUrl: 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800&auto=format&fit=crop&q=60' },
    
    // More Futsal
    { sport: 'Futsal / Футзал', team: 'Kazakhstan Futsal Team / Қазақстан Футзал құрамасы', opponent: 'Brazil / Бразилия', date: createEventDate(97), location: 'São Paulo, Brazil / Сан-Паулу, Бразилия', venue: 'Ginásio do Ibirapuera', imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=60' },
    { sport: 'Futsal / Футзал', team: 'Kazakhstan Futsal Team / Қазақстан Футзал құрамасы', opponent: 'Portugal / Португалия', date: createEventDate(98), location: 'Lisbon, Portugal / Лиссабон, Португалия', venue: 'Pavilhão Atlântico', imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=60' },
    
    // Final event
    { sport: 'Football / Футбол', team: 'Kazakhstan National Team / Қазақстан Ұлттық құрамасы', opponent: 'Sweden / Швеция', date: createEventDate(99), location: 'Stockholm, Sweden / Стокгольм, Швеция', venue: 'Friends Arena', imageUrl: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=800&auto=format&fit=crop&q=60' }
];

async function main() {
    // Seed Events
    for (const event of mockEvents) {
        await prisma.event.create({
            data: event,
        });
    }

    // Seed Admin User
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password: hashedPassword,
        },
    });

    console.log('Database seeded successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
