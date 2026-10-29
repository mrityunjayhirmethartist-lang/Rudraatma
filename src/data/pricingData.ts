import { PricingPlan } from '../types';

export const PRICING_PLANS: PricingPlan[] = [
  // One-time products
  {
    id: 'single-track',
    name: 'Single Track',
    type: 'one-time',
    priceINR: 20,
    billingText: 'one-time payment',
    allowance: '1 single track submission',
    description: 'Perfect for independent singles and standalone song drops. Pay once per release with zero ongoing monthly commitment.',
    features: [
      '1 audio track distribution (up to 10 min)',
      'Free ISRC & UPC barcode generation',
      'Lossless WAV / FLAC audio ingestion',
      'Cover artwork technical verification',
      'Release scheduling (14+ days in advance)',
      'Standard artist royalty reporting',
      'Centralized artist dashboard access',
      'Email support assistance'
    ]
  },
  {
    id: 'ep-album',
    name: 'EP / Album',
    type: 'one-time',
    priceINR: 50,
    billingText: 'one-time payment',
    allowance: '1 EP or full album submission (up to 15 tracks)',
    description: 'Designed for complete concept projects, multi-track EPs, and full-length studio albums without recurring fees.',
    features: [
      'Up to 15 tracks per album included',
      'Sequential track ordering & disc numbering',
      'Custom ISRC assigned for every track',
      'Single album-level UPC barcode included',
      'Full metadata management & writer credits',
      'Explicit content declarations per track',
      'Consolidated album reporting breakdown',
      'Priority metadata verification check'
    ]
  },

  // Monthly subscription plans
  {
    id: 'starter-monthly',
    name: 'Starter Monthly',
    type: 'monthly',
    priceINR: 149,
    billingText: '/month',
    allowance: '1 release submission per billing month',
    description: 'For steady solo creators releasing consistent monthly singles or instrumental tracks.',
    features: [
      '1 release submission each billing cycle',
      '1 primary artist profile management',
      'Free automated ISRC & UPC assignment',
      'Audio & artwork quality validation',
      'Centralized catalog management',
      'Monthly digital royalty statements',
      'Standard support ticketing (24–48h response)'
    ]
  },
  {
    id: 'growth-monthly',
    name: 'Growth Monthly',
    type: 'monthly',
    popular: true,
    badge: 'Most Popular',
    priceINR: 200,
    billingText: '/month',
    allowance: '5 release submissions per billing month',
    description: 'For active artists, frequent collaborators, and emerging boutique labels handling regular drops.',
    features: [
      '5 release submissions each billing cycle',
      'Up to 3 artist profiles managed',
      'Record label profile creation (My Labels)',
      'Smart Links generator with pre-save landing page',
      'Catalog export & track-level breakdown',
      'Direct payout requests (Bank IMPS / UPI)',
      'Priority ticket queue handling'
    ]
  },
  {
    id: 'unlimited-monthly',
    name: 'Unlimited Monthly',
    type: 'monthly',
    priceINR: 300,
    billingText: '/month',
    allowance: 'Unlimited releases (subject to disclosed fair use)',
    description: 'Ideal for prolific beatmakers, multi-genre producers, and active independent record labels.',
    features: [
      'Unlimited release submissions (fair-use policy)',
      'Unlimited managed artist profiles',
      'Multi-label catalog management',
      'Team member workspace invites (Label Manager / Viewer)',
      'Fast-track metadata inspection queue',
      'Automated smart links & custom vanity URLs',
      'Dedicated artist relations desk'
    ]
  },

  // Annual subscription plans
  {
    id: 'starter-annual',
    name: 'Starter Annual',
    type: 'annual',
    priceINR: 1688,
    billingText: '/year',
    allowance: '1 release submission per month (12 / year)',
    annualCalculation: '₹149 × 12 − ₹100 discount = ₹1,688/year',
    description: 'Save with annual billing. 1 monthly release allowance for long-term project planning.',
    features: [
      '1 release per month for a full 12 months',
      'Includes ₹100 direct annual savings',
      '1 primary artist profile',
      'Uninterrupted catalog preservation',
      'ISRC & UPC barcodes included at no extra fee',
      'Monthly royalty statements & CSV exports',
      'Full year of locked pricing'
    ]
  },
  {
    id: 'growth-annual',
    name: 'Growth Annual',
    type: 'annual',
    popular: true,
    badge: 'Best Value',
    priceINR: 2300,
    billingText: '/year',
    allowance: '5 release submissions per month (60 / year)',
    annualCalculation: '₹200 × 12 − ₹100 discount = ₹2,300/year',
    description: 'Comprehensive annual coverage for ambitious creators releasing up to 60 titles per year.',
    features: [
      'Up to 5 releases per month (60 / year)',
      'Includes ₹100 direct annual savings',
      'Up to 3 artist profiles and label records',
      'Smart Links & release landing pages included',
      'Catalog batch metadata management',
      'Priority customer assistance',
      'Consolidated annual financial ledger'
    ]
  },
  {
    id: 'unlimited-annual',
    name: 'Unlimited Annual',
    type: 'annual',
    priceINR: 3500,
    billingText: '/year',
    allowance: 'Unlimited releases for 12 months (fair use)',
    annualCalculation: '₹300 × 12 − ₹100 discount = ₹3,500/year',
    description: 'Maximum publishing freedom for commercial labels and high-volume independent production houses.',
    features: [
      'Unlimited release submissions all year long',
      'Includes ₹100 direct annual savings',
      'Unlimited artist profiles & label entities',
      'Multi-user team management & permissions',
      'Priority technical review queue',
      'Custom pre-save landing pages & tracking links',
      'Dedicated priority artist desk'
    ]
  }
];
