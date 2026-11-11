const SENDER = {
  name: 'Shivay',
  agency: 'FormiqStudio',
  city: 'Durgapur',
  phone: '+91 98320 78313',
};

const SEGMENTS = {
  no_website: {
    label: 'No website',
    asset: { en: 'homepage design', bn: 'homepage design' },
    first: {
      en: `Hi {name} team 👋 I'm {sender} from {agency}, {senderCity}. Found you on Google Maps{social} but there's no website, so customers who search online can't see your services or prices. We build a 5-page website with WhatsApp enquiry in 15 days, hosting free for 1 year. Can I send a free homepage design made for {name}? No charge, no obligation.`,
      bn: `নমস্কার {name} 🙏 আমি {sender}, {agency} ({senderCity}) থেকে। Google Maps-এ আপনাদের দেখলাম{social}, কিন্তু কোনো website নেই। তাই online-এ খোঁজা customer-রা আপনাদের service বা price দেখতে পাচ্ছে না। আমরা ১৫ দিনে WhatsApp enquiry সহ ৫ পেজের website বানাই, ১ বছর hosting free। {name}-এর জন্য একটা free homepage design পাঠাতে পারি? কোনো charge নেই।`,
    },
  },
  reputation: {
    label: 'Low rating',
    asset: { en: 'Google profile audit', bn: 'Google profile audit' },
    first: {
      en: `Hi {name} 👋 {sender} from {agency}, {senderCity}. Your Google rating is {rating}★ with {reviews} reviews. Customers compare 2-3 options on Maps before calling, so this is costing you enquiries every week. We fix it with a review collection system (QR at the counter + WhatsApp follow-up), profile optimisation and replies to old reviews. Most clients cross 4.3★ within 60 days. Want a free 5-minute audit of your profile?`,
      bn: `নমস্কার {name} 🙏 আমি {sender}, {agency} ({senderCity}) থেকে। আপনাদের Google rating {rating}★ ({reviews} reviews)। Customer-রা call করার আগে Maps-এ ২-৩টা দোকান compare করে, তাই প্রতি সপ্তাহে enquiry হারাচ্ছেন। আমরা review collection system (counter-এ QR + WhatsApp follow-up), profile optimisation আর পুরনো review-এর reply দিয়ে এটা ঠিক করি। বেশিরভাগ client ৬০ দিনে 4.3★ পার করে। আপনার profile-এর একটা free ৫ মিনিটের audit পাঠাবো?`,
    },
  },
  booking: {
    label: 'Booking vertical',
    asset: { en: 'booking assistant demo', bn: 'booking assistant demo' },
    first: {
      en: `Hi {name} 👋 {sender} from {agency}, {senderCity}. Quick question: how many calls do you miss after hours or when staff is busy? We set up an AI booking assistant on WhatsApp that replies to customers 24/7, books appointments and sends reminders. ₹3,000-5,000/month, live in 7 days. Can I send a 1-minute demo made for {name}?`,
      bn: `নমস্কার {name} 🙏 আমি {sender}, {agency} ({senderCity}) থেকে। একটা প্রশ্ন: দোকান বন্ধ থাকলে বা staff busy থাকলে কতগুলো call miss হয়? আমরা WhatsApp-এ একটা AI booking assistant বসাই যেটা ২৪ ঘণ্টা customer-কে reply দেয়, appointment book করে আর reminder পাঠায়। মাসে ₹৩,০০০-৫,০০০, ৭ দিনে চালু। {name}-এর জন্য বানানো ১ মিনিটের demo পাঠাতে পারি?`,
    },
  },
  growth: {
    label: 'Growth plan',
    asset: { en: 'ads plan', bn: 'ads plan' },
    first: {
      en: `Hi {name} 👋 {sender} from {agency}, {senderCity}. Saw your website and Google profile, solid base. Are you running Facebook/Instagram ads or posting regularly? We handle website + Meta ads + 12 posts/month + Google profile for ₹6,999/month, no lock-in, 30-day money back, and we meet in person in {city}. Can I share 2 examples of {category} businesses we've grown near you?`,
      bn: `নমস্কার {name} 🙏 আমি {sender}, {agency} ({senderCity}) থেকে। আপনাদের website আর Google profile দেখলাম, ভালো base। Facebook/Instagram-এ ads চালাচ্ছেন বা নিয়মিত post করছেন? আমরা website + Meta ads + মাসে ১২টা post + Google profile সব একসাথে করি মাসে ₹৬,৯৯৯-এ, কোনো lock-in নেই, ৩০ দিনের money back, আর {city}-তে সামনাসামনি দেখা করি। আপনার মতো {category} business-এর ২টো example পাঠাবো?`,
    },
  },
};

const FOLLOW_UPS = {
  fu1: {
    en: `Hi {name}, following up on my message. I've kept a free {asset} ready for you. Want me to send it here? 👇`,
    bn: `নমস্কার {name}, আগের message-এর follow-up। আপনার জন্য একটা free {asset} তৈরি রেখেছি। এখানে পাঠিয়ে দেবো? 👇`,
  },
  fu2: {
    en: `Last message from me, promise 🙂 If growing {name} online isn't a priority right now, no problem at all. If it is, we offer a free 15-minute consultation on WhatsApp. Reply YES and I'll call you. {sender}, {agency} ({senderPhone})`,
    bn: `আমার শেষ message, promise 🙂 এখন {name}-কে online-এ বাড়ানো priority না হলে কোনো সমস্যা নেই। হলে, WhatsApp-এ একটা free ১৫ মিনিটের consultation দিই। YES লিখে reply করলে আমি call করবো। {sender}, {agency} ({senderPhone})`,
  },
};

const BOOKING_CATEGORIES = [
  'restaurant', 'cafe', 'bakery', 'beauty salon', 'hair salon', 'spa', 'gym', 'fitness center',
  'doctor', 'dentist', 'clinic', 'hospital', 'nursing home', 'diagnostic center', 'hotel',
  'driving school', 'photographer', 'wedding planner', 'travel agency', 'play school', 'coaching center',
];

const PRIORITY_CITIES = { Durgapur: 3, Asansol: 2, Burdwan: 1, Kolkata: 0 };

module.exports = { SENDER, SEGMENTS, FOLLOW_UPS, BOOKING_CATEGORIES, PRIORITY_CITIES };
