import React, { useState } from 'react';
import { Share2, Check, Copy, Facebook, Twitter, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const ShareButton = ({ url, title, text, className = '' }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = url || window.location.href;
  const shareTitle = title || document.title;
  const shareText = text || 'Check this out!';

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        toast.success('Shared successfully!');
        setShowMenu(false);
      } catch (error) {
        if (error.name !== 'AbortError') {
          toast.error('Failed to share');
        }
      }
    } else {
      setShowMenu(!showMenu);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => {
        setCopied(false);
        setShowMenu(false);
      }, 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const shareToSocial = (platform) => {
    let shareLink = '';
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);

    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
        break;
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'email':
        shareLink = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodedText}%20${encodedUrl}`;
        break;
      default:
        return;
    }

    window.open(shareLink, '_blank', 'noopener,noreferrer');
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        className={`flex items-center gap-2 px-4 py-2 bg-nairobi-blue text-white rounded-lg hover:bg-blue-700 transition-colors ${className}`}
      >
        <Share2 className="w-4 h-4" />
        <span className="text-sm font-semibold">Share</span>
      </button>

      {/* Share Menu */}
      {showMenu && !navigator.share && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Share via</h3>
            <div className="space-y-2">
              {/* Copy Link */}
              <button
                onClick={copyToClipboard}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {copied ? 'Copied!' : 'Copy Link'}
                </span>
              </button>

              {/* WhatsApp */}
              <button
                onClick={() => shareToSocial('whatsapp')}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="w-5 h-5 text-green-600 font-bold">W</div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  WhatsApp
                </span>
              </button>

              {/* Facebook */}
              <button
                onClick={() => shareToSocial('facebook')}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Facebook className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  Facebook
                </span>
              </button>

              {/* Twitter */}
              <button
                onClick={() => shareToSocial('twitter')}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Twitter className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  Twitter
                </span>
              </button>

              {/* Email */}
              <button
                onClick={() => shareToSocial('email')}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">Email</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {showMenu && !navigator.share && (
        <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
      )}
    </div>
  );
};

export default ShareButton;
