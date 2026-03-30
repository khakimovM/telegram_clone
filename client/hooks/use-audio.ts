"use client";

const useAudio = () => {
  const playSound = (sound: string) => {
    // Next.js public papkasidagi yo'lni aniqlaymiz
    const audioPath = `/audio/${sound}`;

    // Yangi audio obyekti yaratamiz
    const audio = new Audio(audioPath);

    // Ovozni ijro etamiz
    audio.play().catch((err) => {
      console.error("Audio ijro etishda xatolik:", err);
    });
  };

  return { playSound };
};

export default useAudio;
