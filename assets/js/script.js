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
// Enviar por AJAX a la URL definida en el atributo `action` del formulario.
// Mostramos el mensaje de agradecimiento solo después de recibir respuesta exitosa.
const cotizacionForm = document.getElementById("cotizacionForm");
if (cotizacionForm) {
  const handleCotizacionSubmit = async function (e) {
    e.preventDefault();
    const action = cotizacionForm.action;
    const method = (cotizacionForm.method || "POST").toUpperCase();
    const formData = new FormData(cotizacionForm);

    try {
      const resp = await fetch(action, {
        method,
        body: formData,
        headers: {
          // Solicitar respuesta JSON cuando el servidor lo soporte (Formspree lo hace)
          Accept: "application/json",
        },
      });

      const submitBtn = cotizacionForm.querySelector('button[type="submit"]');
      // Obtener HTML original guardado (si existe) para restaurar luego
      const originalBtnHtml = submitBtn
        ? submitBtn.getAttribute("data-original") || submitBtn.innerHTML
        : null;

      // Log status and attempt to read body (clone to preserve original stream)
      console.log("Form submit status:", resp.status, "ok:", resp.ok);
      try {
        const clone = resp.clone();
        const contentType = resp.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const jsonBody = await clone.json().catch(() => null);
          console.log("Response JSON:", jsonBody);
        } else {
          const textBody = await clone.text().catch(() => null);
          console.log("Response body (text):", textBody);
        }
      } catch (logErr) {
        console.warn("No se pudo leer el cuerpo de la respuesta:", logErr);
      }

      if (resp.ok) {
        // Éxito: resetear formulario y mostrar toast nativo de Bootstrap
        cotizacionForm.reset();
        showBootstrapToast("¡Gracias! Su solicitud fue enviada.", "success");
      } else {
        showBootstrapToast(
          "Ocurrió un error al enviar el formulario. Revise la consola.",
          "danger",
        );
      }

      // Restaurar botón al estado original
      if (submitBtn && originalBtnHtml !== null) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    } catch (err) {
      console.error("Error enviando el formulario:", err);
      // Fallback: si la petición AJAX falla (p. ej. CORS o red), intentar envío nativo
      // quitamos el listener antes de reenviar para evitar bucle infinito
      const submitBtn = cotizacionForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML =
          submitBtn.getAttribute("data-original") || "Enviar Solicitud";
      }
      cotizacionForm.removeEventListener("submit", handleCotizacionSubmit);
      // Mostrar toast de error rápido y luego fallback a envío nativo
      try {
        showBootstrapToast(
          "No se pudo enviar por AJAX. Se intentará el envío normal.",
          "danger",
        );
      } catch (t) {
        console.warn("No se pudo mostrar el toast:", t);
      }
      cotizacionForm.submit();
    }
  };

  cotizacionForm.addEventListener("submit", handleCotizacionSubmit);
}

// Enhance submit button UX: attach a small helper that will set spinner when submit starts
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("cotizacionForm");
  if (!form) return;
  const submitBtn = form.querySelector('button[type="submit"]');
  if (!submitBtn) return;
  // store original HTML in data attribute
  submitBtn.setAttribute("data-original", submitBtn.innerHTML);
  // Observe submit via event delegation
  form.addEventListener(
    "submit",
    function (e) {
      // If the button is already disabled, do nothing
      if (submitBtn.disabled) return;
      // If the form is going to be handled by our fetch handler, show spinner
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Enviando...';
    },
    { capture: true },
  );
});

// showBootstrapToast: create a Bootstrap toast dynamically and show it
function showBootstrapToast(message, variant = "success", delay = 4000) {
  // container to append to
  const container = document.getElementById("bsToastContainer");
  if (!container) return; // no-op if container missing

  const toastEl = document.createElement("div");
  toastEl.className = "toast align-items-center text-bg-white border-0";
  toastEl.setAttribute("role", "alert");
  toastEl.setAttribute("aria-live", "assertive");
  toastEl.setAttribute("aria-atomic", "true");
  toastEl.style.minWidth = "220px";

  const toastBody = document.createElement("div");
  toastBody.className = "d-flex";

  const bodyText = document.createElement("div");
  bodyText.className = "toast-body";
  bodyText.textContent = message;
  // color accent left bar
  const accent = document.createElement("div");
  accent.style.width = "6px";
  accent.style.marginRight = "10px";
  accent.style.background = variant === "success" ? "#2ecc71" : "#e74c3c";

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "btn-close btn-close-white me-2 m-auto";
  closeBtn.setAttribute("data-bs-dismiss", "toast");
  closeBtn.setAttribute("aria-label", "Close");

  toastBody.appendChild(accent);
  toastBody.appendChild(bodyText);
  toastBody.appendChild(closeBtn);
  toastEl.appendChild(toastBody);

  container.appendChild(toastEl);

  // Initialize and show via Bootstrap's JS API
  // eslint-disable-next-line no-undef
  const bsToast = new bootstrap.Toast(toastEl, { delay });
  bsToast.show();

  // Remove from DOM once hidden
  toastEl.addEventListener("hidden.bs.toast", () => {
    toastEl.remove();
  });
}

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
    //Mallas para Edificios//
    [
      // {
      //   src: "https://cl.habcdn.com/photos/business/big/img-20190812-183839-381807.jpg",
      //   title: "Edificio Residencial",
      //   desc: "Mallas de seguridad en balcones",
      // },
      // {
      //   src: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
      //   title: "Edificio Residencial - Extra 1",
      //   desc: "Vista adicional 1",
      // },
      // {
      //   src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      //   title: "Edificio Residencial - Extra 2",
      //   desc: "Vista adicional 2",
      // },
    ],
    //Mallas Residenciales//
    [
      // {
      //   src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
      //   title: "Vivienda Familiar - Extra 1",
      //   desc: "Vista adicional 1",
      // },
      // {
      //   src: "https://images.unsplash.com/photo-1465101178521-c1a9136a3fdc?auto=format&fit=crop&w=800&q=80",
      //   title: "Vivienda Familiar - Extra 2",
      //   desc: "Vista adicional 2",
      // },
    ],
    //Convenios//
    [
      {
        src: "assets/img/trabajos/convenios/tarjeta_Vecino_viveLaForida_Mallas_Saru_4.jpg?format=auto",
        title: "Convenios",
        desc: "Descuentos especiales con tarjeta Vecino Vive La Florida",
      },
    ],
    //Clientes Satisfechos//
    [
      // {
      //   src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80",
      //   title: "Proyecto Arquitectónico",
      //   desc: "Integración estética y funcional",
      // },
    ],
    //Mantenimiento y Reparación//
    [
      // {
      //   src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80",
      //   title: "Área de Piscina",
      //   desc: "Seguridad para niños y mascotas",
      // },
    ],
  ];

  // Adding all images from malla_Edificio to the lightbox gallery for Mallas para Edificios
  lightboxGallery[0].push(
    {
      src: "assets/img/trabajos/malla_Edificio/1.jpg?format=auto",
      title: "Balcon Mallas Saru Chile",
      desc: "Tu balcón, seguro y libre.",
    },
    {
      src: "assets/img/trabajos/malla_Edificio/2.jpg?format=auto",
      title: "Balcon Mallas Saru Chile",
      desc: "Protección sin perder la vista.",
    },
    {
      src: "assets/img/trabajos/malla_Edificio/3.jpg?format=auto",
      title: "Balcon Mallas Saru Chile",
      desc: "Disfruta la altura con tranquilidad.",
    },
    {
      src: "assets/img/trabajos/malla_Edificio/4.jpg?format=auto",
      title: "Balcones seguros, vistas intactas.",
      desc: "",
    },
    {
      src: "assets/img/trabajos/malla_Edificio/5.jpg?format=auto",
      title: "Seguridad que no se nota.",
      desc: "",
    },
  );

  // Adding all images from malla_Residencial to the lightbox gallery for Vivienda Familiar
  lightboxGallery[1].push(
    {
      src: "assets/img/trabajos/malla_Residencial/mallas_Saru_Proteccion_Escalera1.jpg?format=auto",
      title: "Protección Escalera 1",
      desc: "Mallas de seguridad para escaleras residenciales.",
    },
    {
      src: "assets/img/trabajos/malla_Residencial/mallas_Saru_Proteccion_Escalera2.jpg?format=auto",
      title: "Protección Escalera",
      desc: "Instalación de mallas en escaleras interiores.",
    },
    {
      src: "assets/img/trabajos/malla_Residencial/mallas_Saru_Proteccion_Escalera3.jpg?format=auto",
      title: "Protección Escalera",
      desc: "Soluciones de seguridad para escaleras modernas.",
    },
    {
      src: "assets/img/trabajos/malla_Residencial/mallas_Saru_Proteccion_Ventanas3.jpg?format=auto",
      title: "Protección Ventanas",
      desc: "Mallas de seguridad para ventanas residenciales.",
    },
    {
      src: "assets/img/trabajos/malla_Residencial/mallas-Saru_residencial.jpg?format=auto",
      title: "Protección de Ventanas",
      desc: "Mallas de seguridad para ventanas residenciales.",
    },
    {
      src: "assets/img/trabajos/malla_Residencial/mallas-Saru_residencial2.jpg?format=auto",
      title: "Protección de Ventanas",
      desc: "Mallas de seguridad para ventanas residenciales.",
    },
    {
      src: "assets/img/trabajos/malla_Residencial/mallas-Saru_residencial3.jpg?format=auto",
      title: "Protección de Ventanas",
      desc: "Mallas de seguridad para ventanas residenciales.",
    },
    {
      src: "assets/img/trabajos/malla_Residencial/mallas-Saru_residencial4.jpg?format=auto",
      title: "Protección de Ventanas",
      desc: "Mallas de seguridad para ventanas residenciales.",
    },
    {
      src: "assets/img/trabajos/malla_Residencial/mallas-Saru_residencial5.jpg?format=auto",
      title: "Protección de Ventanas",
      desc: "Mallas de seguridad para ventanas residenciales.",
    },
  );
  lightboxGallery[2].push(
    {
      src: "assets/img/trabajos/convenios/tarjeta_Vecino_viveLaForida_Mallas_Saru_1.jpg?format=auto",
      title: "Convenio Tarjeta Vecino Vive La Forida",
      desc: "Si cuentas con tu tarjeta Vecino obtienes descuentos especiales en nuestros servicios.",
    },
    {
      src: "assets/img/trabajos/convenios/tarjeta_Vecino_viveLaForida_Mallas_Saru_2.jpg?format=auto",
      title: "Convenio Tarjeta Vecino Vive La Forida",
      desc: "Si cuentas con tu tarjeta Vecino obtienes descuentos especiales en nuestros servicios.",
    },
    {
      src: "assets/img/trabajos/convenios/tarjeta_Vecino_viveLaForida_Mallas_Saru_3.jpg?format=auto",
      title: "Convenio Tarjeta Vecino Vive La Forida",
      desc: "Si cuentas con tu tarjeta Vecino obtienes descuentos especiales en nuestros servicios.",
    },
    {
      src: "assets/img/trabajos/convenios/tarjeta_Vecino_viveLaForida_Mallas_Saru_4.jpg?format=auto",
      title: "Convenio Tarjeta Vecino Vive La Forida",
      desc: "Si cuentas con tu tarjeta Vecino obtienes descuentos especiales en nuestros servicios.",
    },
  );
  lightboxGallery[3].push(
    {
      src: "assets/img/trabajos/clientes_Satisfechos/1.jpg?format=auto",
      title: "Seguridad para tus seres queridos",
      desc: "",
    },
    {
      src: "assets/img/trabajos/clientes_Satisfechos/2.jpg?format=auto",
      title: "Protección para gatos curiosos",
      desc: "",
    },
    {
      src: "assets/img/trabajos/clientes_Satisfechos/3.jpg?format=auto",
      title: "Evita caídas, gana tranquilidad",
      desc: "",
    },
    {
      src: "assets/img/trabajos/clientes_Satisfechos/4.jpg?format=auto",
      title: "Tranquilidad garantizada",
      desc: "",
    },
    {
      src: "assets/img/trabajos/clientes_Satisfechos/5.jpg?format=auto",
      title: "Protege lo que más importa",
      desc: "",
    },
  );
  lightboxGallery[4].push(
    {
      src: "assets/img/trabajos/mantenimiento/mantenimiento_Mallas_Saru_1.jpg?format=auto",
      title: "Mantenimiento de Mallas",
      desc: "Servicios de mantenimiento para mallas de seguridad.",
    },
    {
      src: "assets/img/trabajos/mantenimiento/mantenimiento_Mallas_Saru_2.jpg?format=auto",
      title: "Mantenimiento de Mallas",
      desc: "Servicios de mantenimiento para mallas de seguridad.",
    },
    {
      src: "assets/img/trabajos/mantenimiento/mantenimiento_Mallas_Saru_3.jpg?format=auto",
      title: "Mantenimiento de Mallas",
      desc: "Servicios de mantenimiento para mallas de seguridad.",
    },
    {
      src: "assets/img/trabajos/mantenimiento/mantenimiento_Mallas_Saru_4.jpg?format=auto",
      title: "Mantenimiento de Mallas",
      desc: "Servicios de mantenimiento para mallas de seguridad.",
    },
    {
      src: "assets/img/trabajos/mantenimiento/mantenimiento_Mallas_Saru_5.jpg?format=auto",
      title: "Mantenimiento de Mallas",
      desc: "Servicios de mantenimiento para mallas de seguridad.",
    },
  );

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

document.addEventListener("DOMContentLoaded", function () {
  const modalElement = document.getElementById("modalDescuento");
  if (!modalElement) return;

  const modal = new bootstrap.Modal(modalElement, {
    backdrop: true,
    keyboard: true,
  });

  const whatsappNumber = "56972022406";
  const defaultMessage =
    "Hola, me interesa el descuento del 10% en mi primer servicio. ¿Podrían proporcionarme más información?";

  const btnWhatsApp = document.getElementById("btnWhatsApp");
  if (btnWhatsApp) {
    const waHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      defaultMessage,
    )}`;
    btnWhatsApp.href = waHref;
    btnWhatsApp.target = "_blank";
    btnWhatsApp.setAttribute("aria-label", "Enviar mensaje por WhatsApp");

    btnWhatsApp.addEventListener("click", function (e) {
      e.preventDefault();
      window.open(waHref, "_blank");
    });
  }

  const badge = modalElement.querySelector(".descuento-badge");
  if (badge) {
    badge.textContent = "10% DE DESCUENTO";
  }

  const closeButton = modalElement.querySelector('[data-bs-dismiss="modal"]');
  if (closeButton) {
    closeButton.addEventListener("click", () => modal.hide());
  }

  setTimeout(() => {
    modal.show();
  }, 1000);
});
