import type { SiteContent } from "./types";
import { CTA } from "@/config/site.config";
import { CONTACT } from "@/config/contact";

/**
 * MILESTONE 2 — APPROVED TAOOHAN CONTENT.
 *
 * Every string below is taken VERBATIM from the client-approved
 * "Taoohan Website Content & Copy" document. Nothing here is invented —
 * see the client brief for the hard guardrails (no
 * statistics, testimonials, certifications, company names/logos, social
 * links, team photos or stock people photography).
 *
 * The one documented discrepancy: the approved document lists two slightly
 * different six-service structures (an early draft list naming service #3
 * "Executive & Specialist Recruitment", and the final Services-page list
 * naming it "Talent Sourcing & Recruitment"). The Services-page version is
 * used everywhere below, per the client's own instruction to treat it as
 * the final approved list.
 */

export const taoohanContent: SiteContent = {
  isPlaceholder: false,

  brand: {
    name: "Taoohan",
    tagline: "Bringing Great People to Great Businesses.",
  },

  home: {
    eyebrow: "The Right People. The Right Opportunities.",
    headline: "Bringing Great People to Great Businesses.",
    headlineLines: ["Bringing Great People", "to Great Businesses."],
    supporting:
      "Connecting employers with qualified talent through reliable recruitment, staffing, and manpower solutions across industries.",
    heroCta: {
      label: "Become Our Partner",
    },
    intro: {
      eyebrow: "WHY TAOOHAN",
      heading: "Recruitment Solutions Built Around Your Business",
      lead: "We connect businesses with qualified professionals through reliable recruitment, staffing, and manpower solutions designed to meet your workforce needs.",
    },
    features: [
      {
        key: "quality-talent",
        title: "Access to Quality Talent",
        body: "Connect with qualified and carefully sourced candidates across a wide range of industries and roles.",
      },
      {
        key: "fast-reliable",
        title: "Fast, Reliable Recruitment",
        body: "Streamline your hiring process with responsive recruitment support and a focus on finding the right candidates efficiently.",
      },
      {
        key: "flexible-staffing",
        title: "Flexible Staffing Solutions",
        body: "Scale your workforce with staffing and manpower solutions tailored to your business requirements.",
      },
    ],
    employerCard: {
      heading: "Find Great People for Your Business",
      body: "From skilled professionals to reliable workforce solutions, Taoohan helps businesses connect with qualified people who can contribute to their success.",
      ctaLabel: CTA.employer.label,
      ctaHref: "/for-employers",
      linkLabel: "For Employers →",
      linkHref: "/for-employers",
    },
    jobSeekerCard: {
      heading: "Find Great Opportunities With Great Businesses",
      body: "Connect with employers looking for qualified professionals and discover opportunities that match your skills, experience, and career goals.",
      ctaLabel: CTA.jobSeeker.label,
      ctaHref: "/for-job-seekers",
      linkLabel: "For Job Seekers →",
      linkHref: "/for-job-seekers",
    },
    finalCta: {
      heading: "Ready to Find the Right People or the Right Opportunity?",
      body: "Whether you're looking to build your workforce or take the next step in your career, Taoohan is here to connect you with the right opportunities.",
    },
    partnerModal: {
      heading: "Become Our Partner",
      lead: "Tell us which side you are on and we will take you to the right team.",
      jobSeeker: {
        tabLabel: "I'm looking for work",
        heading: "Find Great Opportunities With Great Businesses",
        lead: "Connect with employers looking for qualified professionals and discover opportunities that match your skills, experience, and career goals.",
        submitLabel: "Continue",
        privacyNote: "We use your details only to contact you about opportunities.",
        channelHeading: "How would you like to send your details?",
        channelLead: "Choose a channel and we will open it with your details already filled in.",
        whatsappLabel: "Continue on WhatsApp",
        whatsappNote: "Opens WhatsApp with your details ready to send. Attach your updated CV in the chat so our recruitment team can review it.",
        emailLabel: "Continue by Email",
        emailNote: "Opens your email app with your details ready to send. Attach your updated CV before sending.",
        successNote: "Your details are ready to send. Remember to attach your CV before you send the message.",
      },
      employer: {
        tabLabel: "I'm hiring staff",
        heading: "Hiring for Your Business?",
        lead: "Tell us about the roles you need to fill and our team will get back to you with a recruitment or staffing solution.",
        ctaLabel: "Email Us Your Hiring Needs",
        note: "Opens your email app, addressed to our team, with your request already written out.",
        successNote: "Thanks — your email app should now be open to send your details to our team.",
      },
    },
  },

  about: {
    eyebrow: "WHO WE ARE",
    heading: "Your Partner in Recruitment, Staffing & Manpower Solutions",
    lead: "Taoohan is a recruitment, staffing, and manpower solutions company connecting businesses with qualified professionals across a wide range of industries.",
    body: [
      "We help employers find the people they need through reliable talent sourcing, recruitment, and flexible workforce solutions tailored to their specific requirements.",
      "From skilled professionals to essential workforce roles, we make the hiring process more efficient while helping people discover meaningful opportunities to grow their careers.",
    ],
    approachHeading: "Our Approach",
    testimonialsHeading: "What Our Partners Say",
    approachLead:
      "We believe successful recruitment goes beyond filling positions. It starts with understanding the needs of both employers and candidates, identifying the right match, and creating connections that support long-term success.",
    values: [
      {
        key: "quality-talent",
        title: "Access to Quality Talent",
        body: "We connect employers with qualified and carefully sourced candidates across a wide range of industries and roles.",
      },
      {
        key: "fast-reliable",
        title: "Fast, Reliable Recruitment",
        body: "We provide responsive recruitment support focused on making the hiring process efficient, straightforward, and dependable.",
      },
      {
        key: "flexible-staffing",
        title: "Flexible Staffing Solutions",
        body: "We provide staffing and manpower solutions that adapt to different workforce requirements, projects, and business needs.",
      },
    ],
  },

  services: {
    eyebrow: "OUR SERVICES",
    heading: "Workforce Solutions That Fit Your Business",
    lead: "From recruitment and talent sourcing to staffing and manpower solutions, we help businesses find and support the people they need across different roles and industries.",
    coreHeading: "OUR CORE SERVICES",
    items: [
      {
        key: "manpower-supply",
        title: "Manpower Supply",
        body: "Reliable workforce solutions to meet your manpower requirements efficiently.",
      },
      {
        key: "recruitment-staffing",
        title: "Recruitment & Staffing",
        body: "Connecting businesses with qualified professionals for their workforce needs.",
      },
      {
        key: "talent-sourcing",
        title: "Talent Sourcing & Recruitment",
        body: "Identifying and connecting businesses with qualified candidates who match their requirements.",
      },
      {
        key: "screening-shortlisting",
        title: "Candidate Screening & Shortlisting",
        body: "Assessing candidates to identify the strongest matches for each role.",
      },
      {
        key: "contract-staffing",
        title: "Contract Staffing",
        body: "Flexible staffing support for specific projects or defined periods.",
      },
      {
        key: "temp-permanent",
        title: "Temporary & Permanent Staffing",
        body: "Staffing solutions for both immediate and long-term workforce needs.",
      },
    ],
    processHeading: "OUR RECRUITMENT PROCESS",
    processTitle: "From Your Hiring Need to the Right Candidate",
    processLead:
      "We make the recruitment process straightforward by understanding your requirements, identifying suitable candidates, and supporting you through selection and placement.",
    steps: [
      {
        key: "understand",
        title: "Understand Your Requirements",
        body: "We begin by understanding your hiring needs, role requirements, workforce goals, and expectations.",
      },
      {
        key: "strategy",
        title: "Build the Recruitment Strategy",
        body: "We determine the right sourcing and recruitment approach based on your requirements and target candidates.",
      },
      {
        key: "source",
        title: "Source & Identify Candidates",
        body: "We search for qualified candidates through targeted sourcing and our talent network.",
      },
      {
        key: "screen",
        title: "Screen & Shortlist",
        body: "We assess candidates based on their qualifications, experience, skills, and suitability for the role.",
      },
      {
        key: "interview",
        title: "Interview & Selection",
        body: "We coordinate the interview process and support communication between the employer and shortlisted candidates.",
      },
      {
        key: "placement",
        title: "Placement & Onboarding",
        body: "Once a candidate is selected, we support the placement process and help facilitate a smooth transition into the role.",
      },
    ],
    ctaHeading: "READY TO BUILD YOUR TEAM?",
    ctaBody:
      "Whether you need qualified professionals, contract staff, or manpower support, Taoohan is ready to help you find the people your business needs.",
  },

  industries: {
    eyebrow: "OUR INDUSTRIES",
    heading: "Connecting Talent Across Industries",
    lead: "We connect businesses with qualified professionals across diverse industries, roles, and workforce requirements, providing recruitment and staffing solutions tailored to each sector.",
    items: [
      {
        key: "construction",
        name: "Construction",
        blurb: "Supporting construction companies with qualified professionals and reliable workforce solutions for projects and ongoing operations.",
      },
      {
        key: "healthcare",
        name: "Healthcare",
        blurb: "Connecting healthcare organizations with qualified professionals to support their staffing and workforce needs.",
      },
      {
        key: "it-technology",
        name: "IT & Technology",
        blurb: "Helping technology-driven businesses find skilled professionals across IT, software, technical, and digital roles.",
      },
      {
        key: "engineering",
        name: "Engineering",
        blurb: "Sourcing qualified engineering professionals across technical disciplines and project requirements.",
      },
      {
        key: "hospitality",
        name: "Hospitality",
        blurb: "Providing recruitment and staffing support for hotels, restaurants, resorts, and other hospitality businesses.",
      },
      {
        key: "logistics-transportation",
        name: "Logistics & Transportation",
        blurb: "Connecting businesses with qualified personnel to support logistics, transportation, distribution, and supply chain operations.",
      },
      {
        key: "manufacturing",
        name: "Manufacturing",
        blurb: "Supporting manufacturing businesses with skilled and reliable personnel across production, technical, and operational roles.",
      },
      {
        key: "retail-sales",
        name: "Retail & Sales",
        blurb: "Helping retail and sales organizations find professionals across customer service, sales, operations, and related functions.",
      },
      {
        key: "facilities-management",
        name: "Facilities Management",
        blurb: "Providing workforce solutions for facilities management, maintenance, operations, and support services.",
      },
      {
        key: "real-estate",
        name: "Real Estate",
        blurb: "Connecting real estate businesses with qualified professionals across property, sales, administration, and related functions.",
      },
      {
        key: "aviation",
        name: "Aviation",
        blurb: "Supporting aviation organizations with qualified professionals across operational, technical, administrative, and support roles.",
      },
      {
        key: "banking-financial-services",
        name: "Banking & Financial Services",
        blurb: "Connecting financial institutions and businesses with qualified professionals across banking, finance, and related functions.",
      },
      {
        key: "oil-gas-energy",
        name: "Oil, Gas & Energy",
        blurb: "Supporting energy-sector businesses with qualified professionals across technical, operational, and support roles.",
      },
      {
        key: "education",
        name: "Education",
        blurb: "Helping educational institutions find qualified professionals across teaching, administration, and support functions.",
      },
      {
        key: "telecommunications",
        name: "Telecommunications",
        blurb: "Connecting telecommunications businesses with professionals across technical, operational, customer service, and support roles.",
      },
      {
        key: "administration-office-support",
        name: "Administration & Office Support",
        blurb: "Providing qualified professionals for administrative, clerical, customer service, and office support roles.",
      },
    ],
    partners: {
      eyebrow: "PARTNERS & CLIENTS",
      heading: "Building Stronger Workforce Partnerships",
      body: "We work with businesses across different industries to support their recruitment, staffing, and workforce requirements.",
    },
    ctaHeading: "READY TO FIND THE RIGHT TALENT?",
    ctaBody:
      "Whether you need skilled professionals, reliable manpower, or flexible staffing support, Taoohan can help you build the workforce your business needs.",
  },

  employers: {
    eyebrow: "FOR EMPLOYERS",
    heading: "Find Great People for Your Business",
    lead: "Whether you need skilled professionals, reliable manpower, or flexible staffing support, Taoohan helps you find qualified people who can contribute to your business and its success.",
    processHeading: "A Simple Recruitment Process",
    processLead:
      "From your initial hiring request to candidate placement, we provide structured recruitment support designed to make the process clear, efficient, and straightforward.",
    steps: [
      {
        key: "share-requirements",
        title: "Share Your Hiring Requirements",
        body: "Tell us about the position, required qualifications, experience, manpower needs, and other requirements for the role.",
      },
      {
        key: "candidate-sourcing",
        title: "Candidate Sourcing",
        body: "Our recruitment team identifies and sources candidates who match your requirements through targeted recruitment and our talent network.",
      },
      {
        key: "screening-shortlisting",
        title: "Screening & Shortlisting",
        body: "We assess candidates based on their qualifications, experience, skills, and suitability before presenting the strongest matches.",
      },
      {
        key: "interview-selection",
        title: "Interview & Selection",
        body: "We coordinate the interview process and support communication between your team and shortlisted candidates.",
      },
      {
        key: "candidate-selection",
        title: "Candidate Selection",
        body: "You review the shortlisted candidates and select the applicant who best meets your requirements.",
      },
      {
        key: "placement-onboarding",
        title: "Placement & Onboarding",
        body: "Once the candidate is selected, we support the placement process and help facilitate a smooth transition into the role.",
      },
    ],
    solutionsHeading: "OUR EMPLOYER SOLUTIONS",
    solutionsLead: "We provide flexible recruitment and workforce solutions to support different hiring requirements.",
    solutions: [
      {
        key: "manpower-supply",
        title: "Manpower Supply",
        body: "Reliable workforce solutions to help businesses meet their manpower requirements efficiently.",
      },
      {
        key: "recruitment-staffing",
        title: "Recruitment & Staffing",
        body: "Connecting businesses with qualified professionals for their workforce needs.",
      },
      {
        key: "talent-sourcing",
        title: "Talent Sourcing & Recruitment",
        body: "Identifying and connecting businesses with qualified candidates who match their requirements.",
      },
      {
        key: "screening-shortlisting-2",
        title: "Candidate Screening & Shortlisting",
        body: "Assessing candidates to identify the strongest matches for each role.",
      },
      {
        key: "contract-staffing",
        title: "Contract Staffing",
        body: "Flexible staffing support for specific projects or defined periods.",
      },
      {
        key: "temp-permanent",
        title: "Temporary & Permanent Staffing",
        body: "Staffing solutions for both immediate and long-term workforce needs.",
      },
    ],
    ctaHeading: "READY TO FIND GREAT PEOPLE?",
    ctaBody: "Tell us what your business needs, and our team will help you identify the right recruitment or workforce solution.",
  },

  jobSeekers: {
    eyebrow: "FOR JOB SEEKERS",
    heading: "Find Great Opportunities With Great Businesses",
    lead: "Connect with employers looking for qualified professionals and discover opportunities that match your skills, experience, and career goals.",
    journeyHeading: "Your Journey to the Right Opportunity",
    journeyLead:
      "From submitting your CV to connecting with potential employers, Taoohan provides recruitment support throughout the process and keeps you informed as suitable opportunities arise.",
    steps: [
      {
        key: "send-cv",
        title: "Send Your CV",
        body: "Send your updated CV to our official WhatsApp number so our recruitment team can review your experience, skills, and career goals.",
      },
      {
        key: "profile-review",
        title: "Profile Review & Matching",
        body: "We review your profile and identify opportunities that align with your qualifications, experience, skills, and career goals.",
      },
      {
        key: "interview-opportunities",
        title: "Interview Opportunities",
        body: "When your profile matches a suitable position, we may present your profile to the relevant employer and coordinate the next steps if you are shortlisted.",
      },
      {
        key: "selection-placement",
        title: "Selection & Placement",
        body: "If selected by the employer, we support you through the placement process and help facilitate a smooth transition into your new role.",
      },
    ],
    applyHeading: "HOW TO APPLY",
    applySidebarHeading: "Send Your CV via WhatsApp",
    applySteps: [
      {
        key: "prepare-cv",
        title: "Prepare Your CV",
        body: "Make sure your CV is updated and clearly reflects your skills, experience, qualifications, and career goals.",
      },
      {
        key: "send-via-whatsapp",
        title: "Send Your CV via WhatsApp",
        body: CONTACT.whatsapp
          ? `Send your CV directly to our official WhatsApp number: ${CONTACT.whatsapp}.`
          : "Send your CV directly to our official WhatsApp number (awaiting client details).",
      },
      {
        key: "wait-for-opportunities",
        title: "Wait for Suitable Opportunities",
        body: "Our recruitment team will review your profile and contact you when a suitable opportunity matches your qualifications and experience.",
      },
    ],
    ctaHeading: "READY FOR YOUR NEXT OPPORTUNITY?",
    ctaBody: "Take the next step in your career and let Taoohan connect you with opportunities that match your skills and experience.",
    // [DRAFT] Not yet client-approved — pulled in to make the navbar's
    // "Submit CV" flow functional. Replace with approved wording once
    // available; no code changes needed when it lands.
    applyInstructions: [
      "Enter your full name and contact number.",
      "Choose how you would like to continue: WhatsApp or email.",
      "Attach your CV in the chat or email that opens, and our team will be in touch.",
    ],
  },

  contact: {
    eyebrow: "CONTACT US",
    heading: "Let's Start a Conversation",
    lead: "Whether you're looking for qualified talent, staffing support, or your next career opportunity, our team is ready to hear from you.",
    body: "For general inquiries, employer hiring requests, or job opportunities, you can reach us by email, phone, or WhatsApp. For the quickest response, we recommend contacting us through WhatsApp, and our team will get back to you as soon as possible.",
    channels: {
      email: {
        label: CONTACT.email,
        note: "For general inquiries, employer requests, and business-related questions.",
      },
      phone: {
        label: CONTACT.phone,
        note: "For direct inquiries and general assistance.",
      },
      whatsapp: {
        label: CONTACT.whatsapp,
        note: "For job seekers submitting their CV.",
        ctaLabel: "Message Us on WhatsApp",
      },
    },
    secondaryHeading: "Ready to Take the Next Step?",
    secondaryBody: "Whether you're hiring for your business or looking for your next opportunity, Taoohan is here to help connect you with the right people and possibilities.",
  },

  // BLOCKED ON CLIENT — "do not add or invent any figures." Hidden.
  stats: [],
  // BLOCKED ON CLIENT — TBD, no placeholder reviews. Hidden.
  testimonials: [],
  // BLOCKED ON CLIENT — real partner names/logos stay on hold. Empty here on
  // purpose: the client's client-authorised exception (temporary A/B/C/X/Y/Z
  // letter tiles on the Industries page only) is rendered directly by
  // src/app/industries/page.tsx from PARTNER_PLACEHOLDER_LABELS — a UI-only
  // decorative constant, not client-supplied data — so this slot stays a
  // real empty array like every other blocked field.
  partners: [],
  // BLOCKED ON CLIENT — do not add until confirmed. Hidden.
  certifications: [],

  labels: {
    manpowerCategories: "MANPOWER CATEGORIES YOU CAN REQUEST",
    footerPages: "Pages",
    footerContact: "Contact",
    // [DRAFT] Not yet client-approved — pulled in to make the navbar's
    // "Submit CV" / "Request Staff" flows functional.
    requestManpower: "Request staffing and manpower",
    howToApply: "How to apply",
    applyWhatsApp: "Continue on WhatsApp",
    applyEmail: "Send by email",
  },

  footer: {
    tagline: "Taoohan — Bringing Great People to Great Businesses.",
  },

  disclaimer:
    "Taoohan does not guarantee a specific salary, position, or hiring outcome unless formally agreed.",

  copyright: {
    year: "2026",
    holder: "Taoohan. All rights reserved.",
    developedBy: "Developed by CREServices Beyond Strategy",
  },

  // BLOCKED ON CLIENT — client has not prepared these documents yet.
  legal: {
    privacy: { title: "", sections: [] },
    terms: { title: "", sections: [] },
  },
};
