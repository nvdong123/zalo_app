import React, { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

export interface IImage {
  src: string;
  alt: string;
  title: string;
}

export interface CarouselProps {
  images: IImage[];
  autoplay?: boolean;
  autoplayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  showNumbers?: boolean;
}

export const ImageCarousel: React.FC<CarouselProps> = ({
    images,
    autoplay = true,
    autoplayInterval = 4000,
    showDots = true,
    showArrows = true,
    showNumbers = true,
}) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'center',
        skipSnaps: false,
    });

    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const scrollPrev = useCallback(
        () => emblaApi && emblaApi.scrollPrev(),
        [emblaApi]
    );

    const scrollNext = useCallback(
        () => emblaApi && emblaApi.scrollNext(),
        [emblaApi]
    );

    const scrollTo = useCallback(
        (index: number) => emblaApi && emblaApi.scrollTo(index),
        [emblaApi]
    );

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;

        onSelect();
        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on('select', onSelect);

        return () => {
            emblaApi.off('select', onSelect);
        };
    }, [emblaApi, onSelect]);

    // Autoplay functionality
    useEffect(() => {
        if (!emblaApi || !autoplay) return;

        const intervalId = setInterval(() => {
            emblaApi.scrollNext();
        }, autoplayInterval);

        return () => clearInterval(intervalId);
    }, [emblaApi, autoplay, autoplayInterval]);

    // Loading state
    const [isLoading, setIsLoading] = useState<boolean>(true);

    return (
        <div className="relative max-w-4xl mx-auto max-h-[300px]">
            {/* Main Carousel */}
            <div className="overflow-hidden bg-gray-100 relative" ref={emblaRef}>
                <div className="flex touch-pan-y">
                    {images.map((image: IImage, index: number) => (
                        <div
                            key={index}
                            className="relative flex-[0_0_100%] min-w-0"
                        >
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-[300px] object-cover rounded-lg transition-opacity duration-300"
                                onLoad={() => setIsLoading(false)}
                                style={{ opacity: isLoading ? 0 : 1 }}
                            />
                            
                        </div>

                    ))}
                </div>
                
                {showNumbers && (
                        <div className="absolute bottom-2 right-2 bg-white bg-opacity-80 p-1 rounded-lg shadow-lg">
                            {selectedIndex+1}/{images.length}
                        </div>
                    )}
            </div>

            {/* Navigation Arrows */}
            {showArrows && (
                <>
                    <button
                        type="button"
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full shadow-lg hover:bg-opacity-100 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={scrollPrev}
                        aria-label="Previous slide"
                    >
                        ←
                    </button>
                    <button
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full shadow-lg hover:bg-opacity-100 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={scrollNext}
                        aria-label="Next slide"
                    >
                        →
                    </button>
                </>
            )}

            {/* Dots Navigation */}
            {showDots && (
                <div className="flex justify-center gap-2 mt-4">
                    {scrollSnaps.map((_, index: number) => (
                        <button
                            key={index}
                            type="button"
                            className={`w-2 h-2 rounded-full transition-all ${index === selectedIndex ? 'bg-blue-600 w-4' : 'bg-gray-300'
                                }`}
                            onClick={() => scrollTo(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};