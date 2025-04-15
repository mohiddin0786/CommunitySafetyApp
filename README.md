# 🛡️ Community Safety Map

⚠️ For demo purposes, this project uses placeholder API keys. Please contact us or check the demo video to see the live version.

The **Community Safety Map** is a full-featured, responsive, and visually engaging web application designed to empower local communities by enabling individuals to collaboratively identify and share information about the safety of locations in their surroundings; it allows users to mark places as either *Safe* or *Unsafe*, to provide relevant context through comments, and to submit categorized safety tips that can aid others in staying aware of possible hazards—be it weather-related, crime-based, or general cautionary advisories.

---

## 🌟 Key Features

- 🗺️ **Interactive Map with Location Markers**  
  Users can add pins on the map indicating whether a particular place is safe or unsafe; each marker can include an optional comment, and the markers are displayed using distinctive icons for immediate visual distinction.

- 🚨 **Emergency Panic Button**  
  A dedicated emergency button is present for users to quickly send alerts that include geolocation and timestamp; this data is stored in Firestore and intended to simulate alerting the authorities or community admins.

- 💬 **Safety Tip Submission and Categorization**  
  Logged-in users can submit short safety tips that are grouped by categories such as *Crime Alert*, *Weather Warning*, *Traffic Hazard*, and more; these tips are then displayed to the community in a scrollable, searchable, and filterable format.

- 🔐 **User Authentication with Firebase**  
  Authentication is seamlessly integrated using Firebase Authentication, allowing users to sign up and log in using email and password credentials; the authentication state dynamically updates the user interface to ensure personalized interactions.

- 🌗 **Dark Mode Toggle**  
  Users can easily switch between light and dark themes using the toggle button, which remembers the selected preference via local storage, enhancing both usability and aesthetic adaptability across different lighting conditions.

- 🔎 **Search**  
  The app features intuitive search functionality that dynamically filters community-submitted tips by keyword and category; this ensures users can quickly access relevant and recent information with minimal friction.

---

## ⚙️ Technologies Used

This application makes use of a blend of modern frontend technologies, APIs, and cloud-based backend services to deliver a dynamic and fully interactive user experience.

- **HTML5 & CSS3**: For the structural layout and styled components; includes responsive design and dark mode theming.
- **JavaScript (Vanilla)**: Handles all interactivity, dynamic rendering, and integration logic.
- **Google Maps JavaScript API**: Renders the map, displays markers, and processes location-based features.
- **Firebase Firestore**: Stores safety tips, location markers, and emergency alerts in real-time.
- **Firebase Authentication**: Manages user sessions and access control through secure email/password login.

---

## 🛠️ Getting Started

If you'd like to clone, run, or contribute to the project, follow the steps below to set it up locally:

###  Clone the Repository

```bash
git clone https://mohiddin0786.github.io/CommunitySafetyApp/
cd community-safety-map

## 🔧 Firebase Setup (Optional if Viewing Demo)

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a project.
2. Enable Firestore and Email/Password Authentication.
3. Replace the Firebase config in `script.js` with your own:
```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  ...
};


## 🗺️ Google Maps API Setup (Optional if Viewing Demo)

To enable the interactive safety map:

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or select an existing one).
3. Enable the **Maps JavaScript API**.
4. Create and copy your API key.
5. In `index.html`, replace the placeholder with your key:

```html
<script async defer
  src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&callback=initMap&libraries=visualization">
</script>

## 🔮 Future Enhancements

Here are some planned features and ideas to expand the Community Safety Map:

- 📨 **Email Alerts**  
  Notify nearby users or authorities when a panic button is triggered.

- 🧑‍💼 **Admin Dashboard**  
  Moderate safety tips, manage users, and review reported markers.

- 🌐 **Location-based Tip Filtering**  
  Show tips specific to the user's current or selected area.

- 🔔 **Push Notifications**  
  Send real-time alerts for high-risk areas or emergencies.

- 🗺️ **Heatmap Visualization**  
  Show dense clusters of unsafe reports as heat zones on the map.

- 📱 **Progressive Web App (PWA)**  
  Enable installable offline-first experience with device-native features.

- 🧠 **AI-Powered Tip Categorization**  
  Automatically classify tips using natural language processing.

- 💬 **Tip Upvotes & Comments**  
  Let users interact with each other's tips for credibility and engagement.

- 👥 **User Profiles**  
  View submitted tips and stats, track contributions.
## 🎥 Demo Video

Watch the demo: [YouTube Link or Drive Link](https://yourlink.com)

