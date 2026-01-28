import { useState } from "react";
import { Share2, Linkedin, Twitter, Facebook, Mail, Check } from "lucide-react";

interface ShareButtonProps {
  news: {
    title: string;
    description: string;
    link: string;
    entity: string;
  };
}

export default function ShareButton({ news }: ShareButtonProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [shareConfirmation, setShareConfirmation] = useState<string | null>(null);

  const showConfirmation = (platform: string) => {
    setShareConfirmation(platform);
    setTimeout(() => setShareConfirmation(null), 2000);
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(news.link)}`;
    window.open(url, "_blank", "width=600,height=400");
    showConfirmation("LinkedIn");
  };

  const shareOnTwitter = () => {
    const text = `${news.title} - ${news.entity}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(news.link)}`;
    window.open(url, "_blank", "width=600,height=400");
    showConfirmation("Twitter");
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(news.link)}`;
    window.open(url, "_blank", "width=600,height=400");
    showConfirmation("Facebook");
  };

  const shareViaEmail = () => {
    const subject = `Opportunità: ${news.title}`;
    const body = `Ti segnalo questa opportunità: ${news.title}\n\n${news.description}\n\nLeggi di più: ${news.link}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    showConfirmation("Email");
  };

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowShareMenu(!showShareMenu);
        }}
        className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
        title="Condividi"
      >
        <Share2 className="w-5 h-5 text-primary" />
      </button>
      {showShareMenu && (
        <div className="absolute top-12 right-0 bg-background border border-border rounded-lg shadow-lg p-2 z-10 min-w-max">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              shareOnLinkedIn();
              setShowShareMenu(false);
            }}
            className="flex items-center gap-2 px-4 py-2 hover:bg-muted rounded-lg transition-colors text-foreground text-sm w-full text-left"
          >
            <Linkedin className="w-4 h-4" />
            <span>LinkedIn</span>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              shareOnTwitter();
              setShowShareMenu(false);
            }}
            className="flex items-center gap-2 px-4 py-2 hover:bg-muted rounded-lg transition-colors text-foreground text-sm w-full text-left"
          >
            <Twitter className="w-4 h-4" />
            <span>Twitter</span>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              shareOnFacebook();
              setShowShareMenu(false);
            }}
            className="flex items-center gap-2 px-4 py-2 hover:bg-muted rounded-lg transition-colors text-foreground text-sm w-full text-left"
          >
            <Facebook className="w-4 h-4" />
            <span>Facebook</span>
          </button>
          <div className="border-t border-border my-1"></div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              shareViaEmail();
              setShowShareMenu(false);
            }}
            className="flex items-center gap-2 px-4 py-2 hover:bg-muted rounded-lg transition-colors text-foreground text-sm w-full text-left"
          >
            <Mail className="w-4 h-4" />
            <span>Email</span>
          </button>
        </div>
      )}
      {shareConfirmation && (
        <div className="absolute top-12 right-0 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg text-sm flex items-center gap-2 animate-in fade-in duration-200 z-20">
          <Check className="w-4 h-4" />
          <span>Condiviso su {shareConfirmation}</span>
        </div>
      )}
    </div>
  );
}
