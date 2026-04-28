"use client";

import { useState, useEffect } from "react";
import { FaCopy, FaTrash } from "react-icons/fa";
import { PiLinkSimpleFill } from "react-icons/pi";
import { TbWorldCheck } from "react-icons/tb";
import { LiaStaylinked } from "react-icons/lia";

type LinkItem = {
  code: string;
  original: string;
  short: string;
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [open, setOpen] = useState(true);

  const [copiedToast, setCopiedToast] = useState(false);
  const [success, setSuccess] = useState(false);

  // ✅ Load saved links on refresh
  useEffect(() => {
    const saved = localStorage.getItem("links");
    if (saved) {
      setLinks(JSON.parse(saved));
    }
  }, []);

  // ✅ SHORTEN + SAVE LOCALLY
  const handleShorten = () => {
    if (!url.trim()) return;

    const code = Math.random().toString(36).substring(2, 8);

    const baseUrl = window.location.origin; // 👈 this is the fix
    const short = `${baseUrl}/${code}`;

    const newLink = {
      code,
      original: url,
      short,
    };

    const updated = [newLink, ...links];

    setLinks(updated);
    localStorage.setItem("links", JSON.stringify(updated));

    setShortUrl(short);
    setUrl("");

    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  // ✅ COPY
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 1800);
  };

  // ✅ DELETE
  const handleDelete = (index: number) => {
    const updated = links.filter((_, i) => i !== index);
    setLinks(updated);
    localStorage.setItem("links", JSON.stringify(updated));
  };

  return (
    <main className="flex min-h-screen bg-gray-50 relative">

      {/* SUCCESS TOAST */}
      <div
        className={`fixed top-6 left-1/2 -translate-x-1/2 transition-all duration-500 ${
          success
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="bg-white border shadow-lg px-4 py-2 rounded-full flex items-center gap-2">
          <div className="bg-green-100 p-2 rounded-full">
            <TbWorldCheck className="text-green-600" size={18} />
          </div>
          <span className="text-sm font-medium text-gray-700">
            Link is ready
          </span>
        </div>
      </div>

      {/* COPIED TOAST */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 transition-all duration-500 ${
          copiedToast
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="bg-black text-white px-4 py-2 rounded-full text-sm shadow-lg">
          Copied to clipboard
        </div>
      </div>

      {/* SIDEBAR */}
      <aside
        className={`h-screen bg-white border-r shadow-sm transition-all duration-500 ease-in-out flex flex-col ${
          open ? "w-80" : "w-16"
        }`}
      >
        {/* Toggle */}
        <div className="p-3 border-b flex justify-end">
          <button
            onClick={() => setOpen(!open)}
            className="hover:bg-gray-100 p-2 rounded-lg transition"
          >
            <PiLinkSimpleFill
              size={22}
              className={`transition-transform duration-500 ${
                open ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
        </div>

        {/* Links */}
        <div className="p-4 flex-1 overflow-hidden">
          {open && (
            <>
              <h2 className="font-semibold text-lg mb-4 text-gray-800">
                Saved Links
              </h2>

              <div className="space-y-3 overflow-y-auto h-full pr-1">
                {links.length === 0 && (
                  <p className="text-gray-400 text-sm">No links yet</p>
                )}

                {links.map((link, index) => (
                  <div
                    key={index}
                    className="group bg-gray-50 hover:bg-white border border-gray-100 hover:shadow-md transition-all duration-300 p-3 rounded-xl flex flex-col gap-2"
                  >
                    <span className="text-xs text-gray-400 truncate">
                      {link.original}
                    </span>

                    <div className="flex items-center justify-between">
                      <span className="text-blue-600 text-sm truncate font-medium">
                        {link.short}
                      </span>

                      <div className="flex gap-2 opacity-70 group-hover:opacity-100 transition">
                        <button
                          onClick={() => handleCopy(link.short)}
                          className="p-1 hover:bg-gray-200 rounded-md transition"
                        >
                          <FaCopy size={13} />
                        </button>

                        <button
                          onClick={() => handleDelete(index)}
                          className="p-1 hover:bg-red-100 text-red-500 rounded-md transition"
                        >
                          <FaTrash size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </aside>

      {/* MAIN */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6">

        {/* TITLE */}
        <h1 className="flex items-center gap-2 text-5xl font-bold text-gray-900 tracking-tight">
          <LiaStaylinked size={60} className="text-blue-500 animate-pulse" />
          UrlCut
        </h1>

        {/* SUBTEXT */}
        <p className="mt-3 text-gray-500 max-w-md">
          A fast, modern URL shortener that turns long links into clean, shareable URLs.
        </p>

        {/* INPUT */}
        <div className="mt-10 w-full max-w-xl bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Paste your long URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

            <button
              onClick={handleShorten}
              className="px-5 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 active:scale-95 transition"
            >
              Shorten
            </button>
          </div>
        </div>

        {/* RESULT */}
        {shortUrl && (
          <div className="mt-4 w-full max-w-xl bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <span className="text-blue-600 font-medium break-all">
              {shortUrl}
            </span>

            <button
              onClick={() => handleCopy(shortUrl)}
              className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl hover:bg-gray-100 transition"
            >
              <FaCopy size={14} />
            </button>
          </div>
        )}

      </section>
    </main>
  );
}