// quiz.js
export function nextQuestion(room, question) {
  room.currentQuestion = question;
}

export function submitAnswer(room, playerId, answer) {
  const player = room.players.find(p => p.id === playerId);
  if (!player) return;

  if (!player.score) player.score = 0;
  if (answer === room.currentQuestion.correct) {
    player.score += room.currentQuestion.points || 1;
  }
}
