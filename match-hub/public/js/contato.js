const canvas = document.getElementById("particles-canvas");
const ctx = canvas.getContext("2d");
let width = (canvas.width = canvas.offsetWidth);
let height = (canvas.height = canvas.offsetHeight);

const particleCount = 100;
const particles = [];
const maxVelocity = 0.5;
const mouse = { x: null, y: null, radius: 150 };

window.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

window.addEventListener("mouseleave", () => {
  mouse.x = null;
  mouse.y = null;
});

window.addEventListener("resize", () => {
  width = canvas.width = canvas.offsetWidth;
  height = canvas.height = canvas.offsetHeight;
});

class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * maxVelocity;
    this.vy = (Math.random() - 0.5) * maxVelocity;
    this.radius = Math.random() * 2 + 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x <= 0 || this.x >= width) this.vx *= -1;
    if (this.y <= 0 || this.y >= height) this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#c4c4c4";
    ctx.fill();
  }
}

function initParticles() {
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function connectParticles() {
  particles.forEach((p) => {
    if (mouse.x !== null) {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(136, 136, 136, ${1 - dist / mouse.radius})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  });
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  connectParticles();
  requestAnimationFrame(animate);
}

function closeFormAndOpenSuccessMessage() {
  const form = document.getElementById("form-contato");
  const successMessage = document.getElementById("success-message");

  form.classList.add("d-none");
  successMessage.classList.remove("d-none");
}

function closeSuccessMessageAndOpenForm() {
  const form = document.getElementById("form-contato");
  const returnForm = document.getElementById("returnForm");
  const successMessage = document.getElementById("success-message");

  returnForm.addEventListener("click", () => {
    form.classList.remove("d-none");
    successMessage.classList.add("d-none");
  });
}

function submitForm() {
  const form = document.getElementById("form-contato");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {
      name: formData.get("nome"),
      email: formData.get("email"),
      message: formData.get("mensagem"),
      _subject: formData.get("_subject"),
    };

    fetch("https://formsubmit.co/ajax/matchhub00@gmail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao enviar formulário.");
        }
        return response.json(); // Retorna os dados para o próximo .then
      })
      .then((data) => {
        closeFormAndOpenSuccessMessage();
        form.reset();
      })
      .catch((error) => {
        console.error("Erro no envio:", error);
        alert("Erro ao enviar a mensagem. Tente novamente.");
      });
  });
}

closeSuccessMessageAndOpenForm();
submitForm();
initParticles();
animate();
