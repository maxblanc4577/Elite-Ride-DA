import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  MessageSquare,
  ShieldCheck,
  CheckCheck,
  User,
  Car,
  Clock,
  Sparkles,
  X,
  Phone,
  Trash2,
  Lock,
} from 'lucide-react';
import { ActiveDriver, ActiveRide, RiderProfile } from '../types/booking';

export interface ChatMessage {
  id: string;
  sender: 'rider' | 'driver';
  senderName: string;
  text: string;
  timestamp: number;
  timeString: string;
  read: boolean;
}

export interface MessagingProps {
  currentRider?: RiderProfile | null;
  activeDriver: ActiveDriver;
  rideStatus: ActiveRide['status'];
  rideId: string;
  onClose?: () => void;
  isInline?: boolean;
}

export const Messaging: React.FC<MessagingProps> = ({
  currentRider,
  activeDriver,
  rideStatus,
  rideId,
  onClose,
  isInline = false,
}) => {
  const storageKey = `elite_ride_chat_${rideId}`;

  // Initial message state backed by localStorage
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'msg-init-1',
        sender: 'driver',
        senderName: activeDriver.name,
        text: `Good day! I am your chauffeur ${activeDriver.name}. We are now in transit. Please let me know if you would like me to adjust the climate control or point out any scenic Dominica landmarks along our route.`,
        timestamp: Date.now() - 60000,
        timeString: new Date(Date.now() - 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: true,
      },
    ];
  });

  const [inputText, setInputText] = useState('');
  const [isDriverTyping, setIsDriverTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Requirement: Ensure messages are cleared once the trip is marked as completed
  useEffect(() => {
    if (rideStatus === 'completed') {
      setMessages([]);
      try {
        localStorage.removeItem(storageKey);
      } catch {
        // ignore
      }
    }
  }, [rideStatus, storageKey]);

  // Sync messages to localStorage while ride is active
  useEffect(() => {
    if (rideStatus !== 'completed' && messages.length > 0) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(messages));
      } catch {
        // ignore
      }
    }
  }, [messages, rideStatus, storageKey]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isDriverTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || rideStatus === 'completed') return;

    const riderName = currentRider?.fullName || 'Rider';
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      sender: 'rider',
      senderName: riderName,
      text,
      timestamp: Date.now(),
      timeString: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Trigger realistic chauffeur driver auto-reply
    setIsDriverTyping(true);
    setTimeout(() => {
      let replyText = 'Received! Keeping our pace steady along the highway.';
      const lower = text.toLowerCase();
      if (lower.includes('ac') || lower.includes('air') || lower.includes('cold') || lower.includes('temperature') || lower.includes('warm')) {
        replyText = 'Adjusting the climate control right away. Let me know if that feels more comfortable.';
      } else if (lower.includes('time') || lower.includes('eta') || lower.includes('schedule') || lower.includes('traffic')) {
        replyText = 'We are right on schedule. Traffic on the Pont Cassé pass is clear, estimated arrival is on target.';
      } else if (lower.includes('stop') || lower.includes('photo') || lower.includes('water') || lower.includes('fruit')) {
        replyText = 'Certainly! There is a safe scenic turnout coming up in about 400 meters where we can pause.';
      } else if (lower.includes('luggage') || lower.includes('bag') || lower.includes('suit')) {
        replyText = 'Noted! I will assist you with all luggage items immediately upon arrival at our destination.';
      } else if (lower.includes('thank') || lower.includes('smooth') || lower.includes('great')) {
        replyText = 'My pleasure! It is an honor driving you through the Nature Island.';
      }

      const driverMsg: ChatMessage = {
        id: `msg-drv-${Date.now()}`,
        sender: 'driver',
        senderName: activeDriver.name,
        text: replyText,
        timestamp: Date.now(),
        timeString: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: true,
      };

      setMessages((prev) => [...prev, driverMsg]);
      setIsDriverTyping(false);
    }, 1800);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickChips = [
    'Are we on schedule for arrival?',
    'Could we adjust the AC slightly?',
    'Can we pause briefly at a scenic viewpoint?',
    'Smooth driving on these mountain curves!',
  ];

  return (
    <div
      className={`flex flex-col bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl transition-all ${
        isInline ? 'w-full h-[520px]' : 'w-full max-w-lg mx-auto h-[540px]'
      }`}
    >
      {/* Header */}
      <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-sm">
              {activeDriver.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-neutral-950 rounded-full animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-white text-sm tracking-wide">
                {activeDriver.name}
              </h4>
              <span className="text-[10px] text-amber-400 font-bold flex items-center gap-0.5">
                ★ {activeDriver.rating}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 font-mono">
              {activeDriver.vehicleModel} · {activeDriver.licensePlate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase tracking-wider">
            In-Transit Chat
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Close Chat"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Safety & Encryption Banner */}
      <div className="px-4 py-2 bg-neutral-950/80 border-b border-neutral-800/80 text-[11px] text-neutral-400 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span>Encrypted Transit Channel · Chauffeur Hand-Free Audio Active</span>
        </div>
        <span className="text-[10px] text-neutral-500 font-mono">Auto-clears on completion</span>
      </div>

      {/* Message History Container */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-950">
        {rideStatus === 'completed' || messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2.5 text-neutral-400">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-1">
              <Lock className="w-6 h-6" />
            </div>
            <h5 className="text-sm font-bold text-white">Trip Marked as Completed</h5>
            <p className="text-xs text-neutral-400 max-w-xs leading-relaxed">
              Conversation history between rider and chauffeur has been securely cleared for passenger privacy and driver protection.
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg) => {
              const isRider = msg.sender === 'rider';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isRider ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 px-1">
                    <span className="font-semibold text-neutral-400">{msg.senderName}</span>
                    <span>·</span>
                    <span className="font-mono">{msg.timeString}</span>
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ${
                      isRider
                        ? 'bg-emerald-500 text-neutral-950 font-medium rounded-br-sm'
                        : 'bg-neutral-800 border border-neutral-700/80 text-white rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {isRider && (
                    <div className="flex items-center gap-1 text-[10px] text-emerald-500/80 pr-1">
                      <CheckCheck className="w-3 h-3" />
                      <span>Delivered</span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Driver Typing Indicator */}
            {isDriverTyping && (
              <div className="flex items-center gap-2 p-2.5 bg-neutral-850 rounded-2xl w-fit border border-neutral-800 text-neutral-400 text-xs">
                <span className="text-[11px] font-medium text-emerald-400">{activeDriver.name} is replying</span>
                <span className="flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Quick Dominica Response Chips */}
      {rideStatus !== 'completed' && (
        <div className="p-2.5 bg-neutral-950/70 border-t border-neutral-850 flex gap-2 overflow-x-auto no-scrollbar">
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(chip)}
              className="shrink-0 px-3 py-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 hover:border-emerald-500/40 rounded-full text-[11px] transition-colors cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Input Bar */}
      {rideStatus !== 'completed' ? (
        <div className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${activeDriver.name}...`}
            className="flex-1 bg-neutral-900 border border-neutral-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="p-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 text-neutral-950 font-bold rounded-xl transition-all cursor-pointer shadow-md"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="p-3 bg-neutral-950 border-t border-neutral-800 text-center text-xs text-neutral-500 font-mono">
          Ride Completed · Session Closed
        </div>
      )}
    </div>
  );
};
