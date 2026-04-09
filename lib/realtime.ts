import Pusher from "pusher-js";

export function subscribeToMatchChannel(matchId, callback) {
  const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: "eu",
  });

  const channel = pusher.subscribe(`match-${matchId}`);

  channel.bind("new-message", (data) => {
    callback(data);
  });
}

export async function sendRealtimeMessage(matchId, message) {
  await fetch("/api/chat/realtime", {
    method: "POST",
    body: JSON.stringify({ matchId, message }),
  });
}
