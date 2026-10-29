export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export const FAQS_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Timing & Delivery',
    question: 'How long does it take for a release to be delivered to platforms?',
    answer: 'Once you submit a release on Rudraatma Music, our technical desk conducts an initial quality review within 24 to 72 business hours to verify audio specs, artwork guidelines, and metadata completeness. Following approval, delivery ingestion is dispatched to receiving platforms. Each destination processes ingestion according to its own review pipeline — major DSPs typically require 5 to 14 calendar days. We recommend submitting your release at least 14 days before your desired release date to allow buffer for DSP ingestion and editorial playlist pitching windows.'
  },
  {
    id: 'faq-2',
    category: 'Pricing & Subscriptions',
    question: 'What is the difference between one-time releases and monthly/annual plans?',
    answer: 'A one-time release (₹20 for a Single Track, ₹50 for an EP/Album) is paid once and keeps your release active without recurring fees. Subscriptions (Starter at ₹149/mo, Growth at ₹200/mo, Unlimited at ₹300/mo, or their discounted annual counterparts) provide recurring release allowances each billing cycle, multi-artist profile management, and expanded dashboard tools. One-time releases are never automatically converted into subscriptions.'
  },
  {
    id: 'faq-3',
    category: 'Royalties & Earnings',
    question: 'How and when are streaming royalties calculated and paid out?',
    answer: 'Streaming services and digital stores calculate and report earnings on a 60- to 90-day processing lag (for example, January streams are typically reported by DSPs in late March or April). Once verified statement reports are processed into our accounting ledger, cleared earnings reflect directly in your Account Balance in INR. You can request payouts via direct Indian Bank Transfer (IMPS/NEFT) or verified UPI once minimum withdrawal thresholds are met.'
  },
  {
    id: 'faq-4',
    category: 'Rights & Clearance',
    question: 'Do I retain 100% ownership of my master recordings and copyrights?',
    answer: 'Yes, absolutely. Rudraatma Music operates as a distribution and administrative conduit. You retain 100% of your copyright, master ownership, and intellectual property. You simply grant us a non-exclusive distribution license to deliver your sound recordings and metadata to DSPs on your behalf.'
  },
  {
    id: 'faq-5',
    category: 'Metadata & Catalog',
    question: 'Can I make metadata corrections after a release has been submitted?',
    answer: 'Yes. If your release is in "Submitted" or "Under Review" status, metadata can be adjusted directly. If your release has already been approved or dispatched, you can submit a "Metadata Correction Request" via the Other Requests panel in your dashboard. DSP ingestion rules differ: most platforms accept updates for artist credits, track titles, and lyrics, but will not allow changing audio files or the core UPC once released.'
  },
  {
    id: 'faq-6',
    category: 'Metadata & Catalog',
    question: 'Can I distribute music that was previously released through another distributor?',
    answer: 'Yes, provided you own the rights. To preserve your existing play counts and playlist additions, you must enter the exact same ISRC code for each track, the same primary artist spelling, and identical track titles as previously registered. Once live, you can request a takedown from your former distributor.'
  },
  {
    id: 'faq-7',
    category: 'Rights & Clearance',
    question: 'Can I release cover songs or remakes through Rudraatma Music?',
    answer: 'Cover songs (re-recording the underlying composition without sampling the original sound recording) require appropriate mechanical licensing depending on the distribution territories. In India and worldwide, statutory mechanical licenses or publisher permissions apply. You must mark the release as a cover, credit the original composers and lyricists accurately, and ensure you do not use unauthorized master samples.'
  },
  {
    id: 'faq-8',
    category: 'Rights & Clearance',
    question: 'Are uncleared samples or royalty-free loops permitted?',
    answer: 'Any third-party audio sample from existing copyrighted records requires 100% written clearance from the original master owner and publisher. Generic, non-exclusive royalty-free sound packs (e.g. standard construction kits) may conflict with YouTube Content ID audio fingerprinting algorithms; such tracks cannot be enrolled in Content ID to avoid automated claim disputes.'
  },
  {
    id: 'faq-9',
    category: 'Metadata & Catalog',
    question: 'How do release takedowns work if I want to remove my music?',
    answer: 'You can issue a takedown request anytime through the dashboard under Other Requests. Once submitted, our system sends removal instructions to all destination endpoints. Ingestion removal typically takes 2 to 7 business days depending on each store\'s refresh schedule.'
  },
  {
    id: 'faq-10',
    category: 'Pricing & Subscriptions',
    question: 'What happens to my music if I cancel my subscription plan?',
    answer: 'If you cancel a recurring subscription, your account remains active until the end of your current paid billing period. After cancellation, you can keep your existing catalog active by transitioning eligible titles to one-time maintenance or choosing an updated tier. Your music is not abruptly deleted without notice.'
  },
  {
    id: 'faq-11',
    category: 'Pricing & Subscriptions',
    question: 'What happens in case of a payment failure or gateway error?',
    answer: 'If a payment fails during checkout or recurring billing, our server preserves your pending order without charging. You will receive an immediate notice and a safe retry link. If your account was debited by your bank but our gateway did not confirm the token, the amount is automatically reconciled or refunded by your bank within 3 to 5 business days.'
  },
  {
    id: 'faq-12',
    category: 'Timing & Delivery',
    question: 'What customer support channels are available to artists?',
    answer: 'All registered users can open formal support tickets directly within their Artist Dashboard under the Support section. Our artist relations and technical desk reviews inquiries Monday through Friday, 10:00 AM to 6:00 PM IST, with verified email replies sent to your registered address within 24 to 48 hours.'
  }
];
