'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DigitalAdvisorChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [followUpSent, setFollowUpSent] = useState(false);
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);
  const timeoutRef = useRef(null);

  // Configuración del asesor
  const advisor = {
    name: 'Hanna',
    role: 'Asesora Comercial',
    avatar: '/images/hanna-placeholder.jfif',
    initialMessage: '¡Hola! 😊 Soy Hanna, ¿en qué puedo ayudarte hoy?',
    followUpMessage: '¿Deseas conocer nuestro catálogo más reciente de productos personalizados? 🚀 Puedo enviártelo por correo, solo dime tu email y te lo envío enseguida.',
  };

  // Reproducir sonido de notificación
  const playNotificationSound = () => {
    try {
      // Solo reproducir si el usuario ya ha interactuado con la página
      if (audioRef.current && hasInteracted) {
        audioRef.current.play().catch(e => {
          // Silenciosamente ignorar si el navegador bloquea el audio
        });
      }
    } catch (error) {
      // Silenciosamente ignorar errores de audio
    }
  };

  // Agregar mensaje del asesor
  const addAdvisorMessage = (text) => {
    const newMessage = {
      id: Date.now(),
      text,
      sender: 'advisor',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
    playNotificationSound();
    setShowBadge(true);
  };

  // Agregar mensaje del usuario
  const addUserMessage = (text) => {
    const newMessage = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
    setHasInteracted(true);
    setShowBadge(false);

    // Cancelar el timeout del mensaje automático
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Simular respuesta automática basada en keywords
    setTimeout(() => {
      handleAutoResponse(text);
    }, 1500);
  };

  // Respuestas automáticas inteligentes con redirección a WhatsApp
  const handleAutoResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    let response = '';
    let showWhatsAppButton = false;

    if (message.includes('precio') || message.includes('costo') || message.includes('cuanto')) {
      response = 'Nuestros precios varían según la cantidad y personalización. Te conectaré con un asesor por WhatsApp para que te envíe una cotización personalizada en minutos. 📱';
      showWhatsAppButton = true;
    } else if (message.includes('catalogo') || message.includes('productos')) {
      response = 'Perfecto! Tenemos un catálogo completo con más de 500 productos. Te envío el catálogo por WhatsApp enseguida. ¿Qué tipo de artículos te interesan? 📦';
      showWhatsAppButton = true;
    } else if (message.includes('@') || message.includes('email') || message.includes('correo')) {
      response = '¡Excelente! He recibido tu email. Para enviarte el catálogo más rápido, te contactaré por WhatsApp. ¿Te parece bien? 🎁';
      showWhatsAppButton = true;
    } else if (message.includes('hola') || message.includes('buenos') || message.includes('buenas')) {
      response = '¡Hola! 👋 Estoy aquí para ayudarte a encontrar el producto promocional perfecto para tu empresa. ¿Qué estás buscando?';
    } else if (message.includes('gracias') || message.includes('thank')) {
      response = '¡De nada! 😊 Si necesitas algo más, aquí estaré. También puedes cotizar directamente por WhatsApp para una respuesta inmediata. ¡Éxitos! 🚀';
      showWhatsAppButton = true;
    } else if (message.includes('envio') || message.includes('entrega') || message.includes('delivery')) {
      response = 'Hacemos entregas en todo Ecuador 🇪🇨. Los tiempos varían según el producto: artículos en stock 3-5 días, personalizados 7-15 días. ¿Te gustaría cotizar por WhatsApp para más detalles? 📦';
      showWhatsAppButton = true;
    } else if (message.includes('whatsapp') || message.includes('contacto') || message.includes('hablar')) {
      response = '¡Por supuesto! Te conectaré con un asesor comercial por WhatsApp ahora mismo. 💬';
      showWhatsAppButton = true;
    } else if (message.includes('ayuda') || message.includes('información') || message.includes('informacion')) {
      response = 'Estoy aquí para ayudarte. Puedo conectarte con un asesor por WhatsApp para que te brinde toda la información que necesites. ¿Te parece? 💬';
      showWhatsAppButton = true;
    } else {
      response = 'Entiendo. Para ayudarte mejor, te conectaré con un asesor por WhatsApp que resolverá todas tus dudas de inmediato. 💬';
      showWhatsAppButton = true;
    }

    addAdvisorMessage(response);

    // Si debe mostrar botón de WhatsApp, agregarlo después de 1 segundo
    if (showWhatsAppButton) {
      setTimeout(() => {
        addWhatsAppMessage();
      }, 1000);
    }
  };

  // Agregar mensaje con botón de WhatsApp
  const addWhatsAppMessage = () => {
    const whatsappMessage = {
      id: Date.now(),
      text: '',
      sender: 'whatsapp-button',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, whatsappMessage]);
    playNotificationSound();
  };

  // Enviar mensaje
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addUserMessage(inputValue);
      setInputValue('');
    }
  };

  // Auto-scroll al último mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Abrir chat automáticamente después de 3 segundos y mostrar mensaje inicial
  useEffect(() => {
    const openTimeout = setTimeout(() => {
      setIsOpen(true);
      addAdvisorMessage(advisor.initialMessage);
    }, 3000);

    return () => clearTimeout(openTimeout);
  }, []);

  // Enviar mensaje de follow-up después de 60 segundos sin interacción (solo una vez)
  useEffect(() => {
    if (messages.length > 0 && !hasInteracted && isOpen && !followUpSent) {
      timeoutRef.current = setTimeout(() => {
        addAdvisorMessage(advisor.followUpMessage);
        setFollowUpSent(true);
      }, 60000); // 60 segundos
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [messages.length, hasInteracted, isOpen, followUpSent]);

  // Cerrar badge cuando se abre el chat
  useEffect(() => {
    if (isOpen) {
      setShowBadge(false);
    }
  }, [isOpen]);

  return (
    <>
      {/* Audio element para notificaciones */}
      <audio
        ref={audioRef}
        preload="auto"
      >
        {/* Generar un tono simple con data URI */}
        <source
          src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZXQ4WZrTn6KZcFQpGneDxwXEfBTKG0fPTgjMGHm7A7+OZXQ4WZrTn6KZcFQ=="
          type="audio/wav"
        />
      </audio>

      {/* Botón flotante - Más pequeño en móviles para evitar interferencias */}
      <motion.div
        className="fixed bottom-3 right-3 md:bottom-8 md:right-8 z-[60]"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative bg-gradient-to-r from-primary to-primary-dark text-white rounded-full p-3 md:p-5 shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 group active:scale-95"
          aria-label="Mensaje a Hanna"
        >
          {/* Badge de notificación */}
          <AnimatePresence>
            {showBadge && !isOpen && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center"
              >
                1
              </motion.span>
            )}
          </AnimatePresence>

          {/* Icono */}
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.svg
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-6 h-6 md:w-8 md:h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </motion.svg>
            ) : (
              <motion.svg
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-6 h-6 md:w-8 md:h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </motion.svg>
            )}
          </AnimatePresence>

          {/* Pulso animado */}
          <span className="absolute inset-0 rounded-full bg-primary opacity-75 animate-ping"></span>
        </button>
      </motion.div>

      {/* Ventana de chat - Ajustada para no superponerse con header */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="fixed bottom-16 right-3 md:bottom-32 md:right-8 z-[55] w-[90vw] sm:w-[85vw] md:w-full max-w-md"
            style={{ maxHeight: 'calc(100vh - 80px)', height: 'auto' }}
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col" style={{ maxHeight: 'inherit' }}>
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-3 md:p-4 flex items-center gap-2 md:gap-3 flex-shrink-0">
                {/* Avatar con indicador en línea */}
                <div className="relative">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-white shadow-lg bg-white">
                    <img
                      src={advisor.avatar}
                      alt={advisor.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback si la imagen no existe
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">H</div>';
                      }}
                    />
                  </div>
                  {/* Indicador en línea */}
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full"></span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base md:text-lg truncate">{advisor.name}</h3>
                  <p className="text-xs md:text-sm text-white/90 flex items-center gap-1 truncate">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0"></span>
                    <span className="truncate">{advisor.role} • En línea</span>
                  </p>
                </div>

                {/* Botón minimizar */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Minimizar chat"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Mensajes - Altura ajustada */}
              <div className="flex-1 overflow-y-auto p-3 md:p-4 bg-gray-50 space-y-3 md:space-y-4" style={{ minHeight: '200px', maxHeight: '60vh' }}>
                {messages.length === 0 && (
                  <div className="text-center text-gray-500 text-sm mt-8">
                    <div className="animate-pulse">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-3">
                        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      Iniciando conversación...
                    </div>
                  </div>
                )}

                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {/* Avatar del asesor */}
                    {message.sender === 'advisor' && (
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full overflow-hidden flex-shrink-0 bg-white border-2 border-gray-200">
                        <img
                          src={advisor.avatar}
                          alt={advisor.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">H</div>';
                          }}
                        />
                      </div>
                    )}

                    {/* Botón de WhatsApp */}
                    {message.sender === 'whatsapp-button' && (
                      <>
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full overflow-hidden flex-shrink-0 bg-white border-2 border-gray-200">
                          <img
                            src={advisor.avatar}
                            alt={advisor.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">H</div>';
                            }}
                          />
                        </div>
                        <div className="max-w-[85%] md:max-w-[75%]">
                          <a
                            href="https://wa.me/593999814838?text=Hola%2C%20me%20gustar%C3%ADa%20recibir%20informaci%C3%B3n%20sobre%20sus%20productos%20promocionales"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block bg-green-500 hover:bg-green-600 text-white px-4 py-3 md:px-6 md:py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                          >
                            <div className="flex items-center gap-2 md:gap-3">
                              <svg className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                              </svg>
                              <div className="min-w-0 flex-1">
                                <div className="font-bold text-sm truncate">Continuar en WhatsApp</div>
                                <div className="text-xs text-white/90">Respuesta inmediata</div>
                              </div>
                            </div>
                          </a>
                        </div>
                      </>
                    )}

                    {/* Burbuja de mensaje normal */}
                    {message.sender !== 'whatsapp-button' && (
                      <div
                        className={`max-w-[85%] md:max-w-[75%] px-3 py-2 md:px-4 md:py-3 rounded-2xl shadow-sm ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-primary to-primary-dark text-white rounded-tr-none'
                            : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
                        }`}
                      >
                        <p className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap break-words">{message.text}</p>
                        <span className={`text-[10px] md:text-xs mt-1 block ${message.sender === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                          {new Date(message.timestamp).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-2 md:p-4 bg-white border-t border-gray-200 flex-shrink-0">
                <form onSubmit={handleSendMessage} className="flex gap-1.5 md:gap-2">
                  <input
                    type="text"
                    name="message"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Escribe tu mensaje..."
                    autoComplete="off"
                    autoFocus={isOpen}
                    className="flex-1 px-3 py-2 md:px-4 md:py-3 bg-gray-100 border border-gray-200 rounded-full text-xs md:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                    aria-label="Escribe tu mensaje"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="bg-gradient-to-r from-primary to-primary-dark text-white p-2 md:p-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex-shrink-0"
                    aria-label="Enviar mensaje"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </form>

                {/* Mensaje de información */}
                <p className="hidden md:block text-xs text-gray-500 text-center mt-3">
                  Respondemos en minutos ⚡ También vía WhatsApp
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
