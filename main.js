// Dados de contato: altere aqui se mudar o número
const CONFIG = {
  whatsapp: "5571987239091",
};


const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Todo link com data-wa abre o WhatsApp com a mensagem já escrita
document.querySelectorAll("[data-wa]").forEach((el) => {
  const msg = el.getAttribute("data-wa") || "Olá! Gostaria de agendar um horário.";
  el.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
  el.target = "_blank";
  el.rel = "noopener";
});


// Cartões entram alternando pela esquerda e pela direita
[".cats .cat", ".team .pro", ".steps li"].forEach((sel) => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add(i % 2 ? "from-right" : "from-left");
    el.style.transitionDelay = `${(i % 3) * 80}ms`;
  });
});
document.querySelectorAll(".contact .map").forEach((el) => el.classList.add("zoom"));

// Aparecem ao entrar na tela e somem ao sair: anima descendo e subindo
const io = new IntersectionObserver(
  (entries) => entries.forEach((e) => e.target.classList.toggle("in", e.isIntersecting)),
  { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// Efeitos ligados à rolagem
const header = document.querySelector(".header");
const heroIn = document.querySelector(".hero-in");
const hs = document.querySelector("[data-hscroll]");
const track = hs && hs.querySelector(".works-track");

function onScroll() {
  const y = window.scrollY;
  const vh = window.innerHeight;
  header.classList.toggle("solid", y > 40);
  if (reduce) return;

  // Texto do topo sobe mais devagar e some aos poucos
  if (heroIn && y < vh * 1.2) {
    heroIn.style.transform = `translateY(${y * 0.35}px)`;
    heroIn.style.opacity = String(Math.max(0, 1 - y / (vh * 0.75)));
  }

  // "Nossos trabalhos" anda para o lado conforme a página desce (e volta ao subir)
  if (hs && track) {
    const r = hs.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
    const max = Math.max(0, track.scrollWidth - document.documentElement.clientWidth);
    track.style.transform = `translate3d(${-progress * max}px,0,0)`;
  }
}

let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) { requestAnimationFrame(() => { onScroll(); ticking = false; }); ticking = true; }
}, { passive: true });
// Esconde "Role para ver mais" quando todas as fotos já cabem na tela
function checkHint() {
  const hint = hs && hs.querySelector(".works-hint");
  if (hint && track) hint.hidden = track.scrollWidth <= document.documentElement.clientWidth;
}
window.addEventListener("resize", () => { onScroll(); checkHint(); });
window.addEventListener("load", checkHint);
onScroll();
checkHint();
