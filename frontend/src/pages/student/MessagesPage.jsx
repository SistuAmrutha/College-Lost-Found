import React, { useState, useEffect, useRef } from 'react';
import { messageService } from '../../services/messageService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatTimeAgo } from '../../utils/formatters';
import {
  MessageSquare,
  Send,
  User,
  Clock,
  Inbox,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function MessagesPage() {
  const { user } = useAuth();
  const { error } = useToast();

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  const loadConversations = async (silent = false) => {
    if (!silent) setLoadingConversations(true);
    try {
      const data = await messageService.getConversations();
      setConversations(data || []);
      if (data && data.length > 0 && !activeConversation) {
        setActiveConversation(data[0]);
      }
    } catch (err) {
      if (!silent) error('Failed to load conversations');
    } finally {
      if (!silent) setLoadingConversations(false);
    }
  };

  const loadMessages = async (convId, silent = false) => {
    if (!silent) setLoadingMessages(true);
    try {
      const data = await messageService.getMessages(convId, 0, 50);
      setMessages(data.content || []);
    } catch {
      if (!silent) error('Failed to load messages');
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  };

  useEffect(() => {
    loadConversations();
    const interval = setInterval(() => {
      loadConversations(true);
    }, 15000); // 15s polling for conversations
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation.id);
      const interval = setInterval(() => {
        loadMessages(activeConversation.id, true);
      }, 5000); // 5s polling for active chat messages
      return () => clearInterval(interval);
    }
  }, [activeConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    setSending(true);
    try {
      const sent = await messageService.sendMessage(activeConversation.id, newMessage);
      setNewMessage('');
      setMessages((prev) => [...prev, sent]);
      // refresh conversation last message
      loadConversations(true);
    } catch {
      error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Direct Messages
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Safely coordinate handovers and discuss item recovery with fellow students
        </p>
      </div>

      {loadingConversations ? (
        <LoadingSpinner text="Loading conversations..." />
      ) : conversations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden h-[600px]">
          {/* Conversation List Column */}
          <div className="border-r border-slate-200 dark:border-slate-800 flex flex-col h-full overflow-y-auto">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 font-bold text-xs uppercase tracking-wider text-slate-400">
              Conversations ({conversations.length})
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 overflow-y-auto flex-1">
              {conversations.map((c) => {
                const isActive = activeConversation?.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveConversation(c)}
                    className={`w-full text-left p-4 flex items-start gap-3 transition-colors ${
                      isActive
                        ? 'bg-primary-50/70 dark:bg-primary-950/40 border-l-4 border-primary-600'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-bold flex items-center justify-center shrink-0 text-xs">
                      {c.otherParticipantName?.charAt(0) || 'U'}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                          {c.otherParticipantName || 'Student'}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {formatTimeAgo(c.lastMessageAt || c.createdAt)}
                        </span>
                      </div>

                      {c.relatedItemTitle && (
                        <p className="text-[11px] font-semibold text-primary-600 dark:text-primary-400 truncate">
                          Re: {c.relatedItemTitle}
                        </p>
                      )}

                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {c.lastMessage || 'Started conversation'}
                      </p>
                    </div>

                    {c.unreadCount > 0 && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat Window Column */}
          <div className="md:col-span-2 flex flex-col h-full bg-slate-50/50 dark:bg-slate-950/50">
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-bold flex items-center justify-center text-xs">
                      {activeConversation.otherParticipantName?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {activeConversation.otherParticipantName || 'Student'}
                      </h3>
                      {activeConversation.relatedItemTitle && (
                        <span className="text-[11px] text-primary-600 dark:text-primary-400">
                          Item: {activeConversation.relatedItemTitle}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Message History */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {loadingMessages ? (
                    <LoadingSpinner size="sm" text="Loading chat history..." />
                  ) : messages.length > 0 ? (
                    messages.map((msg) => {
                      const isMe = msg.isOwnMessage || msg.senderId === user?.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                              isMe
                                ? 'bg-primary-600 text-white rounded-br-none'
                                : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-none'
                            }`}
                          >
                            {msg.content}
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 px-1">
                            {formatTimeAgo(msg.createdAt)}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-12 text-xs text-slate-400">
                      No messages yet. Send a greeting to begin!
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Send Input */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
                >
                  <input
                    type="text"
                    required
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="p-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-sm transition-colors disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <MessageSquare className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm">Select a conversation to read messages</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            No Active Conversations
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            When you contact a finder or someone messages you regarding a listed item, conversations will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
