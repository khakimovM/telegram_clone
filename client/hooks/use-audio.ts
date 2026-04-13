"use client";

const useAudio = () => {
  const playSound = (sound: string) => {
    if (!sound) return;

    // Fayl yo'lini tekshiring (O'zingizga moslang)
    // Agar sound o'zi to'liq URL bo'lsa (masalan: http://...), unda shunchaki sound ni bering
    const audioPath = sound.startsWith("http") ? sound : `/audio/${sound}`;

    const audio = new Audio(audioPath);

    // Brauzer avtomatik ijroni bloklasa, xatolik catch ga tushadi
    audio.play().catch((err) => {
      if (err.name === "NotAllowedError") {
        console.warn("Ovoz bloklandi: Foydalanuvchi interaksiyasi kerak.");
      } else if (err.name === "NotSupportedError") {
        console.error(
          "Xato: Audio fayl topilmadi yoki format noto'g'ri. Manzil:",
          audioPath,
        );
      } else {
        console.error("Audio ijro xatosi:", err);
      }
    });
  };

  return { playSound };
};

export default useAudio;
