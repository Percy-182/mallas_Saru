// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// Form submission
document
  .getElementById("cotizacionForm")
  ?.addEventListener("submit", function (e) {
    e.preventDefault();
    alert(
      "¡Gracias por su solicitud! Nos pondremos en contacto a la brevedad."
    );
    this.reset();
  });

// Navbar background change on scroll
window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
    navbar.style.backgroundColor = "rgba(255, 255, 255, 0.98)";
  } else {
    navbar.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
    navbar.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
  }
});

// Cerrar menú móvil al hacer clic en un enlace
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    const navbarCollapse = document.querySelector(".navbar-collapse");
    if (navbarCollapse.classList.contains("show")) {
      document.querySelector(".navbar-toggler").click();
    }
  });
});

// Lightbox/Carousel para Portfolio
// Lightbox/Carousel para Portfolio
window.addEventListener("load", function () {
  /**
   * Galería personalizada para el lightbox.
   * Puedes agregar imágenes adicionales (locales o por URL) al array.
   * Ejemplo:
   *   {
   *     src: "assets/img/extra1.jpg", // Imagen local
   *     title: "Extra 1",
   *     desc: "Descripción extra 1"
   *   },
   *   {
   *     src: "https://ejemplo.com/otra.jpg", // Imagen por URL
   *     title: "Otra",
   *     desc: "Otra descripción"
   *   }
   */
  // Galería de imágenes agrupadas por cada item del grid (cada grupo puede tener imágenes adicionales)
  const lightboxGallery = [
    [
      {
        src: "https://cl.habcdn.com/photos/business/big/img-20190812-183839-381807.jpg",
        title: "Edificio Residencial",
        desc: "Mallas de seguridad en balcones",
      },
      {
        src: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
        title: "Edificio Residencial - Extra 1",
        desc: "Vista adicional 1",
      },
      {
        src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
        title: "Edificio Residencial - Extra 2",
        desc: "Vista adicional 2",
      },
    ],
    [
      {
        src: "https://cl.habcdn.com/photos/project/big/cobertizo-257384.jpg",
        title: "Vivienda Familiar",
        desc: "Protección para terraza y jardín",
      },
      {
        src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
        title: "Vivienda Familiar - Extra 1",
        desc: "Vista adicional 1",
      },
      {
        src: "https://images.unsplash.com/photo-1465101178521-c1a9136a3fdc?auto=format&fit=crop&w=800&q=80",
        title: "Vivienda Familiar - Extra 2",
        desc: "Vista adicional 2",
      },
    ],
    [
      {
        src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80",
        title: "Centro Educativo",
        desc: "Protección en escaleras y ventanas",
      },
      {
        src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
        title: "Centro Educativo - Extra 1",
        desc: "Vista adicional 1",
      },
      {
        src: "https://images.unsplash.com/photo-1465101178521-c1a9136a3fdc?auto=format&fit=crop&w=800&q=80",
        title: "Centro Educativo - Extra 2",
        desc: "Vista adicional 2",
      },
    ],
    [
      {
        src: "https://images.unsplash.com/photo-1504309092620-4d0ec726efa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80",
        title: "Instalación Industrial",
        desc: "Mallas de seguridad en altura",
      },
      {
        src: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
        title: "Instalación Industrial - Extra 1",
        desc: "Vista adicional 1",
      },
      {
        src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
        title: "Instalación Industrial - Extra 2",
        desc: "Vista adicional 2",
      },
    ],
    [
      {
        src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80",
        title: "Proyecto Arquitectónico",
        desc: "Integración estética y funcional",
      },
      {
        src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
        title: "Proyecto Arquitectónico - Extra 1",
        desc: "Vista adicional 1",
      },
      {
        src: "https://images.unsplash.com/photo-1465101178521-c1a9136a3fdc?auto=format&fit=crop&w=800&q=80",
        title: "Proyecto Arquitectónico - Extra 2",
        desc: "Vista adicional 2",
      },
    ],
    [
      {
        src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80",
        title: "Área de Piscina",
        desc: "Seguridad para niños y mascotas",
      },
      {
        src: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
        title: "Área de Piscina - Extra 1",
        desc: "Vista adicional 1",
      },
      {
        src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
        title: "Área de Piscina - Extra 2",
        desc: "Vista adicional 2",
      },
    ],
  ];

  const lightboxModal = document.getElementById("lightboxModal");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");
  let currentGroup = [];
  let currentIndex = 0;

  // Relaciona cada imagen del grid con su índice en la galería usando data-index
  const portfolioItems = document.querySelectorAll(".portfolio-item");
  portfolioItems.forEach((item, gridIdx) => {
    const img = item.querySelector(".portfolio-img");
    if (img) img.style.cursor = "pointer";
    item.addEventListener("click", function (e) {
      e.preventDefault();
      // Usa el índice del atributo data-index para abrir la galería correspondiente
      const idx = parseInt(item.getAttribute("data-index"), 10);
      if (!isNaN(idx) && lightboxGallery[idx]) {
        openLightboxGroup(lightboxGallery[idx], 0);
      }
    });
  });

  function openLightboxGroup(group, index) {
    if (!group || index < 0 || index >= group.length) return;
    currentGroup = group;
    currentIndex = index;
    updateLightbox();
    lightboxModal.style.display = "flex";
  }

  function updateLightbox() {
    const imgObj = currentGroup[currentIndex];
    lightboxImg.src = imgObj.src;
    lightboxCaption.innerHTML =
      "<h4>" + imgObj.title + "</h4>" + "<span>" + imgObj.desc + "</span>";
  }

  function closeLightbox() {
    lightboxModal.style.display = "none";
    currentGroup = [];
    currentIndex = 0;
  }

  function showPrev() {
    if (!currentGroup.length) return;
    currentIndex =
      (currentIndex - 1 + currentGroup.length) % currentGroup.length;
    updateLightbox();
  }

  function showNext() {
    if (!currentGroup.length) return;
    currentIndex = (currentIndex + 1) % currentGroup.length;
    updateLightbox();
  }

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", function (e) {
    e.stopPropagation();
    showPrev();
  });
  lightboxNext.addEventListener("click", function (e) {
    e.stopPropagation();
    showNext();
  });
  lightboxModal.addEventListener("click", function (e) {
    if (e.target === lightboxModal) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (lightboxModal.style.display === "flex") {
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "Escape") closeLightbox();
    }
  });
});
