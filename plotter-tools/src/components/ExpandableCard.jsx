import React, { useState } from 'react'

const ExpandableCard = ({
  title = 'What is this?',
  mainContent,
  expandedContent,
  features = [],
  images = [],
  initialExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded)

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-xl text-green-700">{title}</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-green-700 hover:text-green-800 text-sm font-medium"
        >
          {isExpanded ? (
            'Show less'
          ) : (
            <p className="animate-bounce">Read more</p>
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="animate-fadeIn mt-4">
          <div className="text-gray-600 mb-4">{mainContent}</div>
          {expandedContent}
          {features.length > 0 && (
            <>
              <h3 className="text-lg font-semibold text-green-700 mt-6 mb-3">
                Key Features
              </h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                {features.map((feature, index) => (
                  <li key={index}>
                    <strong>{feature.name}</strong>: {feature.description}
                  </li>
                ))}
              </ul>
            </>
          )}
          {images.length > 0 && (
            <div className="text-gray-600">
              {images.map((image, index) => (
                <div key={index}>
                  {image.caption && <p>{image.caption}</p>}
                  <img
                    src={image.src}
                    alt={image.alt || 'image'}
                    width={image.width || 400}
                  />
                </div>
              ))}
            </div>
          )}
          <p className="text-gray-600 mt-4 italic text-sm">
            Free to use & open-source (づ｡◕‿‿◕｡)づ
          </p>
        </div>
      )}
    </div>
  )
}

export default ExpandableCard
