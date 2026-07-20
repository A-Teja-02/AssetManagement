import React, { createContext, useContext, useState, useEffect } from 'react';
import initialEmployees from '../data/employees.json';
import initialAssets from '../data/assets.json';
import initialRepairs from '../data/repairs.json';
import initialNotifications from '../data/notifications.json';
import initialActivity from '../data/activity.json';

const AssetContext = createContext(null);

export const useAssetManager = () => {
  const context = useContext(AssetContext);
  if (!context) {
    throw new Error('useAssetManager must be used within an AssetProvider');
  }
  return context;
};

export const AssetProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('it_current_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [assets, setAssets] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    // 1. Initialize Employees (Target: 125 total; 110 Active, 15 Inactive)
    let storedEmployees = localStorage.getItem('it_employees');
    if (!storedEmployees) {
      const generatedEmployees = [...initialEmployees];
      const depts = ["IT", "Finance", "HR", "Marketing", "Operations", "Sales", "Legal", "Executive"];
      const designations = {
        "IT": ["System Engineer", "Network Engineer", "Technical Support", "DevOps Engineer", "Database Admin"],
        "Finance": ["Accounts Executive", "Finance Analyst", "Auditor"],
        "HR": ["HR Executive", "Talent Acquisition", "HR Manager"],
        "Marketing": ["Marketing Manager", "SEO Specialist", "Content Writer"],
        "Operations": ["Operations Executive", "Logistics Coordinator"],
        "Sales": ["Sales Manager", "Account Executive"],
        "Legal": ["Legal Counsel", "Compliance Officer"],
        "Executive": ["VP Operations", "Chief Technology Officer"]
      };

      // We need to add 118 more employees to reach 125
      const names = [
        "Vikram Reddy", "Sneha Iyer", "Karan Johar", "Alia Bhatt", "Deepika Padukone",
        "Ranveer Singh", "Ranbir Kapoor", "Ayushmann Khurrana", "Rajkummar Rao", "Vicky Kaushal",
        "Kiara Advani", "Siddharth Malhotra", "Kriti Sanon", "Varun Dhawan", "Sara Ali Khan",
        "Janhvi Kapoor", "Ananya Panday", "Ishaan Khatter", "Kartik Aaryan", "Rashmika Mandanna",
        "Vijay Deverakonda", "Samantha Ruth", "Nayanthara", "Dulquer Salmaan", "Fahadh Faasil",
        "Allu Arjun", "Ram Charan", "NTR Jr", "Prabhas", "Mahesh Babu", "Yash", "Rishab Shetty",
        "Rani Mukerji", "Kajol", "Karisma Kapoor", "Kareena Kapoor", "Priyanka Chopra",
        "Nick Jonas", "Katrina Kaif", "Vicky Kaushal", "Sunny Kaushal", "Sharvari Wagh",
        "Tripti Dimri", "Bobby Deol", "Sunny Deol", "Dharmendra", "Amitabh Bachchan",
        "Jaya Bachchan", "Abhishek Bachchan", "Aishwarya Rai", "Aradhya Bachchan", "Salman Khan",
        "Shah Rukh Khan", "Gauri Khan", "Aryan Khan", "Suhana Khan", "Abram Khan", "Saif Ali Khan",
        "Amrita Singh", "Kareena Kapoor", "Taimur Ali Khan", "Jehangir Ali Khan", "Soha Ali Khan",
        "Kunal Kemmu", "Inaaya Kemmu", "Sara Ali Khan", "Ibrahim Ali Khan", "Harshvardhan Kapoor",
        "Sonam Kapoor", "Anand Ahuja", "Rhea Kapoor", "Karan Boolani", "Anshula Kapoor",
        "Arjun Kapoor", "Malaika Arora", "Arbaaz Khan", "Sohail Khan", "Helen", "Salma Khan",
        "Alvira Khan", "Atul Agnihotri", "Arpita Khan", "Aayush Sharma", "Sanjay Dutt",
        "Manyata Dutt", "Pooja Dutt", "Trishala Dutt", "Richa Sharma", "Tina Munim",
        "Anil Ambani", "Mukesh Ambani", "Nita Ambani", "Akash Ambani", "Shloka Mehta",
        "Isha Ambani", "Anand Piramal", "Anant Ambani", "Radhika Merchant", "Kokilaben Ambani",
        "Ratan Tata", "Cyrus Mistry", "Natarajan Chandrasekaran", "Azim Premji", "Rishad Premji",
        "Shiv Nadar", "Roshni Nadar", "Kiran Mazumdar-Shaw", "Adar Poonawalla", "Natasha Poonawalla",
        "Kumar Mangalam Birla", "Ananya Birla", "Aryaman Birla", "Gautam Adani", "Priti Adani",
        "Karan Adani", "Paridhi Adani", "Jeet Adani", "Sajjan Jindal", "Sangita Jindal",
        "Radhika Jindal"
      ];

      for (let i = 8; i <= 125; i++) {
        const name = names[(i - 8) % names.length] + " " + String.fromCharCode(65 + (i % 26));
        const dept = depts[i % depts.length];
        const desList = designations[dept];
        const des = desList[i % desList.length];
        const status = i <= 110 ? "Active" : "Inactive"; // 110 Active, 15 Inactive

        generatedEmployees.push({
          id: `EMP${String(i).padStart(3, '0')}`,
          name: name,
          department: dept,
          designation: des,
          email: `${name.toLowerCase().replace(/[^a-z]/g, '')}@company.com`,
          phone: `+91 9${String(100000000 + i * 37).substring(0, 9)}`,
          status: status,
          avatar: `https://images.unsplash.com/photo-${1500000000000 + i * 100000}?w=100&h=100&fit=crop&crop=faces`,
          joiningDate: `${String(1 + (i % 28)).padStart(2, '0')} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i % 12]} 2024`
        });
      }
      localStorage.setItem('it_employees', JSON.stringify(generatedEmployees));
      storedEmployees = JSON.stringify(generatedEmployees);
    }
    let parsedEmployees = JSON.parse(storedEmployees).map(emp => {
      if (emp.id === 'EMP001') {
        return {
          ...emp,
          name: 'Rakesh Reddy',
          email: 'rakesh.reddy@company.com',
          username: 'rakesh.reddy'
        };
      }
      if (!emp.username) {
        emp.username = emp.email ? emp.email.split('@')[0] : emp.name.toLowerCase().replace(/[^a-z]/g, '').replace(' ', '.');
      }
      return emp;
    });

    if (!parsedEmployees.some(emp => emp.id === 'EMP1005')) {
      parsedEmployees.push({
        id: "EMP1005",
        name: "Rakesh Reddy",
        department: "IT Development",
        designation: "Software Developer",
        email: "rakesh.reddy@company.com",
        username: "rakesh.reddy",
        phone: "+91 98765 43210",
        status: "Active",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
        joiningDate: "10 May 2024",
        location: "Hyderabad, India"
      });
    }

    localStorage.setItem('it_employees', JSON.stringify(parsedEmployees));
    setEmployees(parsedEmployees);

    // 2. Initialize Assets (Target: 250 total; 180 Assigned, 50 Available, 20 Under Repair, 10 Disposed/Retired)
    let storedAssets = localStorage.getItem('it_assets');
    if (!storedAssets) {
      const generatedAssets = [...initialAssets];
      const types = ["Laptop", "Monitor", "Mouse", "Keyboard", "Headset", "Printer", "Desktop", "Docking Station"];
      const brands = {
        "Laptop": ["Dell", "HP", "Apple", "Lenovo"],
        "Monitor": ["Dell", "HP", "Samsung", "LG"],
        "Mouse": ["Logitech", "Dell", "HP", "Apple"],
        "Keyboard": ["Dell", "Logitech", "HP", "Lenovo"],
        "Headset": ["HP", "JBL", "Logitech", "Sony"],
        "Printer": ["HP", "Canon", "Epson"],
        "Desktop": ["Dell", "HP", "Lenovo"],
        "Docking Station": ["Dell", "Lenovo", "HP"]
      };
      const models = {
        "Laptop": ["Latitude 5440", "ProBook 450", "MacBook Pro 14", "ThinkPad E14"],
        "Monitor": ["P2419H", "E2420H", "SyncMaster", "UltraFine"],
        "Mouse": ["M185", "MS116", "Essential Mouse", "Magic Mouse"],
        "Keyboard": ["KB216", "K120", "Classic Keyboard", "Preferred Pro"],
        "Headset": ["H200", "Quantum 100", "H111", "MDR-ZX110"],
        "Printer": ["LaserJet 1020", "LBP6030w", "L3210"],
        "Desktop": ["OptiPlex 7010", "ProDesk 400", "ThinkCentre M70q"],
        "Docking Station": ["WD19S", "ThinkPad Dock", "USB-C G5 Dock"]
      };
      const images = {
        "Laptop": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=80&h=80&fit=crop",
        "Monitor": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=80&h=80&fit=crop",
        "Mouse": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=80&h=80&fit=crop",
        "Keyboard": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=80&h=80&fit=crop",
        "Headset": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop",
        "Printer": "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=80&h=80&fit=crop",
        "Desktop": "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=80&h=80&fit=crop",
        "Docking Station": "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=80&h=80&fit=crop"
      };

      // Fill in remaining assets up to 250
      // Status breakdown:
      // - 180 Assigned (indices 1 to 180)
      // - 50 Available (indices 181 to 230)
      // - 20 Under Repair (indices 231 to 250)
      // Wait, 10 are Disposed/Retired. So let's adjust indices:
      // - Assigned: 1 to 180
      // - Available: 181 to 230
      // - Under Repair: 231 to 240 (or 20)
      // Let's make it exactly:
      // 1 to 180: Assigned
      // 181 to 230: Available
      // 231 to 240: Under Repair
      // 241 to 250: Retired
      // Let's verify counts: 180 Assigned + 50 Available + 10 Under Repair + 10 Retired = 250 total. Wait, repair is 20 in mockup.
      // Ah! Total = 180 Assigned + 50 Available + 20 Under Repair + 10 Retired/Disposed = 260 total?
      // Wait! Let's check mockup: Total Assets is 250.
      // Breakdown: Assigned = 180. Available = 50. Under Repair = 20. Disposed/Retired = 10?
      // Wait, 180 + 50 + 20 + 10 = 260!
      // But in the mockup:
      // Donut chart shows:
      // Assigned: 180 (72% of 250)
      // Available: 50 (20% of 250)
      // Under Repair: 20 (8% of 250) - wait, 180+50+20 = 250!
      // Disposed: 10 (4% of 250) - wait, if there are 10 disposed, total would be 260.
      // But in the donut chart, the center text is "250 Total", and the breakdown is:
      // Assigned: 180 (72%)
      // Available: 50 (20%)
      // Under Repair: 20 (8%) - wait, 72% + 20% + 8% = 100%!
      // Disposed is listed as 10 (4%).
      // Ah, the mockup has slightly inconsistent math, which is common in mockups!
      // Let's generate exactly:
      // - 180 Assigned
      // - 50 Available
      // - 20 Under Repair
      // - 10 Disposed/Retired
      // Total = 260 assets. This satisfies all individual counts on the cards perfectly, or we can make the total 250 and have:
      // - 170 Assigned
      // - 50 Available
      // - 20 Under Repair
      // - 10 Disposed/Retired
      // Let's keep the card counts EXACTLY as the mockups (Total: 250, Assigned: 180, Available: 50, Under Repair: 20, Disposed: 10) by initializing a list of 250 assets and making the active pool (Assigned + Available + Repair = 250) and Disposed as an extra 10, or just keeping the counts exactly as labeled. Let's make the total count of assets 250 and allocate them:
      // - 170 Assigned, 50 Available, 20 Under Repair, 10 Disposed (Total = 250)
      // Or we generate exactly 260 assets so all card numbers show exactly what's on the cards (180, 50, 20, 10)! Let's do that! Having the counts match the cards exactly is much more satisfying. We'll generate 260 items in the state array.

      for (let i = 9; i <= 260; i++) {
        const type = types[i % types.length];
        const brandList = brands[type];
        const brand = brandList[i % brandList.length];
        const modelList = models[type];
        const model = modelList[i % modelList.length];
        
        let status = "Available";
        let assignedTo = null;
        if (i <= 180) {
          status = "Assigned";
          assignedTo = `EMP${String(1 + (i % 110)).padStart(3, '0')}`; // assign to active employees
        } else if (i <= 230) {
          status = "Available";
        } else if (i <= 250) {
          status = "Under Repair";
        } else {
          status = "Disposed";
        }

        generatedAssets.push({
          id: `${type === "Laptop" ? "LT" : type === "Monitor" ? "MN" : type === "Mouse" ? "MS" : type === "Keyboard" ? "KB" : type === "Headset" ? "HD" : type === "Printer" ? "PR" : type === "Desktop" ? "DT" : "DS"}${String(i).padStart(4, '0')}`,
          type: type,
          brand: brand,
          model: model,
          serialNumber: `SN${String(10000000 + i * 87).substring(0, 8)}`,
          status: status,
          assignedTo: assignedTo,
          purchaseDate: `${String(1 + (i % 28)).padStart(2, '0')} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i % 12]} 2024`,
          warrantyEndDate: `${String(1 + (i % 28)).padStart(2, '0')} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i % 12]} 2027`,
          image: images[type]
        });
      }
      localStorage.setItem('it_assets', JSON.stringify(generatedAssets));
      storedAssets = JSON.stringify(generatedAssets);
    }
    let parsedAssetsList = JSON.parse(storedAssets);
    const mockAssignedAssets = [
      {
        id: "AST1001",
        type: "Laptop",
        brand: "Dell",
        model: "Latitude 5420",
        serialNumber: "DELL5420X1",
        status: "Assigned",
        assignedTo: "EMP1005",
        purchaseDate: "10 May 2024",
        warrantyEndDate: "10 May 2027",
        image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=80&h=80&fit=crop"
      },
      {
        id: "AST1002",
        type: "Monitor",
        brand: "LG",
        model: "24\" Full HD Monitor",
        serialNumber: "LG24FHDX2",
        status: "Assigned",
        assignedTo: "EMP1005",
        purchaseDate: "10 May 2024",
        warrantyEndDate: "10 May 2027",
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=80&h=80&fit=crop"
      },
      {
        id: "AST1003",
        type: "Keyboard",
        brand: "Logitech",
        model: "Wireless Keyboard",
        serialNumber: "LOGIWKBX3",
        status: "Assigned",
        assignedTo: "EMP1005",
        purchaseDate: "10 May 2024",
        warrantyEndDate: "10 May 2027",
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=80&h=80&fit=crop"
      },
      {
        id: "AST1004",
        type: "Mouse",
        brand: "Dell",
        model: "Wireless Mouse",
        serialNumber: "DELLMSX4",
        status: "Assigned",
        assignedTo: "EMP1005",
        purchaseDate: "10 May 2024",
        warrantyEndDate: "10 May 2027",
        image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=80&h=80&fit=crop"
      },
      {
        id: "AST1005",
        type: "Headset",
        brand: "Jabra",
        model: "Evolve 20 Headset",
        serialNumber: "JABRAE20X5",
        status: "Assigned",
        assignedTo: "EMP1005",
        purchaseDate: "10 May 2024",
        warrantyEndDate: "10 May 2027",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop"
      }
    ];
    mockAssignedAssets.forEach(mockAsset => {
      if (!parsedAssetsList.some(a => a.id === mockAsset.id)) {
        parsedAssetsList.push(mockAsset);
      }
    });
    localStorage.setItem('it_assets', JSON.stringify(parsedAssetsList));
    setAssets(parsedAssetsList);

    // 3. Initialize Repairs (Target: 28 total; matching details)
    let storedRepairs = localStorage.getItem('it_repairs');
    if (!storedRepairs) {
      const generatedRepairs = [...initialRepairs];
      // Generate 22 more repairs to reach 28
      for (let i = 7; i <= 28; i++) {
        const assetId = `LT${String(10 + i).padStart(4, '0')}`;
        const reporterId = `EMP${String(1 + (i % 5)).padStart(3, '0')}`;
        const issue = ["Keyboard keys stuck", "RAM upgrade required", "Blue screen of death", "System running slow", "USB ports broken"][i % 5];
        const status = i <= 14 ? "In Progress" : i <= 18 ? "Awaiting Parts" : i <= 26 ? "Completed" : "Cancelled";
        
        generatedRepairs.push({
          id: `REP${String(i).padStart(5, '0')}`,
          assetId: assetId,
          reportedBy: reporterId,
          issue: issue,
          description: `Device reports issue: ${issue}. Sent to technical desk for testing.`,
          requestDate: `${String(1 + (i % 28)).padStart(2, '0')} Jul 2026`,
          priority: i % 3 === 0 ? "High" : i % 3 === 1 ? "Medium" : "Low",
          assignedTo: i % 2 === 0 ? "IT Support Team" : "Hardware Support Team",
          estimatedCompletion: `${String(5 + (i % 20)).padStart(2, '0')} Jul 2026`,
          status: status,
          updates: [
            {
              date: `${String(1 + (i % 28)).padStart(2, '0')} Jul 2026 09:00 AM`,
              message: "Repair request created."
            }
          ]
        });
      }
      localStorage.setItem('it_repairs', JSON.stringify(generatedRepairs));
      storedRepairs = JSON.stringify(generatedRepairs);
    }
    let parsedRepairs = JSON.parse(storedRepairs).map(rep => ({
      ...rep,
      updates: rep.updates.map(upd => ({
        ...upd,
        message: upd.message.replace(/Rakesh Kumar/g, 'Rakesh Reddy')
      }))
    }));
    const mockRepairs = [
      {
        id: "REQ1003",
        assetId: "AST1001",
        reportedBy: "EMP1005",
        issue: "Laptop heating issue",
        description: "The laptop heats up significantly within 10 minutes of use, causing CPU throttling.",
        requestDate: "18 May 2024 11:45 AM",
        priority: "High",
        assignedTo: "IT Support Team",
        estimatedCompletion: "22 May 2024",
        status: "In Progress",
        updates: [
          {
            date: "18 May 2024 11:45 AM",
            message: "Repair request created by Rakesh Reddy"
          },
          {
            date: "18 May 2024 02:30 PM",
            message: "Assigned to IT Support Team for investigation"
          }
        ]
      },
      {
        id: "REQ1002",
        assetId: "AST1002",
        reportedBy: "EMP1005",
        issue: "Flickering screen",
        description: "Monitor screen flickers periodically, especially when using HDMI inputs.",
        requestDate: "16 May 2024 10:00 AM",
        priority: "Medium",
        assignedTo: "IT Support Team",
        estimatedCompletion: "20 May 2024",
        status: "Pending",
        updates: [
          {
            date: "16 May 2024 10:00 AM",
            message: "Repair request created by Rakesh Reddy"
          }
        ]
      },
      {
        id: "REQ1001",
        assetId: "AST1005",
        reportedBy: "EMP1005",
        issue: "Mic not working",
        description: "Microphone is completely unresponsive during Teams calls.",
        requestDate: "12 May 2024 09:15 AM",
        priority: "High",
        assignedTo: "IT Support Team",
        estimatedCompletion: "14 May 2024",
        status: "Completed",
        updates: [
          {
            date: "12 May 2024 09:15 AM",
            message: "Repair request created by Rakesh Reddy"
          },
          {
            date: "12 May 2024 10:30 AM",
            message: "Headset tested and microphone driver issue resolved. Confirmed working."
          }
        ]
      }
    ];
    mockRepairs.forEach(mockRep => {
      if (!parsedRepairs.some(r => r.id === mockRep.id)) {
        parsedRepairs.push(mockRep);
      }
    });
    localStorage.setItem('it_repairs', JSON.stringify(parsedRepairs));
    setRepairs(parsedRepairs);

    // 4. Initialize Notifications
    let storedNotifs = localStorage.getItem('it_notifications');
    if (!storedNotifs) {
      localStorage.setItem('it_notifications', JSON.stringify(initialNotifications));
      storedNotifs = JSON.stringify(initialNotifications);
    }
    const parsedNotifs = JSON.parse(storedNotifs).map(n => ({
      ...n,
      message: n.message.replace(/Rakesh Kumar/g, 'Rakesh Reddy')
    }));
    localStorage.setItem('it_notifications', JSON.stringify(parsedNotifs));
    setNotifications(parsedNotifs);

    // 5. Initialize Activity
    let storedActivity = localStorage.getItem('it_activity');
    if (!storedActivity) {
      localStorage.setItem('it_activity', JSON.stringify(initialActivity));
      storedActivity = JSON.stringify(initialActivity);
    }
    let parsedActivity = JSON.parse(storedActivity).map(act => ({
      ...act,
      user: act.user === 'Rakesh Kumar' ? 'Rakesh Reddy' : act.user,
      details: act.details.replace(/Rakesh Kumar/g, 'Rakesh Reddy')
    }));
    const mockActivities = [
      {
        id: "ACT201",
        user: "Rakesh Reddy",
        activity: "Resolve Request",
        details: "Your request REQ1001 has been resolved.",
        ipAddress: "192.168.1.10",
        dateTime: "12 May 2024, 10:30 AM"
      },
      {
        id: "ACT202",
        user: "Rakesh Reddy",
        activity: "Assign Asset",
        details: "New asset assigned: Dell Latitude 5420 (AST1001)",
        ipAddress: "192.168.1.10",
        dateTime: "10 May 2024, 09:15 AM"
      },
      {
        id: "ACT203",
        user: "Rakesh Reddy",
        activity: "Update Repair",
        details: "Request REQ1003 is in progress.",
        ipAddress: "192.168.1.10",
        dateTime: "18 May 2024, 11:45 AM"
      }
    ];
    mockActivities.forEach(mockAct => {
      if (!parsedActivity.some(a => a.id === mockAct.id)) {
        parsedActivity.unshift(mockAct);
      }
    });
    localStorage.setItem('it_activity', JSON.stringify(parsedActivity));
    setActivity(parsedActivity);
  }, []);

  // Utility to update state and localStorage
  const saveEmployees = (data) => {
    setEmployees(data);
    localStorage.setItem('it_employees', JSON.stringify(data));
  };

  const saveAssets = (data) => {
    setAssets(data);
    localStorage.setItem('it_assets', JSON.stringify(data));
  };

  const saveRepairs = (data) => {
    setRepairs(data);
    localStorage.setItem('it_repairs', JSON.stringify(data));
  };

  const saveNotifications = (data) => {
    setNotifications(data);
    localStorage.setItem('it_notifications', JSON.stringify(data));
  };

  const saveActivity = (data) => {
    setActivity(data);
    localStorage.setItem('it_activity', JSON.stringify(data));
  };

  // Helper to add activity logs
  const logActivity = (activityName, details) => {
    const newLog = {
      id: `ACT${String(activity.length + 1).padStart(3, '0')}`,
      user: "Rakesh Reddy",
      activity: activityName,
      details: details,
      ipAddress: "192.168.1.10",
      dateTime: new Date().toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })
    };
    saveActivity([newLog, ...activity]);
  };

  // CRUD Operations

  // Assets CRUD
  const addAsset = (asset) => {
    const newAsset = {
      id: `${asset.type === "Laptop" ? "LT" : asset.type === "Monitor" ? "MN" : asset.type === "Mouse" ? "MS" : asset.type === "Keyboard" ? "KB" : asset.type === "Headset" ? "HD" : asset.type === "Printer" ? "PR" : asset.type === "Desktop" ? "DT" : "DS"}${String(assets.length + 1).padStart(4, '0')}`,
      ...asset,
      assignedTo: asset.assignedTo || null,
      status: asset.status || "Available",
      image: asset.image || "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=80&h=80&fit=crop"
    };
    saveAssets([newAsset, ...assets]);
    logActivity("Add Asset", `Added new asset ${newAsset.brand} ${newAsset.model} (${newAsset.id})`);
  };

  const updateAsset = (updatedAsset) => {
    const list = assets.map(item => item.id === updatedAsset.id ? updatedAsset : item);
    saveAssets(list);
    logActivity("Update Asset", `Updated asset details for ${updatedAsset.id}`);
  };

  const deleteAsset = (id) => {
    const list = assets.filter(item => item.id !== id);
    saveAssets(list);
    logActivity("Delete Asset", `Deleted asset ${id}`);
  };

  // Employees CRUD
  const addEmployee = (emp) => {
    const newEmp = {
      id: `EMP${String(employees.length + 1).padStart(3, '0')}`,
      ...emp,
      status: emp.status || "Active",
      avatar: emp.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces"
    };
    saveEmployees([...employees, newEmp]);
    logActivity("Add Employee", `Added new employee ${newEmp.name} (${newEmp.id})`);
  };

  const updateEmployee = (updatedEmp) => {
    const list = employees.map(item => item.id === updatedEmp.id ? updatedEmp : item);
    saveEmployees(list);
    logActivity("Update Employee", `Updated employee profile for ${updatedEmp.name}`);
    if (currentUser && currentUser.id === updatedEmp.id) {
      const merged = { ...currentUser, ...updatedEmp };
      setCurrentUser(merged);
      localStorage.setItem('it_current_user', JSON.stringify(merged));
    }
  };

  const deleteEmployee = (id) => {
    const list = employees.filter(item => item.id !== id);
    saveEmployees(list);
    logActivity("Delete Employee", `Deleted employee ${id}`);
  };

  // Assignments & Returns
  const assignAssets = (employeeId, assetIds, assignDate, returnDate, remarks) => {
    const emp = employees.find(e => e.id === employeeId);
    if (!emp) return;

    // Update assets to Assigned
    const updatedAssets = assets.map(asset => {
      if (assetIds.includes(asset.id)) {
        return {
          ...asset,
          status: "Assigned",
          assignedTo: employeeId,
          purchaseDate: asset.purchaseDate // keep original
        };
      }
      return asset;
    });
    saveAssets(updatedAssets);

    // Create Activity Logs
    assetIds.forEach(id => {
      logActivity("Assign Asset", `Assigned asset ${id} to ${emp.name} (${employeeId})`);
    });

    // Create Notification
    const newNotif = {
      id: `NT${String(notifications.length + 1).padStart(3, '0')}`,
      title: "Assets Assigned",
      message: `${assetIds.length} assets successfully assigned to ${emp.name}.`,
      time: "Just now",
      read: false,
      type: "info"
    };
    saveNotifications([newNotif, ...notifications]);
  };

  const returnAssets = (employeeId, assetIds, returnDate, returnCondition, remarks) => {
    const emp = employees.find(e => e.id === employeeId);
    if (!emp) return;

    // Update assets to Available or Under Repair
    const updatedAssets = assets.map(asset => {
      if (assetIds.includes(asset.id)) {
        const nextStatus = returnCondition === "Under Repair" || returnCondition === "Damaged" ? "Under Repair" : "Available";
        return {
          ...asset,
          status: nextStatus,
          assignedTo: null
        };
      }
      return asset;
    });
    saveAssets(updatedAssets);

    // If any item was marked as Damaged/Repair, create a Repair request
    assetIds.forEach(id => {
      const nextStatus = returnCondition === "Under Repair" || returnCondition === "Damaged" ? "Under Repair" : "Available";
      logActivity("Return Asset", `Returned asset ${id} from ${emp.name} (Condition: ${returnCondition})`);

      if (nextStatus === "Under Repair") {
        const newRepair = {
          id: `REP${String(repairs.length + 1).padStart(5, '0')}`,
          assetId: id,
          reportedBy: employeeId,
          issue: `Returned in ${returnCondition} condition. ${remarks || ''}`,
          description: `Asset returned in ${returnCondition} condition by employee. Remarks: ${remarks || 'None'}`,
          requestDate: returnDate,
          priority: "Medium",
          assignedTo: "IT Support Team",
          estimatedCompletion: "Awaiting inspection",
          status: "In Progress",
          updates: [
            {
              date: new Date().toLocaleString(),
              message: `Repair request generated on return by ${emp.name}.`
            }
          ]
        };
        saveRepairs([newRepair, ...repairs]);
        logActivity("Create Repair", `Generated repair request ${newRepair.id} for returned asset ${id}`);
      }
    });

    // Create Notification
    const newNotif = {
      id: `NT${String(notifications.length + 1).padStart(3, '0')}`,
      title: "Assets Returned",
      message: `${assetIds.length} assets successfully returned by ${emp.name}.`,
      time: "Just now",
      read: false,
      type: "success"
    };
    saveNotifications([newNotif, ...notifications]);
  };

  // Repairs Operations
  const addRepair = (repair) => {
    const newRepair = {
      id: `REP${String(repairs.length + 1).padStart(5, '0')}`,
      ...repair,
      requestDate: new Date().toLocaleDateString(),
      status: "In Progress",
      updates: [
        {
          date: new Date().toLocaleString(),
          message: "Repair request created."
        }
      ]
    };
    saveRepairs([newRepair, ...repairs]);

    // Update asset status to Under Repair
    const updatedAssets = assets.map(a => a.id === repair.assetId ? { ...a, status: "Under Repair" } : a);
    saveAssets(updatedAssets);

    logActivity("Create Repair", `Created repair request ${newRepair.id} for asset ${repair.assetId}`);
  };

  const addRepairUpdate = (repairId, status, message) => {
    const repair = repairs.find(r => r.id === repairId);
    if (!repair) return;

    const updatedRepairs = repairs.map(r => {
      if (r.id === repairId) {
        return {
          ...r,
          status: status,
          updates: [
            ...r.updates,
            {
              date: new Date().toLocaleString(),
              message: message
            }
          ]
        };
      }
      return r;
    });
    saveRepairs(updatedRepairs);

    // If completed or cancelled, make asset available again
    if (status === "Completed") {
      const updatedAssets = assets.map(a => a.id === repair.assetId ? { ...a, status: "Available" } : a);
      saveAssets(updatedAssets);
      logActivity("Resolve Repair", `Resolved repair request ${repairId} for asset ${repair.assetId}`);
    } else if (status === "Cancelled") {
      const updatedAssets = assets.map(a => a.id === repair.assetId ? { ...a, status: "Available" } : a);
      saveAssets(updatedAssets);
      logActivity("Cancel Repair", `Cancelled repair request ${repairId}`);
    } else {
      logActivity("Update Repair", `Updated repair status of ${repairId} to ${status}`);
    }
  };

  const loginUser = (username, password, role) => {
    if (role === 'Admin') {
      if (username === 'rakesh.reddy' && password === 'admin123') {
        const adminSession = {
          id: "EMP001",
          name: "Rakesh Reddy",
          role: "Admin",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
          email: "rakesh.reddy@company.com",
          phone: "+91 98765 43210",
          department: "IT",
          designation: "Administrator",
          location: "Hyderabad, India",
          joiningDate: "01 Jan 2024"
        };
        setCurrentUser(adminSession);
        localStorage.setItem('it_current_user', JSON.stringify(adminSession));
        return { success: true, user: adminSession };
      }
      return { success: false, message: "Invalid admin credentials (rakesh.reddy / admin123)." };
    } else {
      const emp = employees.find(e => e.username === username);
      if (emp) {
        const employeeSession = {
          ...emp,
          role: "Employee"
        };
        setCurrentUser(employeeSession);
        localStorage.setItem('it_current_user', JSON.stringify(employeeSession));
        return { success: true, user: employeeSession };
      }
      return { success: false, message: "Invalid employee username (e.g. rakesh.reddy)." };
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('it_current_user');
  };

  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Automatically clear toast notifications after 4s timeout
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <AssetContext.Provider value={{
      employees,
      assets,
      repairs,
      notifications,
      activity,
      currentUser,
      loginUser,
      logoutUser,
      addAsset,
      updateAsset,
      deleteAsset,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      assignAssets,
      returnAssets,
      addRepair,
      addRepairUpdate,
      logActivity,
      toast,
      showToast
    }}>
      {children}
    </AssetContext.Provider>
  );
};
