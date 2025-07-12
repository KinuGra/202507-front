const MIN_ROOM_ID = 10000;
const MAX_ROOM_ID = 99999;
const ROOM_ID_RANGE = MAX_ROOM_ID - MIN_ROOM_ID + 1;

function generateRandomRoomId(): number {
  return Math.floor(MIN_ROOM_ID + Math.random() * ROOM_ID_RANGE);
}

export async function createRoomId(): Promise<number> {
  let roomId = generateRandomRoomId();
  
  while (true) {
    try {
      const response = await fetch(`/api/game/room-exists/?roomId=${encodeURIComponent(roomId)}`);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Room ID ${roomId} exists: ${data.exists}`);
      
      if (!data.exists) {
        return roomId;
      }
      
      roomId = generateRandomRoomId();
    } catch (error) {
      console.error('Failed to check room ID availability:', error);
      throw error;
    }
  }
}