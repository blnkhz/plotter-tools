const AboutModal = ({ closeModal }) => {
  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
      <div className="bg-rose-50 rounded-lg shadow-xl p-6 w-full md:max-w-[80%] text-green-700 max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">about</h2>
          <button
            onClick={closeModal}
            className="text-rose-500 hover:text-rose-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <div className="mb-4 overflow-y-auto flex-1">
          <p className="font-semibold py-4">Why plotting?</p>
          <p className="mx-2">
            There's something oddly satisfying about pen plotting. It's this
            weird reverse-engineering of the digital world—taking cold computer
            data and spitting out something you can actually touch and hang on
            your wall. Unlike regular printers that just splatter ink onto
            paper, a pen plotter grabs the same tools humans use—pens, pencils,
            brushes—and drags them across the page with robot precision. Each
            drawing tool brings its own quirky character to the table: ink might
            puddle at the corners, pencils might skip on the texture of the
            paper, brushes might leave those delightful little bristle marks.
            These "flaws" are actually what make the whole thing magical—this
            strange dance between mathematical perfection and the chaotic nature
            of physical materials. It's like teaching a robot to make art with
            human tools, and watching the delightful mess that results. (Plus
            they sound amazing, at least for the first five minutes.)
          </p>
          <p className="font-semibold py-4">What do you use for plotting?</p>
          <p className="mx-2">
            I have an{' '}
            <a
              href="https://shop.evilmadscientist.com/productsmenu/890"
              target="_blank"
              className="text-rose-500 hover:text-rose-700"
            >
              Axidraw V3/A3
            </a>{' '}
            that's unfortunately no longer in production.
          </p>
          <p className="font-semibold py-4">Is the code available somewhere?</p>
          <p className="mx-2">
            <a
              href="https://github.com/blnkhz/plotter-tools"
              target="_blank"
              className="text-rose-500 hover:text-rose-700"
            >
              It sure is
            </a>
            , though it is very much of a work in progress.
          </p>
          <p className="font-semibold py-4">Who are you?</p>
          <p className="mx-2">
            <a
              href="https://blnkhz.me"
              target="_blank"
              className="text-rose-500 hover:text-rose-700"
            >
              blanka
            </a>{' '}
            (gotta update my landing page)
          </p>
        </div>
        <div className="flex justify-end mt-2">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-rose-100 text-green-700 rounded hover:bg-rose-200 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default AboutModal
