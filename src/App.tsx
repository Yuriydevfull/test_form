import { useEffect, useState } from "react";
import { Boxes } from "./components/ui/background";

import { BackgroundGradient } from "./components/ui/border-grad";

import { TypewriterEffectSmooth } from "./components/ui/typewritter";
import { cn } from "./lib/utils";
import { ChangeForm } from "./components/chageForm";
function App() {
  const [isCardVisible, setIsCardVisible] = useState(false);
  const words = [
    { text: "Convert", className: "text-white" },
    { text: "your", className: "text-white" },
    { text: "Currency", className: "text-white" },
    { text: "in Safety", className: "text-green-400" },
  ];
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCardVisible(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center ">
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />

      <Boxes />
      <div className="flex flex-col items-center gap-12">
        <TypewriterEffectSmooth words={words} />
        <BackgroundGradient
          className={cn(
            "rounded-[24px] max-w-sm h-[500px] min-w-[800px]   bg-white dark:bg-zinc-900 transition-all duration-500 ",
            isCardVisible ? "opacity-100" : "opacity-0"
          )}
        >
          <ChangeForm />
        </BackgroundGradient>
      </div>
    </div>
  );
}

export default App;
