
// Saraswati Puja poster generator — 1080 x 1920 pixels
const W = 1080, H = 1920;
const TEMPLATE = "poster-template.jpg";

const canvas = document.getElementById("poster");
const ctx = canvas.getContext("2d");
const form = document.getElementById("form");
const nameField = document.getElementById("name");
const designationField = document.getElementById("designation");
const logoField = document.getElementById("logo");
const status = document.getElementById("status");
const error = document.getElementById("error");
const download = document.getElementById("download");

canvas.width = W;
canvas.height = H;

const template = new Image();
let templateReady = false;
let logoImage = null;
let generated = false;

function showError(message) {
  error.textContent = message;
  error.classList.remove("hidden");
}

function clearError() {
  error.textContent = "";
  error.classList.add("hidden");
}

function drawPlaceholder() {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#555";
  ctx.textAlign = "center";
  ctx.font = "bold 32px Arial";
  ctx.fillText("Loading Saraswati Puja poster...", W / 2, H / 2);
}

function drawTemplate() {
  const scale = Math.max(
    W / template.naturalWidth,
    H / template.naturalHeight
  );

  const w = template.naturalWidth * scale;
  const h = template.naturalHeight * scale;

  ctx.clearRect(0, 0, W, H);
  ctx.drawImage(template, (W - w) / 2, (H - h) / 2, w, h);
}

function fittedSize(text, start, min, maxWidth, weight) {
  let size = start;

  while (size > min) {
    ctx.font = `${weight} ${size}px Arial, Helvetica, sans-serif`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size--;
  }

  return Math.max(size, min);
}

function drawLogo(img) {
  const box = {
    x: W * 0.32,
    y: H * 0.065,
    w: W * 0.36,
    h: H * 0.065
  };

  const scale = Math.min(
    box.w / img.naturalWidth,
    box.h / img.naturalHeight
  );

  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;

  ctx.drawImage(
    img,
    box.x + (box.w - w) / 2,
    box.y + (box.h - h) / 2,
    w,
    h
  );
}

function drawPersonalization(name, designation) {
  ctx.save();

  // Corrected lower text position based on your reference image.
  // This white mask clears the old placeholder text.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(
    W * 0.18,
    H * 0.812,
    W * 0.64,
    H * 0.067
  );

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#3b3b3b";

  // Name
  const nameSize = fittedSize(
    name, 36, 25, W * 0.78, "700"
  );

  ctx.font = `700 ${nameSize}px Arial, Helvetica, sans-serif`;
  ctx.fillText(
    name,
    W * 0.5,
    H * 0.835,
    W * 0.78
  );

  // Designation
  const designationSize = fittedSize(
    designation, 30, 18, W * 0.78, "400"
  );

  ctx.font = `400 ${designationSize}px Arial, Helvetica, sans-serif`;
  ctx.fillText(
    designation,
    W * 0.5,
    H * 0.862,
    W * 0.78
  );

  ctx.restore();
}

function render() {
  if (!templateReady) {
    showError(
      "The poster template did not load. Keep poster-template.jpg beside index.html and refresh."
    );
    return;
  }

  const name = nameField.value.trim();
  const designation = designationField.value.trim();

  if (!name || !designation) {
    showError("Please enter both your name and designation.");
    return;
  }

  clearError();
  drawTemplate();

  if (logoImage) {
    drawLogo(logoImage);
  }

  drawPersonalization(name, designation);

  generated = true;
  download.disabled = false;
  status.textContent = "• Preview ready";
}

template.onload = () => {
  templateReady = true;
  drawTemplate();
  status.textContent = "• Template loaded";
};

template.onerror = () => {
  templateReady = false;
  status.textContent = "• Template not found";
  showError(
    "Could not find poster-template.jpg. Check the filename and folder."
  );
  drawPlaceholder();
};

template.src = TEMPLATE;
drawPlaceholder();

logoField.addEventListener("change", () => {
  logoImage = null;

  const file = logoField.files && logoField.files[0];

  if (!file) {
    if (generated) render();
    return;
  }

  if (!file.type.startsWith("image/")) {
    showError("Please choose an image file.");
    logoField.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    const img = new Image();

    img.onload = () => {
      logoImage = img;
      if (generated) render();
    };

    img.onerror = () => {
      showError("Could not open that logo image.");
    };

    img.src = reader.result;
  };

  reader.onerror = () => {
    showError("Could not read that logo image.");
  };

  reader.readAsDataURL(file);
});

form.addEventListener("submit", event => {
  event.preventDefault();
  render();
});

[nameField, designationField].forEach(field => {
  field.addEventListener("input", () => {
    if (generated) render();
  });
});

document.getElementById("reset").addEventListener("click", () => {
  form.reset();
  logoImage = null;
  generated = false;
  download.disabled = true;
  clearError();

  if (templateReady) {
    drawTemplate();
  } else {
    drawPlaceholder();
  }

  status.textContent = templateReady
    ? "• Template loaded"
    : "• Loading template";
});

download.addEventListener("click", () => {
  if (!generated) return;

  canvas.toBlob(blob => {
    if (!blob) {
      showError("PNG export failed. Try another browser.");
      return;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const safeName = (
      nameField.value.trim() || "poster"
    ).replace(/[^a-z0-9_-]+/gi, "-");

    link.href = url;
    link.download =
      `${safeName}-saraswati-puja-1080x1920.png`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }, "image/png");
});
