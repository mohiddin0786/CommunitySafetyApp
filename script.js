// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdG9kA4lBH4Edjw-nI9i4FuvXHwvLbvQQ",
  authDomain: "map-safety-app.firebaseapp.com",
  projectId: "map-safety-app",
  storageBucket: "map-safety-app.firebasestorage.app",
  messagingSenderId: "178491555595",
  appId: "1:178491555595:web:3022738d7dd7c4be766c0e",
  measurementId: "G-05JRJ8SDYK"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
let map;
let userMarker;
let userLocation = { lat: 0, lng: 0 };

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 12
  });

  // Try HTML5 geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        map.setCenter(userLocation);
        userMarker = new google.maps.Marker({
          position: userLocation,
          map: map,
          title: 'Your Location'
        });
      },
      () => handleLocationError(true)
    );
  } else {
    handleLocationError(false);
  }

  // Load saved locations
  db.collection("locations").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const marker = new google.maps.Marker({
        position: { lat: data.lat, lng: data.lng },
        map: map,
        icon: data.safe
          ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
          : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
      });
  
      const infoWindow = new google.maps.InfoWindow({
        content: `<strong>${data.safe ? "Safe" : "Unsafe"} Location</strong><br>${data.comment || "No comment"}`
      });
  
      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });
    });
  });
  map.addListener("click", (e) => {
    placeMarker(e.latLng);
  });
  
  loadTips();
}

function handleLocationError(browserHasGeolocation) {
  alert(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
}

function placeMarker(location) {
  const isSafe = confirm("Mark this location as SAFE?\nClick Cancel for UNSAFE.");
  
  // Ask for a comment
  const comment = prompt("Add a comment for this location (optional):");
  if (comment === null) return; // user pressed "Cancel" in prompt

  // Create marker
  const marker = new google.maps.Marker({
    position: location,
    map: map,
    icon: isSafe
      ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
      : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
  });

  // Add info window with comment
  const infoWindow = new google.maps.InfoWindow({
    content: `<strong>${isSafe ? "Safe" : "Unsafe"} Location</strong><br>${comment || "No comment"}`
  });

  marker.addListener("click", () => {
    infoWindow.open(map, marker);
  });

  // Save data
  saveToFirebase(location, isSafe, comment);
  loadTips();
}
function saveToFirebase(location, isSafe, comment) {
  db.collection("locations").add({
    lat: location.lat(),
    lng: location.lng(),
    safe: !!isSafe,
    comment: comment || "",
    timestamp: new Date()
  }).then(() => {
    console.log("Location saved!");
  }).catch((error) => {
    console.error("Error saving to Firebase:", error);
  });
}

// Submit Tip
function submitTip() {
  const tipText = document.getElementById("tipText").value.trim();
  const category = document.getElementById("tipCategory").value;
  const shareLocation = document.getElementById("shareLocation").checked;

  if (tipText.length === 0) {
    alert("Please enter a safety tip.");
    return;
  }

  const tipData = {
    text: tipText,
    category,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    location: null,
    userId: auth.currentUser ? auth.currentUser.uid : null
  };

  // Get current location if enabled
  if (shareLocation && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        tipData.location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        saveTipToFirestore(tipData);
      },
      () => {
        alert("Could not fetch location. Saving tip without it.");
        saveTipToFirestore(tipData);
      }
    );
  } else {
    saveTipToFirestore(tipData);
  }
}

function saveTipToFirestore(tipData) {
  db.collection("safetyTips").add(tipData)
    .then(() => {
      alert("Tip submitted successfully!");
      document.getElementById("tipText").value = "";
      document.getElementById("charRemaining").innerText = "300";
      loadTips();
    })
    .catch((error) => {
      console.error("Error adding tip: ", error);
    });
}

// Load Tips
function loadTips() {
  db.collection("safetyTips")
    .orderBy("timestamp", "desc")
    .get()
    .then((querySnapshot) => {
      const tipsList = document.getElementById("tipsList");
      tipsList.innerHTML = "";
      querySnapshot.forEach((doc) => {
        const tip = doc.data();
        tipsList.innerHTML += renderTipCard(tip);
      });
    });
}
function centerMap() {
  map.setCenter(userLocation);
  map.setZoom(15);
}


// Render Tip Card
function renderTipCard(tip) {
  const date = tip.timestamp?.toDate().toLocaleString() || "Unknown time";
  return `
    <div class="tip-card ${tip.category}">
      <div class="tip-header">
        <span class="tip-category ${tip.category}">${tip.category}</span>
        <span class="tip-time">${date}</span>
      </div>
      <div class="tip-content">${tip.text}</div>
      ${tip.location ? `
        <div class="tip-footer">
          <span class="tip-location"><i class="fas fa-map-marker-alt"></i> (${tip.location.lat.toFixed(2)}, ${tip.location.lng.toFixed(2)})</span>
        </div>` : ""}
    </div>
  `;
}

// Auth Modals
function showLogin() {
  document.getElementById("loginModal").style.display = "block";
}
function showSignup() {
  document.getElementById("signupModal").style.display = "block";
}
function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

// Sign Up
function signup() {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const confirm = document.getElementById("signupConfirm").value;
  if (password !== confirm) return alert("Passwords do not match");

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      alert("Sign up successful!");
      closeModal('signupModal');
    })
    .catch(err => alert(err.message));
}

// Login
function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      alert("Logged in!");
      closeModal('loginModal');
    })
    .catch(err => alert(err.message));
}

// Logout
function logout() {
  auth.signOut().then(() => {
    alert("Logged out.");
  });
}

// Update UI on Auth Change
auth.onAuthStateChanged(user => {
  const authSection = document.getElementById("authSection");
  if (user) {
    authSection.innerHTML = `
      <span>Welcome!</span>
      <button class="btn auth-btn" onclick="logout()">Logout</button>
    `;
  } else {
    authSection.innerHTML = `
      <button class="btn auth-btn" onclick="showLogin()">Login</button>
      <button class="btn auth-btn" onclick="showSignup()">Sign Up</button>
    `;
  }
});

// Character count for tip input
document.getElementById("tipText").addEventListener("input", function () {
  const max = 300;
  const current = this.value.length;
  document.getElementById("charRemaining").innerText = max - current;
});
function confirmPanic() {
  if (confirm('Are you sure you want to trigger an emergency alert?')) {
    db.collection('emergencies').add({
      location: new firebase.firestore.GeoPoint(userLocation.lat, userLocation.lng),
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      user: auth.currentUser?.displayName || 'Anonymous'
    });
    alert('Emergency alert sent! Authorities have been notified.');
  }
}
// Get category name
function getCategoryName(category) {
  const names = {
    general: "General Safety",
    crime: "Crime Alert",
    traffic: "Traffic Hazard",
    weather: "Weather Warning",
    other: "Other"
  };
  return names[category] || "General";
}

let currentFilter = {
  category: "all",
  sort: "newest",
  search: ""
};

// Update the existing searchTips function
function searchTips() {
  const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
  currentFilter.search = searchTerm;
  loadFilteredTips();
}

// Add real-time search input listener
document.getElementById('searchInput').addEventListener('input', function(e) {
  currentFilter.search = e.target.value.trim().toLowerCase();
  loadFilteredTips();
});

// Modify the loadFilteredTips function to handle search better
function loadFilteredTips() {
  let query = db.collection("safetyTips");

  // Base query with sorting
  query = query.orderBy("timestamp", currentFilter.sort === "oldest" ? "asc" : "desc");

  query.get().then(snapshot => {
    const tipsList = document.getElementById("tipsList");
    tipsList.innerHTML = "";
    let tips = [];

    snapshot.forEach(doc => {
      const tipData = doc.data();
      tips.push({
        id: doc.id,
        ...tipData,
        timestamp: tipData.timestamp?.toDate() // Convert Firestore timestamp
      });
    });

    // Apply filters
    tips = tips.filter(tip => {
      const matchesCategory = currentFilter.category === 'all' || tip.category === currentFilter.category;
      const matchesSearch = !currentFilter.search || 
        tip.text.toLowerCase().includes(currentFilter.search) ||
        (tip.category && tip.category.toLowerCase().includes(currentFilter.search));
      return matchesCategory && matchesSearch;
    });

    // Handle empty results
    if (tips.length === 0) {
      tipsList.innerHTML = '<div class="no-results">No matching tips found</div>';
      return;
    }

    // Render tips
    tips.forEach(tip => {
      const tipElement = document.createElement('div');
      tipElement.className = `tip-card ${tip.category}`;
      tipElement.innerHTML = `
        <div class="tip-header">
          <span class="tip-category ${tip.category}">${getCategoryName(tip.category)}</span>
          <span class="tip-time">${tip.timestamp?.toLocaleString() || 'Unknown time'}</span>
        </div>
        <div class="tip-content">${highlightSearchMatches(tip.text)}</div>
        ${tip.location ? `
          <div class="tip-footer">
            <span class="tip-location"><i class="fas fa-map-marker-alt"></i> 
              (${tip.location.lat.toFixed(4)}, ${tip.location.lng.toFixed(4)})
            </span>
          </div>` : ''}
      `;
      tipsList.appendChild(tipElement);
    });
  }).catch(error => {
    console.error("Error loading tips:", error);
    tipsList.innerHTML = '<div class="error">Error loading tips. Please try again.</div>';
  });
}

// Add highlight function
function highlightSearchMatches(text) {
  if (!currentFilter.search) return text;
  const regex = new RegExp(`(${currentFilter.search})`, 'gi');
  return text.replace(regex, '<span class="search-highlight">$1</span>');
}
function toggleDarkMode() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  
  // Toggle theme
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
  
  // Update toggle icon
  const icon = document.querySelector('.dark-mode-toggle i');
  icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
}
function filterTips() {
  currentFilter.category = document.getElementById("filterCategory").value;
  loadFilteredTips();
}

// Sort tips
function sortTips() {
  currentFilter.sort = document.getElementById("filterSort").value;
  loadFilteredTips();
}

// Search tips
function searchTips() {
  currentFilter.search = document.getElementById("searchInput").value.trim();
  loadFilteredTips();
}
// Initial load
window.onload = () => {
  loadTips();
  loadFilteredTips();
};