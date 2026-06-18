/**
 * Seed 20 published news articles and 20 events for the public site.
 *
 * Usage:
 *   node --env-file=.env.local scripts/seed-cms-mockups.mjs
 */

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const NEWS_IMAGES = [
  "/event-science.jpg",
  "/facility-computer.jpg",
  "/admissions-cover.png",
  "/senior-high-class.jpg",
  "/event-sports.jpg",
  "/event-foundation.jpg",
  "/students-events.jpg",
  "/event-cultural.jpg",
  "/facility-library.jpg",
  "/facility-science.jpg",
  "/junior-high-class.jpg",
  "/event-leadership.jpg",
  "/event-recognition.jpg",
  "/club-academic.jpg",
  "/club-sports.jpg",
  "/facility-classroom.jpg",
  "/track-academic.jpg",
  "/about-school.jpg",
  "/club-arts.jpg",
  "/facility-sports.jpg",
];

const EVENT_IMAGES = [
  "/event-foundation.jpg",
  "/event-sports.jpg",
  "/event-science.jpg",
  "/students-events.jpg",
  "/event-cultural.jpg",
  "/event-leadership.jpg",
  "/event-recognition.jpg",
  "/club-community.jpg",
  "/club-government.jpg",
  "/club-media.jpg",
  "/track-sports.jpg",
  "/track-tvl.jpg",
  "/track-arts.jpg",
  "/facility-wifi.jpg",
  "/facility-sports.jpg",
  "/junior-high-class.jpg",
  "/senior-high-class.jpg",
  "/facility-library.jpg",
  "/facility-classroom.jpg",
  "/club-academic.jpg",
];

const newsTemplates = [
  {
    title: "NVIANS Students Excel at Regional Science Fair",
    excerpt: "Our students brought home top honors in biology and physics categories at the regional fair.",
    content:
      "Nueva Vizcaya Institute students showcased innovative research projects at the Regional Science Fair held in Tuguegarao. Teams from Grade 10 and Grade 11 earned first and second place in the biology and physics categories.\n\nFaculty advisers credited months of after-school mentoring and access to updated laboratory equipment. The school community congratulates all participants and invites everyone to view selected exhibits in the science building this week.",
  },
  {
    title: "New Computer Laboratory Opens for Senior High",
    excerpt: "Senior High students now have access to a modern lab for programming, multimedia, and research.",
    content:
      "NVIANS officially opened its upgraded computer laboratory, designed to support Senior High tracks in STEM, ABM, and ICT-related subjects.\n\nThe facility includes high-speed internet, collaborative workstations, and licensed software for coding, design, and data analysis. Administrators say the investment reflects the school's commitment to preparing students for college and industry-ready skills.",
  },
  {
    title: "Enrollment for School Year 2026–2027 Now Open",
    excerpt: "Applications for Junior and Senior High are now being accepted for the incoming school year.",
    content:
      "Enrollment for School Year 2026–2027 is officially open for Junior High (Grades 7–10) and Senior High (Grades 11–12).\n\nInterested families may visit the admissions office or contact the registrar for requirements, tuition information, and orientation schedules. Early applicants are encouraged to complete document submission before July to secure their preferred sections.",
  },
  {
    title: "Grade 11 STEM Students Present Capstone Research",
    excerpt: "Capstone teams presented solutions in health, agriculture, and environmental science.",
    content:
      "Grade 11 STEM students defended their capstone research before a panel of teachers and guest evaluators from local colleges.\n\nProjects ranged from water-quality monitoring to low-cost agricultural tools. Several teams have been invited to present at the upcoming STEM Research Exhibit on campus. Congratulations to all presenters for their hard work and professionalism.",
  },
  {
    title: "NVIANS Crowns Intramurals 2026 Champions",
    excerpt: "A week of friendly competition ended with new records and spirited house cheers.",
    content:
      "Intramurals 2026 wrapped up with championship games in basketball, volleyball, and track events. Grade 8 and Grade 12 teams delivered standout performances, while the marching competition drew one of the largest crowds in recent years.\n\nThe school thanks coaches, faculty, and student volunteers for making the event safe, organized, and memorable for the entire NVIANS community.",
  },
  {
    title: "Library Week Highlights Love for Reading",
    excerpt: "Students joined storytelling sessions, book swaps, and a campus-wide reading challenge.",
    content:
      "The NVIANS library celebrated National Reading Month with a full week of activities for Junior and Senior High students.\n\nHighlights included peer-led book reviews, a poetry corner, and a donation drive for community reading centers. Librarians report record borrowing during the campaign and encourage families to continue reading at home over the break.",
  },
  {
    title: "ABM Students Host Entrepreneurship Bazaar",
    excerpt: "Young entrepreneurs sold handmade products and pitched business plans to guest judges.",
    content:
      "Senior High ABM students transformed the covered court into a lively entrepreneurship bazaar featuring food stalls, crafts, and service demos.\n\nEach group presented cost sheets, marketing strategies, and profit projections to faculty and local business mentors. Top performers will represent NVIANS at the division-level business showcase next quarter.",
  },
  {
    title: "Junior High Debate Team Wins Division Title",
    excerpt: "The team argued persuasively on climate policy and earned the championship trophy.",
    content:
      "NVIANS debate delegates clinched the division championship after three rounds of intense parliamentary debate.\n\nCoaches praised students for research depth, rebuttal skill, and respectful discourse. The squad is now preparing for the regional finals with after-school practice sessions open to interested Grade 9 and 10 students.",
  },
  {
    title: "Campus Wi-Fi Upgrade Improves Digital Learning",
    excerpt: "Faster connectivity now supports online research, LMS access, and blended instruction.",
    content:
      "Information technology staff completed a campus-wide Wi-Fi upgrade covering classrooms, laboratories, and common areas.\n\nTeachers can now run simultaneous digital activities with fewer interruptions. The administration reminds students to use school networks responsibly and follow acceptable-use policies at all times.",
  },
  {
    title: "NVIANS Choir Places Second in Regional Festival",
    excerpt: "Vocalists earned silver for their renditions of Filipino and international pieces.",
    content:
      "The NVIANS choir dazzled adjudicators at the Regional Choral Festival with tight harmonies and dynamic stage presence.\n\nMonths of early-morning rehearsals paid off as the group placed second among twelve participating schools. Music teachers thanked parents and alumni volunteers who supported transportation and costume preparation.",
  },
  {
    title: "Guidance Office Launches Wellness Check-In Program",
    excerpt: "A new peer-support initiative helps students manage stress during exam season.",
    content:
      "The guidance and counseling office introduced weekly wellness check-ins for Grade 10 and Grade 11 students.\n\nSessions cover study habits, sleep hygiene, and healthy coping strategies. Students may also book one-on-one appointments with counselors through their class advisers or the main office.",
  },
  {
    title: "TVL Students Complete On-the-Job Training Partnerships",
    excerpt: "Twelve seniors finished immersion programs with local shops and hospitality partners.",
    content:
      "Senior High TVL students concluded their work immersion with partner establishments in Bayombong and nearby towns.\n\nParticipants gained hands-on experience in food service, electrical installation, and consumer electronics repair. Employers commended NVIANS trainees for punctuality, teamwork, and workplace safety awareness.",
  },
  {
    title: "Parent Volunteers Lead Campus Clean-Up Drive",
    excerpt: "Families and teachers worked together to beautify gardens and common areas.",
    content:
      "The NVIANS Parent-Teacher Association organized a Saturday clean-up drive focused on landscaping, recycling, and classroom organization.\n\nVolunteers repainted signages, cleared drainage paths, and planted native shrubs along the main walkway. The school extends its gratitude to everyone who donated tools, snacks, and their time.",
  },
  {
    title: "Mathletes Qualify for National Mathematics Olympiad",
    excerpt: "Four students advanced after dominating the regional problem-solving contest.",
    content:
      "NVIANS mathletes secured slots in the national olympiad after a strong showing in the regional elimination round.\n\nThe team trained under faculty coaches using timed practice sets and collaborative solution reviews. A send-off program is scheduled before the national competition to recognize their dedication.",
  },
  {
    title: "Student Council Rolls Out Anti-Bullying Campaign",
    excerpt: "Posters, forums, and peer pledges promote respect across all grade levels.",
    content:
      "The Supreme Student Council launched an anti-bullying campaign with classroom talks, pledge walls, and a confidential reporting channel.\n\nOfficers collaborated with the guidance office to tailor messages for Junior and Senior High audiences. Faculty advisers encourage students to speak up and support classmates who may need help.",
  },
  {
    title: "HUMSS Class Hosts Mock United Nations Session",
    excerpt: "Delegates debated global issues and practiced diplomacy in a day-long simulation.",
    content:
      "Grade 12 HUMSS students staged a mock United Nations session on climate migration and education access.\n\nParticipants researched country positions, drafted resolutions, and negotiated amendments in formal committee style. Social studies teachers said the activity strengthened public speaking and critical thinking skills.",
  },
  {
    title: "NVIANS Alumni Share Career Talks with Seniors",
    excerpt: "Graduates from medicine, engineering, and education inspired graduating students.",
    content:
      "The alumni association returned to campus for a career symposium aimed at Grade 12 students exploring college pathways.\n\nSpeakers discussed course selection, scholarship applications, and lessons learned after graduation. The school plans to make alumni career talks a quarterly tradition starting next school year.",
  },
  {
    title: "Science Club Observes Earth Hour with Night Sky Viewing",
    excerpt: "Students learned constellations and discussed energy conservation after sunset.",
    content:
      "Members of the NVIANS Science Club marked Earth Hour with a stargazing activity on the sports field.\n\nAdvisers used the event to discuss renewable energy, light pollution, and simple habits families can adopt at home. Parents were invited to join the closing reflection circle led by student officers.",
  },
  {
    title: "English Week Celebrates Creative Writing Talent",
    excerpt: "Poetry slams, short fiction readings, and spelling bees filled the schedule.",
    content:
      "English Week featured daily contests and workshops for Junior and Senior High students.\n\nWinners in poetry, essay writing, and impromptu speaking will represent the school in division literary competitions. The English department thanked student publications staff for designing event materials and moderating sessions.",
  },
  {
    title: "NVIANS Marks Fire Safety Month with Drill and Seminar",
    excerpt: "Students and staff practiced evacuation routes with local fire bureau instructors.",
    content:
      "The school conducted a full-campus fire drill followed by a seminar on fire prevention and emergency response.\n\nBureau of Fire Protection personnel demonstrated extinguisher use and discussed common hazards in classrooms and kitchens. Administrators will review drill feedback to improve assembly times and signage visibility.",
  },
];

const eventTemplates = [
  {
    title: "Foundation Day Celebration",
    description:
      "Join the entire NVIANS community for Foundation Day—a celebration of school pride, student performances, alumni messages, and the annual recognition of outstanding achievers.",
    location: "School Gymnasium",
    status: "upcoming",
    daysFromNow: 12,
    duration: 0,
  },
  {
    title: "Junior High Sports Fest",
    description:
      "Junior High students compete in basketball, volleyball, badminton, and track events. Families are welcome to cheer for their grade-level teams.",
    location: "NVIANS Sports Complex",
    status: "upcoming",
    daysFromNow: 26,
    duration: 1,
  },
  {
    title: "STEM Research Exhibit",
    description:
      "STEM students display capstone prototypes, experiments, and research posters. Open to parents, partner schools, and community guests.",
    location: "Science Building & Auditorium",
    status: "upcoming",
    daysFromNow: 50,
    duration: 0,
  },
  {
    title: "Parent-Teacher Conference",
    description:
      "Meet teachers, review progress reports, and discuss learning goals for the first semester. Appointment slots will be posted by class advisers.",
    location: "Main Building Classrooms",
    status: "upcoming",
    daysFromNow: 91,
    duration: 0,
  },
  {
    title: "Cultural Night & Recognition Program",
    description:
      "An evening of cultural performances, awards, and student-led presentations honoring academic and co-curricular achievements.",
    location: "School Gymnasium",
    status: "upcoming",
    daysFromNow: 130,
    duration: 0,
  },
  {
    title: "Senior High Career Fair",
    description:
      "Colleges, training centers, and employers set up booths for Grade 11 and 12 students exploring post-secondary options.",
    location: "Covered Court",
    status: "upcoming",
    daysFromNow: 18,
    duration: 0,
  },
  {
    title: "Math and Science Quiz Bowl",
    description:
      "Inter-grade teams compete in rapid-fire rounds covering algebra, geometry, biology, and chemistry.",
    location: "Science Building Lecture Hall",
    status: "upcoming",
    daysFromNow: 35,
    duration: 0,
  },
  {
    title: "Leadership Camp for Student Officers",
    description:
      "SSG, class officers, and club presidents join a two-day camp focused on teamwork, service, and school governance.",
    location: "NVIANS Retreat House",
    status: "upcoming",
    daysFromNow: 42,
    duration: 1,
  },
  {
    title: "Buwan ng Wika Program",
    description:
      "Filipino language and culture take center stage with sabayang pagbigkas, duplo, and traditional games.",
    location: "Main Stage & Quadrangle",
    status: "upcoming",
    daysFromNow: 58,
    duration: 2,
  },
  {
    title: "Teachers' Professional Development Day",
    description:
      "Faculty participate in workshops on assessment, classroom technology, and learner-centered instruction. No regular classes.",
    location: "Faculty Hall",
    status: "upcoming",
    daysFromNow: 67,
    duration: 0,
  },
  {
    title: "Blood Donation Drive",
    description:
      "Partner health units accept voluntary blood donations from qualified faculty, staff, and eligible Senior High students.",
    location: "School Clinic & Gym Lobby",
    status: "upcoming",
    daysFromNow: 74,
    duration: 0,
  },
  {
    title: "Junior High Science Fair",
    description:
      "Grade 7–10 students present experiments and models judged by teachers and guest scientists from nearby colleges.",
    location: "Science Laboratories",
    status: "upcoming",
    daysFromNow: 82,
    duration: 0,
  },
  {
    title: "Christmas Cantata and Gift Drive",
    description:
      "The school choir leads a holiday program while student organizations collect gifts for partner barangay learning centers.",
    location: "School Gymnasium",
    status: "upcoming",
    daysFromNow: 198,
    duration: 0,
  },
  {
    title: "First Quarter Recognition Rites",
    description:
      "Honor students and exemplary club members receive certificates during a formal morning assembly.",
    location: "School Gymnasium",
    status: "upcoming",
    daysFromNow: 105,
    duration: 0,
  },
  {
    title: "Sports Tryouts for School Teams",
    description:
      "Open tryouts for basketball, volleyball, football, and athletics squads representing NVIANS in district meets.",
    location: "NVIANS Sports Complex",
    status: "upcoming",
    daysFromNow: 8,
    duration: 2,
  },
  {
    title: "Media and Journalism Workshop",
    description:
      "Campus journalists learn news writing, photography basics, and ethical reporting from alumni working in media.",
    location: "Computer Laboratory",
    status: "upcoming",
    daysFromNow: 22,
    duration: 0,
  },
  {
    title: "TVL Skills Demonstration Day",
    description:
      "Senior High TVL students showcase competencies in cookery, electrical installation, and consumer electronics servicing.",
    location: "TVL Workshop & Covered Court",
    status: "upcoming",
    daysFromNow: 96,
    duration: 0,
  },
  {
    title: "University Admission Seminar",
    description:
      "Guidance counselors explain application timelines, entrance exams, and scholarship opportunities for graduating students.",
    location: "Auditorium",
    status: "upcoming",
    daysFromNow: 112,
    duration: 0,
  },
  {
    title: "Earth and Environment Summit",
    description:
      "Clubs host talks on waste management, tree planting, and youth-led climate action projects open to all students.",
    location: "Quadrangle & Science Building",
    status: "upcoming",
    daysFromNow: 140,
    duration: 0,
  },
  {
    title: "Graduation Rehearsal and Baccalaureate Service",
    description:
      "Grade 12 students attend final rehearsal and a baccalaureate service with families before commencement week.",
    location: "School Gymnasium",
    status: "upcoming",
    daysFromNow: 165,
    duration: 0,
  },
];

const MOCK_NEWS_TITLES = newsTemplates.map((item) => item.title);
const MOCK_EVENT_TITLES = eventTemplates.map((item) => item.title);

function addDays(baseDate, days) {
  const date = new Date(baseDate);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function publishedAtDaysAgo(daysAgo) {
  const date = new Date("2026-06-16T08:00:00.000Z");
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date.toISOString();
}

const newsItems = newsTemplates.map((item, index) => ({
  ...item,
  cover_image: NEWS_IMAGES[index % NEWS_IMAGES.length],
  published_at: publishedAtDaysAgo(index * 3),
}));

const eventItems = eventTemplates.map((item, index) => {
  const startDate = addDays("2026-06-16", item.daysFromNow);
  const endDate = addDays(startDate, item.duration);
  const { daysFromNow, duration, ...rest } = item;

  return {
    ...rest,
    start_date: startDate,
    end_date: endDate,
    cover_image: EVENT_IMAGES[index % EVENT_IMAGES.length],
  };
});

async function getAdminUserId() {
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .in("role", ["admin", "staff"])
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.warn(`Could not load admin user: ${error.message}`);
    return null;
  }

  return data?.id ?? null;
}

async function seedNews(adminId) {
  const { data: existing } = await supabase
    .from("news")
    .select("title")
    .in("title", MOCK_NEWS_TITLES);

  const existingTitles = new Set((existing ?? []).map((row) => row.title));
  const toInsert = newsItems
    .filter((item) => !existingTitles.has(item.title))
    .map((item) => ({
      ...item,
      is_published: true,
      author_id: adminId,
      published_by: adminId,
    }));

  if (toInsert.length === 0) {
    console.log("News mockups already exist — skipped.");
    return;
  }

  const { error } = await supabase.from("news").insert(toInsert);
  if (error) throw new Error(`Failed to insert news: ${error.message}`);
  console.log(`Inserted ${toInsert.length} news article(s).`);
}

async function seedEvents() {
  const { data: existing } = await supabase
    .from("events")
    .select("title")
    .in("title", MOCK_EVENT_TITLES);

  const existingTitles = new Set((existing ?? []).map((row) => row.title));
  const toInsert = eventItems
    .filter((item) => !existingTitles.has(item.title))
    .map((item) => ({
      ...item,
      is_published: true,
    }));

  if (toInsert.length === 0) {
    console.log("Event mockups already exist — skipped.");
    return;
  }

  const { error } = await supabase.from("events").insert(toInsert);
  if (error) throw new Error(`Failed to insert events: ${error.message}`);
  console.log(`Inserted ${toInsert.length} event(s).`);
}

try {
  const adminId = await getAdminUserId();
  await seedNews(adminId);
  await seedEvents();
  console.log("CMS mockups ready. Visit /news to preview.");
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
