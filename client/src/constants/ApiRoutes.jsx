import axios from "axios";
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { FHOST } from "../Admin/AdminHomeComponents/AdminSidebar";



export  const fetchClasses = async (setClasses) => {
    try {
      const response = await axios.get(`${FHOST}/h-sch/admin/api/allclasses`);
      const clasesArray = Object.values(response.data.clases); // Convert clases object to an array
      if (!clasesArray || !Array.isArray(clasesArray)) {
        throw new Error('Clases array is undefined or not an array');
      }
      const formattedClasses = clasesArray.map(classItem => ({
        id: classItem.id,
        name: classItem.name,
        category: "classes",
        isChecked: false
      }));
      setClasses(formattedClasses);
    } catch (error) {
      console.error('Error fetching Classes:', error);
    }
  };
  
  export const fetchSubclassClasses = async (setClasses) => {
    try {
      const response = await axios.get(`${FHOST}/h-sch/admin/api/classes`);
      console.log('Classes:', response.data.classes);
      const formattedClasses = response.data.classes.map(classItem => ({
        id: classItem.id,
        name: classItem.name,
        category: classItem.category,
        isChecked: false,
        active: false,
        subclasses: classItem.subclasses.map(subclass => ({
          id: subclass.id,
          name: subclass.name,
        })),
      }));
      console.log('Formatted classes:', formattedClasses);
      setClasses(formattedClasses);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };


  export  const fetchStudentData = async () => {
    try {
        const response = await axios.get(`${FHOST}/api/students`); // Replace '/api/students' with your actual endpoint
        const students = response.data.map(student => ({
            id: student.id,
            name: student.name,
            email: student.email,
            profile_picture: student.profile_picture,
            contacts: student.contacts,
            stream_id: student.stream_id,
            school_id: student.school_id,
            admission_no: student.admission_no,
            password: student.password,
            admitted_on: student.admitted_on,
            transferred_on: student.transferred_on
        }));
        return students;
    } catch (error) {
        console.error('Error fetching student data:', error);
        return []; // Return an empty array if there's an error
    }
};




export const fetchStaffData = async () => {
    try {
        const response = await axios.get('/api/staff');
        const staff = response.data.map(item => ({
            id: item.id,
            name: item.name,
            email: item.email,
            profile_picture: item.profile_picture,
            contacts: item.contacts,
            school_id: item.school_id,
            user_no: item.user_no,
            password: item.password,
            admitted_on: item.admitted_on,
            transferred_on: item.transferred_on
        }));
        return staff;
    } catch (error) {
        console.error('Error fetching staff data:', error);
        return [];
    }
};

export const fetchTeachersData = async () => {
    try {
        const response = await axios.get('/api/teachers');
        const teachers = response.data.map(item => ({
            id: item.id,
            name: item.name,
            email: item.email,
            profile_picture: item.profile_picture,
            contacts: item.contacts,
            stream_id: item.stream_id,
            school_id: item.school_id,
            user_no: item.user_no,
            password: item.password,
            admitted_on: item.admitted_on,
            transferred_on: item.transferred_on
        }));
        return teachers;
    } catch (error) {
        console.error('Error fetching teachers data:', error);
        return [];
    }
};

export const fetchAdminData = async () => {
    try {
        const response = await axios.get('/api/admin');
        const admin = response.data.map(item => ({
            id: item.id,
            name: item.name,
            email: item.email,
            profile_picture: item.profile_picture,
            contacts: item.contacts,
            school_id: item.school_id,
            staff_no: item.staff_no,
            password: item.password,
            admitted_on: item.admitted_on,
            transferred_on: item.transferred_on
        }));
        return admin;
    } catch (error) {
        console.error('Error fetching admin data:', error);
        return [];
    }
};



export const fetchSubjectsData = async () => {
    try {
        const response = await axios.get('/api/subjects');
        const subjects = response.data.map(item => ({
            id: item.id,
            subject_name: item.subject_name,
            stream_id: item.stream_id
        }));
        return subjects;
    } catch (error) {
        console.error('Error fetching subjects data:', error);
        return [];
    }
};


export const fetchStreamData = async () => {
  try {
      // Make a GET request to fetch stream data from the API endpoint
      const response = await axios.get('/api/streams'); // Replace '/api/streams' with your actual endpoint
      // Extract the data from the response
      const streams = response.data;
      // Return the streams data
      return streams;
  } catch (error) {
      console.error('Error fetching stream data:', error);
      return []; // Return an empty array if there's an error
  }
};

export const fetchSchoolData = async () => {
    try {
        const response = await axios.get('/api/schools'); // Replace '/api/schools' with your actual endpoint
        const schools = response.data.map(school => ({
            id: school.id,
            owners_name: school.owners_name,
            school_name: school.school_name,
            email: school.email,
            contacts: school.contacts,
            timestamp: school.timestamp
        }));
        return schools;
    } catch (error) {
        console.error('Error fetching school data:', error);
        return []; // Return an empty array if there's an error
    }
};



export const checkUser = async (email) => {
  const serverUrl = `${FHOST}/admin/check_user`;

  try {
    const response = await axios.post(serverUrl, { email });
    const responseData = response.data;

    // If the response data is not null, return the response data
    if (responseData !== null) {
      return responseData;
    }
    return { error: 'User not found' };
    
  } catch (error) {
    console.error('Error checking email:', error);

    // Extract and return the server's error message
    if (error.response && error.response.data && error.response.data.message) {
      return { error: error.response.data.message };
    }

    return { error: 'An unknown error occurred' };
  }
};


export const verifyLogin = async (formData) => {
  const serverUrl = `${FHOST}/admin/verify_login`;
  const { username, password } = formData;
  console.log(username, "this is the username");
  console.log(password, "this is the password");
  try {
    const response = await axios.post(serverUrl, { username, password });
    const responseData = response.data;

    // If the response data is not null, return the response data
    if (responseData !== null) {
      return responseData;
    }

    // If the response data is null, the user is not registered
    return { error: 'User is not registered' };
  } catch (error) {
    console.error('Error checking email:', error);
    if (error.response && error.response.data && error.response.data.message) {
      return { error: error.response.data.message };
    }

    return { error: 'An unknown error occurred' };
  }
};

export const fetchTeachers = async (school_id) => {
  try {
    const response = await axios.get(`${FHOST}/admin/api/teachers/admitted/${school_id}`);
    

    console.log(response.data.teachers,"these are the teacheers")
    return response.data.teachers;
    
  } catch (error) {
    console.error('Error fetching teachers:', error);
    
  }
}


export const verifyFingerprint = async (fingerprint, user_id, user_type) => {
  const serverUrl = `${FHOST}/admin/verify-fingerprint`; // Replace with your actual server URL

  // Assuming DeviceCode is equal to fingerprint
  const DeviceCode = fingerprint;

  try {
    const response = await axios.post(serverUrl, {
      user_id,
      user_type,
      DeviceCode,
    });

    const responseData = response.data;
    return responseData; // Return the response data from the server
  } catch (error) {
    console.error('Error verifying fingerprint:', error);
    throw error; // Rethrow the error to handle it elsewhere
  }
};


export const storeFingerprint = async (userType, user_id,school_id, DeviceInfo, DeviceCode,combinedInfo) => {
  const serverUrl = `${FHOST}/admin/store-fingerprint`; // Replace with your actual server URL

  try {
    const response = await axios.post(serverUrl, {
      userType,
      user_id,
      DeviceInfo,
      DeviceCode,
      combinedInfo,
      school_id,
    });

    const responseData = response.data;
    return responseData; // Return the response data from the server
  } catch (error) {
    console.error('Error storing fingerprint data:', error);
    throw error; // Rethrow the error to handle it elsewhere
  }
};


export const generateDeviceFingerprint = async () => {
  try {
    // Initialize an agent at application startup
    const fpPromise = FingerprintJS.load();

    // Get the visitor identifier and components when needed
    const fp = await fpPromise;
    const result = await fp.get();

    // Extract device fingerprint and components
    const fingerprint = result.visitorId;
    const deviceInfo = result.components;

    // Log fingerprint and device info for testing (optional)
    console.log('Device Fingerprint:', fingerprint);
    console.log('Device Info:', deviceInfo);

    // Return fingerprint and device info as an object
    return { fingerprint, deviceInfo };
  } catch (error) {
    console.error('Error generating device fingerprint:', error);
    throw error; // Rethrow the error to handle it elsewhere
  }
};


export const parseDeviceInfo = (deviceInfo) => {
  let deviceName = "Unknown Device";
  let deviceVersion = "Unknown Version";
  let operatingSystem = "Unknown OS";

  if (deviceInfo.includes("iPhone")) {
    deviceName = "iPhone";
    const match = deviceInfo.match(/iPhone\s([\d_]+)/);
    if (match) {
      deviceVersion = match[1].replace(/_/g, ".");
    }
    operatingSystem = "iOS";
  } else if (deviceInfo.includes("iPad")) {
    deviceName = "iPad";
    const match = deviceInfo.match(/iPad\s([\d_]+)/);
    if (match) {
      deviceVersion = match[1].replace(/_/g, ".");
    }
    operatingSystem = "iOS";
  } else if (deviceInfo.includes("Samsung")) {
    deviceName = "Samsung Device";
    const match = deviceInfo.match(/Samsung\s([\w\s]+)/);
    if (match) {
      deviceVersion = match[1];
    }
    operatingSystem = "Android";
  } else if (deviceInfo.includes("Huawei")) {
    deviceName = "Huawei Device";
    const match = deviceInfo.match(/Huawei\s([\w\s]+)/);
    if (match) {
      deviceVersion = match[1];
    }
    operatingSystem = "Android";
  } else if (deviceInfo.includes("OnePlus")) {
    deviceName = "OnePlus Device";
    const match = deviceInfo.match(/OnePlus\s([\w\s]+)/);
    if (match) {
      deviceVersion = match[1];
    }
    operatingSystem = "Android";
  } else if (deviceInfo.includes("Google Pixel")) {
    deviceName = "Google Pixel";
    const match = deviceInfo.match(/Google Pixel\s([\w\s]+)/);
    if (match) {
      deviceVersion = match[1];
    }
    operatingSystem = "Android";
  } else if (deviceInfo.includes("Android")) {
    deviceName = "Android Device";
    const match = deviceInfo.match(/Android\s([\d.]+)/);
    if (match) {
      deviceVersion = match[1];
    }
    operatingSystem = "Android";
  } else if (deviceInfo.includes("Windows")) {
    deviceName = "Windows PC";
    const match = deviceInfo.match(/Windows NT (\d+\.\d+)/);
    if (match) {
      switch (match[1]) {
        case '10.0':
          operatingSystem = 'Windows 10';
          break;
        case '6.3':
          operatingSystem = 'Windows 8.1';
          break;
        case '6.2':
          operatingSystem = 'Windows 8';
          break;
        case '6.1':
          operatingSystem = 'Windows 7';
          break;
        case '6.0':
          operatingSystem = 'Windows Vista';
          break;
        case '5.1':
          operatingSystem = 'Windows XP';
          break;
        default:
          operatingSystem = `Windows ${match[1]}`;
          break;
      }
    }
  } else if (deviceInfo.includes("Macintosh")) {
    deviceName = "Mac";
    const match = deviceInfo.match(/Mac OS X\s([\d_]+)/);
    if (match) {
      deviceVersion = match[1].replace(/_/g, ".");
    }
    operatingSystem = "macOS";
  }

  // Combine device details into a single string
  const combinedInfo = `${deviceName} ${deviceVersion} ${operatingSystem}`;
  
  return {
    deviceName,
    deviceVersion,
    operatingSystem,
    combinedInfo // Combined string
  };
};



export const getClasses = async (school_id) => {
  try {
    const response = await axios.get(`${FHOST}/admin/get-classes/${school_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching classes:', error);
    throw error;
  }
};

export const fetchDevices = async (userType, userId) => {
  try {
    const response = await axios.get(`${FHOST}/admin/api/get-devices`, {
      params: { userType, userId }
    });
    return response.data.devices; // Adjust based on the actual response format
  } catch (error) {
    throw new Error('Failed to fetch devices');
  }
};


export const fetchStudents = async (school_id) => {
  try {
    const response = await axios.get(`${FHOST}/admin/api/students/admitted/${school_id}`);
    if (Array.isArray(response.data)) {
      return response.data.map(item => item.students); // Extract 'students' from each object
    } else {
      console.error('Unexpected data format:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
};

export const fetchTransferedStudents = async (school_id) => {
  try {
    const response = await axios.get(`${FHOST}/admin/api/students/transferred/${school_id}`);
    if (Array.isArray(response.data)) {
      return response.data.map(item => item.students); // Extract 'students' from each object
    } else {
      console.error('Unexpected data format:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
};