export interface Event {
    id: number;
    sport: string;
    team: string;
    opponent: string;
    date: string;
    location: string;
    venue: string;
    imageUrl: string;
}

export const mockEvents: Event[] = [
    {
        id: 1,
        sport: 'Football',
        team: 'Kazakhstan National Team',
        opponent: 'France',
        date: '2024-09-07T20:45:00',
        location: 'Paris, France',
        venue: 'Stade de France',
        imageUrl: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=800&auto=format&fit=crop&q=60'
    },
    {
        id: 2,
        sport: 'Tennis',
        team: 'Elena Rybakina',
        opponent: 'Iga Swiatek',
        date: '2024-06-08T15:00:00',
        location: 'London, UK',
        venue: 'Wimbledon',
        imageUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&auto=format&fit=crop&q=60'
    },
    {
        id: 3,
        sport: 'Boxing',
        team: 'Janibek Alimkhanuly',
        opponent: 'Chris Eubank Jr.',
        date: '2024-10-15T22:00:00',
        location: 'Las Vegas, USA',
        venue: 'T-Mobile Arena',
        imageUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=60'
    },
    {
        id: 4,
        sport: 'Futsal',
        team: 'Kazakhstan Futsal Team',
        opponent: 'Brazil',
        date: '2024-09-20T18:00:00',
        location: 'Tashkent, Uzbekistan',
        venue: 'Humo Arena',
        imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=60'
    },
    {
        id: 5,
        sport: 'Hockey',
        team: 'Barys Astana',
        opponent: 'Avangard Omsk',
        date: '2024-11-05T19:30:00',
        location: 'Omsk, Russia',
        venue: 'G-Drive Arena',
        imageUrl: 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800&auto=format&fit=crop&q=60'
    }
];
