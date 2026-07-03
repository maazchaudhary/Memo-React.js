export const navItems = [
  ["New Arrivals", "/new-arrivals"],
];

export const menuItems = [
  ["Home", "/"],
  ["New Arrivals", "/new-arrivals"],
  ["Contact Us", "/contact-us"],
];

export const categoryPages = {
  "/new-arrivals": { title: "New Arrivals", category: null },
};

export const infoPages = {
  "/payment": {
    title: "Payment",
    copy: [
      "All orders are prepaid. Customers may pay the full amount in advance, or pay 50% to confirm the order.",
      "The remaining balance can be paid through cash on delivery for eligible local orders.",
      { text: "Payment Method", strong: true },
      { text: "For Local orders:", strong: true },
      { list: ["Bank Transfer", "Easy Paisa", "Jazz Cash"] },
      { text: "For International Orders:", strong: true },
      { list: ["Bank Transfer", "Western Union", "Remitly / Wise"] },
      "Payment details will be shared with customers through WhatsApp or email once the order has been received."
    ]
  },
  "/disclaimer": {
    title: "Disclaimer",
    copy: [
      { text: "Product Appearance:", strong: true },
      "We use high resolution images on our website to display actual colors of the product. However, the color/ texture you will see will depend on your device Therefore, the final item you receive mighty vary as seen on your screen.",
      "Laces/ embellishments will be of same quality as seen on the image, however, they may be different as seen on the picture, depending on the availability.",
      { text: "Product Care:", strong: true },
      "Please handle our products with care as they are delicate. They should be dry cleaned only."
    ]
  },
  "/faqs": {
    title: "FAQ's",
    copy: [
      { text: "How to make a purchase?", strong: true },
      "You can purchase directly from our website or message us your order on our instagram/ facebook. Provide your complete details (Name, address, contact no. and email) so that we can place your order.",
      "We accept the following payment methods:",
      { list: ["Bank transfer for customers worldwide", "Easy Paisa/ Jazz Cash for Local customers"] },
      { text: "Which countries do we ship?", strong: true },
      "We ship worldwide.",
      { text: "What if courier delays or misplaces our parcel?", strong: true },
      "If unfortunately a parcel is delayed or misplaced by the courier and it’s evident, we will help you recover it by staying in contact with both parties but we cannot be held responsible for a third party action. But rest assured, we will do our best to recover it as soon as possible.",
      { text: "Do you offer cash on delivery?", strong: true },
      "We take 50% advance and remaining before we dispatch or COD.",
      { text: "Do you have refunds?", strong: true },
      "No, we do not have refunds. Order cannot be cancelled once placed, even after an hour as it instantly goes into production.",
      { text: "Do you offer custom made outfits?", strong: true },
      "Yes we do. You can share your reference image and we will design the best outfit for you.",
      { text: "What is the exchange time period?", strong: true },
      "You can let us know within 24hrs of receiving the parcel if there is any fault from our side we will happily exchange it. After that no exchange will be entertained.",
      { text: "What if order is delayed? Can we refund?", strong: true },
      "We try our best to avoid any delays but if there is any unforeseen delay after committing you a date of delivery especially during Eid of Festive season, we will offer compensatory discount of 10-20% but we do not have refunds. Please keep this in mind prior to ordering.",
      { text: "Delivery time", strong: true },
      "Delivery time varies from 7 to 18 days depending on the article and season."
    ]
  },
  "/terms-and-conditions": {
    title: "Terms and conditions",
    copy: [
      { text: "Delivery Charges", strong: true },
      "Charges for international orders are calculated based on the destination and weight of the shipment. Duties and taxes are not included in the goods' price, and customs duty and tax charges are payable to the courier company upon delivery.",
      { text: "Delivery Timelines", strong: true },
      "Memo by Miraal is responsible for dispatching your order, but we cannot control any delays caused by our courier partners. If concerns arise after dispatch, please contact the courier service directly. As each item is made to order, delays due to circumstances beyond our control may occur, and customers will be informed of any delays.",
      { text: "Custom/Duties/Taxes", strong: true },
      "When ordering from MemobyMiraal for delivery overseas, customers may be subject to import duties and taxes. Additional charges for Customs clearance are the customer's responsibility. Customs policies vary, and cross-border deliveries are subject to inspection by Customs Authorities.",
    ]
  },
  "/care-instructions": {
    title: "Care instructions",
    copy: [
      { list: ["All of our pieces are designed to be dry clean only. We strongly recommend that customers adhere to these care instructions to ensure the longevity and quality of the garment.", "Please note that any damage caused by handwashing, machine washing, or any cleaning methods other than dry cleaning will not be covered under our returns or exchange policy. We will not be held liable for any deterioration, shrinkage, or damage resulting from improper care."] },
      { text: "Privacy", strong: true },
      "Your privacy is important to us. Any personal information provided through this site will be used in accordance with our privacy policy."
    ]
  },
  "/returns-and-exchanges": {
    title: "Returns & Exchanges",
    copy: [
      "Returns are only accepted if reported within 24 hours of receiving, with proof of purchase and photos sent via WhatsApp/Instagram.",
      "If there is an issue with the product from our side, we'll be happy to exchange it.",
      "Returns won’t be accepted if: reported after 24 hours, item isn’t returned properly, item is damaged by improper care, or if there’s no proof submitted.",
      { text: "Following points will not be catered:", strong: true },
      { list: ["No longer needed: If you decide the item is no longer necessary for your requirements.", "Changed my mind: If you have reconsidered your purchase decision.", "No technical reason, just canceling the order: If you wish to cancel the order for reasons unrelated to technical issues.", "No return/refund is possible for a custom size outfit."] },
    ]
  },
};
