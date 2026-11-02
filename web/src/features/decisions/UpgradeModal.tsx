import { Link } from "react-router-dom";

export function UpgradeModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/20 backdrop-blur-sm">
      <div className="bento w-full max-w-md shadow-neu-flat bg-cream text-center p-8">
        <div className="h-16 w-16 mx-auto rounded-full bg-accent/20 flex items-center justify-center mb-6">
          <span className="text-2xl font-bold text-accentHover">!</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Limit reached</h2>
        <p className="mt-3 text-sm text-inkSoft leading-relaxed">
          Free accounts can have up to 5 active pending decisions. 
          Complete a review or upgrade to Pro to unlock unlimited decisions.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <button className="btn-primary bg-accentHover text-white shadow-none hover:bg-accentHover/90">
            Upgrade to Pro ($5/mo)
          </button>
          <button onClick={onClose} className="btn-ghost">
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}