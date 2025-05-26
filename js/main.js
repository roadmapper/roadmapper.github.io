var normal = document.getElementById("nav-menu");
var reverse = document.getElementById("nav-menu-left");

var icon = normal !== null ? normal : reverse;

// Toggle the "menu-open" % "menu-opn-left" classes
function toggle() {
	  var navRight = document.getElementById("nav");
	  var navLeft = document.getElementById("nav-left");
	  var nav = navRight !== null ? navRight : navLeft;

	  var button = document.getElementById("menu");
	  var site = document.getElementById("wrap");
	  
	  if (nav.className == "menu-open" || nav.className == "menu-open-left") {
	  	  nav.className = "";
	  	  button.className = "";
	  	  site.className = "";
	  } else if (reverse !== null) {
	  	  nav.className += "menu-open-left";
	  	  button.className += "btn-close";
	  	  site.className += "fixed";
	  } else {
	  	  nav.className += "menu-open";
	  	  button.className += "btn-close";
	  	  site.className += "fixed";
	    }
	}

// Ensures backward compatibility with IE old versions
function menuClick() {
	if (document.addEventListener && icon !== null) {
		icon.addEventListener('click', toggle);
	} else if (document.attachEvent && icon !== null) {
		icon.attachEvent('onclick', toggle);
	} else {
		return;
	}
}

menuClick();

window.addEventListener("load", () => {
	const images = document.querySelectorAll(".responsive-img");

	images.forEach(img => {
		// Wait until image is fully loaded
		if (img.complete) {
			setImageSize(img);
		} else {
			img.onload = () => setImageSize(img);
		}
	});

	function setImageSize(img) {
		if (img.naturalHeight > img.naturalWidth) {
			// Portrait
			img.style.width = "600px";
		} else {
			// Landscape
			img.style.width = "800px";
		}
	}
});

function toggleZoom(img) {
    var modal = document.getElementById("imageModal");
    var modalImg = document.getElementById("modalImage");
    modal.style.display = "block";
    modalImg.src = img.src;

	// Add Escape key listener
    document.addEventListener("keydown", handleEscape);
}

function closeModal() {
	document.getElementById("imageModal").style.display = "none";

	// Remove Escape key listener when modal is closed
    document.removeEventListener("keydown", handleEscape);
}

function handleEscape(e) {
	if (e.key === "Escape" || e.key === "Esc") {
		closeModal();
	}
}
