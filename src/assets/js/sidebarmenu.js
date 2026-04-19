document.addEventListener("DOMContentLoaded", () => {
  console.log("Sidebar activo cargado");

  const links = document.querySelectorAll("#sidebarnav a");
  const currentUrl = window.location.pathname;

  links.forEach(link => {
    const linkPath = new URL(link.href).pathname;

    // Marcar enlace activo
    if (linkPath === currentUrl) {
      link.classList.add("active");

      let parent = link.parentElement;

      while (parent && parent.id !== "sidebarnav") {
        if (parent.tagName === "LI") {
          parent.classList.add("active", "selected");
        }

        if (parent.tagName === "UL") {
          parent.classList.add("in");
        }

        parent = parent.parentElement;
      }
    }

    // Evento click
    link.addEventListener("click", function (e) {
      const submenu = this.nextElementSibling;

      if (submenu && submenu.tagName === "UL") {
        e.preventDefault();

        // Cerrar otros menús
        document.querySelectorAll("#sidebarnav ul.in").forEach(ul => {
          if (ul !== submenu) ul.classList.remove("in");
        });

        document.querySelectorAll("#sidebarnav a.active").forEach(a => {
          if (a !== this) a.classList.remove("active");
        });

        // Toggle menú actual
        submenu.classList.toggle("in");
        this.classList.toggle("active");
      }
    });
  });
});