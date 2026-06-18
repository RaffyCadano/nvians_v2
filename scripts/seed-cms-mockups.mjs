/**
 * Seed 5 published news articles and 5 upcoming events for the public site.
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

const MOCK_NEWS_TITLES = [
  "NVIANS Students Excel at Regional Science Fair",
  "New Computer Laboratory Opens for Senior High",
  "Enrollment for School Year 2026–2027 Now Open",
  "Grade 11 STEM Students Present Capstone Research",
  "NVIANS Crowns Intramurals 2026 Champions",
];

const MOCK_EVENT_TITLES = [
  "Foundation Day Celebration",
  "Junior High Sports Fest",
  "STEM Research Exhibit",
  "Parent-Teacher Conference",
  "Cultural Night & Recognition Program",
];

const newsItems = [
  {
    title: MOCK_NEWS_TITLES[0],
    excerpt: "Our students brought home top honors in biology and physics categories at the regional fair.",
    content:
      "Nueva Vizcaya Institute students showcased innovative research projects at the Regional Science Fair held in Tuguegarao. Teams from Grade 10 and Grade 11 earned first and second place in the biology and physics categories.\n\nFaculty advisers credited months of after-school mentoring and access to updated laboratory equipment. The school community congratulates all participants and invites everyone to view selected exhibits in the science building this week.",
    cover_image: "/event-science.jpg",
    published_at: "2026-06-10T08:00:00.000Z",
  },
  {
    title: MOCK_NEWS_TITLES[1],
    excerpt: "Senior High students now have access to a modern lab for programming, multimedia, and research.",
    content:
      "NVIANS officially opened its upgraded computer laboratory, designed to support Senior High tracks in STEM, ABM, and ICT-related subjects.\n\nThe facility includes high-speed internet, collaborative workstations, and licensed software for coding, design, and data analysis. Administrators say the investment reflects the school’s commitment to preparing students for college and industry-ready skills.",
    cover_image: "/facility-computer.jpg",
    published_at: "2026-06-05T08:00:00.000Z",
  },
  {
    title: MOCK_NEWS_TITLES[2],
    excerpt: "Applications for Junior and Senior High are now being accepted for the incoming school year.",
    content:
      "Enrollment for School Year 2026–2027 is officially open for Junior High (Grades 7–10) and Senior High (Grades 11–12).\n\nInterested families may visit the admissions office or contact the registrar for requirements, tuition information, and orientation schedules. Early applicants are encouraged to complete document submission before July to secure their preferred sections.",
    cover_image: "/admissions-cover.png",
    published_at: "2026-06-01T08:00:00.000Z",
  },
  {
    title: MOCK_NEWS_TITLES[3],
    excerpt: "Capstone teams presented solutions in health, agriculture, and environmental science.",
    content:
      "Grade 11 STEM students defended their capstone research before a panel of teachers and guest evaluators from local colleges.\n\nProjects ranged from water-quality monitoring to low-cost agricultural tools. Several teams have been invited to present at the upcoming STEM Research Exhibit on campus. Congratulations to all presenters for their hard work and professionalism.",
    cover_image: "/senior-high-class.jpg",
    published_at: "2026-05-28T08:00:00.000Z",
  },
  {
    title: MOCK_NEWS_TITLES[4],
    excerpt: "A week of friendly competition ended with new records and spirited house cheers.",
    content:
      "Intramurals 2026 wrapped up with championship games in basketball, volleyball, and track events. Grade 8 and Grade 12 teams delivered standout performances, while the marching competition drew one of the largest crowds in recent years.\n\nThe school thanks coaches, faculty, and student volunteers for making the event safe, organized, and memorable for the entire NVIANS community.",
    cover_image: "/event-sports.jpg",
    published_at: "2026-05-20T08:00:00.000Z",
  },
];

const eventItems = [
  {
    title: MOCK_EVENT_TITLES[0],
    description:
      "Join the entire NVIANS community for Foundation Day—a celebration of school pride, student performances, alumni messages, and the annual recognition of outstanding achievers.",
    start_date: "2026-06-28",
    end_date: "2026-06-28",
    location: "School Gymnasium",
    cover_image: "/event-foundation.jpg",
    status: "upcoming",
  },
  {
    title: MOCK_EVENT_TITLES[1],
    description:
      "Junior High students compete in basketball, volleyball, badminton, and track events. Families are welcome to cheer for their grade-level teams.",
    start_date: "2026-07-12",
    end_date: "2026-07-13",
    location: "NVIANS Sports Complex",
    cover_image: "/event-sports.jpg",
    status: "upcoming",
  },
  {
    title: MOCK_EVENT_TITLES[2],
    description:
      "STEM students display capstone prototypes, experiments, and research posters. Open to parents, partner schools, and community guests.",
    start_date: "2026-08-05",
    end_date: "2026-08-05",
    location: "Science Building & Auditorium",
    cover_image: "/event-science.jpg",
    status: "upcoming",
  },
  {
    title: MOCK_EVENT_TITLES[3],
    description:
      "Meet teachers, review progress reports, and discuss learning goals for the first semester. Appointment slots will be posted by class advisers.",
    start_date: "2026-09-15",
    end_date: "2026-09-15",
    location: "Main Building Classrooms",
    cover_image: "/students-events.jpg",
    status: "upcoming",
  },
  {
    title: MOCK_EVENT_TITLES[4],
    description:
      "An evening of cultural performances, awards, and student-led presentations honoring academic and co-curricular achievements.",
    start_date: "2026-10-24",
    end_date: "2026-10-24",
    location: "School Gymnasium",
    cover_image: "/event-cultural.jpg",
    status: "upcoming",
  },
];

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
  const toInsert = eventItems.filter((item) => !existingTitles.has(item.title));

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
