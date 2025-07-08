import React, { useState, useEffect, useRef } from 'react';
import './SupportPage.css';
// Removed Firebase imports as we are no longer using Firestore for chat messages
// import { initializeApp } from 'firebase/app';
// import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
// import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

// Define global variables for Firebase configuration (not used for AI chat, but kept for other potential Firebase features if re-added)
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? initialAuthToken : null;

// FAQ Item Component for reusability and managing individual state
const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [feedback, setFeedback] = useState(null); // null, 'yes', or 'no'

    const toggleOpen = () => {
        setIsOpen(!isOpen);
        setFeedback(null); // Reset feedback when toggling
    };

    const handleFeedback = (type) => {
        setFeedback(type);
        // In a real application, you would send this feedback to your backend
        console.log(`Feedback for "${question}": ${type}`);
    };

    return (
        <div className="bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer">
            <div className="flex justify-between items-center" onClick={toggleOpen}>
                <h3 className="text-xl font-semibold text-blue-300 flex items-center">
                    <span className="mr-3 text-2xl">❓</span> Q: {question}
                </h3>
                <svg
                    className={`w-6 h-6 text-gray-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </div>
            {isOpen && (
                <div className="mt-2 transition-all duration-300 ease-in-out">
                    <p className="text-gray-300">A: {answer}</p>
                    <div className="mt-4 text-sm text-gray-400 flex items-center">
                        Was this helpful?
                        <button
                            onClick={() => handleFeedback('yes')}
                            className={`ml-3 px-3 py-1 rounded-full text-white ${feedback === 'yes' ? 'bg-green-600' : 'bg-gray-600 hover:bg-green-500'} transition-colors duration-200`}
                        >
                            Yes
                        </button>
                        <button
                            onClick={() => handleFeedback('no')}
                            className={`ml-2 px-3 py-1 rounded-full text-white ${feedback === 'no' ? 'bg-red-600' : 'bg-gray-600 hover:bg-red-500'} transition-colors duration-200`}
                        >
                            No
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// ChatModal Component for AI Chat
const ChatModal = ({ isOpen, onClose }) => { // Removed db, auth, userId props as they are not needed for AI chat
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false); // State to show typing indicator
    const messagesEndRef = useRef(null); // Ref for scrolling to the latest message

    // Scroll to the bottom of the chat when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Initial welcome message from AI
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            // Personalized welcome message (placeholder for username)
            setMessages([{ sender: 'ai', text: 'Hello there! How can I assist you with your gaming queries today?' }]);
        }
        scrollToBottom();
    }, [isOpen, messages.length]);

    // Handle sending a new message to the AI
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        const userMessage = { sender: 'user', text: newMessage };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setNewMessage('');
        setIsTyping(true); // Show typing indicator

        // Prepare chat history for the AI model
        let chatHistory = messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));
        chatHistory.push({ role: 'user', parts: [{ text: newMessage }] });

        try {
            const payload = { contents: chatHistory };
            const apiKey = ""; // Leave as-is, Canvas will provide it
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const aiResponseText = result.candidates[0].content.parts[0].text;
                setMessages((prevMessages) => [...prevMessages, { sender: 'ai', text: aiResponseText }]);
            } else {
                setMessages((prevMessages) => [...prevMessages, { sender: 'ai', text: 'Sorry, I could not generate a response at this time.' }]);
                console.error("Unexpected API response structure:", result);
            }
        } catch (error) {
            console.error("Error communicating with AI:", error);
            setMessages((prevMessages) => [...prevMessages, { sender: 'ai', text: 'An error occurred while connecting to the AI. Please try again later.' }]);
        } finally {
            setIsTyping(false); // Hide typing indicator
            scrollToBottom(); // Scroll to bottom after AI response
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-md h-[80vh] flex flex-col border border-gray-700">
                {/* Chat Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-700 rounded-t-lg">
                    <h2 className="text-2xl font-bold text-white">AI Chat Support</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors duration-200 text-3xl font-semibold"
                    >
                        &times;
                    </button>
                </div>

                {/* Messages Display Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {messages.map((msg, index) => (
                        <div
                            key={index} // Using index as key for now, better to use unique IDs if messages were persistent
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] p-3 rounded-lg shadow-md ${
                                msg.sender === 'user'
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-gray-600 text-white rounded-bl-none'
                            }`}>
                                <strong className="block text-sm mb-1 opacity-80">
                                    {msg.sender === 'user' ? 'You' : 'AI Assistant'}
                                </strong>
                                <p className="text-base break-words">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="max-w-[80%] p-3 rounded-lg shadow-md bg-gray-600 text-white rounded-bl-none">
                                <strong className="block text-sm mb-1 opacity-80">AI Assistant</strong>
                                <p className="text-base">Typing...</p>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} /> {/* Empty div for scrolling */}
                </div>

                {/* Message Input Form */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700 bg-gray-700 rounded-b-lg">
                    <div className="flex space-x-3">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Ask your question..."
                            className="flex-1 px-4 py-2 rounded-lg bg-gray-900 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={isTyping} // Disable input while AI is typing
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white p-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                            disabled={isTyping} // Disable button while AI is typing
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// Main App component
const SupportPage = () => { // Renamed from App to SupportPage
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('General Inquiry'); // New state for message type
    const [showChat, setShowChat] = useState(false);
    const [faqSearchTerm, setFaqSearchTerm] = useState(''); // New state for FAQ search

    // Handle form submission (for demonstration purposes)
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', { email, messageType, message }); // Log messageType as well
        alert('Your inquiry has been submitted! We will get back to you soon.');
        setEmail('');
        setMessage('');
        setMessageType('General Inquiry'); // Reset message type
    };

    const faqs = [
        {
            question: "How can I withdraw my money?",
            answer: "To withdraw your money, navigate to the 'Wallet' or 'Cashout' section in your profile. Select your preferred withdrawal method and follow the instructions to complete the transaction."
        },
        {
            question: "How much time will it take for rewards to convert into money?",
            answer: "The conversion time for rewards to money can vary depending on the reward type and processing times. Please refer to the specific reward program terms for detailed information."
        },
        {
            question: "How do I earn coins?",
            answer: "You can earn coins by participating in various in-game activities, completing challenges, winning matches, and through special events. Check the 'Earn Coins' section for more details."
        },
        {
            question: "What is the conversion rate between coins and money?",
            answer: "The conversion rate between coins and money is subject to change and can be found in the 'Wallet' or 'Exchange' section of your account. Please check there for the most current rates."
        },
        {
            question: "Is my account secure?",
            answer: "We use industry-standard encryption and security protocols to protect your account and personal information. We recommend using a strong, unique password and enabling two-factor authentication for added security."
        },
        {
            question: "How do I update my profile information?",
            answer: "You can update your profile information by visiting the 'Account Settings' section in your dashboard. From there, you can edit your personal details, payment methods, and notification preferences."
        }
    ];

    // Filtered FAQs based on search term
    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(faqSearchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(faqSearchTerm.toLowerCase())
    );

    const popularArticles = [
        { title: "Troubleshooting Game Lag", url: "#" },
        { title: "Understanding Coin Rewards", url: "#" },
        { title: "Setting Up Your Gaming Profile", url: "#" },
    ];

    return (
        <div className="min-h-screen flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 bg-gray-900 text-gray-100">
            {/* Main Container */}
            <div className="max-w-4xl w-full bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 relative">

                {/* Header Section */}
                <header className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-white mb-4 drop-shadow-lg">Support Center</h1>
                    <p className="text-xl text-gray-400">Your ultimate guide to smooth gaming.</p>
                </header>

                {/* Popular Articles Section */}
                <section className="mb-12">
                    <h2 className="text-4xl font-bold text-white mb-8 text-center flex items-center justify-center">
                        <span className="mr-3 text-yellow-400">🔥</span> Popular Articles
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {popularArticles.map((article, index) => (
                            <a
                                key={index}
                                href={article.url}
                                className="bg-gray-700 p-5 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 text-center block"
                            >
                                <h3 className="text-lg font-semibold text-blue-300 mb-2">{article.title}</h3>
                                <p className="text-gray-400 text-sm">Read more &rarr;</p>
                            </a>
                        ))}
                    </div>
                </section>

                {/* FAQs Section */}
                <section className="mb-12">
                    <h2 className="text-4xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
                    {/* FAQ Search Bar */}
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Search FAQs..."
                            value={faqSearchTerm}
                            onChange={(e) => setFaqSearchTerm(e.target.value)}
                            className="w-full px-5 py-3 rounded-lg bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        />
                    </div>
                    <div className="space-y-6">
                        {filteredFaqs.length > 0 ? (
                            filteredFaqs.map((faq, index) => (
                                <FAQItem key={index} question={faq.question} answer={faq.answer} />
                            ))
                        ) : (
                            <p className="text-center text-gray-400">No FAQs found matching your search.</p>
                        )}
                    </div>
                </section>

                {/* Contact Form Section */}
                <section className="mb-12">
                    <h2 className="text-4xl font-bold text-white mb-8 text-center">Contact Us</h2>
                    <form onSubmit={handleSubmit} className="bg-gray-700 p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                        <div className="mb-6">
                            <label htmlFor="email" className="block text-gray-300 text-lg font-medium mb-2">Your Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="your.email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-3 rounded-lg bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                required
                            />
                        </div>

                        {/* New Dropdown for Message Type */}
                        <div className="mb-6">
                            <label htmlFor="messageType" className="block text-gray-300 text-lg font-medium mb-2">What type of message would you like to send us?</label>
                            <select
                                id="messageType"
                                name="messageType"
                                value={messageType}
                                onChange={(e) => setMessageType(e.target.value)}
                                className="w-full px-5 py-3 rounded-lg bg-gray-900 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                required
                            >
                                <option value="General Inquiry">General Inquiry</option>
                                <option value="Feedback/Suggestion">Feedback/Suggestion</option>
                                <option value="Report a Problem">Report a Problem</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="message" className="block text-gray-300 text-lg font-medium mb-2">Your Message</label>
                            <textarea
                                id="message"
                                name="message"
                                rows="6"
                                placeholder="Describe your issue or inquiry here..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full px-5 py-3 rounded-lg bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                required
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Submit Inquiry
                        </button>
                        {/* Estimated Response Time */}
                        <p className="text-center text-gray-400 text-sm mt-3">Typical response time: 1-2 business days.</p>
                        {/* New link for "Still facing problem?" */}
                        <div className="text-center mt-4">
                            <a
                                href="https://forms.gle/F8U99FtBZzcTsBGt8"
                                target="_blank" // Opens in a new tab
                                rel="noopener noreferrer" // Security best practice for target="_blank"
                                className="text-blue-400 hover:text-blue-200 font-semibold text-md transition duration-200"
                            >
                                Still facing problem?
                            </a>
                        </div>
                    </form>
                </section>

                {/* Back to Home Link and Community Link */}
                <div className="text-center mt-12 flex justify-center space-x-6">
                    <a href="#" className="text-blue-400 hover:text-blue-200 font-semibold text-lg transition duration-200">
                        &larr; Back to Home
                    </a>
                    <a href="#" className="text-purple-400 hover:text-purple-200 font-semibold text-lg transition duration-200">
                        Join Our Community Forum &rarr;
                    </a>
                </div>
            </div>

            {/* AI Chat Widget (Floating bottom-right) */}
            <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
                <p className="text-gray-300 text-sm mb-2 mr-3">Need instant help? Chat with our AI assistant!</p>
                <button
                    className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors duration-300 flex items-center justify-center text-lg font-bold transform hover:scale-110"
                    onClick={() => setShowChat(true)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    AI Chat
                </button>
            </div>

            {/* Chat Modal Component */}
            {showChat && (
                <ChatModal
                    isOpen={showChat}
                    onClose={() => setShowChat(false)}
                />
            )}
        </div>
    );
};

export default SupportPage;
