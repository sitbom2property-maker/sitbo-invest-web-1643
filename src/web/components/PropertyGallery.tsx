import { useCallback, useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import { A11y, FreeMode, Keyboard, Navigation, Thumbs } from "swiper/modules";
import { useT } from "../i18n";

import "swiper/css";
import "./property-gallery.css";

type PropertyGalleryProps = {
  photos: string[];
  name: string;
};

function Chevron({ dir }: { dir: "prev" | "next" }) {
  const isPrev = dir === "prev";
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d={isPrev ? "M11.25 3.75 6 9l5.25 5.25" : "M6.75 3.75 12 9l-5.25 5.25"}
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="3.4" height="3.4" rx="0.4" stroke="currentColor" strokeWidth="1.2" />
      <rect x="5.3" y="1" width="3.4" height="3.4" rx="0.4" stroke="currentColor" strokeWidth="1.2" />
      <rect x="9.6" y="1" width="3.4" height="3.4" rx="0.4" stroke="currentColor" strokeWidth="1.2" />
      <rect x="1" y="5.3" width="3.4" height="3.4" rx="0.4" stroke="currentColor" strokeWidth="1.2" />
      <rect x="5.3" y="5.3" width="3.4" height="3.4" rx="0.4" stroke="currentColor" strokeWidth="1.2" />
      <rect x="9.6" y="5.3" width="3.4" height="3.4" rx="0.4" stroke="currentColor" strokeWidth="1.2" />
      <rect x="1" y="9.6" width="3.4" height="3.4" rx="0.4" stroke="currentColor" strokeWidth="1.2" />
      <rect x="5.3" y="9.6" width="3.4" height="3.4" rx="0.4" stroke="currentColor" strokeWidth="1.2" />
      <rect x="9.6" y="9.6" width="3.4" height="3.4" rx="0.4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function PropertyGallery({ photos, name }: PropertyGalleryProps) {
  const t = useT();
  const uid = useId().replace(/:/g, "");
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [lightboxThumbs, setLightboxThumbs] = useState<SwiperClass | null>(null);
  const [mainSwiper, setMainSwiper] = useState<SwiperClass | null>(null);
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const readyThumbs = thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null;
  const readyLightboxThumbs = lightboxThumbs && !lightboxThumbs.destroyed ? lightboxThumbs : null;
  const total = photos.length;

  const openLightbox = useCallback(() => {
    if (total === 0) return;
    setLightboxOpen(true);
  }, [total]);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.classList.add("sitbo-modal-open");
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("sitbo-modal-open");
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxOpen, closeLightbox]);

  useEffect(() => {
    if (!lightboxOpen && mainSwiper && !mainSwiper.destroyed) {
      mainSwiper.slideTo(active, 0);
    }
  }, [lightboxOpen, active, mainSwiper]);

  if (total === 0) return null;

  const counter = t("project.gallery.counter", { current: active + 1, total });

  const lightbox = lightboxOpen
    ? createPortal(
        <div
          className="property-gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={t("project.gallery.lightbox")}
        >
          <div className="property-gallery-lightbox-top">
            <div className="property-gallery-lightbox-title">
              {name} · {counter}
            </div>
            <button
              type="button"
              className="property-gallery-lightbox-close"
              onClick={closeLightbox}
              aria-label={t("project.gallery.close")}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M4 4l10 10M14 4 4 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="property-gallery-lightbox-stage">
            {total > 1 && (
              <>
                <button
                  type="button"
                  className="property-gallery-nav property-gallery-nav-prev"
                  data-pg-lightbox-prev={uid}
                  aria-label={t("project.gallery.prev")}
                >
                  <Chevron dir="prev" />
                </button>
                <button
                  type="button"
                  className="property-gallery-nav property-gallery-nav-next"
                  data-pg-lightbox-next={uid}
                  aria-label={t("project.gallery.next")}
                >
                  <Chevron dir="next" />
                </button>
              </>
            )}
            <Swiper
              className="property-gallery-lightbox-main"
              modules={[Navigation, Thumbs, Keyboard, A11y]}
              initialSlide={active}
              speed={480}
              spaceBetween={0}
              rewind={total > 1}
              observer
              observeParents
              keyboard={{ enabled: true }}
              navigation={
                total > 1
                  ? {
                      prevEl: `[data-pg-lightbox-prev="${uid}"]`,
                      nextEl: `[data-pg-lightbox-next="${uid}"]`,
                    }
                  : false
              }
              thumbs={{ swiper: readyLightboxThumbs, autoScrollOffset: 2, multipleActiveThumbs: false }}
              onSlideChange={(swiper) => setActive(swiper.activeIndex)}
            >
              {photos.map((src, i) => (
                <SwiperSlide key={src + i}>
                  <img src={src} alt={`${name} ${i + 1}`} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {total > 1 && (
            <div className="property-gallery-lightbox-thumbs">
              <Swiper
                modules={[FreeMode, Thumbs, A11y]}
                onSwiper={setLightboxThumbs}
                slidesPerView="auto"
                spaceBetween={4}
                watchSlidesProgress
                slideToClickedSlide
                centeredSlides
                centeredSlidesBounds
                freeMode={{ enabled: true, sticky: false }}
              >
                {photos.map((src, i) => (
                  <SwiperSlide key={src + i} aria-label={`${i + 1}`}>
                    <img src={src} alt="" />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>,
        document.body
      )
    : null;

  return (
    <div className="property-gallery">
      <div className="property-gallery-main-wrap">
        {total > 1 && (
          <>
            <button
              type="button"
              className="property-gallery-nav property-gallery-nav-prev"
              data-pg-prev={uid}
              aria-label={t("project.gallery.prev")}
            >
              <Chevron dir="prev" />
            </button>
            <button
              type="button"
              className="property-gallery-nav property-gallery-nav-next"
              data-pg-next={uid}
              aria-label={t("project.gallery.next")}
            >
              <Chevron dir="next" />
            </button>
          </>
        )}

        <div className="property-gallery-counter">{counter}</div>

        <button type="button" className="property-gallery-show-all" onClick={openLightbox}>
          <GridIcon />
          {t("project.gallery.showAll")}
        </button>

        <Swiper
          className="property-gallery-main"
          modules={[Navigation, Thumbs, Keyboard, A11y]}
          onSwiper={setMainSwiper}
          speed={480}
          spaceBetween={0}
          rewind={total > 1}
          keyboard={{ enabled: !lightboxOpen }}
          navigation={
            total > 1
              ? {
                  prevEl: `[data-pg-prev="${uid}"]`,
                  nextEl: `[data-pg-next="${uid}"]`,
                }
              : false
          }
          thumbs={{ swiper: readyThumbs, autoScrollOffset: 2, multipleActiveThumbs: false }}
          onSlideChange={(swiper) => setActive(swiper.activeIndex)}
          onClick={openLightbox}
        >
          {photos.map((src, i) => (
            <SwiperSlide key={src + i}>
              <img src={src} alt={`${name} ${i + 1}`} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {total > 1 && (
        <div className="property-gallery-thumbs">
          <Swiper
            modules={[FreeMode, Thumbs, A11y]}
            onSwiper={setThumbsSwiper}
            slidesPerView="auto"
            spaceBetween={4}
            watchSlidesProgress
            slideToClickedSlide
            centeredSlides
            centeredSlidesBounds
            freeMode={{ enabled: true, sticky: false }}
          >
            {photos.map((src, i) => (
              <SwiperSlide key={src + i}>
                <img src={src} alt="" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {lightbox}
    </div>
  );
}
