Electric Vehicle Recharge Bunk
    🚗 Project Overview
    Electric Vehicle Recharge Bunk is a web application that helps EV users to easily find nearby EV charging stations, check slot availability, and book slots in advance.
    It also allows EV Station Admins to manage bunk details, slots, and view user bookings.
    The project promotes green transportation by improving access to EV charging points and reducing waiting times at stations.

🔥 Key Features
    For Users:
      1.Register and Login
      
      2.Search and view nearby EV recharge bunks (within 30 KM)
      
      3.View Bunk Details:
      
        Address
        
        Contact Information
        
        Google Map Location
        
        Check available time slots
        
        Book an EV charging slot
    
    For Admin:
      1.Register and Login
      
      2.Create new EV recharge bunk locations
      
      3.Manage existing bunk details
      
      4.Monitor and manage slot bookings
      
      5.Free up booked slots when users finish charging

🛠️ Technologies Used
    Frontend: HTML, CSS, JavaScript, React.js, TailwindCSS
    
    Backend: Firebase Firestore (Database), Firebase Authentication

Deployment: Vercel

📋 Workflow Summary
    User Registration/Login:
    Users register or log in using Firebase Authentication.
    
    EV Bunk Creation (Admin Panel):
    Admins can create EV bunk locations by providing details like name, address, latitude, longitude, available slots, and Google Maps link.
    
    Finding Nearby Bunks (User Dashboard):
    Users can find EV bunks within a 30 km radius based on their current location using geolocation APIs.
    
    Slot Booking (User Panel):
    Users view available slots and can book a slot. Once a slot is booked:
    
    Slot information is saved in the bookedSlots collection in Firebase.
    
    Available slots are updated dynamically.
    
    Slot Management (Admin Panel):
    Admins can monitor booked slots, and free up slots manually if needed.
    
    Deployment:
    The project is deployed on Vercel for easy access on mobile and desktop browsers.

⚡ How to Run the Project
    1.Clone the repository:git clone <github.com/venkateshrajamoor/ev_recharge_bunk>
    2.install dependencies :npm i
    3.Setup your Firebase project and replace firebaseConfig.js with your credentials.
    4.Start the development server:npm run  dev
    5.Visit http://localhost:3000 to view the application.
🔒 Important Notes
    Authentication: Only registered users can access booking and dashboard features.
    
    Slot Management: Max 4 slots can be active at any bunk. Slots are freed manually by Admins after use.
    
    Mobile Optimization: The app is responsive but best performance is ensured on updated mobile browsers.
    
👨‍💻 Developer
    Venkatesh Rajamoor

