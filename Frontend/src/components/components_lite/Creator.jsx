import React from "react";
import Navbar from "./Navbar";
import img11 from "./img11.jpg";

const Creator = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <div className="bg-gray-800 shadow-2xl rounded-3xl p-10 max-w-5xl w-full flex flex-col md:flex-row items-center md:gap-12 border border-gray-700">

          {/* Photo */}
          <div className="flex-shrink-0 transform transition-transform duration-500 hover:scale-105">
            <img
              src={img11} // Replace with your photo URL
              alt="Creator"
              className="w-52 h-52 rounded-full object-cover border-4 border-gray-600 shadow-xl"
            />
          </div>

          {/* Description */}
          <div className="text-center md:text-left mt-6 md:mt-0 space-y-4">
            <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">
              Hi, I&apos;m Muskan Kumari
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              I am a passionate Full Stack Developer and web enthusiast. I love
              turning ideas into interactive web applications and solving
              complex problems with elegant code. With a deep interest in
              modern technologies, I continually strive to learn, innovate, and
              build experiences that users love.
            </p>
            <p className="text-gray-400 text-md">
              I specialize in React, Node.js, JavaScript, and modern web
              frameworks. From front-end interfaces to back-end APIs, I create
              responsive, scalable, and secure solutions. I also enjoy
              mentoring, collaborating, and sharing knowledge with the tech
              community.
            </p>
            <p className="text-gray-400 text-md">
              My philosophy: <span className="text-purple-400 font-semibold">"Code with purpose, design with passion, create with curiosity."</span>
            </p>

            {/* Social Buttons */}
            <div className="flex justify-center md:justify-start gap-4 mt-6">
              <a
                href="https://github.com/msingh7763"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 bg-gray-700 text-white font-semibold rounded-xl shadow-lg hover:bg-gray-600 transition transform hover:-translate-y-1"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 bg-purple-600 text-white font-semibold rounded-xl shadow-lg hover:bg-purple-500 transition transform hover:-translate-y-1"
              >
                LinkedIn
              </a>
              <a
                href="https://twitter.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 bg-blue-500 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-400 transition transform hover:-translate-y-1"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Creator;
