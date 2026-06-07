"use client";

import { useState } from "react";
import { UploadButton } from "@/utils/uploadthing"; // sørg for at denne pathen stemmer

export default function ImageUpload({
  onUploaded,
}: {
  onUploaded: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle"); // "idle" | "uploading" | "sending" | "error"

  return (
    <div className="flex flex-col gap-2">
      <UploadButton
        endpoint="chatImage"
        onUploadBegin={() => {
          setUploading(true);
          setError("");
          setStatus("uploading");
        }}
        onClientUploadComplete={(res) => {
          setUploading(false);
          setStatus("sending");
          if (res && res[0]?.url && res[0].url.trim()) {
            onUploaded(res[0].url);
            // Send a chat message with the uploaded image URL
            fetch("/api/chat/send", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ imageUrl: res[0].url }),
            })
              .then(() => {
                setStatus("sent");
                // Reset status after a short delay
                setTimeout(() => setStatus("idle"), 2000);
              })
              .catch((err) => {
console.error("Failed to send chat message:", err);
setError("Kunne ikke sende bilde‑melding");
setStatus("error");
              });
          } else {
            setError("Upload succeeded but no URL returned");
            setStatus("error");
          }
        }}
        onUploadError={(err) => {
          setUploading(false);
          setError("Kunne ikke laste opp bilde");
          setStatus("error");
        }}
      />

      {uploading && <p className="text-sm text-gray-500">Laster…</p>}
      {sending && <p className="text-sm text-gray-500">Sender…</p>}
      {error && <p className="text-sm text-red-600">Error: {error}</p>}

      {status === "sent" && <p className="text-sm text-green-600">Melding sendt!</p>}

      {status === "idle" && (
        <p className="text-sm text-gray-500">Last opp et bilde for å dele i chatten</p>
      )}
    </div>
  );
}