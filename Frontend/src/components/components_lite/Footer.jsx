import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-10 border-t border-slate-800 bg-slate-950/70 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
        <div className="text-center md:text-left space-y-1">
          <p className="font-medium text-slate-300">
            © 2025 <span className="text-purple-400">Muskan</span>. All rights reserved.
          </p>
          <p>
            Built with ❤️ for developers & recruiters.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/msingh7763"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-purple-400 transition-colors"
            >
              GitHub
            </a>
          </div>

          <div className="h-px w-12 md:h-5 md:w-px bg-slate-800" />

          <div className="flex items-center gap-3">
            <Link
              to="/privacy-policy"
              className="hover:text-slate-200 transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-slate-600">•</span>
            <Link
              to="/terms-of-service"
              className="hover:text-slate-200 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;