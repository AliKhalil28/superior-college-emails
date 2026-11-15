export type FolderId =
  | "inbox"
  | "starred"
  | "sent"
  | "drafts"
  | "archive"
  | "spam"
  | "trash";

export interface MailUser {
  name: string;
  email: string;
  initials: string;
  color: string;
}

export interface Email {
  id: string;
  folder: FolderId;
  from: MailUser;
  to: string;
  subject: string;
  preview: string;
  body: string[];
  date: string;
  time: string;
  unread?: boolean;
  starred?: boolean;
  hasAttachment?: boolean;
  attachments?: { name: string; size: string }[];
  labels?: string[];
  category?: "primary" | "promotions" | "social";
}

export const currentUser = {
  name: "Ali Khalil",
  role: "IT Incharge",
  email: "ali.khalil@superiorcollegemc.com",
  initials: "AK",
  addresses: [
    "ali.khalil@superiorcollegemc.com",
    "it@superiorcollegemc.com",
    "info@superiorcollegemc.com",
  ],
};

export const folders: { id: FolderId; label: string; count?: number; unread?: number }[] = [
  { id: "inbox", label: "Inbox", count: 24, unread: 4 },
  { id: "starred", label: "Starred" },
  { id: "sent", label: "Sent", count: 18 },
  { id: "drafts", label: "Drafts", count: 2 },
  { id: "archive", label: "Archive", count: 41 },
  { id: "spam", label: "Spam", count: 3 },
  { id: "trash", label: "Trash", count: 6 },
];

export const labels = [
  { name: "Official", color: "bg-emerald-600" },
  { name: "Admissions", color: "bg-amber-500" },
  { name: "Exams", color: "bg-sky-600" },
  { name: "Finance", color: "bg-violet-600" },
];

const u = (name: string, email: string, initials: string, color: string): MailUser => ({
  name,
  email,
  initials,
  color,
});

export const emails: Email[] = [
  {
    id: "m1",
    folder: "inbox",
    from: u("Principal Office", "principal@superiorcollegemc.com", "PO", "bg-emerald-700"),
    to: "ali.khalil@superiorcollegemc.com",
    subject: "Staff meeting — Monday, 10:00 AM, Conference Room",
    preview:
      "All department heads and incharges are requested to attend the weekly coordination meeting on Monday at 10:00 AM sharp…",
    body: [
      "Dear colleagues,",
      "All department heads and incharges are requested to attend the weekly coordination meeting on Monday at 10:00 AM sharp in the Conference Room.",
      "Agenda: (1) December function arrangements, (2) final-term date sheet approval, (3) lab reports review. Please bring your department updates in writing.",
      "Regards,\nOffice of the Principal\nSuperior College Mian Channu",
    ],
    date: "Today",
    time: "9:12 AM",
    unread: true,
    labels: ["Official"],
  },
  {
    id: "m2",
    folder: "inbox",
    from: u("Admissions Office", "admissions@superiorcollegemc.com", "AO", "bg-amber-600"),
    to: "ali.khalil@superiorcollegemc.com",
    subject: "Fall 2026 admissions — merit list verification required",
    preview:
      "The second merit list for BS programs is ready. Please verify the uploaded lists on the portal before they are published…",
    body: [
      "Dear IT Incharge,",
      "The second merit list for BS programs (Fall 2026) is ready. Please verify the uploaded lists on the admissions portal before they are published on the website and Facebook page.",
      "The verification sheet is attached. Kindly confirm by today evening so the lists can go live tomorrow morning.",
      "Admissions Office",
    ],
    date: "Today",
    time: "8:47 AM",
    unread: true,
    hasAttachment: true,
    attachments: [{ name: "Merit-List-2-Verification.xlsx", size: "184 KB" }],
    labels: ["Admissions", "Official"],
  },
  {
    id: "m3",
    folder: "inbox",
    from: u("Higher Education Commission", "noreply@hec.gov.pk", "HE", "bg-sky-700"),
    to: "ali.khalil@superiorcollegemc.com",
    subject: "NSCT 2027 — institute focal person registration",
    preview:
      "Institutes are requested to nominate a focal person for the National Skill Competency Test (NSCT) 2027 for 7th and 8th semester…",
    body: [
      "Dear Sir/Madam,",
      "Institutes are requested to nominate a focal person for the National Skill Competency Test (NSCT) 2027, mandatory for 7th and 8th semester students of Computing/IT programs.",
      "Tentative test dates are 23–24 January 2027. Registration details will be shared through the focal person.",
      "Higher Education Commission, Islamabad",
    ],
    date: "Today",
    time: "7:30 AM",
    unread: true,
    labels: ["Official"],
  },
  {
    id: "m4",
    folder: "inbox",
    from: u("BISE Multan", "controller@bisemultan.edu.pk", "BM", "bg-rose-700"),
    to: "ali.khalil@superiorcollegemc.com",
    subject: "Intermediate Part-I result gazette — institution copy",
    preview:
      "The result gazette for Intermediate Part-I Annual 2026 for your institution is attached for record and verification…",
    body: [
      "Dear Principal,",
      "The result gazette for Intermediate Part-I Annual 2026 for your institution is attached for record and verification.",
      "Discrepancies, if any, may be reported to the Board office within 15 days of the result declaration.",
      "Controller of Examinations\nBISE Multan",
    ],
    date: "Yesterday",
    time: "4:05 PM",
    unread: true,
    starred: true,
    hasAttachment: true,
    attachments: [{ name: "Gazette-Part-I-2026.pdf", size: "2.4 MB" }],
    labels: ["Exams"],
  },
  {
    id: "m5",
    folder: "inbox",
    from: u("Hostinger", "noreply@hostinger.com", "HO", "bg-violet-700"),
    to: "ali.khalil@superiorcollegemc.com",
    subject: "Welcome to your new mailbox — superiorcollegemc.com",
    preview:
      "Your email plan for superiorcollegemc.com is active. You can create up to 30 mailboxes and connect them with any mail app using IMAP/SMTP…",
    body: [
      "Hi there,",
      "Your email plan for superiorcollegemc.com is now active. You can create up to 30 mailboxes from your Hostinger panel and connect them to any mail app using IMAP and SMTP.",
      "Incoming server (IMAP): imap.hostinger.com — port 993 (SSL)\nOutgoing server (SMTP): smtp.hostinger.com — port 465 (SSL) or 587 (TLS)",
      "The Hostinger Team",
    ],
    date: "Yesterday",
    time: "11:20 AM",
    labels: ["Official"],
  },
  {
    id: "m6",
    folder: "inbox",
    from: u("M. Shoaib Khan", "principal@superiorcollegemc.com", "SK", "bg-emerald-800"),
    to: "ali.khalil@superiorcollegemc.com",
    subject: "December function — arrangements review",
    preview:
      "Please prepare a short summary of the tent, SMD screen and photography arrangements for the December function so we can finalise…",
    body: [
      "Ali,",
      "Please prepare a short summary of the tent, SMD screen and photography arrangements for the December function so we can finalise everything this week.",
      "Also collect the teachers' photographs for the frames at the earliest.",
      "M. Shoaib Khan\nPrincipal",
    ],
    date: "Nov 14",
    time: "6:42 PM",
    starred: true,
    labels: ["Official"],
  },
  {
    id: "m7",
    folder: "inbox",
    from: u("Accounts Office", "accounts@superiorcollegemc.com", "AC", "bg-teal-700"),
    to: "ali.khalil@superiorcollegemc.com",
    subject: "October salary slips are ready",
    preview:
      "Salary slips for the month of October 2026 have been generated. Staff can collect printed copies from the Accounts Office…",
    body: [
      "Dear staff,",
      "Salary slips for the month of October 2026 have been generated. Staff can collect printed copies from the Accounts Office during office hours.",
      "For any correction, please visit the Accounts Office with your CNIC copy.",
      "Accounts Office",
    ],
    date: "Nov 13",
    time: "1:15 PM",
    labels: ["Finance"],
  },
  {
    id: "m8",
    folder: "inbox",
    from: u("Examination Cell", "exams@superiorcollegemc.com", "EC", "bg-sky-600"),
    to: "ali.khalil@superiorcollegemc.com",
    subject: "Date sheet — Final Term, Fall 2026",
    preview:
      "The final-term date sheet for BS programs is attached for circulation. Papers start from 15 December 2026…",
    body: [
      "Dear colleagues,",
      "The final-term date sheet for BS programs is attached for circulation among students. Papers start from 15 December 2026.",
      "Invigilation duties will be shared separately.",
      "Examination Cell",
    ],
    date: "Nov 12",
    time: "10:02 AM",
    hasAttachment: true,
    attachments: [{ name: "Date-Sheet-Final-Term-Fall-2026.pdf", size: "312 KB" }],
    labels: ["Exams"],
  },
  {
    id: "m9",
    folder: "inbox",
    from: u("Digital Library", "library@superiorcollegemc.com", "DL", "bg-indigo-700"),
    to: "ali.khalil@superiorcollegemc.com",
    subject: "New arrivals — Computer Science titles, November",
    preview:
      "42 new Computer Science and IT titles have been added to the digital library catalogue this month, including networking and…",
    body: [
      "Dear faculty,",
      "42 new Computer Science and IT titles have been added to the digital library catalogue this month, including networking, databases and software engineering.",
      "The updated catalogue is available on the e-library portal.",
      "Digital Library Team",
    ],
    date: "Nov 11",
    time: "9:38 AM",
  },
  {
    id: "m10",
    folder: "inbox",
    from: u("HR Office", "hr@superiorcollegemc.com", "HR", "bg-orange-700"),
    to: "ali.khalil@superiorcollegemc.com",
    subject: "Leave policy update — please acknowledge",
    preview:
      "The updated leave policy is effective from 1 December 2026. All staff are requested to read and acknowledge receipt…",
    body: [
      "Dear staff members,",
      "The updated leave policy is effective from 1 December 2026. All staff are requested to read the attached policy and acknowledge receipt by replying to this email.",
      "HR Office",
    ],
    date: "Nov 10",
    time: "3:26 PM",
    labels: ["Official"],
  },
  {
    id: "m13",
    folder: "inbox",
    from: u("Hostinger Offers", "offers@hostinger.com", "HO", "bg-violet-600"),
    to: "ali.khalil@superiorcollegemc.com",
    subject: "Renewal season: up to 78% off hosting plans",
    preview:
      "Your email plan is in good standing. This week only, renew or upgrade any hosting plan with up to 78% off and free domain…",
    body: [
      "Hi there,",
      "Your email plan is in good standing. This week only, renew or upgrade any hosting plan with up to 78% off and a free domain for the first year.",
      "The Hostinger Team",
    ],
    date: "Nov 12",
    time: "7:14 AM",
    category: "promotions",
  },
  {
    id: "m14",
    folder: "inbox",
    from: u("Facebook", "notification@facebookmail.com", "FB", "bg-blue-600"),
    to: "ali.khalil@superiorcollegemc.com",
    subject: "Superior College Mian Channu: 128 new page views this week",
    preview:
      "Your Page had 128 views and 36 new interactions this week. See insights for your recent admissions post…",
    body: [
      "Hi Ali,",
      "Your Page, Superior College Mian Channu, had 128 views and 36 new interactions this week.",
      "See insights for your recent admissions post to learn what worked.",
      "The Facebook Team",
    ],
    date: "Nov 11",
    time: "8:02 PM",
    category: "social",
  },
  {
    id: "m15",
    folder: "inbox",
    from: u("LinkedIn", "invitations@linkedin.com", "IN", "bg-sky-800"),
    to: "ali.khalil@superiorcollegemc.com",
    subject: "You have 3 new connection invitations",
    preview:
      "People from education and IT in Punjab want to connect with you. Review your pending invitations…",
    body: [
      "Hi Ali,",
      "You have 3 new connection invitations from people in education and IT in Punjab.",
      "Review your pending invitations on LinkedIn.",
      "The LinkedIn Team",
    ],
    date: "Nov 10",
    time: "9:45 AM",
    category: "social",
  },
  {
    id: "m11",
    folder: "sent",
    from: u("Ali Khalil", "ali.khalil@superiorcollegemc.com", "AK", "bg-emerald-600"),
    to: "principal@superiorcollegemc.com",
    subject: "Lab report — week ending 14 November",
    preview:
      "Sir, the weekly computer lab report is attached. All 45 lab sessions were conducted as scheduled except two, which were…",
    body: [
      "Respected Sir,",
      "The weekly computer lab report is attached. All 45 lab sessions were conducted as scheduled except two, which were adjusted due to the No Bag Pack Day event.",
      "Ali Khalil\nIT Incharge",
    ],
    date: "Nov 14",
    time: "5:10 PM",
    hasAttachment: true,
    attachments: [{ name: "Weekly-Lab-Report.pdf", size: "96 KB" }],
  },
  {
    id: "m12",
    folder: "drafts",
    from: u("Ali Khalil", "ali.khalil@superiorcollegemc.com", "AK", "bg-emerald-600"),
    to: "admissions@superiorcollegemc.com",
    subject: "Website — BS HND program page update",
    preview:
      "Please note the BS HND program is missing from the Programmes section and the admissions form dropdown. Kindly add it so the…",
    body: [
      "Please note the BS HND program is missing from the Programmes section and the admissions form dropdown. Kindly add it so the total program count becomes 17.",
    ],
    date: "Nov 13",
    time: "8:05 PM",
  },
];
