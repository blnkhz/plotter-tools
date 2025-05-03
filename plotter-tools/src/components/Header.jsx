import { useState } from 'react'
import AboutModal from './AboutModal'

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <div className="w-full min-w-full text-white shadow-md">
      <div className="w-full px-2 sm:px-6 py-2 flex justify-between items-center">
        <h1 className="text-xl text-green-700">blanka's plotter tools</h1>
        <button
          onClick={openModal}
          className="px-4 py-2 bg-rose-100 text-green-700 rounded hover:bg-rose-200 transition-colors duration-200"
        >
          about
        </button>
      </div>

      {isModalOpen && <AboutModal closeModal={closeModal} />}
    </div>
  )
}

export default Header
