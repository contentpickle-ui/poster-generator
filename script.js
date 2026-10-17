
const W = 1080;
const H = 1350;
const TEMPLATE = "poster-template.jpg";

// HTML elements
const canvas = document.getElementById("poster");
const ctx = canvas.getContext("2d");

const form = document.getElementById("form");
const nameInput = document.getElementById("name");
const designationInput = document.getElementById("designation");
const status = document.getElementById("status");
const error = document.getElementById("error");
const downloadButton = document.getElementById("download");
const resetButton = document.getElementById("reset");

// Set poster dimensions
canvas.width = W;
canvas.height = H;

let template = new Image();
let templateLoaded = false;

// Create Company Name input if it doesn't already exist
let companyInput = document.getElementById("company");

if (!companyInput) {
  const designationField = designationInput.closest(".form-group, .field, label") 
    || designationInput.parentElement;

  const companyWrapper = document.createElement("div");
  companyWrapper.className = designationField.className || "form-group";
  companyWrapper.style.marginTop = "12px";

  const companyLabel = document.createElement("label");
  companyLabel.htmlFor = "company";
  companyLabel.textContent = "Company Name";

  companyInput = document.createElement("input");
  companyInput.id = "company";
  companyInput.name = "company";
  companyInput.type = "text";
  companyInput.placeholder = "Enter company name";
  companyInput.autocomplete = "organization";
  companyInput.style.width = "100%";
  companyInput.style.boxSizing = "border-box";

  companyWrapper.appendChild(companyLabel);
  companyWrapper.appendChild(companyInput);

  if (designationField.parentElement) {
    designationField.insertAdjacentElement("afterend", companyWrapper);
  }
}

// Load poster template
template.onload = () => {
  templateLoaded = true;
  renderPoster();
};

template.onerror = () => {
  showError(
    'Could not load "poster-template.jpg". Make sure the image is in the same folder as index.html and script.js.'
  );
};

template.src = TEMPLATE;

// Show error message
function showError(message) {
  if (error) {
    error.textContent = message;
    error.style.display = "block";
  }
}

// Clear error message
function clearError() {
  if (error) {
    error.textContent = "";
    error.style.display = "none";
  }
}

// Draw template without stretching it
function drawTemplate() {
  const scale = Math.max(
    W / template.naturalWidth,
    H / template.naturalHeight
  );

  const imageWidth = template.naturalWidth * scale;
  const imageHeight = template.naturalHeight * scale;

  const x = (W - imageWidth) / 2;
  const y = (H - imageHeight) / 2;

  ctx.clearRect(0, 0, W, H);
  ctx.drawImage(template, x, y, imageWidth, imageHeight);
}

// Fit text within the available width
function fittedSize(text, maxWidth, startingSize, fontWeight = "bold") {
  let size = startingSize;

  while (size > 12) {
    ctx.font = `${fontWeight} ${size}px Arial, sans-serif`;

    if (ctx.measureText(text).width <= maxWidth) {
      break;
    }

    size -= 1;
  }

  return size;
}

// Draw personalized text directly on the poster.
// No white background and no logo.
function drawPersonalization(name, designation, company) {
  const centerX = W / 2;
  const maxWidth = W * 0.82;

  // Adjust these three Y values if needed:
  const nameY = H * 0.785;
  const designationY = H * 0.825;
  const companyY = H * 0.865;

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Name
  if (name) {
    const size = fittedSize(name, maxWidth, 38);
    ctx.font = `bold ${size}px Arial, sans-serif`;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(name, centerX, nameY, maxWidth);
  }

  // Designation
  if (designation) {
    const size = fittedSize(designation, maxWidth, 29);
    ctx.font = `600 ${size}px Arial, sans-serif`;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(designation, centerX, designationY, maxWidth);
  }

  // Company Name
  if (company) {
    const size = fittedSize(company, maxWidth, 27);
    ctx.font = `600 ${size}px Arial, sans-serif`;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(company, centerX, companyY, maxWidth);
  }
}

// Render poster preview
function renderPoster() {
  clearError();

  if (!templateLoaded) {
    if (status) {
      status.textContent = "Loading poster template...";
    }
    return;
  }

  drawTemplate();

  const name = nameInput.value.trim();
  const designation = designationInput.value.trim();
  const company = companyInput.value.trim();

  drawPersonalization(name, designation, company);

  if (status) {
    status.textContent = "Poster preview updated.";
  }
}

// Update preview when typing
[nameInput, designationInput, companyInput].forEach((input) => {
  input.addEventListener("input", renderPoster);
});

// Handle form submission
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    renderPoster();
  });
}

// Download poster as PNG
if (downloadButton) {
  downloadButton.addEventListener("click", () => {
    clearError();

    if (!templateLoaded) {
      showError("Please wait until the poster template finishes loading.");
      return;
    }

    renderPoster();

    canvas.toBlob((blob) => {
      if (!blob) {
        showError("Could not create the poster image. Please try again.");
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      const safeName = (nameInput.value.trim() || "poster")
        .replace(/[^a-z0-9_-]/gi, "-")
        .replace(/-+/g, "-");

      link.href = url;
      link.download = `${safeName}-saraswati-puja-1080x1350.png`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);

      if (status) {
        status.textContent = "Poster downloaded successfully.";
      }
    }, "image/png");
  });
}

// Reset all fields
if (resetButton) {
  resetButton.addEventListener("click", () => {
    nameInput.value = "";
    designationInput.value = "";
    companyInput.value = "";
    clearError();
    renderPoster();

    if (status) {
      status.textContent = "Fields have been reset.";
    }
  });
}

// Initial preview
renderPoster();
