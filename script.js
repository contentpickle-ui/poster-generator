
// Saraswati Puja Poster Generator
// Export size: 1080 x 1350 pixels

const W = 1080;
const H = 1350;
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

// Create the Company Name field if it is missing from index.html.
let companyField = document.getElementById("company");

if (!companyField) {
  const label = document.createElement("label");
  label.htmlFor = "company";
  label.textContent = "Company Name";

  companyField = document.createElement("input");
  companyField.id = "company";
  companyField.name = "company";
  companyField.type = "text";
  companyField.placeholder = "Enter company name";
  companyField.required = true;

  designationField.insertAdjacentElement("afterend", label);
  label.insertAdjacentElement("afterend", companyField);
}

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
  ctx.font = "bold 28px Arial";
  ctx.fillText("Loading Saraswati Puja poster...", W / 2, H / 2);
}

function drawTemplate() {
  // Fill the 4:5 canvas without stretching the template.
  // A source with a different ratio will be center-cropped.
  const scale = Math.max(
    W / template.naturalWidth,
    H / template.naturalHeight
  );

  const width = template.naturalWidth * scale;
  const height = template.naturalHeight * scale;

  ctx.clearRect(0, 0, W, H);

  ctx.drawImage(
    template,
    (W - width) / 2,
    (H - height) / 2,
    width,
    height
  );
}

function fittedSize(text, start, min, maxWidth, weight) {
  let size = start;

  while (size > min) {
    ctx.font = `${weight} ${size}px Arial, Helvetica, sans-serif`;

    if (ctx.measureText(text).width <= maxWidth) {
      break;
    }

    size--;
  }

  return Math.max(size, min);
}

function drawLogo(img) {
  const box = {
    x: W * 0.32,
    y: H * 0.045,
    w: W * 0.36,
    h: H * 0.075
  };

  const scale = Math.min(
    box.w / img.naturalWidth,
    box.h / img.naturalHeight
  );

  const width = img.naturalWidth * scale;
  const height = img.naturalHeight * scale;

  ctx.drawImage(
    img,
    box.x + (box.w - width) / 2,
    box.y + (box.h - height) / 2,
    width,
    height
  );
}

function drawPersonalization(name, designation, company) {
  ctx.save();

  /*
   * Text layout for 1080 x 1350.
   * Adjust this clearing rectangle to match the blank area
   * in your 4:5 poster template.
   */
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(
    W * 0.12,
    H * 0.755,
    W * 0.76,
    H * 0.145
  );

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#3b3b3b";

  // Name
  const nameSize = fittedSize(
    name, 36, 22, W * 0.80, "700"
  );

  ctx.font = `700 ${nameSize}px Arial, Helvetica, sans-serif`;

  ctx.fillText(
    name,
    W / 2,
    H * 0.785,
    W * 0.80
  );

  // Designation
  const designationSize = fittedSize(
    designation, 28, 18, W * 0.80, "400"
  );

  ctx.font = `400 ${designationSize}px Arial, Helvetica, sans-serif`;

  ctx.fillText(
    designation,
    W / 2,
    H * 0.825,
    W * 0.80
  );

  // Company Name
  const companySize = fittedSize(
    company, 26, 16, W * 0.80, "600"
  );

  ctx.font = `600 ${companySize}px Arial, Helvetica, sans-serif`;

  ctx.fillText(
    company,
    W / 2,
    H * 0.865,
    W * 0.80
  );

  ctx.restore();
}

function render() {
  if (!templateReady) {
    showError(
      "Poster template not loaded. Keep poster-template.jpg beside index.html."
    );
    return;
  }

  const name = nameField.value.trim();
  const designation = designationField.value.trim();
  const company = companyField.value.trim();

  if (!name || !designation || !company) {
    showError(
      "Please enter your name, designation, and company name."
    );
    return;
  }

  clearError();

  drawTemplate();

  if (logoImage) {
    drawLogo(logoImage);
  }

  drawPersonalization(name, designation, company);

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

// Logo upload
logoField.addEventListener("change", () => {
  logoImage = null;

  const file = logoField.files && logoField.files[0];

  if (!file) {
    if (generated) render();
    return;
  }

  if (!file.type.startsWith("image/")) {
    showError("Please select an image file.");
    logoField.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    const img = new Image();

    img.onload = () => {
      logoImage = img;

      if (generated) {
        render();
      }
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

// Generate poster
form.addEventListener("submit", event => {
  event.preventDefault();
  render();
});

// Update preview when text changes
[nameField, designationField, companyField].forEach(field => {
  field.addEventListener("input", () => {
    if (generated) {
      render();
    }
  });
});

// Reset
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

// Export PNG at exactly 1080 x 1350
download.addEventListener("click", () => {
  if (!generated) return;

  canvas.toBlob(blob => {
    if (!blob) {
      showError("PNG export failed. Please try another browser.");
      return;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const safeName = (
      nameField.value.trim() || "poster"
    ).replace(/[^a-z0-9_-]+/gi, "-");

    link.href = url;
    link.download = `${safeName}-saraswati-puja-1080x1350.png`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }, "image/png");
});
