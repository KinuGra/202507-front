export interface Room {
  id: string;
  name: string;
  category: string;
  participantCount: number;
  problemCount: number;
  creator: {
    name: string;
    icon: string;
  };
}

export const mockRooms: Room[] = [
  { 
    id: "room-1", 
    name: "History Buffs Unite!", 
    category: "History", 
    participantCount: 3, 
    problemCount: 20,
    creator: { name: "Alex", icon: "/images/avatars/person_avatar_1.png" }
  },
  { 
    id: "room-2", 
    name: "Science Quiz", 
    category: "Science", 
    participantCount: 5, 
    problemCount: 15,
    creator: { name: "Maria", icon: "/images/avatars/person_avatar_2.png" }
  },
  { 
    id: "room-3", 
    name: "Pop Culture Trivia", 
    category: "Pop Culture", 
    participantCount: 2, 
    problemCount: 30,
    creator: { name: "David", icon: "/images/avatars/person_avatar_3.png" }
  },
  { 
    id: "room-4", 
    name: "Geography Challenge", 
    category: "Geography", 
    participantCount: 7, 
    problemCount: 25,
    creator: { name: "Sarah", icon: "/images/avatars/person_avatar_4.png" }
  },
];
