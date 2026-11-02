import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 animate-in fade-in duration-200">
      <div className="relative flex items-center justify-center mb-5">
        {/* Glowing pulse aura */}
        <div className="absolute w-20 h-20 rounded-full bg-[#FF7A59]/20 dark:bg-[#FF7A59]/30 animate-ping"></div>

        {/* Central Brand Badge */}
        <div className="relative w-16 h-16 rounded-2xl bg-forest-950 dark:bg-[#FF7A59] text-white flex items-center justify-center text-2xl shadow-xl shadow-[#FF7A59]/10">
          <FontAwesomeIcon icon={faBookOpen} className="animate-pulse" />
        </div>
      </div>

      <div className="text-center space-y-2">
        <h3 className="font-serif font-bold text-lg text-forest-950 dark:text-white tracking-wide">
          BookNook
        </h3>
        <div className="flex items-center justify-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#FF7A59] animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-2 h-2 rounded-full bg-[#FF7A59] animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-2 h-2 rounded-full bg-[#FF7A59] animate-bounce"></span>
        </div>
        <p className="text-xs text-stone-500 dark:text-darkMuted font-medium font-bangla">
          বই ও লাইব্রেরি লোড হচ্ছে...
        </p>
      </div>
    </div>
  );
}

