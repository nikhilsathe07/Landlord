import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip, Smile, Phone, Video, MoreVertical } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/helpers';

const ChatWindow = () => {
  const { messages, addMessage, markMessagesAsRead } = useApp();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Get the other user (landlord if tenant, tenant if landlord)
  const otherUser = user?.role === 'tenant' 
    ? { id: 'landlord-demo', name: 'Jane Landlord', role: 'landlord', online: true }
    : { id: 'tenant-demo', name: 'John Tenant', role: 'tenant', online: false };

  // Filter messages for current conversation
  const conversationMessages = messages
    .filter(msg => 
      msg.participants && msg.participants.includes(user?.id) && msg.participants.includes(otherUser.id)
    )
    .sort((a, b) => {
      const aTime = a.timestamp?.seconds ? a.timestamp.seconds * 1000 : new Date(a.timestamp).getTime();
      const bTime = b.timestamp?.seconds ? b.timestamp.seconds * 1000 : new Date(b.timestamp).getTime();
      return aTime - bTime;
    });

  // Mark messages as read when component mounts
  useEffect(() => {
    if (user?.id) {
      markMessagesAsRead(otherUser.id);
    }
  }, [otherUser.id, markMessagesAsRead, user?.id]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user?.id) return;

    const messageData = {
      senderId: user.id,
      receiverId: otherUser.id,
      message: newMessage.trim(),
      senderName: user.name
    };

    const result = await addMessage(messageData);
    
    if (result.success) {
      setNewMessage('');
      
      // Simulate typing indicator for demo
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        // Simulate auto-reply for demo
        if (Math.random() > 0.5) {
          setTimeout(() => {
            addMessage({
              senderId: otherUser.id,
              receiverId: user.id,
              message: getRandomReply(),
              senderName: otherUser.name
            });
          }, 1000);
        }
      }, 2000);
    }
  };

  const getRandomReply = () => {
    const replies = [
      "Thanks for the update! I'll look into this right away.",
      "Got it. I'll schedule someone to check this out.",
      "No problem! Let me know if you need anything else.",
      "I'll get back to you within 24 hours.",
      "Thanks for letting me know. This is being handled.",
      "Understood. I'll coordinate with the maintenance team."
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    let date;
    if (timestamp.seconds) {
      // Firestore timestamp
      date = new Date(timestamp.seconds * 1000);
    } else {
      date = new Date(timestamp);
    }
    
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 flex flex-col h-full overflow-hidden"
      >
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-medium">
                  {otherUser.name.charAt(0)}
                </div>
                <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                  otherUser.online ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
              </div>
              <div>
                <h2 className="font-semibold">{otherUser.name}</h2>
                <p className="text-xs text-blue-100 capitalize">
                  {otherUser.online ? 'Online' : 'Offline'} • {otherUser.role}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-lg hover:bg-white/20 transition-colors">
                <Phone className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-lg hover:bg-white/20 transition-colors">
                <Video className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-lg hover:bg-white/20 transition-colors">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {conversationMessages.length > 0 ? (
            conversationMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.senderId === user?.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm">{message.message}</p>
                  <p className={`text-xs mt-1 ${
                    message.senderId === user?.id ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatMessageTime(message.timestamp)}
                    {message.senderId === user?.id && (
                      <span className="ml-1">
                        {message.read ? '✓✓' : '✓'}
                      </span>
                    )}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                  {otherUser.name.charAt(0)}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Start conversation with {otherUser.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  Send a message to begin your conversation about property maintenance.
                </p>
              </div>
            </div>
          )}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Paperclip className="h-5 w-5" />
            </button>
            
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Smile className="h-5 w-5" />
              </button>
            </div>
            
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatWindow;