// rooms.js
export const rooms = {};

export function createRoom(roomId, hostId) {
  rooms[roomId] = {
    hostId,
    players: [],
    slideId: null,
    currentQuestion: null
  };
}

export function joinRoom(roomId, player) {
  if (!rooms[roomId]) return false;
  rooms[roomId].players.push(player);
  return true;
}

export function leaveRoom(roomId, playerId) {
  if (!rooms[roomId]) return;
  rooms[roomId].players = rooms[roomId].players.filter(p => p.id !== playerId);
}
