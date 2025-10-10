import React from 'react'

const Header = () => {
  return (
    <div className="py-10">
      <div className="text-center">
        <span className="px-4 py-1 rounded-full bg-gray-200 text-red-600 font-xs ">career opportunities</span>

        <h2 className="text-6xl font-bold py-2">Find Your<br /> <span className="text-fuchsia-900">Perfect <span className="text-cyan-800">JOB</span> Match</span></h2><br />
        <p className="font-xxs">Your dream job is just a click away.The job you deserve is within reach. Elevate your career with expert guidance. </p>
        <p>Connecting the best talent with the best opportunities.The bridge between talent and triumph.

        </p><br />
        <div className="relative max-w-md mx-auto shadow-xl">
          <input
            type="text"
            placeholder="Find your dream job..."
            className="block w-full py-2 pl-4 pr-20 text-sm border border-gray-300 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-fuchsia-600 text-white text-sm px-4 py-1.5 rounded-full hover:bg-fuchsia-950"
          >
            Search
          </button>
        </div>




      </div>

    </div>
  )
}

export default Header
