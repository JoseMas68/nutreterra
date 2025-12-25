import { useState } from 'react';

interface ProductGalleryProps {
  mainImage: string;
  galleryImages: string[];
  productName: string;
}

export default function ProductGallery({ mainImage, galleryImages = [], productName }: ProductGalleryProps) {
  const allImages = [mainImage, ...galleryImages];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Imagen principal */}
      <div
        className="relative aspect-square rounded-xl overflow-hidden shadow-lg cursor-zoom-in group"
        onClick={() => setIsModalOpen(true)}
      >
        <img
          src={allImages[selectedIndex]}
          alt={`${productName} - Vista ${selectedIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {allImages.length > 1 && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
            <svg className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
          </div>
        )}
      </div>

      {/* Miniaturas */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                selectedIndex === index
                  ? 'border-primary shadow-md scale-105'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <img
                src={image}
                alt={`${productName} - Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Modal de imagen ampliada */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="relative max-w-4xl w-full">
            <img
              src={allImages[selectedIndex]}
              alt={`${productName} - Vista ampliada ${selectedIndex + 1}`}
              className="w-full h-auto rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            {allImages.length > 1 && (
              <>
                {/* Botón anterior */}
                {selectedIndex > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIndex(selectedIndex - 1);
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}

                {/* Botón siguiente */}
                {selectedIndex < allImages.length - 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIndex(selectedIndex + 1);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}

                {/* Indicador de posición */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  {selectedIndex + 1} / {allImages.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
