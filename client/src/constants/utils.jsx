import { useEffect } from "react";
import axios from "axios";

// Function to format time
export function formatTime(time) {
    return time < 10 ? '0' + time : time;
}

// Countdown timer function
export function startCountdown(startDate, endDate, submitExam) {
    let lastTime = -1; // Store the last time to avoid unnecessary DOM updates
    const updateInterval = 1000; // Update interval in milliseconds

    const updateTimer = () => {
        const now = new Date();
        const distance = endDate - now;

        if (distance <= 0) {
            clearInterval(countdown);
            submitExam();
            return;
        }

        // Calculate time difference in days, hours, minutes, and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (days >= 0 && hours >= 0 && minutes >= 0 && seconds >= 0) {
            document.getElementById('days').innerText = days;
            document.getElementById('hours').innerText = formatTime(hours);
            document.getElementById('minutes').innerText = formatTime(minutes);
            document.getElementById('seconds').innerText = formatTime(seconds);
        }
    };

    // Initial update to prevent initial delay
    updateTimer();

    // Set up interval for regular updates
    const countdown = setInterval(updateTimer, updateInterval);

    // Return the countdown interval ID for cleanup
    return countdown;
}

// Function to submit exam
export function submitExam() {
    // Your code to submit the exam goes here
    console.log('Exam submitted!');
}


export const formatDate = (dateString) => {
    // Parse the date string into a Date object
    const date = new Date(dateString);

    // Get individual components of the date
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Construct the formatted date string
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

    return formattedDate;
};

// Example usage
const dateString = "Thu, 04 Apr 2024 08:53:21 GMT";
const formattedDate = formatDate(dateString);
console.log(formattedDate); // Output: "2024-04-04T08:53:21"




export function ProfileModal({ imageUrl, onClose }) {
    useEffect(() => {
        const handleClickOutside = event => {
          if (event.target.classList.contains("profile-modal")) {
            onClose();
          }
        };
    
        window.addEventListener("click", handleClickOutside);
    
        return () => {
          window.removeEventListener("click", handleClickOutside);
        };
      }, [onClose]);
  return (
    <div className="fixed z-40 top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div className="max-w-lg bg-white p-4 rounded-lg">
        <img src={imageUrl} alt="Profile" className="w-full h-auto " />
        <button className="absolute top-0 right-0 p-2 h-screen w-screen -z-10" onClick={onClose}>
          
        </button>
      </div>
    </div>
  );
}


export const calculateYearlyPay = (enrollmentDate, yearlyPay) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // getMonth() is zero-based, so add 1
  const currentTerm = Math.floor((currentMonth - 1) / 4) + 1;

  // Start of the year
  const startOfYear = new Date(currentYear, 0, 1);

  // End date of the first one-third of the year (adding 4 months)
  const endOfFirstThird = new Date(startOfYear);
  endOfFirstThird.setMonth(startOfYear.getMonth() + 4);

  let adjustedYearlyPay = yearlyPay;

  if (new Date(enrollmentDate) >= endOfFirstThird) {
    adjustedYearlyPay = yearlyPay / 3;
  }
  if (currentTerm !== 1) {
    adjustedYearlyPay = 0;
  }

  return adjustedYearlyPay;
};


export const getCurrentTerm = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // getMonth() is zero-based, so add 1

  let currentTerm;

  if (currentMonth >= 1 && currentMonth <= 4) {
    currentTerm = 1;
  } else if (currentMonth >= 5 && currentMonth <= 8) {
    currentTerm = 2;
  } else if (currentMonth >= 9 && currentMonth <= 12) {
    currentTerm = 3;
  }

  return currentTerm;
};






// // Configure Cloudinary with your credentials
// const cloudinaryConfig =({
//   // cloudName: 'dlydu2g6v',
//   // api_key: '369178931235243',
//   // api_secret: 'H2ZQ2WJTJ_Oxotare95OVKjSdzk',
//   cloud: {
//     cloudName: 'dlydu2g6v'
//   }
// });

// // Define a function to upload file to Cloudinary and return URL
// export const uploadFileToCloudinary = async (file, folderName) => {
//   try {
//     // Set up Cloudinary configuration
//     const CLOUDINARY_CLOUD_NAME = 'dlydu2g6v';
//     const CLOUDINARY_UPLOAD_PRESET = '';
//     const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

//     // Create a new FormData object
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
//     formData.append('folder', folderName);

//     // Send the file to Cloudinary
//     const response = await axios.post(CLOUDINARY_API_URL, formData);

//     // Return the secure URL of the uploaded image
//     return response.data.secure_url;
//   } catch (error) {
//     console.error('Error uploading file to Cloudinary:', error);
//     throw error;
//   }
// };