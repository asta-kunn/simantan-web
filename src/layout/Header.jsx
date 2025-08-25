import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, Menu as MenuIcon, Search } from "lucide-react";

import { Button, ConfirmationPopover } from "@/components/Dexain";
import {
  default as authStore,
  default as useAuthStore,
} from "@/stores/authStore";
import useGeneralStore from "@/stores/generalStore";
import { Breadcrumbs } from "@/components/fields/Breadcrumbs";
import logoVidaAi from "@/assets/logos/logo_vida_ai.svg";
import { useUIStore } from "@/stores/uiStore";
import { Tabs } from "@/components/Dexain";
import { Input } from "@/components/fields/Input";
import { AtSign, ChartLine, Paperclip, Send } from "lucide-react";
import Notification from "./Notification";

const Header = ({ handleDarkMode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { addStack } = useUIStore();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const sheet = useUIStore((state) => state.sheet);

  /** Store */
  const isAuthenticated = authStore((state) => state.isAuthenticated);
  const user = authStore((state) => state.user);
  const { setLogout } = useAuthStore();
  const toggleSidebar = useGeneralStore((state) => state.toggleSidebar);
  const toggleSidebarMobile = useGeneralStore(
    (state) => state.toggleSidebarMobile
  );

  /** Local State */
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const historyData = [
    {
      text: "How many Registration Renewal tasks are assigned to [Dito Rido]?",
    },
    { text: "RA - Product registration tasks Completed" },
    {
      text: "How many Registration Variation and Notification tasks are assigned to [Novia Wulandari]?",
    },
    {
      text: 'List Registration Variation & Notification tasks that are currently "In Progress" and group by Last Step "Respon NIS & Upload Document"',
    },
  ];

  useEffect(() => {
    setIsSheetOpen(sheet.isOpen);
  }, [sheet.isOpen]);

  const isdebugMode = localStorage.getItem("debugMode") === "true";

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("debugMode");

      const currentLocation = location.pathname + location.search;
      await setLogout();

      const tokenData = {
        authorizedUser: [user.LOGIN_ID],
        url: currentLocation,
        parameter: location.state,
      };
      const token = btoa(JSON.stringify(tokenData));

      navigate(`/login?token=${token}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenVidaAI = () => {
    addStack({
      type: "sheet",
      title: "Vida AI",
      size: "xl",
      content: (
        <Tabs
          style="sticky"
          tabs={[
            {
              value: "sb1",
              label: "Chat",
              content: <ChatTabContent user={user} />,
            },
            {
              value: "sb2",
              label: "History",
              content: <HistoryTabContent />,
            },
          ]}
        />
      ),
    });
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white border-b border-gray-200 py-2 px-4 flex items-center justify-between"
    >
      <div className="flex items-center space-x-1">
        <Button
          className="p-2"
          variant="outline"
          onClick={() => {
            toggleSidebar();
            toggleSidebarMobile();
          }}
        >
          <MenuIcon className="h-4 w-4" />
        </Button>
        <Breadcrumbs />
      </div>

      <div className="flex items-center space-x-2">
        {isdebugMode && (
          <div className="text-sm text-primary-normal font-bold border border-primary-normal rounded-md px-2 py-1">
            <span className="text-xs text-primary-normal font-bold">
              Debug Mode
            </span>
          </div>
        )}

        <div className="flex items-center">
          {/* <div className="relative">
            <Notification />
          </div> */}

          {/* <Button
            variant="soft"
            className="p-2 font-semibold transition-colors duration-300 bg-tertiary-normal hover:bg-primary-soft hover:text-primary-normal active:bg-primary-soft active:text-primary-normal text-black"
            onClick={handleOpenVidaAI}
          >
            <motion.img
              src={logoVidaAi}
              alt="Vida AI"
              className="h-4 w-4"
              animate={{ rotate: isSheetOpen ? 45 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              whileHover={{ rotate: 45 }}
            />
            Vida AI
          </Button> */}
        </div>

        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-normal text-white my-auto text-sm font-bold">
          {user && user.username
            ? user.username.split(" ")
                .map((n) => n[0])
                .filter(Boolean)
                .slice(0, 2)
                .map((c) => c.toUpperCase())
                .join(" ")
            : ""}
        </div>
        <div className="flex border-gray-200">
          <div className="flex flex-col justify-center">
            <div className="flex flex-col leading-tight">
              <b className="text-gray-600 text-sm font-bold">
                {user ? user.username : ""}
              </b>
              <span className="text-primary-normal text-xs  font-semibold ">
                Officer
              </span>
              <span className="text-gray-400 text-xs">
                Dinas Pertanian & Peternakan
              </span>
            </div>
          </div>
        </div>

        <ConfirmationPopover
          content="Are you sure you want to logout ?"
          onConfirm={handleLogout}
        >
          <Button
            className="p-2 font-semibold transition-colors duration-300"
            variant="outline"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </ConfirmationPopover>
      </div>
    </motion.header>
  );
};

function ChatTabContent({ user }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "How can I help you today?",
      timestamp: "10:30 AM",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      sender: "user",
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        sender: "ai",
        text: "I received your message. How can I assist you further?",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Header section */}
      <div className="pt-4 pb-4">
        <h1 className="bg-gradient-to-r from-[#D32F2F] to-[#E98A37] bg-clip-text text-transparent">
          Hello {user ? user.NAME : ""}!
        </h1>
        <div className="text-gray-500 text-sm">
          Pick a prompt or suggestion or ask anything.
        </div>
      </div>

      {/* Chat messages area - takes up most of the space */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "ai" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`rounded-lg p-3 max-w-[80%] ${
                message.sender === "ai" ? "bg-gray-100" : "bg-primary-soft"
              }`}
            >
              <p className="text-sm text-gray-800">{message.text}</p>
              <span className="text-xs text-gray-500 mt-1">
                {message.sender === "ai" ? "AI Assistant" : "You"} •{" "}
                {message.timestamp}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom section with suggestions and input */}
      <div className="mt-auto">
        <div className="flex gap-3 mb-1 overflow-x-auto pb-2">
          <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm cursor-pointer hover:bg-gray-50 transition flex-shrink-0 max-w-[200px]">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 flex-shrink-0" />
              <div className="font-semibold text-sm text-gray-800 truncate">
                Find task
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1 line-clamp-2">
              How many product registration tasks are assigned to{" "}
              <span className="text-primary-normal font-semibold">
                [person]
              </span>
              ?
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm cursor-pointer hover:bg-gray-50 transition flex-shrink-0 max-w-[200px]">
            <div className="flex items-center gap-2">
              <ChartLine className="h-4 w-4 flex-shrink-0" />
              <div className="font-semibold text-sm text-gray-800 truncate">
                Measure productivity
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1 line-clamp-2">
              List Registration Variation & Notification tasks that are
              currently "In Progress".
            </div>
          </div>
        </div>

        {/* Input area - fixed at the bottom */}
        <div className="bg-white border border-gray-200 rounded-xl p-2 flex flex-col shadow-md">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Write a prompt to get started"
            className="border-none shadow-none focus:ring-0 focus:border-none bg-transparent px-0 text-gray-500 placeholder:text-gray-400 resize-none"
          />
          <div className="flex items-end justify-between mt-2">
            <div className="flex gap-2">
              <button
                type="button"
                className="bg-gray-100 border border-gray-200 rounded-md p-2 text-black hover:bg-gray-200 transition"
              >
                <Paperclip className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="bg-gray-100 border border-gray-200 rounded-md p-2 text-black hover:bg-gray-200 transition"
              >
                <AtSign className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={handleSendMessage}
              className="bg-primary-normal text-white rounded-md p-2 transition hover:bg-primary-dark"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function HistoryTabContent() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const historyData = [
    {
      text: "How many Registration Renewal tasks are assigned to [Dito Rido]?",
    },
    { text: "RA - Product registration tasks Completed" },
    {
      text: "How many Registration Variation and Notification tasks are assigned to [Novia Wulandari]?",
    },
    {
      text: 'List Registration Variation & Notification tasks that are currently "In Progress" and group by Last Step "Respon NIS & Upload Document"',
    },
  ];
  return (
    <div className="space-y-3 pt-4 pb-2">
      {historyData.map((item, idx) => {
        const isRed = idx % 2 === 1;
        return (
          <div
            key={idx}
            className={
              (isRed
                ? "bg-primary-soft border border-tertiary-normal "
                : "bg-white border border-gray-200 ") +
              "rounded-lg p-3 flex flex-col gap-2 relative"
            }
          >
            <div className="flex items-center justify-between">
              <div
                className={
                  (isRed ? "text-primary-normal " : "text-gray-800 ") +
                  "text-sm hover:underline cursor-pointer transition-all"
                }
              >
                {item.text}
              </div>
              <button
                className={
                  "p-1 rounded " +
                  (isRed
                    ? "hover:bg-danger-soft text-primary-normal"
                    : "hover:bg-gray-100 text-gray-400")
                }
                onClick={() =>
                  setOpenDropdown(openDropdown === idx ? null : idx)
                }
              >
                <span className="sr-only">More</span>
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <circle cx="12" cy="6" r="1.5" />
                  <circle cx="12" cy="12" r="1.5" />
                  <circle cx="12" cy="18" r="1.5" />
                </svg>
              </button>
            </div>
            {openDropdown === idx && (
              <div className="absolute right-3 top-12 z-10 w-32 bg-white border border-gray-200 rounded-lg shadow-md py-1">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Rename
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-danger-normal hover:bg-danger-soft">
                  Delete
                </button>
              </div>
            )}
          </div>
        );
      })}

      <div className="mt-4 bg-white border border-gray-200 rounded-xl p-3 flex flex-col gap-2">
        <Input
          placeholder="Write a prompt to get started"
          className="border-none shadow-none focus:ring-0 focus:border-none bg-transparent px-0 text-gray-500 placeholder:text-gray-400 min-h-[32px] resize-none"
          style={{ minHeight: 32 }}
        />
        <div className="flex items-end justify-between mt-2">
          <div className="flex gap-2">
            <button
              type="button"
              className="bg-gray-100 border border-gray-200 rounded-md p-2 text-black hover:bg-gray-200 transition"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="bg-gray-100 border border-gray-200 rounded-md p-2 text-black hover:bg-gray-200 transition"
            >
              <AtSign className="h-4 w-4" />
            </button>
          </div>
          <button
            type="button"
            className="bg-transparent text-gray-500 hover:bg-tertiary-normal hover:text-black rounded-md p-2 transition"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
