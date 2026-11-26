export const SITE = {
  name: "Vasudha Skin & Hair Clinic",
  fullName: "Vasudha Skin and Hair Clinic",
  descriptor: "Dermatology Clinic in Visakhapatnam",
  addressLines: [
    "#19-13-39/2, Lalitha Nilayam, 60 Feet Road",
    "Opp: Sarvani Sweets, Muralinagar",
    "Visakhapatnam - 530007",
  ],
  addressOneLine:
    "#19-13-39/2, Lalitha Nilayam, 60 Feet Road, Opp: Sarvani Sweets, Muralinagar, Visakhapatnam - 530007",
  phoneDisplay: "+91 78427 37710",
  phoneHref: "tel:+917842737710",
  whatsapp:
    "https://wa.me/917842737710?text=Hello%20Vasudha%20Skin%20%26%20Hair%20Clinic%2C%20I%20would%20like%20to%20book%20an%20appointment.",
  email: "vasudhaskinclinic@gmail.com",
  instagram: "https://www.instagram.com/vasudha_skin_and_hair_clinic",
  facebook: "https://www.facebook.com/p/Vasudha-Skin-and-Hair-clinic-61582451735640/",
  mapsLink: "https://share.google/NPgGrU7A1guC9Wydy",
  mapsEmbed: "https://maps.google.com/maps?q=17.7481451,83.2599816&z=17&output=embed",
  hoursLine: "Consultation Hours: 11:00 AM to 2:00 PM and 5:30 PM to 8:30 PM",
};

import { Sparkles, Scissors, Stethoscope } from "lucide-react";

export const SESSIONS = ["Morning: 11:00 AM to 2:00 PM", "Evening: 5:30 PM to 8:30 PM"];

export const EXPERTISE_CATEGORIES = [
  {
    icon: Stethoscope,
    title: "Medical Dermatology",
    items: [
      { name: "Acne & Rosacea Care", desc: "Medical treatment for active acne, breakouts and facial redness to calm and clear your skin.", img: "https://images.pexels.com/photos/5701545/pexels-photo-5701545.jpeg?auto=compress&cs=tinysrgb&w=800" },
      { name: "Eczema & Allergy Management", desc: "Lasting relief for eczema, rashes and skin allergies with care plans made for your skin.", img: "https://images.pexels.com/photos/7446672/pexels-photo-7446672.jpeg?auto=compress&cs=tinysrgb&w=800" },
      { name: "Vitiligo & Pigment Disorders", desc: "Careful diagnosis and treatment for vitiligo and uneven skin pigmentation.", img: "https://images.pexels.com/photos/41057961/pexels-photo-41057961.jpeg?auto=compress&cs=tinysrgb&w=800" },
      { name: "Mole & Skin Screening", desc: "Full-body mole checks and early skin-cancer screening for complete peace of mind.", img: "https://images.pexels.com/photos/7446661/pexels-photo-7446661.jpeg?auto=compress&cs=tinysrgb&w=800" },
      { name: "Nail & Fungal Disorders", desc: "Treatment for nail fungus, infections and nail changes caused by skin conditions.", img: "https://images.pexels.com/photos/3738377/pexels-photo-3738377.jpeg?auto=compress&cs=tinysrgb&w=800" },
      { name: "Pediatric Dermatology", desc: "Gentle, child-friendly care for common baby and childhood skin concerns.", img: "https://images.pexels.com/photos/8460035/pexels-photo-8460035.jpeg?auto=compress&cs=tinysrgb&w=800" },
    ],
  },
  {
    icon: Sparkles,
    title: "Cosmetic Dermatology",
    items: [
      { name: "Anti-Wrinkle Injectables", desc: "Safe injectables that soften fine lines and wrinkles for a naturally rested look.", img: "https://images.pexels.com/photos/7581590/pexels-photo-7581590.jpeg?auto=compress&cs=tinysrgb&w=800" },
      { name: "Medical-Grade Peels", desc: "Professional peels that brighten dull skin, fade marks and smooth rough texture.", img: "https://images.pexels.com/photos/10600175/pexels-photo-10600175.jpeg?auto=compress&cs=tinysrgb&w=800" },
      { name: "Microneedling", desc: "Collagen-boosting micro-treatment that improves skin texture, scars and open pores.", img: "https://images.pexels.com/photos/36338411/pexels-photo-36338411.jpeg?auto=compress&cs=tinysrgb&w=800" },
      { name: "HydraFacial & Medi-Facials", desc: "Deep-cleansing, hydrating facials for an instant healthy glow with no downtime.", img: "https://images.pexels.com/photos/5069589/pexels-photo-5069589.jpeg?auto=compress&cs=tinysrgb&w=800" },
    ],
  },
  {
    icon: Scissors,
    title: "Hair & Scalp",
    items: [
      { name: "Hair Loss Consultation", desc: "A thorough diagnosis of your hair loss to find the cause before treating it.", img: "https://images.pexels.com/photos/4586740/pexels-photo-4586740.jpeg?auto=compress&cs=tinysrgb&w=800" },
      { name: "PRP Hair Therapy", desc: "Growth-factor therapy using your own blood to strengthen and regrow thinning hair.", img: "https://images.pexels.com/photos/38595833/pexels-photo-38595833.jpeg?auto=compress&cs=tinysrgb&w=800" },
      { name: "Alopecia Areata Care", desc: "Medical care for patchy hair loss that calms the immune attack and supports regrowth.", img: "https://images.pexels.com/photos/9771340/pexels-photo-9771340.jpeg?auto=compress&cs=tinysrgb&w=800" },
      { name: "Scalp Disorders", desc: "Effective treatment for dandruff, psoriasis, itching and other stubborn scalp conditions.", img: "https://images.pexels.com/photos/40594081/pexels-photo-40594081.jpeg?auto=compress&cs=tinysrgb&w=800" },
    ],
  },
];

export const DOCTOR = {
  name: "Dr. Vasudha Varada",
  designation: "Consultant Dermatologist & Cosmetologist",
  degrees: "M.B.B.S., M.D. (Dermatology)",
  regdNo: "81341",
  photo: "/assets/dr-vasudha.jpg",
};

export const IMG = {
  hero: "https://images.pexels.com/photos/7108396/pexels-photo-7108396.jpeg?auto=compress&cs=tinysrgb&w=1400",
  aboutPreview:
    "https://images.unsplash.com/photo-1762625570087-6d98fca29531?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200&auto=format&fit=crop",
};

export const MARQUEE_ITEMS = [
  "Acne & Pimple Care",
  "Hair Fall Treatments",
  "Chemical Peels",
  "Anti-Ageing",
  "PRP & GFC Hair Therapy",
  "Pigmentation Correction",
  "Skin Allergy Care",
];
