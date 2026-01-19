import React from 'react';

export const GallerySection: React.FC = () => {
  const galleryImages = [
    {
      id: 'reception',
      src: '/images/reception.png',
      alt: 'NEXX Reception',
      title: 'Наша рецепція',
      description: 'Затишний простір для клієнтів',
    },
    {
      id: 'workspace',
      src: '/images/workspace.png',
      alt: 'NEXX Workspace',
      title: 'Робоче місце майстра',
      description: 'Професійне обладнання',
    },
    {
      id: 'facade',
      src: '/images/facade.png',
      alt: 'NEXX Facade',
      title: 'Фасад сервіс-центру',
      description: 'Легко знайти у центрі міста',
    },
  ];

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Наш сервіс-центр
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Сучасне обладнання та комфортний простір для клієнтів
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {galleryImages.map((image) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden bg-slate-200">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-1">{image.title}</h3>
                  <p className="text-sm text-white/80">{image.description}</p>
                </div>
              </div>

              {/* Zoom Icon */}
              <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <i className="fa fa-search-plus text-slate-900"></i>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-4">
            Завітайте до нас і переконайтеся в професіоналізмі нашої команди!
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-lg"
          >
            Записатися на візит
            <i className="fa fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
