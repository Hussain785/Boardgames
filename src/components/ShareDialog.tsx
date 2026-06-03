import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Copy,
  Mail,
  MessageCircle,
  Send,
  Share2,
  X,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  url: string;
  recipientName?: string;
  senderName?: string;
}

export default function ShareDialog({
  open,
  onClose,
  url,
  recipientName,
  senderName,
}: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const message = `${
    recipientName ? `${recipientName}, ` : ""
  }I wrote you a little something. Open it when you're alone and feel like being adored. ❤️\n${url}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback: temporary input
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      } catch {
        // ignore
      }
      input.remove();
    }
  };

  const handleNativeShare = async () => {
    const data = {
      title: "A letter for you",
      text: message,
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(data);
      } else {
        await handleCopy();
      }
    } catch {
      // user cancelled — that's ok
    }
  };

  const subject = encodeURIComponent(
    `${senderName ? `${senderName} ` : ""}wrote you a love letter`.trim()
  );
  const body = encodeURIComponent(message);

  const mailHref = `mailto:?subject=${subject}&body=${body}`;
  const waHref = `https://wa.me/?text=${encodeURIComponent(message)}`;
  const tgHref = `https://t.me/share/url?url=${encodeURIComponent(
    url
  )}&text=${encodeURIComponent(
    `${recipientName ? `${recipientName}, ` : ""}I wrote you something. ❤️`
  )}`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-title"
        >
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="relative w-full max-w-lg card !p-6 sm:!p-8"
            initial={{ scale: 0.92, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2
                  id="share-title"
                  className="font-display text-2xl gradient-text"
                >
                  Send it with love
                </h2>
                <p className="mt-1 text-sm text-rose-700/80 dark:text-rose-200/70">
                  Pick how you'd like to deliver this letter to{" "}
                  <strong className="font-semibold">
                    {recipientName || "them"}
                  </strong>
                  .
                </p>
              </div>
              <button
                ref={closeRef}
                onClick={onClose}
                aria-label="Close"
                className="btn-ghost !p-2 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-2">
              <ShareButton
                onClick={handleNativeShare}
                icon={<Share2 className="w-4 h-4" />}
              >
                Quick share
              </ShareButton>
              <ShareButton
                href={waHref}
                icon={<MessageCircle className="w-4 h-4" />}
              >
                WhatsApp
              </ShareButton>
              <ShareButton
                href={tgHref}
                icon={<Send className="w-4 h-4" />}
              >
                Telegram
              </ShareButton>
              <ShareButton
                href={mailHref}
                icon={<Mail className="w-4 h-4" />}
                className="col-span-2 sm:col-span-1"
              >
                Email
              </ShareButton>
              <ShareButton
                onClick={handleCopy}
                icon={
                  copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )
                }
                className="col-span-2 sm:col-span-2"
              >
                {copied ? "Link copied" : "Copy link"}
              </ShareButton>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-5 rounded-2xl bg-white/70 dark:bg-white/5 border border-white/60 dark:border-white/5 p-4">
              <div className="rounded-xl bg-white p-3 shadow-soft">
                <QRCodeSVG
                  value={url}
                  size={120}
                  bgColor="#ffffff"
                  fgColor="#bf1554"
                  level="M"
                />
              </div>
              <div className="text-sm text-rose-700/80 dark:text-rose-200/70 text-center sm:text-left">
                <p className="font-medium text-rose-700 dark:text-rose-100">
                  Or hand them your phone
                </p>
                <p>
                  Let them scan this little heart-coded square. The letter is
                  packed inside the link itself, so it works anywhere.
                </p>
              </div>
            </div>

            <p className="mt-4 text-[11px] text-rose-500/80 dark:text-rose-200/60 text-center">
              The whole letter is stored inside the share link. Nothing is sent
              to a server, nothing is saved online.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ShareButton({
  children,
  icon,
  onClick,
  href,
  className = "",
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
}) {
  const cls = `btn-outline w-full !py-3 ${className}`;
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
      >
        {icon}
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {icon}
      {children}
    </button>
  );
}
