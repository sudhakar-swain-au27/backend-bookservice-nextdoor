import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./src/config/db.config.js";
import Business from "./src/models/business.model.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const demoBusinesses = [
  {
    businessName: "Glow Beauty Salon",
    email: "glowbeauty@example.com",
    password: "Password1",
    ownerName: "Nina Kapoor",
    phone: "+919876543210",
    category: "Salon",
    address: "12 Aura Street, South Delhi",
    city: "Delhi",
    mapLocation: "https://www.google.com/maps?q=28.6139,77.2090",
    description:
      "Glow Beauty Salon offers premium salon and spa services for hair, skin, and bridal beauty in a relaxing atmosphere.",
    openingTime: "09:00",
    closingTime: "21:00",
    closedDays: "Monday",
    logo: "https://via.placeholder.com/120x120?text=Glow",
    banner: "https://via.placeholder.com/1200x400?text=Glow+Beauty+Salon",
    gallery: [
      "https://via.placeholder.com/600x400?text=Glow+Gallery+1",
      "https://via.placeholder.com/600x400?text=Glow+Gallery+2",
      "https://via.placeholder.com/600x400?text=Glow+Gallery+3",
    ],
    services: [
      {
        serviceName: "Keratin Hair Treatment",
        description: "Smooth and frizz-free hair with our professional keratin therapy.",
        price: 1299,
        duration: "90 mins",
        category: "Hair",
        image: "https://via.placeholder.com/400x300?text=Keratin",
        slots: ["10:00", "13:00", "16:00"],
      },
      {
        serviceName: "Bridal Makeup",
        description: "Full bridal makeup with premium products and photogenic finish.",
        price: 4999,
        duration: "180 mins",
        category: "Makeup",
        image: "https://via.placeholder.com/400x300?text=Bridal",
        slots: ["11:00", "15:00"],
      },
    ],
    offers: ["20% off first appointment", "Free hair spa with haircut"],
    professionals: [
      {
        name: "Aisha Sharma",
        speciality: "Senior Makeup Artist",
        photo: "https://via.placeholder.com/200x200?text=Aisha",
      },
      {
        name: "Priya Sen",
        speciality: "Hair Stylist",
        photo: "https://via.placeholder.com/200x200?text=Priya",
      },
    ],
    isProfileComplete: true,
  },
  {
    businessName: "Pulse Fitness Studio",
    email: "pulsefitness@example.com",
    password: "Password1",
    ownerName: "Aman Verma",
    phone: "+919812345678",
    category: "Gym",
    address: "45 Health Avenue, Pune",
    city: "Pune",
    mapLocation: "https://www.google.com/maps?q=18.5204,73.8567",
    description:
      "Pulse Fitness Studio is a modern gym with personal training, group workouts, and nutrition coaching.",
    openingTime: "06:00",
    closingTime: "22:00",
    closedDays: "Sunday",
    logo: "https://via.placeholder.com/120x120?text=Pulse",
    banner: "https://via.placeholder.com/1200x400?text=Pulse+Fitness+Studio",
    gallery: [
      "https://via.placeholder.com/600x400?text=Fitness+1",
      "https://via.placeholder.com/600x400?text=Fitness+2",
      "https://via.placeholder.com/600x400?text=Fitness+3",
    ],
    services: [
      {
        serviceName: "Personal Training",
        description: "Customized workout plans and one-on-one coaching.",
        price: 1999,
        duration: "60 mins",
        category: "Training",
        image: "https://via.placeholder.com/400x300?text=Training",
        slots: ["07:00", "08:00", "18:00"],
      },
      {
        serviceName: "Yoga Classes",
        description: "Hatha and Vinyasa yoga sessions for all levels.",
        price: 799,
        duration: "75 mins",
        category: "Yoga",
        image: "https://via.placeholder.com/400x300?text=Yoga",
        slots: ["09:00", "17:00"],
      },
    ],
    offers: ["Buy 5 sessions, get 1 free", "Free body assessment"],
    professionals: [
      {
        name: "Riya Nair",
        speciality: "Fitness Coach",
        photo: "https://via.placeholder.com/200x200?text=Riya",
      },
      {
        name: "Sarvesh Patel",
        speciality: "Yoga Instructor",
        photo: "https://via.placeholder.com/200x200?text=Sarvesh",
      },
    ],
    isProfileComplete: true,
  },
  {
    businessName: "Calm Mind Clinic",
    email: "calmmind@example.com",
    password: "Password1",
    ownerName: "Dr. Priyanka Roy",
    phone: "+919701234567",
    category: "Clinic",
    address: "22 Wellness Road, Kolkata",
    city: "Kolkata",
    mapLocation: "https://www.google.com/maps?q=22.5726,88.3639",
    description:
      "Calm Mind Clinic provides counseling, therapy, and mental wellness services with experienced professionals.",
    openingTime: "10:00",
    closingTime: "19:00",
    closedDays: "Tuesday",
    logo: "https://via.placeholder.com/120x120?text=Calm",
    banner: "https://via.placeholder.com/1200x400?text=Calm+Mind+Clinic",
    gallery: [
      "https://via.placeholder.com/600x400?text=Clinic+1",
      "https://via.placeholder.com/600x400?text=Clinic+2",
      "https://via.placeholder.com/600x400?text=Clinic+3",
    ],
    services: [
      {
        serviceName: "Therapy Consultation",
        description: "One-on-one therapy sessions for anxiety, stress, and life coaching.",
        price: 1499,
        duration: "60 mins",
        category: "Counseling",
        image: "https://via.placeholder.com/400x300?text=Therapy",
        slots: ["10:00", "13:00", "16:00"],
      },
      {
        serviceName: "Couples Counseling",
        description: "Relationship and couple therapy with a compassionate approach.",
        price: 2299,
        duration: "90 mins",
        category: "Counseling",
        image: "https://via.placeholder.com/400x300?text=Couples",
        slots: ["11:00", "15:00"],
      },
    ],
    offers: ["First session discount 15%", "Free follow-up chat"],
    professionals: [
      {
        name: "Dr. Priyanka Roy",
        speciality: "Clinical Psychologist",
        photo: "https://via.placeholder.com/200x200?text=Priyanka",
      },
      {
        name: "Anushka Bose",
        speciality: "Counselor",
        photo: "https://via.placeholder.com/200x200?text=Anushka",
      },
    ],
    isProfileComplete: true,
  },
  {
    businessName: "Savor Bistro",
    email: "savorbistro@example.com",
    password: "Password1",
    ownerName: "Rahul Mehta",
    phone: "+919876123450",
    category: "Restaurant",
    address: "78 Flavor Lane, Mumbai",
    city: "Mumbai",
    mapLocation: "https://www.google.com/maps?q=19.0760,72.8777",
    description:
      "Savor Bistro serves modern Indian cuisine with handcrafted meals and a welcoming dining experience.",
    openingTime: "11:00",
    closingTime: "23:00",
    closedDays: "Wednesday",
    logo: "https://via.placeholder.com/120x120?text=Savor",
    banner: "https://via.placeholder.com/1200x400?text=Savor+Bistro",
    gallery: [
      "https://via.placeholder.com/600x400?text=Restaurant+1",
      "https://via.placeholder.com/600x400?text=Restaurant+2",
      "https://via.placeholder.com/600x400?text=Restaurant+3",
    ],
    services: [
      {
        serviceName: "Chef's Special Dinner",
        description: "Multi-course dinner curated by our head chef.",
        price: 899,
        duration: "120 mins",
        category: "Dining",
        image: "https://via.placeholder.com/400x300?text=Dinner",
        slots: ["18:00", "20:00"],
      },
      {
        serviceName: "Weekend Brunch",
        description: "Delicious brunch menu for families and groups.",
        price: 599,
        duration: "90 mins",
        category: "Dining",
        image: "https://via.placeholder.com/400x300?text=Brunch",
        slots: ["11:30", "13:30"],
      },
    ],
    offers: ["10% off for online bookings", "Free dessert on orders above ₹1200"],
    professionals: [
      {
        name: "Chef Anil Kumar",
        speciality: "Head Chef",
        photo: "https://via.placeholder.com/200x200?text=Anil",
      },
      {
        name: "Mansi Joshi",
        speciality: "Restaurant Manager",
        photo: "https://via.placeholder.com/200x200?text=Mansi",
      },
    ],
    isProfileComplete: true,
  },
  {
    businessName: "EduSpark Tutors",
    email: "eduspark@example.com",
    password: "Password1",
    ownerName: "Sapna Sharma",
    phone: "+919711223344",
    category: "Tutors",
    address: "16 Scholar Street, Bengaluru",
    city: "Bengaluru",
    mapLocation: "https://www.google.com/maps?q=12.9716,77.5946",
    description:
      "EduSpark Tutors offers personalized tutoring for school and competitive exams with expert instructors.",
    openingTime: "08:00",
    closingTime: "20:00",
    closedDays: "Sunday",
    logo: "https://via.placeholder.com/120x120?text=EduSpark",
    banner: "https://via.placeholder.com/1200x400?text=EduSpark+Tutors",
    gallery: [
      "https://via.placeholder.com/600x400?text=Tutor+1",
      "https://via.placeholder.com/600x400?text=Tutor+2",
      "https://via.placeholder.com/600x400?text=Tutor+3",
    ],
    services: [
      {
        serviceName: "Math Mastery",
        description: "One-on-one math tutoring for grades 6-12.",
        price: 999,
        duration: "60 mins",
        category: "Academics",
        image: "https://via.placeholder.com/400x300?text=Math",
        slots: ["10:00", "14:00", "17:00"],
      },
      {
        serviceName: "Exam Prep Coaching",
        description: "Strategic coaching for board and entrance exams.",
        price: 1499,
        duration: "90 mins",
        category: "Coaching",
        image: "https://via.placeholder.com/400x300?text=Exam+Prep",
        slots: ["09:00", "16:00"],
      },
    ],
    offers: ["Free trial class", "10% off first 3 sessions"],
    professionals: [
      {
        name: "Rohit Singh",
        speciality: "Math Tutor",
        photo: "https://via.placeholder.com/200x200?text=Rohit",
      },
      {
        name: "Neha Gupta",
        speciality: "Exam Coach",
        photo: "https://via.placeholder.com/200x200?text=Neha",
      },
    ],
    isProfileComplete: true,
  },
  {
    businessName: "PetCare Hub",
    email: "petcarehub@example.com",
    password: "Password1",
    ownerName: "Deepa Rao",
    phone: "+919887766554",
    category: "Pet Care",
    address: "3 Paws Lane, Hyderabad",
    city: "Hyderabad",
    mapLocation: "https://www.google.com/maps?q=17.3850,78.4867",
    description:
      "PetCare Hub offers grooming, boarding, and health check services for pets with loving care.",
    openingTime: "09:00",
    closingTime: "20:00",
    closedDays: "Tuesday",
    logo: "https://via.placeholder.com/120x120?text=PetCare",
    banner: "https://via.placeholder.com/1200x400?text=PetCare+Hub",
    gallery: [
      "https://via.placeholder.com/600x400?text=Pet+Care+1",
      "https://via.placeholder.com/600x400?text=Pet+Care+2",
      "https://via.placeholder.com/600x400?text=Pet+Care+3",
    ],
    services: [
      {
        serviceName: "Pet Grooming",
        description: "Full grooming for dogs and cats with premium products.",
        price: 899,
        duration: "75 mins",
        category: "Grooming",
        image: "https://via.placeholder.com/400x300?text=Grooming",
        slots: ["10:00", "14:00", "18:00"],
      },
      {
        serviceName: "Pet Boarding",
        description: "Safe boarding spaces for pets while you travel.",
        price: 1299,
        duration: "24 hours",
        category: "Boarding",
        image: "https://via.placeholder.com/400x300?text=Boarding",
        slots: ["Anytime"],
      },
    ],
    offers: ["Free nail trim with grooming", "10% off on first boarding"],
    professionals: [
      {
        name: "Nikhil Bhatia",
        speciality: "Pet Groomer",
        photo: "https://via.placeholder.com/200x200?text=Nikhil",
      },
      {
        name: "Simran Kaur",
        speciality: "Pet Care Specialist",
        photo: "https://via.placeholder.com/200x200?text=Simran",
      },
    ],
    isProfileComplete: true,
  },
  {
    businessName: "SnapShots Photography",
    email: "snapshots@example.com",
    password: "Password1",
    ownerName: "Karan Mehra",
    phone: "+919900112233",
    category: "Photography",
    address: "99 Frame Street, Ahmedabad",
    city: "Ahmedabad",
    mapLocation: "https://www.google.com/maps?q=23.0225,72.5714",
    description:
      "SnapShots Photography captures weddings, events, and portraits with creativity and precision.",
    openingTime: "10:00",
    closingTime: "20:00",
    closedDays: "Thursday",
    logo: "https://via.placeholder.com/120x120?text=SnapShots",
    banner: "https://via.placeholder.com/1200x400?text=SnapShots+Photography",
    gallery: [
      "https://via.placeholder.com/600x400?text=Photo+1",
      "https://via.placeholder.com/600x400?text=Photo+2",
      "https://via.placeholder.com/600x400?text=Photo+3",
    ],
    services: [
      {
        serviceName: "Wedding Photography",
        description: "Elegant wedding coverage for ceremonies and receptions.",
        price: 9999,
        duration: "8 hours",
        category: "Events",
        image: "https://via.placeholder.com/400x300?text=Wedding",
        slots: ["Bookings available"],
      },
      {
        serviceName: "Portrait Session",
        description: "Indoor and outdoor portrait sessions for individuals and families.",
        price: 2499,
        duration: "90 mins",
        category: "Portrait",
        image: "https://via.placeholder.com/400x300?text=Portrait",
        slots: ["11:00", "14:00", "16:00"],
      },
    ],
    offers: ["Free photo wall with wedding package", "20% off portrait sessions"],
    professionals: [
      {
        name: "Maya Singh",
        speciality: "Lead Photographer",
        photo: "https://via.placeholder.com/200x200?text=Maya",
      },
      {
        name: "Rajat Kapoor",
        speciality: "Wedding Photographer",
        photo: "https://via.placeholder.com/200x200?text=Rajat",
      },
    ],
    isProfileComplete: true,
  },
  {
    businessName: "Urban Spa Retreat",
    email: "urbanspa@example.com",
    password: "Password1",
    ownerName: "Shweta Nanda",
    phone: "+919911223344",
    category: "Spa",
    address: "55 Relax Avenue, Chennai",
    city: "Chennai",
    mapLocation: "https://www.google.com/maps?q=13.0827,80.2707",
    description:
      "Urban Spa Retreat delivers premium spa treatments, massages, and wellness therapies.",
    openingTime: "09:00",
    closingTime: "22:00",
    closedDays: "Monday",
    logo: "https://via.placeholder.com/120x120?text=Urban+Spa",
    banner: "https://via.placeholder.com/1200x400?text=Urban+Spa+Retreat",
    gallery: [
      "https://via.placeholder.com/600x400?text=Spa+1",
      "https://via.placeholder.com/600x400?text=Spa+2",
      "https://via.placeholder.com/600x400?text=Spa+3",
    ],
    services: [
      {
        serviceName: "Aromatherapy Massage",
        description: "Relaxing massage with essential oils for complete rejuvenation.",
        price: 2199,
        duration: "75 mins",
        category: "Massage",
        image: "https://via.placeholder.com/400x300?text=Massage",
        slots: ["10:00", "13:00", "17:00"],
      },
      {
        serviceName: "Facial Treatment",
        description: "Deep cleansing facial for glowing skin.",
        price: 1299,
        duration: "60 mins",
        category: "Facial",
        image: "https://via.placeholder.com/400x300?text=Facial",
        slots: ["11:00", "15:00"],
      },
    ],
    offers: ["Buy 2 treatments, get 1 free", "Complimentary herbal tea"],
    professionals: [
      {
        name: "Nisha Rao",
        speciality: "Spa Therapist",
        photo: "https://via.placeholder.com/200x200?text=Nisha",
      },
      {
        name: "Arjun Iyer",
        speciality: "Massage Specialist",
        photo: "https://via.placeholder.com/200x200?text=Arjun",
      },
    ],
    isProfileComplete: true,
  },
  {
    businessName: "CleanRide Car Care",
    email: "cleanride@example.com",
    password: "Password1",
    ownerName: "Vivek Sharma",
    phone: "+919700334455",
    category: "Auto Care",
    address: "88 Drive Street, Gurgaon",
    city: "Gurgaon",
    mapLocation: "https://www.google.com/maps?q=28.4595,77.0266",
    description:
      "CleanRide Car Care provides premium cleaning, detailing, and servicing for vehicles.",
    openingTime: "08:00",
    closingTime: "20:00",
    closedDays: "Sunday",
    logo: "https://via.placeholder.com/120x120?text=CleanRide",
    banner: "https://via.placeholder.com/1200x400?text=CleanRide+Car+Care",
    gallery: [
      "https://via.placeholder.com/600x400?text=Car+Care+1",
      "https://via.placeholder.com/600x400?text=Car+Care+2",
      "https://via.placeholder.com/600x400?text=Car+Care+3",
    ],
    services: [
      {
        serviceName: "Exterior Detailing",
        description: "Complete exterior polish, waxing, and protection.",
        price: 1599,
        duration: "120 mins",
        category: "Detailing",
        image: "https://via.placeholder.com/400x300?text=Detailing",
        slots: ["09:00", "14:00", "17:00"],
      },
      {
        serviceName: "Interior Deep Clean",
        description: "Vacuum and steam cleaning for a fresh cabin experience.",
        price: 1299,
        duration: "90 mins",
        category: "Cleaning",
        image: "https://via.placeholder.com/400x300?text=Interior",
        slots: ["10:00", "15:00"],
      },
    ],
    offers: ["Free air freshener with every wash", "10% off on detailing"],
    professionals: [
      {
        name: "Sahil Sharma",
        speciality: "Detailing Expert",
        photo: "https://via.placeholder.com/200x200?text=Sahil",
      },
      {
        name: "Ritu Malhotra",
        speciality: "Car Care Specialist",
        photo: "https://via.placeholder.com/200x200?text=Ritu",
      },
    ],
    isProfileComplete: true,
  },
  {
    businessName: "Garden Fresh Florals",
    email: "gardenfresh@example.com",
    password: "Password1",
    ownerName: "Meera Joshi",
    phone: "+919812009877",
    category: "Florist",
    address: "10 Blossom Road, Jaipur",
    city: "Jaipur",
    mapLocation: "https://www.google.com/maps?q=26.9124,75.7873",
    description:
      "Garden Fresh Florals offers handmade bouquets, floral decorations, and event flower designs.",
    openingTime: "09:00",
    closingTime: "19:00",
    closedDays: "Wednesday",
    logo: "https://via.placeholder.com/120x120?text=Garden+Fresh",
    banner: "https://via.placeholder.com/1200x400?text=Garden+Fresh+Florals",
    gallery: [
      "https://via.placeholder.com/600x400?text=Florals+1",
      "https://via.placeholder.com/600x400?text=Florals+2",
      "https://via.placeholder.com/600x400?text=Florals+3",
    ],
    services: [
      {
        serviceName: "Custom Bouquet",
        description: "Beautiful seasonal bouquets crafted to order.",
        price: 799,
        duration: "45 mins",
        category: "Bouquet",
        image: "https://via.placeholder.com/400x300?text=Bouquet",
        slots: ["10:00", "14:00", "17:00"],
      },
      {
        serviceName: "Event Florals",
        description: "Decorative flower services for weddings and special events.",
        price: 3499,
        duration: "120 mins",
        category: "Event",
        image: "https://via.placeholder.com/400x300?text=Event+Florals",
        slots: ["Bookings available"],
      },
    ],
    offers: ["Free vase with first order", "10% off same-day delivery"],
    professionals: [
      {
        name: "Nidhi Agarwal",
        speciality: "Florist",
        photo: "https://via.placeholder.com/200x200?text=Nidhi",
      },
      {
        name: "Pooja Shah",
        speciality: "Event Decor Specialist",
        photo: "https://via.placeholder.com/200x200?text=Pooja",
      },
    ],
    isProfileComplete: true,
  },
  {
    businessName: "Urban Eats Kitchen",
    email: "urbaneats@example.com",
    password: "Password1",
    ownerName: "Arjun Khanna",
    phone: "+919989887766",
    category: "Restaurant",
    address: "31 Food Street, Kolkata",
    city: "Kolkata",
    mapLocation: "https://www.google.com/maps?q=22.5726,88.3639",
    description:
      "Urban Eats Kitchen delivers comfort foods, quick meals, and chef-designed specials for busy customers.",
    openingTime: "10:00",
    closingTime: "23:00",
    closedDays: "Monday",
    logo: "https://via.placeholder.com/120x120?text=Urban+Eats",
    banner: "https://via.placeholder.com/1200x400?text=Urban+Eats+Kitchen",
    gallery: [
      "https://via.placeholder.com/600x400?text=Urban+Eats+1",
      "https://via.placeholder.com/600x400?text=Urban+Eats+2",
      "https://via.placeholder.com/600x400?text=Urban+Eats+3",
    ],
    services: [
      {
        serviceName: "Quick Meal Combo",
        description: "Satisfying meal combos served fast for lunch and dinner.",
        price: 499,
        duration: "45 mins",
        category: "Meals",
        image: "https://via.placeholder.com/400x300?text=Meal",
        slots: ["12:00", "13:30", "20:00"],
      },
      {
        serviceName: "Dessert Platter",
        description: "Delicious dessert platter for sharing.",
        price: 499,
        duration: "30 mins",
        category: "Dessert",
        image: "https://via.placeholder.com/400x300?text=Dessert",
        slots: ["17:00", "19:00"],
      },
    ],
    offers: ["Free soft drink with combo", "Buy 2 desserts, get 1 free"],
    professionals: [
      {
        name: "Vikram Dutta",
        speciality: "Chef",
        photo: "https://via.placeholder.com/200x200?text=Vikram",
      },
      {
        name: "Sana Khan",
        speciality: "Kitchen Manager",
        photo: "https://via.placeholder.com/200x200?text=Sana",
      },
    ],
    isProfileComplete: true,
  },
  {
    businessName: "Zen Yoga Studio",
    email: "zenyoga@example.com",
    password: "Password1",
    ownerName: "Kajal Reddy",
    phone: "+919988776655",
    category: "Yoga",
    address: "8 Serenity Lane, Chennai",
    city: "Chennai",
    mapLocation: "https://www.google.com/maps?q=13.0827,80.2707",
    description:
      "Zen Yoga Studio offers guided yoga classes, meditation sessions, and wellness workshops.",
    openingTime: "06:30",
    closingTime: "19:30",
    closedDays: "Saturday",
    logo: "https://via.placeholder.com/120x120?text=Zen+Yoga",
    banner: "https://via.placeholder.com/1200x400?text=Zen+Yoga+Studio",
    gallery: [
      "https://via.placeholder.com/600x400?text=Yoga+1",
      "https://via.placeholder.com/600x400?text=Yoga+2",
      "https://via.placeholder.com/600x400?text=Yoga+3",
    ],
    services: [
      {
        serviceName: "Morning Yoga",
        description: "Vinyasa and Hatha flow to energize your day.",
        price: 799,
        duration: "60 mins",
        category: "Yoga",
        image: "https://via.placeholder.com/400x300?text=Morning+Yoga",
        slots: ["06:30", "08:00"],
      },
      {
        serviceName: "Meditation Session",
        description: "Relaxing guided meditation for stress relief.",
        price: 599,
        duration: "45 mins",
        category: "Meditation",
        image: "https://via.placeholder.com/400x300?text=Meditation",
        slots: ["10:00", "18:00"],
      },
    ],
    offers: ["First session free", "Discount on monthly membership"],
    professionals: [
      {
        name: "Kajal Reddy",
        speciality: "Yoga Instructor",
        photo: "https://via.placeholder.com/200x200?text=Kajal",
      },
      {
        name: "Rahul Nair",
        speciality: "Meditation Coach",
        photo: "https://via.placeholder.com/200x200?text=Rahul",
      },
    ],
    isProfileComplete: true,
  },
];

const seedBusinesses = async () => {
  try {
    await connectDB();
    const emails = demoBusinesses.map((business) => business.email);

    console.log("Removing any existing demo businesses...");
    await Business.deleteMany({ email: { $in: emails } });

    console.log("Seeding demo businesses...");
    for (const businessData of demoBusinesses) {
      await Business.create(businessData);
    }

    console.log("✅ Seed complete. 10 demo businesses created.");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
};

seedBusinesses();
